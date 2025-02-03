import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { Workout } from '@/types/client';

export const workoutService = {
  async addWorkout(workout: Omit<Workout, 'id'>) {
    try {
      const workoutRef = await addDoc(collection(db, 'workouts'), {
        ...workout,
        timestamp: Timestamp.fromDate(workout.timestamp)
      });
      return workoutRef.id;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  },

  async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, where('createdBy', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Workout[];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }
};