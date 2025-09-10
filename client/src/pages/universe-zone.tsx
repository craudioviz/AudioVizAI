import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniverseZone } from "@shared/schema";
import Navigation from "@/components/ui/navigation";

export default function UniverseZonePage() {
  const { zoneName } = useParams<{ zoneName: string }>();

  const { data: zones = [] } = useQuery<UniverseZone[]>({
    queryKey: ["/api/universe-zones"],
  });

  const zone = zones.find(z => 
    z.name.toLowerCase().replace(/\s+/g, '-') === zoneName?.toLowerCase()
  );

  if (!zone) {
    return (
      <div className="min-h-screen bg-background" data-testid="zone-not-found">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Universe Zone Not Found</h1>
            <p className="text-muted-foreground">The requested zone could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      'G': 'bg-green-500',
      'PG': 'bg-yellow-500',
      'PG-13': 'bg-orange-500',
      'R': 'bg-red-500',
      'X': 'bg-red-700'
    };
    return colors[rating] || 'bg-gray-500';
  };

  const getZoneIcon = (name: string) => {
    const icons: Record<string, string> = {
      'family-zone': 'fas fa-home',
      'creative-studio': 'fas fa-palette',
      'business-hub': 'fas fa-building',
      'entertainment-zone': 'fas fa-gamepad',
      'only-avatar': 'fas fa-lock'
    };
    return icons[name.toLowerCase().replace(/\s+/g, '-')] || 'fas fa-globe';
  };

  const getZoneGradient = (name: string) => {
    const gradients: Record<string, string> = {
      'family-zone': 'from-green-400 to-blue-500',
      'creative-studio': 'from-purple-400 to-pink-500',
      'business-hub': 'from-gray-600 to-blue-600',
      'entertainment-zone': 'from-red-500 to-orange-500',
      'only-avatar': 'from-black to-red-900'
    };
    return gradients[name.toLowerCase().replace(/\s+/g, '-')] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="universe-zone-page">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Zone Header */}
          <Card className="mb-8" data-testid="card-zone-header">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getZoneGradient(zone.name)} flex items-center justify-center`}>
                    <i className={`${getZoneIcon(zone.name)} text-white text-3xl`}></i>
                  </div>
                  <div>
                    <CardTitle className="text-3xl" data-testid="text-zone-name">{zone.name}</CardTitle>
                    <p className="text-muted-foreground text-lg" data-testid="text-zone-description">
                      {zone.description}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={`${getRatingColor(zone.rating)} text-white text-lg px-4 py-2`}
                  data-testid={`badge-rating-${zone.rating.toLowerCase()}`}
                >
                  {zone.rating}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Zone Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <Card data-testid="card-zone-features">
              <CardHeader>
                <CardTitle data-testid="heading-features">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zone.rating === 'G' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Family-friendly content</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Educational activities</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-green-500"></i>
                        <span>Safe chat environment</span>
                      </div>
                    </>
                  )}
                  {zone.rating === 'PG' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-blue-500"></i>
                        <span>Creative tools & templates</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-blue-500"></i>
                        <span>Collaboration features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-blue-500"></i>
                        <span>Content sharing</span>
                      </div>
                    </>
                  )}
                  {zone.rating === 'PG-13' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-orange-500"></i>
                        <span>Professional networking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-orange-500"></i>
                        <span>Business tools</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-orange-500"></i>
                        <span>Advanced analytics</span>
                      </div>
                    </>
                  )}
                  {zone.rating === 'R' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-red-500"></i>
                        <span>Mature gaming content</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-red-500"></i>
                        <span>Adult social features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-check text-red-500"></i>
                        <span>Premium experiences</span>
                      </div>
                    </>
                  )}
                  {zone.rating === 'X' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span>Adult content only</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-lock text-red-500"></i>
                        <span>Private experiences</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-dollar-sign text-red-500"></i>
                        <span>Creator monetization</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Information */}
            <Card data-testid="card-access-info">
              <CardHeader>
                <CardTitle data-testid="heading-access">Access Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zone.requiresAgeVerification ? (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-destructive mb-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span className="font-semibold">Age Verification Required</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You must be 18 years or older and verify your age to access this zone.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                        <i className="fas fa-check-circle"></i>
                        <span className="font-semibold">Open Access</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This zone is available to all registered users.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">What you'll need:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Active CRVerse account</li>
                      <li>• Stable internet connection</li>
                      {zone.requiresAgeVerification && <li>• Age verification (18+)</li>}
                      {zone.rating === 'X' && <li>• Payment method for premium content</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center">
            {zone.isActive ? (
              <Button 
                size="lg" 
                className={`px-8 py-3 ${zone.rating === 'X' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                data-testid="button-enter-zone"
              >
                {zone.requiresAgeVerification ? 'Verify Age & Enter' : 'Enter Zone'}
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="secondary" 
                disabled
                data-testid="button-coming-soon"
              >
                Coming Soon
              </Button>
            )}
          </div>

          {/* Safety Notice for X-rated content */}
          {zone.rating === 'X' && (
            <Card className="mt-8 border-red-500/50" data-testid="card-safety-notice">
              <CardHeader>
                <CardTitle className="text-red-400" data-testid="heading-safety">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Safety & Protection Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    This zone contains adult content and is strictly separated from all other CRVerse areas.
                  </p>
                  <p>
                    We have implemented robust child protection measures and age verification systems.
                  </p>
                  <p>
                    All content in this zone is consensual, legal, and follows strict community guidelines.
                  </p>
                  <p className="text-red-400 font-medium">
                    If you are under 18 years old, please return to the main CRVerse areas immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
