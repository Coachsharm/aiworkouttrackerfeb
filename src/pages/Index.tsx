import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-4xl px-4 animate-fade-in">
        <div className="text-center space-y-6 glass-card p-8 rounded-2xl">
          <h1 className="text-4xl font-bold text-gradient">
            Welcome to Thrive Quick Notes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal space for capturing and organizing thoughts, ideas, and important information with smart keyword analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {currentUser ? (
              <Button
                className="button-style text-lg px-8 py-6"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  className="button-style text-lg px-8 py-6"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl hover-scale">
            <h3 className="text-xl font-semibold mb-2">Quick Capture</h3>
            <p className="text-muted-foreground">
              Instantly save your thoughts and ideas with our streamlined interface
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl hover-scale">
            <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
            <p className="text-muted-foreground">
              Automatically extract and organize keywords from your notes
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl hover-scale">
            <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
            <p className="text-muted-foreground">
              Find your notes quickly with our powerful search and filtering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;