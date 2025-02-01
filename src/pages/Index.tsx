import { useState, useEffect } from 'react';
import { WorkoutInput } from '@/components/workout/WorkoutInput';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

interface Workout {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  timestamp: Date;
}

const Index = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Workout[];
      setWorkouts(workoutData);
    };

    fetchWorkouts();
  }, []);

  const handleWorkoutSubmit = async (workoutText: string) => {
    const parts = workoutText.split(' ');
    const workout = {
      exercise: parts[0],
      weight: parseInt(parts[1]) || 0,
      reps: parseInt(parts[3]) || 0,
      timestamp: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'workouts'), workout);
    const newWorkout = { ...workout, id: docRef.id };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Workout Tracker</h1>
          <p className="text-muted-foreground">
            Log your workouts and track your progress
          </p>
        </div>

        <WorkoutInput onSubmit={handleWorkoutSubmit} />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Workout History
          </h2>
          <WorkoutHistory workouts={workouts} />
        </div>
      </div>
    </div>
  );
};

export default Index;