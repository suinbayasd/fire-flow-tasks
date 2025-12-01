import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

export const useBoardMembers = (memberIds: string[]) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!memberIds || memberIds.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const memberQuery = query(usersRef, where('__name__', 'in', memberIds));
        const snapshot = await getDocs(memberQuery);
        
        const memberData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setMembers(memberData);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [JSON.stringify(memberIds)]);

  return { members, loading };
};
