import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Client } from '@/types/client';

export const clientService = {
  async addClient(client: Omit<Client, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'clients'), client);
      return docRef.id;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  },

  async getClients(coachId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, 'clients'),
        where('createdBy', '==', coachId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        lastWorkout: doc.data().lastWorkout?.toDate(),
        lastCheckIn: doc.data().lastCheckIn?.toDate(),
      })) as Client[];
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  },

  async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, updates);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(clientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};