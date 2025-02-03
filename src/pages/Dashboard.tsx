import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dumbbell, Calendar, MessageSquare } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to AI Workout Tracker</h1>
          <p className="text-muted-foreground">Select a feature to get started</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/workouts">
            <Card className="p-6 hover:bg-accent transition-colors">
              <Dumbbell className="h-12 w-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Workout Tracker</h2>
              <p className="text-muted-foreground">Log and track your workouts with AI assistance</p>
            </Card>
          </Link>

          <Link to="/habits">
            <Card className="p-6 hover:bg-accent transition-colors">
              <Calendar className="h-12 w-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Habit Tracker</h2>
              <p className="text-muted-foreground">Build and maintain healthy habits</p>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="p-6 hover:bg-accent transition-colors">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">AI Chat</h2>
              <p className="text-muted-foreground">Get personalized workout advice</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;