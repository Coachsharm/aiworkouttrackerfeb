import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold">
            AI Workout Tracker
          </Link>
          {user && (
            <>
              <Link to="/workouts">
                <Button variant="ghost">Workouts</Button>
              </Link>
              <Link to="/habits">
                <Button variant="ghost">Habits</Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost">AI Chat</Button>
              </Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {user && (
            <Button
              variant="outline"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};