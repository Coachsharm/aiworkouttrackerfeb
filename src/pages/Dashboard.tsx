import { Link } from "react-router-dom";
import { Activity, List, MessageSquare, Notebook, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  const features = [
    {
      title: "Workout Tracker",
      description: "Log and track your workouts with AI assistance",
      icon: Activity,
      href: "/workouts",
    },
    {
      title: "Habit Tracker",
      description: "Build and maintain healthy habits",
      icon: List,
      href: "/habits",
    },
    {
      title: "AI Chat",
      description: "Get personalized fitness advice",
      icon: MessageSquare,
      href: "/chat",
    },
    {
      title: "Notes",
      description: "Keep track of your fitness journey",
      icon: Notebook,
      href: "/notes",
    },
    {
      title: "Client Management",
      description: "Manage your clients and their progress",
      icon: Users,
      href: "/clients",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to AI Workout Tracker</h1>
            <p className="text-muted-foreground">Select a feature to get started with your fitness journey.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} to={feature.href}>
                <Card className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="space-y-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <div className="space-y-2">
                      <h2 className="font-semibold">{feature.title}</h2>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;