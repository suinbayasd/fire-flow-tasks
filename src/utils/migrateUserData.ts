import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const migrateUserData = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('User document does not exist, will be created on next operation');
      return;
    }

    const userData = userDoc.data();
    
    // Check if favorites field exists
    if (!userData.favorites) {
      await updateDoc(userRef, {
        favorites: []
      });
      console.log('Added favorites field to user document');
    }
  } catch (error) {
    console.error('Error migrating user data:', error);
  }
};
