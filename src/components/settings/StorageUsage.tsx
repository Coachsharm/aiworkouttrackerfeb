import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const StorageUsage = () => {
  const [usedStorage, setUsedStorage] = useState(0);
  const { user } = useAuth();
  const MAX_STORAGE = 500 * 1024 * 1024; // 500 MB in bytes

  useEffect(() => {
    const calculateStorage = async () => {
      if (!user) return;
      
      const db = getFirestore();
      const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(notesQuery);
      const totalBytes = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        // Approximate size calculation (2 bytes per character)
        return acc + (data.description?.length || 0) * 2;
      }, 0);
      
      setUsedStorage(totalBytes);
    };

    calculateStorage();
  }, [user]);

  const usedPercentage = (usedStorage / MAX_STORAGE) * 100;
  const usedMB = (usedStorage / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Storage Usage</h3>
      <Progress value={usedPercentage} className="w-full" />
      <p className="text-sm text-muted-foreground">
        {usedMB} MB used of 500 MB
      </p>
    </div>
  );
};

export default StorageUsage;