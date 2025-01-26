import { Timestamp } from 'firebase/firestore';

export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  userId: string;
  imageUrl?: string;
  isDeleted?: boolean;
  deletedAt?: Timestamp;
  selectedIcon?: string;
}