import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Project from "@/pages/Project";
import AdminPanel from "@/pages/AdminPanel";
import AdminLogin from "@/pages/AdminLogin";

// Hash based routing for GitHub Pages
const useHashLocation = () => {
  const [location, setLocation] = useState(
    window.location.hash.replace("#", "") || "/"
  );

  useEffect(() => {
    // Handle hash change event
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "/";
      setLocation(hash);
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Return location and a function that changes the location
  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [location, navigate] as [string, (to: string) => void];
};

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/project/:id" component={Project} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/:path*" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
