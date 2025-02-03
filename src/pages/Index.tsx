import { useState, useEffect } from 'react';
import { WorkoutInput } from '@/components/workout/WorkoutInput';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { useAuth } from '@/contexts/AuthContext';
import { workoutService } from '@/services/workoutService';
import type { Workout } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;
      try {
        const userWorkouts = await workoutService.getUserWorkouts(user.uid);
        setWorkouts(userWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        toast({
          title: "Error",
          description: "Failed to load workouts. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchWorkouts();
  }, [user, toast]);

  const handleWorkoutSubmit = async (workoutText: string) => {
    if (!user) return;
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