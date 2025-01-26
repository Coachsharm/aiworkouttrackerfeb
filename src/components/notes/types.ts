import { Timestamp } from 'firebase/firestore';

export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  userId: string;
  icon?: string;
  isDeleted?: boolean;
  deletedAt?: Timestamp;
  isPinned?: boolean;
}

export type SortOption = 'title' | 'createdAt' | 'modifiedAt';
export type SortDirection = 'asc' | 'desc';