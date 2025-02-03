import { useEffect, useState } from "react";
import { WorkoutInput } from "@/components/workout/WorkoutInput";
import { WorkoutHistory } from "@/components/workout/WorkoutHistory";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface Workout {
  id: string;
  exercises: Exercise[];
  duration: number;
  type: string;
  timestamp: Date;
  createdBy: string;
}

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const workoutsRef = collection(db, 'workouts');
    const q = query(
      workoutsRef,
      where("createdBy", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Workout[];
      
      setWorkouts(workoutData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Tracker</h1>
          <p className="text-muted-foreground">Log your workouts and track your progress.</p>
        </div>

        <WorkoutInput onSubmit={async () => {}} />
        
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

export default WorkoutPage;