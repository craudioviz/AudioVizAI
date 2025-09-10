import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/ui/navigation";
import { useToast } from "@/hooks/use-toast";

export default function OnlyAvatar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(user?.ageVerified || false);

  const verifyAgeMutation = useMutation({
    mutationFn: async (confirmed: boolean) => {
      const res = await apiRequest("POST", "/api/age-verification", { confirmed });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.verified) {
        setVerificationComplete(true);
        toast({
          title: "Age Verification Complete",
          description: "Welcome to Only Avatar. Please enjoy responsibly.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleVerification = () => {
    if (ageConfirmed && termsAccepted) {
      verifyAgeMutation.mutate(true);
    }
  };

  if (!verificationComplete) {
    return (
      <div className="min-h-screen bg-background" data-testid="age-verification-page">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-500/50" data-testid="card-age-verification">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-white text-3xl"></i>
                </div>
                <CardTitle className="text-3xl text-red-400" data-testid="heading-adult-warning">
                  Adult Content Warning
                </CardTitle>
                <Badge variant="destructive" className="mx-auto" data-testid="badge-x-rated">
                  X-RATED CONTENT
                </Badge>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6 border-red-500/50" data-testid="alert-content-warning">
                  <AlertDescription className="text-center">
                    <strong>You are about to enter the Only Avatar zone</strong>
                    <br />
                    This area contains explicit adult content and is strictly for users 18 years and older.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-red-400 mb-3" data-testid="heading-content-includes">
                      This area includes:
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Adult virtual fantasy experiences</li>
                      <li>• Private avatar interactions</li>
                      <li>• Explicit content and scenarios</li>
                      <li>• Creator monetization opportunities</li>
                      <li>• Premium subscription services</li>
                    </ul>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-400 mb-3" data-testid="heading-safety-measures">
                      Our Safety Measures:
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Strict age verification required</li>
                      <li>• Complete separation from other CRVerse areas</li>
                      <li>• Robust child protection protocols</li>
                      <li>• Secure payment processing</li>
                      <li>• 24/7 content moderation</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2" data-testid="checkbox-age-confirmation">
                      <Checkbox 
                        id="age-confirm"
                        checked={ageConfirmed}
                        onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
                      />
                      <label 
                        htmlFor="age-confirm" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I confirm that I am 18 years of age or older
                      </label>
                    </div>

                    <div className="flex items-center space-x-2" data-testid="checkbox-terms-acceptance">
                      <Checkbox 
                        id="terms-accept"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      />
                      <label 
                        htmlFor="terms-accept" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I accept the Terms of Service for adult content areas
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleVerification}
                      disabled={!ageConfirmed || !termsAccepted || verifyAgeMutation.isPending}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      data-testid="button-verify-and-enter"
                    >
                      {verifyAgeMutation.isPending ? "Verifying..." : "Verify Age & Enter"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="flex-1"
                      data-testid="button-take-me-back"
                    >
                      Take Me Back to Safety
                    </Button>
                  </div>

                  <p className="text-xs text-center text-gray-400" data-testid="text-protection-notice">
                    This content is strictly separated from all other CRVerse areas and includes 
                    robust child protection measures. By proceeding, you acknowledge that you 
                    understand the nature of the content and accept full responsibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Only Avatar interface (after age verification)
  return (
    <div className="min-h-screen bg-background" data-testid="only-avatar-main">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center">
              <i className="fas fa-heart text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-bold mb-2" data-testid="heading-only-avatar">
              Only Avatar
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-welcome-message">
              Welcome to your private virtual fantasy world
            </p>
            <Badge variant="destructive" className="mt-2" data-testid="badge-verified">
              Age Verified • 18+
            </Badge>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fantasy Experiences */}
            <Card className="border-red-500/30" data-testid="card-fantasy-experiences">
              <CardHeader>
                <CardTitle className="text-red-400" data-testid="heading-fantasy-experiences">
                  <i className="fas fa-magic mr-2"></i>
                  Fantasy Experiences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-romantic-encounters">
                    <i className="fas fa-heart mr-2"></i>
                    Romantic Encounters
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-adventure-stories">
                    <i className="fas fa-dragon mr-2"></i>
                    Adventure Stories
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-custom-scenarios">
                    <i className="fas fa-pen-fancy mr-2"></i>
                    Custom Scenarios
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Avatar Options */}
            <Card className="border-purple-500/30" data-testid="card-avatar-options">
              <CardHeader>
                <CardTitle className="text-purple-400" data-testid="heading-avatar-options">
                  <i className="fas fa-users mr-2"></i>
                  Avatar Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-ai-companions">
                    <i className="fas fa-robot mr-2"></i>
                    AI Companions
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-human-performers">
                    <i className="fas fa-user mr-2"></i>
                    Human Performers
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-custom-avatars">
                    <i className="fas fa-palette mr-2"></i>
                    Custom Avatars
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Creator Tools */}
            <Card className="border-green-500/30" data-testid="card-creator-tools">
              <CardHeader>
                <CardTitle className="text-green-400" data-testid="heading-creator-tools">
                  <i className="fas fa-dollar-sign mr-2"></i>
                  Creator Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-monetize-content">
                    <i className="fas fa-money-bill mr-2"></i>
                    Monetize Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-subscription-tiers">
                    <i className="fas fa-crown mr-2"></i>
                    Subscription Tiers
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-analytics-earnings">
                    <i className="fas fa-chart-line mr-2"></i>
                    Analytics & Earnings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Sharing Information */}
          <Card className="mt-8 border-yellow-500/30" data-testid="card-revenue-sharing">
            <CardHeader>
              <CardTitle className="text-yellow-400" data-testid="heading-revenue-sharing">
                <i className="fas fa-handshake mr-2"></i>
                Revenue Sharing Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center" data-testid="revenue-creators">
                  <div className="text-3xl font-bold text-green-400">70%</div>
                  <p className="text-sm text-muted-foreground">Creators</p>
                </div>
                <div className="text-center" data-testid="revenue-platform">
                  <div className="text-3xl font-bold text-blue-400">20%</div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                </div>
                <div className="text-center" data-testid="revenue-infrastructure">
                  <div className="text-3xl font-bold text-purple-400">10%</div>
                  <p className="text-sm text-muted-foreground">Infrastructure</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Fair revenue sharing that puts creators first while maintaining platform quality and safety.
              </p>
            </CardContent>
          </Card>

          {/* Safety Reminder */}
          <Alert className="mt-8 border-blue-500/50" data-testid="alert-safety-reminder">
            <i className="fas fa-shield-alt text-blue-400"></i>
            <AlertDescription>
              <strong>Safety Reminder:</strong> All interactions are private and secure. 
              Our 24/7 moderation team ensures content guidelines are followed. 
              Report any inappropriate behavior immediately.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
