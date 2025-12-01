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

export const useBoards = (userId: string | undefined) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBoards([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'boards'),
      where('ownerId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure members is always an array of BoardMember objects
          members: Array.isArray(data.members) ? 
            (typeof data.members[0] === 'string' ? [] : data.members) : 
            [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }) as Board[];
      
      // Sort on client side to avoid index requirements
      boardsData.sort((a, b) => {
        const dateA = a.updatedAt?.getTime() || 0;
        const dateB = b.updatedAt?.getTime() || 0;
        return dateB - dateA;
      });
      
      setBoards(boardsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching boards:', error);
      toast({
        title: "Ошибка загрузки досок",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const createBoard = async (title: string, background: string, ownerId: string) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'boards'), {
        title,
        background,
        ownerId,
        members: [],
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
