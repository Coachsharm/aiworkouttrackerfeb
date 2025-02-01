import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
}

interface WorkoutHistoryProps {
  workouts: Workout[];
}

export const WorkoutHistory = ({ workouts }: WorkoutHistoryProps) => {
  const sortedWorkouts = [...workouts].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card className="workout-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Exercise</TableHead>
            <TableHead>Sets</TableHead>
            <TableHead>Reps</TableHead>
            <TableHead>Weight (KG)</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkouts.map((workout) => (
            workout.exercises.map((exercise, index) => (
              <TableRow key={`${workout.id}-${index}`}>
                <TableCell>
                  {workout.timestamp.toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{exercise.name}</TableCell>
                <TableCell>{exercise.sets}</TableCell>
                <TableCell>{exercise.reps}</TableCell>
                <TableCell>{exercise.weight || 'N/A'}</TableCell>
                <TableCell>{workout.type}</TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};