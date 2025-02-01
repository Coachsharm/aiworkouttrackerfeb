import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface Workout {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
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
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Exercise</TableHead>
            <TableHead>Weight (KG)</TableHead>
            <TableHead>Reps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkouts.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell>
                {workout.timestamp.toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{workout.exercise}</TableCell>
              <TableCell>{workout.weight}</TableCell>
              <TableCell>{workout.reps}</TableCell>
            </TableRow>
          ))}
          {sortedWorkouts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No workouts logged yet. Start by adding one above!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};