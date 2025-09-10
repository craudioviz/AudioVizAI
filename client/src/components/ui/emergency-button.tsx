import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Alert, AlertDescription } from "./alert";
import { useToast } from "@/hooks/use-toast";

export default function EmergencyButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");

  const emergencyMutation = useMutation({
    mutationFn: async ({ action, reason }: { action: string; reason: string }) => {
      const res = await apiRequest("POST", "/api/emergency-stop", { action, reason });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Emergency Action Logged",
        description: "The emergency action has been recorded and authorities notified.",
      });
      setShowDialog(false);
      setAction("");
      setReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Emergency Action Failed",
        description: error.message || "Failed to process emergency action",
        variant: "destructive",
      });
    },
  });

  // Only show for admin users
  if (!user?.isAdmin) {
    return null;
  }

  const handleEmergencyClick = () => {
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim()) {
      toast({
        title: "Action Required",
        description: "Please specify the emergency action type.",
        variant: "destructive",
      });
      return;
    }

    emergencyMutation.mutate({ action: action.trim(), reason: reason.trim() });
  };

  const emergencyActions = [
    "SYSTEM_SHUTDOWN",
    "CONTENT_LOCKDOWN", 
    "USER_ACCESS_SUSPENSION",
    "AVATAR_DISABLE_ALL",
    "ONLY_AVATAR_EMERGENCY_STOP",
    "FULL_PLATFORM_FREEZE"
  ];

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        onClick={handleEmergencyClick}
        title="Emergency Stop - Roy/Cindy Authority Required"
        data-testid="button-emergency-stop"
      >
        <i className="fas fa-power-off text-xl"></i>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog} data-testid="dialog-emergency-controls">
        <DialogContent className="max-w-md bg-card border-red-500/50" data-testid="content-emergency-controls">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center" data-testid="heading-emergency-controls">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Emergency Controls
            </DialogTitle>
          </DialogHeader>

          <Alert className="border-red-500/50" data-testid="alert-emergency-warning">
            <AlertDescription className="text-sm">
              <strong>Warning:</strong> Emergency controls will immediately affect platform operations.
              Only use in genuine emergency situations.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="emergency-action" className="text-sm font-medium">
                Emergency Action Type
              </Label>
              <select
                id="emergency-action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                data-testid="select-emergency-action"
              >
                <option value="">Select action type...</option>
                {emergencyActions.map((actionType) => (
                  <option key={actionType} value={actionType}>
                    {actionType.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="emergency-reason" className="text-sm font-medium">
                Reason (Optional but Recommended)
              </Label>
              <Textarea
                id="emergency-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the emergency situation..."
                className="mt-1"
                rows={3}
                data-testid="textarea-emergency-reason"
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-400 mb-2 text-sm">
                Authority Hierarchy:
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Roy Henderson - Ultimate Authority</li>
                <li>• Cindy - Secondary Authority</li>
                <li>• Actions are logged and audited</li>
                <li>• All emergency stops are reversible</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit"
                disabled={!action || emergencyMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
                data-testid="button-execute-emergency"
              >
                {emergencyMutation.isPending ? "Executing..." : "Execute Emergency Action"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
                data-testid="button-cancel-emergency"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-center text-gray-400">
              Current authority: <strong>{user.username}</strong>
              <br />
              All actions are logged with timestamp and user ID.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
