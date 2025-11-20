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
import { Card } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useCards = (boardId: string | undefined) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'cards'),
      where('boardId', '==', boardId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Card[];
      
      // Sort on client side to avoid index requirements
      cardsData.sort((a, b) => a.order - b.order);
      
      setCards(cardsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cards:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [boardId]);

  const createCard = async (title: string, columnId: string, boardId: string, order: number) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'cards'), {
        title,
        description: '',
        columnId,
        boardId,
        order,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка создания карточки",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    try {
      await updateDoc(doc(db, 'cards', cardId), {
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

  const deleteCard = async (cardId: string) => {
    try {
      await deleteDoc(doc(db, 'cards', cardId));
    } catch (error: any) {
      toast({
        title: "Ошибка удаления",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { cards, loading, createCard, updateCard, deleteCard };
};
