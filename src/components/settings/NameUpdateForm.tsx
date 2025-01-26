import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Edit } from 'lucide-react';

const NameUpdateForm = () => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateUserName, user } = useAuth();

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
      // Force a re-render by updating the user object
      window.location.reload();
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
        <div className="relative">
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className="w-full pl-10"
          />
          <Edit className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Name"}
      </Button>
    </form>
  );
};

export default NameUpdateForm;