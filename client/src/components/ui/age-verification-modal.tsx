import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Alert, AlertDescription } from "./alert";
import { useToast } from "@/hooks/use-toast";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const verifyAgeMutation = useMutation({
    mutationFn: async (confirmed: boolean) => {
      const res = await apiRequest("POST", "/api/age-verification", { confirmed });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.verified) {
        toast({
          title: "Age Verification Complete",
          description: "You can now access age-restricted content.",
        });
        onClose();
        // Navigate to Only Avatar after verification
        window.location.href = "/only-avatar";
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

  const handleCancel = () => {
    setAgeConfirmed(false);
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-testid="dialog-age-verification">
      <DialogContent className="max-w-md mx-4 bg-card border-red-500/50" data-testid="content-age-verification">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <DialogTitle className="text-xl text-red-400" data-testid="heading-adult-content-warning">
            Adult Content Warning
          </DialogTitle>
          <Badge variant="destructive" className="mx-auto mt-2" data-testid="badge-x-rated-modal">
            X-RATED CONTENT
          </Badge>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-red-500/50" data-testid="alert-only-avatar-warning">
            <AlertDescription className="text-center text-sm">
              <strong>You are about to enter the Only Avatar zone</strong>
              <br />
              This area contains explicit adult content and is strictly for users 18 years and older.
            </AlertDescription>
          </Alert>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <h4 className="font-semibold text-red-400 mb-2 text-sm" data-testid="heading-content-warning">
              This content includes:
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Adult virtual fantasy experiences</li>
              <li>• Private avatar interactions</li>
              <li>• Explicit content and scenarios</li>
              <li>• Creator monetization opportunities</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <h4 className="font-semibold text-blue-400 mb-2 text-sm" data-testid="heading-safety-measures">
              Our Safety Measures:
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Strict age verification required</li>
              <li>• Complete separation from other CRVerse areas</li>
              <li>• Robust child protection protocols</li>
              <li>• 24/7 content moderation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2" data-testid="checkbox-age-confirmation-modal">
              <Checkbox 
                id="age-confirm-modal"
                checked={ageConfirmed}
                onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
              />
              <label 
                htmlFor="age-confirm-modal" 
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that I am 18 years of age or older
              </label>
            </div>

            <div className="flex items-center space-x-2" data-testid="checkbox-terms-acceptance-modal">
              <Checkbox 
                id="terms-accept-modal"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label 
                htmlFor="terms-accept-modal" 
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the Terms of Service for adult content areas
              </label>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleVerification}
              disabled={!ageConfirmed || !termsAccepted || verifyAgeMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
              data-testid="button-verify-and-enter-modal"
            >
              {verifyAgeMutation.isPending ? "Verifying..." : "Verify & Enter"}
            </Button>
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="flex-1 text-sm"
              data-testid="button-cancel-verification"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-gray-400" data-testid="text-protection-notice-modal">
            This content is strictly separated from all other CRVerse areas and includes 
            robust child protection measures.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
