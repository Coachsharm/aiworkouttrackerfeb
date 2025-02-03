import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WorkoutInputProps {
  onSubmit?: (workout: string) => Promise<void>;
}

export const WorkoutInput = ({ onSubmit }: WorkoutInputProps) => {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const functions = getFunctions();
  const processWorkout = httpsCallable(functions, 'processWorkout');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to log workouts",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await processWorkout({ 
        workoutText: input,
      });
      
      console.log('Processed workout:', result.data);
      
      toast({
        title: "Success",
        description: "Workout logged successfully!",
      });
      setInput('');
      
      if (onSubmit) {
        await onSubmit(input);
      }
    } catch (error: any) {
      console.error('Error processing workout:', error);
      setError(error?.message || "Failed to process workout. Please try again.");
      toast({
        title: "Error",
        description: error?.message || "Failed to process workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Input
          placeholder="Describe your workout in natural language (e.g., 'I did 3 sets of 10 bench presses at 135 pounds')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="workout-input text-lg"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Log Workout"}
        </Button>
      </form>
    </Card>
  );
};