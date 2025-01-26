import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="glass-card p-12 rounded-lg space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <p className="text-xl text-muted-foreground">Welcome back</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="text-center">
          <time className="text-7xl font-light tabular-nums">
            {time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </time>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;