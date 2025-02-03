import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Index from "@/pages/Index";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            {/* Placeholder routes for new features */}
            <Route
              path="/habits"
              element={
                <PrivateRoute>
                  <div className="min-h-screen">
                    <Navbar />
                    <div className="container max-w-7xl mx-auto p-6">
                      <h1 className="text-3xl font-bold">Habit Tracker</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <div className="min-h-screen">
                    <Navbar />
                    <div className="container max-w-7xl mx-auto p-6">
                      <h1 className="text-3xl font-bold">AI Chat</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <div className="min-h-screen">
                    <Navbar />
                    <div className="container max-w-7xl mx-auto p-6">
                      <h1 className="text-3xl font-bold">Notes</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <div className="min-h-screen">
                    <Navbar />
                    <div className="container max-w-7xl mx-auto p-6">
                      <h1 className="text-3xl font-bold">Client Management</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;