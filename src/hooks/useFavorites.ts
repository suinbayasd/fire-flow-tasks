import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const toggleFavorite = async (userId: string, boardId: string, isFavorite: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(boardId)
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(boardId)
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить избранное",
        variant: "destructive",
      });
    }
  };

  return { toggleFavorite };
};
