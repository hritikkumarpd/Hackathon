import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import { useAppContext } from "./contexts/AppContext";
import ConnectionModal from "./components/ConnectionModal";
import { useState, useEffect } from "react";

function Router() {
  const { showFirstVisitModal } = useAppContext();
  const [initialRender, setInitialRender] = useState(true);
  
  useEffect(() => {
    // After initial render, mark it as complete
    setInitialRender(false);
  }, []);
  
  // During initial render or when showFirstVisitModal is true, show Welcome page
  if (initialRender || showFirstVisitModal) {
    return <Welcome />;
  }
  
  // Otherwise show regular routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { showConnectionModal } = useAppContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {showConnectionModal && <ConnectionModal />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
