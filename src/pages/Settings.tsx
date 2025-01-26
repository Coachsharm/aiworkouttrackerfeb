import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import NameUpdateForm from '@/components/settings/NameUpdateForm';
import PasswordUpdateForm from '@/components/settings/PasswordUpdateForm';
import StorageUsage from '@/components/settings/StorageUsage';
import { useAuth } from '@/contexts/AuthContext';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Storage</h2>
          <StorageUsage />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <p className="text-muted-foreground mb-4">
            Current Name: {user?.displayName || 'No name set'}
          </p>
          <NameUpdateForm />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <PasswordUpdateForm />
        </Card>
      </div>
    </div>
  );
};

export default Settings;
