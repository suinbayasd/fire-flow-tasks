import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Board } from '@/types';
import { toast } from '@/hooks/use-toast';

const parseBoard = (docSnapshot: any): Board => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    members: Array.isArray(data.members) ? 
      (typeof data.members[0] === 'string' ? [] : data.members) : 
      [],
    memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Board;
};

export const useBoards = (userId: string | undefined) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBoards([]);
      setLoading(false);
      return;
    }

    // Query for boards where user is owner
    const ownedQuery = query(
      collection(db, 'boards'),
      where('ownerId', '==', userId)
    );

    // Query for boards where user is a member
    const memberQuery = query(
      collection(db, 'boards'),
      where('memberIds', 'array-contains', userId)
    );

    let ownedBoards: Board[] = [];
    let memberBoards: Board[] = [];
    let ownedLoaded = false;
    let memberLoaded = false;

    const updateBoards = () => {
      if (!ownedLoaded || !memberLoaded) return;
      
      // Combine and deduplicate boards
      const allBoards = [...ownedBoards];
      memberBoards.forEach(board => {
        if (!allBoards.find(b => b.id === board.id)) {
          allBoards.push(board);
        }
      });
      
      // Sort by updatedAt
      allBoards.sort((a, b) => {
        const dateA = a.updatedAt?.getTime() || 0;
        const dateB = b.updatedAt?.getTime() || 0;
        return dateB - dateA;
      });
      
      setBoards(allBoards);
      setLoading(false);
    };

    const unsubscribeOwned = onSnapshot(ownedQuery, (snapshot) => {
      ownedBoards = snapshot.docs.map(parseBoard);
      ownedLoaded = true;
      updateBoards();
    }, (error) => {
      console.error('Error fetching owned boards:', error);
      toast({
        title: "Ошибка загрузки досок",
        description: error.message,
        variant: "destructive",
      });
      ownedLoaded = true;
      updateBoards();
    });

    const unsubscribeMember = onSnapshot(memberQuery, (snapshot) => {
      memberBoards = snapshot.docs.map(parseBoard);
      memberLoaded = true;
      updateBoards();
    }, (error) => {
      console.error('Error fetching shared boards:', error);
      memberLoaded = true;
      updateBoards();
    });

    return () => {
      unsubscribeOwned();
      unsubscribeMember();
    };
  }, [userId]);

  const createBoard = async (title: string, background: string, ownerId: string) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'boards'), {
        title,
        background,
        ownerId,
        members: [],
        memberIds: [], // For array-contains queries
        createdAt: now,
        updatedAt: now,
      });
      
      toast({
        title: "Доска создана",
        description: `Доска "${title}" успешно создана`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка создания доски",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    try {
      await updateDoc(doc(db, 'boards', boardId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      await deleteDoc(doc(db, 'boards', boardId));
      toast({
        title: "Доска удалена",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { boards, loading, createBoard, updateBoard, deleteBoard };
};
