import { Link } from "react-router-dom";
import { House, Activity, List, MessageSquare, Notebook, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 container max-w-7xl mx-auto">
        <div className="mr-8 hidden md:flex">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold">AI Workout Tracker</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <House className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/workouts">
            <Button variant="ghost" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Workouts
            </Button>
          </Link>
          <Link to="/habits">
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4 mr-2" />
              Habits
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Chat
            </Button>
          </Link>
          <Link to="/notes">
            <Button variant="ghost" size="sm">
              <Notebook className="h-4 w-4 mr-2" />
              Notes
            </Button>
          </Link>
          <Link to="/clients">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </Button>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground">
            {user?.displayName || user?.email}
          </span>
        </div>
      </div>
    </nav>
  );
};