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
      // Clear stored credentials on logout
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileText className="w-16 h-16 text-primary" />
          <div>
            <p className="text-xl text-muted-foreground">Welcome back</p>
            <p className="text-sm text-muted-foreground">
              {user?.displayName || user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 space-y-8">
        <div className="text-center py-8">
          <time className="text-7xl font-light tabular-nums">
            {time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </time>
        </div>

        <Separator className="my-8" />
        
        <Notes />
      </main>
    </div>
  );
};

export default Dashboard;