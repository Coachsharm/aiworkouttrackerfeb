import { useState, useEffect } from 'react';
import { WorkoutInput } from '@/components/workout/WorkoutInput';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const workoutsRef = collection(db, 'users', user.uid, 'workouts');
    const q = query(workoutsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setWorkouts(workoutData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleWorkoutSubmit = async (workoutText: string) => {
    // The actual submission is handled in WorkoutInput component
    // which calls the Firebase Function directly
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Workout Tracker</h1>
          <p className="text-muted-foreground">
            Log your workouts in natural language
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