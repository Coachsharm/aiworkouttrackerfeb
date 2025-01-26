import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import Notes from '@/components/Notes';
import { Separator } from '@/components/ui/separator';
import { FileText, Settings } from 'lucide-react';
import MotivationalQuote from '@/components/MotivationalQuote';

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileText className="w-12 h-12 text-primary" />
          <div>
            <p className="text-lg text-muted-foreground">Welcome back</p>
            <p className="text-base font-medium">{user?.displayName || user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 space-y-4">
        <div className="text-center py-4">
          <time className="text-6xl font-light tabular-nums">
            {time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </time>
          <div className="mt-2 mb-4">
            <MotivationalQuote />
          </div>
        </div>

        <Separator className="my-4" />
        
        <Notes />
      </main>
    </div>
  );
};

export default Dashboard;