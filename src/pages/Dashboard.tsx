import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WorkoutInput } from '@/components/workout/WorkoutInput';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { Dumbbell, LogOut, Settings } from 'lucide-react';

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
}

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWorkouts = async () => {
      const workoutsRef = collection(db, 'users', user.uid, 'workouts');
      const q = query(
        workoutsRef,
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Workout[];
      
      setWorkouts(workoutData);
    };

    fetchWorkouts();
  }, [user, navigate]);

  const handleWorkoutSubmit = async (workoutText: string) => {
    // The actual submission is handled in WorkoutInput component
    // which calls the Firebase Function directly
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-4">
          <Dumbbell className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI Workout Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.displayName || user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
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

export default Dashboard;