import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/ui/navigation";
import AvatarCard from "@/components/ui/avatar-card";
import UniverseCard from "@/components/ui/universe-card";
import AgeVerificationModal from "@/components/ui/age-verification-modal";
import EmergencyButton from "@/components/ui/emergency-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, UniverseZone } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const [rotatingCR, setRotatingCR] = useState("Creative Reality");
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  const crMeanings = [
    'Creative Reality',
    'Connected Realms', 
    'Collaborative Revolution',
    'Cognitive Renaissance',
    'Community Reimagined'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCR(prev => {
        const currentIndex = crMeanings.indexOf(prev);
        const nextIndex = (currentIndex + 1) % crMeanings.length;
        return crMeanings[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { data: avatars = [] } = useQuery<Avatar[]>({
    queryKey: ["/api/avatars"],
  });

  const { data: universeZones = [] } = useQuery<UniverseZone[]>({
    queryKey: ["/api/universe-zones"],
  });

  return (
    <div className="bg-background text-foreground min-h-screen" data-testid="homepage">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" data-testid="main-headline">
              Your Story. Our Design.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8" data-testid="hero-subtitle">
              Powered by CRAudioVizAI - Unleash creativity through AI, avatars, and immersive experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                data-testid="button-explore-solutions"
              >
                Explore Solutions
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                data-testid="button-watch-demo"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CR Rotating Text */}
      <div className="bg-muted/10 py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-muted-foreground">
            <span data-testid="text-rotating-cr" className="transition-opacity duration-300">
              {rotatingCR}
            </span>
          </div>
        </div>
      </div>

      {/* Live Avatars Section */}
      <section id="avatars" className="py-16 bg-muted/20" data-testid="section-live-avatars">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-live-avatars">
              Meet Our Live Avatars
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-avatars-subtitle">
              Interactive AI personalities ready to assist you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6" data-testid="grid-avatars">
            {avatars.map((avatar, index) => (
              <AvatarCard 
                key={avatar.id} 
                avatar={avatar} 
                index={index}
                data-testid={`card-avatar-${avatar.name.toLowerCase()}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CRAudioVizAI Solutions Section */}
      <section id="solutions" className="py-16 bg-muted/10" data-testid="section-solutions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-solutions">
              CRAudioVizAI Solutions
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-solutions-subtitle">
              Comprehensive AI-powered tools, apps, and services for every business need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" data-testid="grid-solutions">
            {/* AI Tools & Apps */}
            <Card className="content-card text-center" data-testid="card-ai-tools">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <i className="fas fa-robot text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Tools & Apps</h3>
                <p className="text-sm text-muted-foreground mb-4">Intelligent automation and productivity solutions</p>
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
              </CardContent>
            </Card>

            {/* Website Creation */}
            <Card className="content-card text-center" data-testid="card-website-creation">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <i className="fas fa-code text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Website Creation</h3>
                <p className="text-sm text-muted-foreground mb-4">Custom websites built by AI and expert developers</p>
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
              </CardContent>
            </Card>

            {/* Business Solutions */}
            <Card className="content-card text-center" data-testid="card-business-solutions">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <i className="fas fa-briefcase text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">Business Solutions</h3>
                <p className="text-sm text-muted-foreground mb-4">Enterprise AI consulting and custom development</p>
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
              </CardContent>
            </Card>

            {/* CRVerse Avatar World */}
            <Card className="content-card text-center border-purple-500/50" data-testid="card-crverse">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <i className="fas fa-globe text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">CRVerse Avatar World</h3>
                <p className="text-sm text-muted-foreground mb-4">Immersive avatar experiences and digital universes</p>
                <Badge variant="default" className="mb-2">Live Now</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CRVerse Universe Section */}
      <section id="universe" className="py-16" data-testid="section-universe">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-universe">
              CRVerse: Our Avatar Universe
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-universe-subtitle">
              Immersive avatar experiences with content for every audience and appropriate ratings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-universe-zones">
            {universeZones.map(zone => (
              <UniverseCard 
                key={zone.id} 
                zone={zone}
                onAgeVerificationRequired={() => setShowAgeVerification(true)}
                data-testid={`card-universe-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Creator Monetization Section */}
      <section id="creators" className="py-16 bg-muted/20" data-testid="section-creators">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-creator-economy">
              Creator Economy
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-creator-subtitle">
              Monetize your creativity across all CRAudioVizAI platforms and CRVerse experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="grid-monetization">
            <Card className="content-card text-center" data-testid="card-content-monetization">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-white text-2xl"></i>
                </div>
                <CardTitle>Content Monetization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>• Revenue sharing across all platforms</p>
                  <p>• Direct fan subscriptions</p>
                  <p>• Premium content access</p>
                  <p>• Tip and donation systems</p>
                </div>
                <Button className="w-full" data-testid="button-start-creating">
                  Start Creating
                </Button>
              </CardContent>
            </Card>

            <Card className="content-card text-center" data-testid="card-avatar-services">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <i className="fas fa-handshake text-white text-2xl"></i>
                </div>
                <CardTitle>Avatar Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>• Custom avatar design</p>
                  <p>• Voice and personality modeling</p>
                  <p>• Interactive experiences</p>
                  <p>• Business consultation</p>
                </div>
                <Button className="w-full" data-testid="button-offer-services">
                  Offer Services
                </Button>
              </CardContent>
            </Card>

            <Card className="content-card text-center" data-testid="card-premium-experiences">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <i className="fas fa-crown text-white text-2xl"></i>
                </div>
                <CardTitle>Premium Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>• Exclusive virtual events</p>
                  <p>• Private avatar sessions</p>
                  <p>• Custom world creation</p>
                  <p>• VIP community access</p>
                </div>
                <Button className="w-full" data-testid="button-go-premium">
                  Go Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Creator Dashboard Access */}
      {user && (
        <section className="py-16" data-testid="section-dashboard-access">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-creator-dashboard">
                Creator Dashboard
              </h2>
              <p className="text-xl text-muted-foreground mb-8" data-testid="text-dashboard-subtitle">
                Access your content creation and monetization tools
              </p>
              
              <Link href="/dashboard">
                <Button size="lg" className="px-8" data-testid="button-access-dashboard">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12" data-testid="footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div data-testid="footer-brand">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <span className="font-bold">CRAudioVizAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your comprehensive AI solutions provider - Tools, apps, websites, and avatar experiences.
              </p>
            </div>
            
            <div data-testid="footer-solutions">
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/universe/family-zone" className="hover:text-foreground transition-colors">CRVerse Avatar World</Link></li>
                <li><Link href="/universe/creative-studio" className="hover:text-foreground transition-colors">AI Tools & Apps</Link></li>
                <li><Link href="/universe/business-hub" className="hover:text-foreground transition-colors">Website Creation</Link></li>
                <li><Link href="/universe/entertainment" className="hover:text-foreground transition-colors">Business Solutions</Link></li>
              </ul>
            </div>
            
            <div data-testid="footer-avatars">
              <h4 className="font-semibold mb-4">Avatars</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/chat/javari" className="hover:text-foreground transition-colors">Javari</Link></li>
                <li><Link href="/chat/kairo" className="hover:text-foreground transition-colors">Kairo</Link></li>
                <li><Link href="/chat/crai" className="hover:text-foreground transition-colors">CRAI</Link></li>
                <li><Link href="/chat/roy" className="hover:text-foreground transition-colors">Roy & Cindy</Link></li>
              </ul>
            </div>
            
            <div data-testid="footer-support">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground" data-testid="footer-copyright">
            <p>&copy; 2025 CRAudioVizAI. All rights reserved. | Your Story. Our Design.</p>
          </div>
        </div>
      </footer>

      <AgeVerificationModal 
        isOpen={showAgeVerification}
        onClose={() => setShowAgeVerification(false)}
        data-testid="modal-age-verification"
      />
      
      <EmergencyButton data-testid="button-emergency" />
    </div>
  );
}
