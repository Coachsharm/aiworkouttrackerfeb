import { Timestamp } from 'firebase/firestore';

export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
}