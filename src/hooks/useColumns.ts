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
import { Column } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useColumns = (boardId: string | undefined) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) {
      setColumns([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'columns'),
      where('boardId', '==', boardId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const columnsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Column[];
      
      // Sort on client side to avoid index requirements
      columnsData.sort((a, b) => a.order - b.order);
      
      setColumns(columnsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching columns:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [boardId]);

  const createColumn = async (title: string, boardId: string, order: number) => {
    try {
      await addDoc(collection(db, 'columns'), {
        title,
        boardId,
        order,
        createdAt: Timestamp.now(),
      });
    } catch (error: any) {
      toast({
        title: "Ошибка создания колонки",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateColumn = async (columnId: string, updates: Partial<Column>) => {
    try {
      await updateDoc(doc(db, 'columns', columnId), updates);
    } catch (error: any) {
      toast({
        title: "Ошибка обновления",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await deleteDoc(doc(db, 'columns', columnId));
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { columns, loading, createColumn, updateColumn, deleteColumn };
};
