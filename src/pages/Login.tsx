import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { LampContainer } from '@/components/ui/lamp';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
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

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background/95 to-background/90">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <LampContainer>
        <div className="w-full max-w-md space-y-6 -mt-32"> {/* Adjusted margin top */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4 animate-scale-in">
              <div className="relative w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-xl">
                <FileText className="w-12 h-12 text-primary animate-fade-in" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <motion.h1 
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="text-4xl font-bold text-gradient"
            >
              Thrive Quick Notes
            </motion.h1>
            <p className="text-primary font-semibold">Coach Sharm, MSc</p>
          </div>
          
          <form onSubmit={handleLogin} className="glass-card p-6 space-y-4 rounded-lg animate-scale-in border border-primary/20 bg-background/60 backdrop-blur-lg">
            <div className="space-y-3">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-style bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-sm hover-scale"
                  required
                />
              </div>
              
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-style bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-sm hover-scale pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full button-style hover-scale"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>

              <p className="text-muted-foreground">
                New? {" "}
                <Link to="/register" className="text-primary hover:underline">
                  Click here to register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </LampContainer>
    </div>
  );
};

export default Login;
