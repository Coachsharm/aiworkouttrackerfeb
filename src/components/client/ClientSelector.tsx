import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { clientService } from '@/services/clientService';
import type { Client } from '@/types/client';

interface ClientSelectorProps {
  onClientSelect: (clientId: string) => void;
  selectedClientId?: string;
}

export const ClientSelector = ({ onClientSelect, selectedClientId }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadClients = async () => {
      if (!user) return;
      try {
        const fetchedClients = await clientService.getClients(user.uid);
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user]);

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <Select
      value={selectedClientId}
      onValueChange={onClientSelect}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};