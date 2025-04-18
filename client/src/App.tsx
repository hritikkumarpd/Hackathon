import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useAppContext } from "./contexts/AppContext";
import FirstVisitModal from "./components/FirstVisitModal";
import ConnectionModal from "./components/ConnectionModal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { showFirstVisitModal, showConnectionModal } = useAppContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {showFirstVisitModal && <FirstVisitModal />}
        {showConnectionModal && <ConnectionModal />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
