import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutInput } from '@/components/workout/WorkoutInput';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { Navbar } from '@/components/Navbar';

const Index = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef,
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      
      setWorkouts(workoutData);
    };

    fetchWorkouts();
  }, [user]);

  const handleWorkoutSubmit = async (workoutText: string) => {
    // The actual submission is handled in WorkoutInput component
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Tracker</h1>
          <p className="text-muted-foreground">Log your workouts and track your progress.</p>
        </div>

        <WorkoutInput onSubmit={handleWorkoutSubmit} />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Workout History
          </h2>
          <WorkoutHistory workouts={workouts} />
        </div>
      </main>
    </div>
  );
};

export default Index;