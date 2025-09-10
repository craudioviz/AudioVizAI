import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { DomainAuthGuard } from "@/components/ui/domain-auth-guard";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AvatarChat from "@/pages/avatar-chat";
import UniverseZone from "@/pages/universe-zone";
import OnlyAvatar from "@/pages/only-avatar";
import CreatorDashboard from "@/pages/creator-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/chat/:avatarName" component={AvatarChat} />
      <ProtectedRoute path="/universe/:zoneName" component={UniverseZone} />
      <ProtectedRoute path="/only-avatar" component={OnlyAvatar} />
      <ProtectedRoute path="/dashboard" component={CreatorDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DomainAuthGuard>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </DomainAuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
