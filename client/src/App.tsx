import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import StandaloneHome from "./pages/StandaloneHome";
import Welcome from "./pages/Welcome";
import { useState, useEffect } from "react";

function Router() {
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if user has visited before
    return !localStorage.getItem('visited');
  });
  
  useEffect(() => {
    if (!showWelcome) {
      // Mark as visited
      localStorage.setItem('visited', 'true');
    }
  }, [showWelcome]);
  
  // Show welcome page if first visit
  if (showWelcome) {
    return (
      <Welcome onGetStarted={() => setShowWelcome(false)} />
    );
  }
  
  // Otherwise show regular routes
  return (
    <Switch>
      <Route path="/" component={StandaloneHome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
