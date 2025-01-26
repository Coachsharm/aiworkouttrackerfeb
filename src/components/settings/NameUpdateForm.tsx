import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NameUpdateForm = () => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateUserName } = useAuth();

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserName(newName);
      toast({
        title: "Success",
        description: "Name updated successfully",
      });
      setNewName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateName} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">New Name</label>
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Name"}
      </Button>
    </form>
  );
};

export default NameUpdateForm;