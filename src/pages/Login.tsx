import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Pencil } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background/95 to-background/90">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6 animate-scale-in">
            <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-xl">
              <Pencil className="w-8 h-8 text-primary animate-fade-in" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient">Thrive Quick Note</h1>
          <p className="text-red-500 font-semibold">Coach Sharm, MSc</p>
        </div>
        
        <form onSubmit={handleLogin} className="glass-card p-8 space-y-6 rounded-lg animate-scale-in">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-style hover-scale"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-style hover-scale"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full button-style hover-scale"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New? {" "}
            <Link to="/register" className="text-primary hover:underline">
              Click here to register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;