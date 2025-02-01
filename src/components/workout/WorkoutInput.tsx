import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WorkoutInputProps {
  onSubmit: (workout: string) => Promise<void>;
}

export const WorkoutInput = ({ onSubmit }: WorkoutInputProps) => {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(input);
      setInput('');
      toast({
        title: "Success",
        description: "Workout logged successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log workout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Enter workout (e.g., Deadlifts 25KG 10 reps)"
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