export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  startDate: Date;
  goals?: string[];
  lastWorkout?: Date;
  lastCheckIn?: Date;
  createdBy: string; // Coach's user ID
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  clientId: string;
  clientName: string;
  exercises: Exercise[];
  type: 'strength' | 'cardio' | 'hybrid';
  duration: number;
  timestamp: Date;
  coachNotes?: string;
  createdBy: string;
}

export interface Habit {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  frequency: 'daily' | 'weekly';
  completed: boolean;
  streak: number;
  timestamp: Date;
  notes?: string;
  createdBy: string;
}