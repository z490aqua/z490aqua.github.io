import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import GamePage from "@/pages/GamePage";
import { useEffect } from "react";
import { GameProvider } from "@/context/GameContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Prevent default browser behaviors that could interfere with game controls
    const preventDefaults = (e: Event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes((e as KeyboardEvent).key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", preventDefaults);
    
    return () => {
      window.removeEventListener("keydown", preventDefaults);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Router />
        <Toaster />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
