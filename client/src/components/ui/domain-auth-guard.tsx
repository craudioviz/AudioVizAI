import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { shouldForceAuth, getDomainConfig } from "@/lib/domain-config";
import { Loader2 } from "lucide-react";

interface DomainAuthGuardProps {
  children: React.ReactNode;
}

export function DomainAuthGuard({ children }: DomainAuthGuardProps) {
  const { user, isLoading } = useAuth();
  const config = getDomainConfig();

  useEffect(() => {
    // Only redirect if we need auth but don't have a user
    if (!isLoading && shouldForceAuth() && !user) {
      window.location.href = config.redirectUnauth || '/auth';
    }
  }, [user, isLoading, config]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-border mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting to {config.name}...</p>
        </div>
      </div>
    );
  }

  // If domain requires auth but user is not authenticated, redirect will happen in useEffect
  if (shouldForceAuth() && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-border mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}