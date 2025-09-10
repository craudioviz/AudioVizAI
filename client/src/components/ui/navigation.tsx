import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import { Badge } from "./badge";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/#solutions", label: "Solutions" },
    { href: "/#universe", label: "CRAIverse" },
    { href: "/#avatars", label: "Live Avatars" },
    { href: "/#creators", label: "Creators" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md" data-testid="navigation">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-4" data-testid="link-home">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
              <i className="fas fa-robot text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">CRAudioVizAI</h1>
              <div className="text-sm text-muted-foreground">
                Your Story. Our Design.
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="hover:text-primary transition-colors"
                data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </a>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm" data-testid="text-username">
                    Welcome, {user.username}
                  </span>
                  {user.isCreator && (
                    <Badge variant="default" data-testid="badge-creator-nav">Creator</Badge>
                  )}
                  {user.isAdmin && (
                    <Badge variant="destructive" data-testid="badge-admin-nav">Admin</Badge>
                  )}
                </div>
                
                {(user.isCreator || user.isAdmin) && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" data-testid="button-dashboard-nav">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                
                {user && !user.isAdmin && !user.isCreator && (
                  <Link href="/chat/javari">
                    <Button variant="outline" size="sm" data-testid="button-javari-access">
                      Access Javari
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button data-testid="button-sign-in">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} data-testid="sheet-mobile-menu">
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                <i className="fas fa-bars text-xl"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80" data-testid="content-mobile-menu">
              <div className="flex flex-col space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">CRAudioVizAI</h2>
                  <p className="text-sm text-muted-foreground">Your Story. Our Design.</p>
                </div>

                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-lg hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {user ? (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="font-medium" data-testid="mobile-username">
                        {user.username}
                      </p>
                      <div className="flex justify-center space-x-2 mt-2">
                        {user.isCreator && (
                          <Badge variant="default" data-testid="mobile-badge-creator">Creator</Badge>
                        )}
                        {user.isAdmin && (
                          <Badge variant="destructive" data-testid="mobile-badge-admin">Admin</Badge>
                        )}
                      </div>
                    </div>

                    {(user.isCreator || user.isAdmin) && (
                      <Link href="/dashboard">
                        <Button 
                          className="w-full" 
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="mobile-button-dashboard"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}

                    {user && !user.isAdmin && !user.isCreator && (
                      <Link href="/chat/javari">
                        <Button 
                          className="w-full"
                          variant="outline" 
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="mobile-button-javari"
                        >
                          Access Javari
                        </Button>
                      </Link>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      data-testid="mobile-button-logout"
                    >
                      {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <Link href="/auth">
                      <Button 
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-button-sign-in"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
