import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, ChatSession } from "@shared/schema";
import Navigation from "@/components/ui/navigation";

export default function AvatarChat() {
  const { avatarName } = useParams<{ avatarName: string }>();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: avatar } = useQuery<Avatar>({
    queryKey: ["/api/avatars", avatarName],
  });

  // Start chat session when avatar is loaded
  const startSessionMutation = useMutation({
    mutationFn: async (avatarId: string) => {
      const res = await apiRequest("POST", "/api/chat/start", { avatarId });
      return await res.json();
    },
    onSuccess: (session: ChatSession) => {
      setCurrentSession(session);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string; message: string }) => {
      const res = await apiRequest("POST", `/api/chat/${sessionId}/message`, { message });
      return await res.json();
    },
    onSuccess: (updatedSession: ChatSession) => {
      setCurrentSession(updatedSession);
      setMessage("");
    },
  });

  useEffect(() => {
    if (avatar && !currentSession) {
      startSessionMutation.mutate(avatar.id);
    }
  }, [avatar]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentSession) return;

    sendMessageMutation.mutate({
      sessionId: currentSession.id,
      message: message.trim()
    });
  };

  if (!avatar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="avatar-loading">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading avatar...</p>
        </div>
      </div>
    );
  }

  const getAvatarIcon = (name: string) => {
    const icons: Record<string, string> = {
      javari: "fas fa-brain",
      kairo: "fas fa-chart-line", 
      crai: "fas fa-code",
      roy: "fas fa-user-tie",
      cindy: "fas fa-user-friends"
    };
    return icons[name.toLowerCase()] || "fas fa-robot";
  };

  const getAvatarGradient = (name: string) => {
    const gradients: Record<string, string> = {
      javari: "from-purple-500 to-blue-500",
      kairo: "from-blue-500 to-cyan-500",
      crai: "from-green-500 to-emerald-500", 
      roy: "from-orange-500 to-red-500",
      cindy: "from-pink-500 to-purple-500"
    };
    return gradients[name.toLowerCase()] || "from-gray-500 to-gray-700";
  };

  const messages = (currentSession?.messages as any[]) || [];

  return (
    <div className="min-h-screen bg-background" data-testid="avatar-chat-page">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Avatar Header */}
          <Card className="mb-6" data-testid="card-avatar-header">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarGradient(avatar.name)} flex items-center justify-center`}>
                  <i className={`${getAvatarIcon(avatar.name)} text-white text-2xl`}></i>
                </div>
                <div>
                  <CardTitle className="text-2xl" data-testid="text-avatar-name">{avatar.name}</CardTitle>
                  <p className="text-muted-foreground" data-testid="text-avatar-description">
                    {avatar.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={avatar.status === "live" ? "default" : "secondary"}
                      data-testid={`badge-status-${avatar.status}`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        avatar.status === "live" ? "bg-green-500" : "bg-gray-500"
                      }`}></span>
                      {avatar.status === "live" ? "Live" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Chat Interface */}
          <Card data-testid="card-chat-interface">
            <CardHeader>
              <CardTitle data-testid="heading-chat">Chat with {avatar.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <ScrollArea className="h-96 w-full mb-4 p-4 border rounded-lg" data-testid="scroll-messages">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8" data-testid="text-no-messages">
                      <p>Start a conversation with {avatar.name}</p>
                    </div>
                  ) : (
                    messages.map((msg: any, index: number) => (
                      <div 
                        key={msg.id || index} 
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        data-testid={`message-${msg.sender}-${index}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-foreground"
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2" data-testid="form-send-message">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type a message to ${avatar.name}...`}
                  disabled={sendMessageMutation.isPending || avatar.status !== "live"}
                  data-testid="input-message"
                />
                <Button 
                  type="submit" 
                  disabled={!message.trim() || sendMessageMutation.isPending || avatar.status !== "live"}
                  data-testid="button-send-message"
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send"}
                </Button>
              </form>

              {avatar.status !== "live" && (
                <p className="text-sm text-muted-foreground mt-2 text-center" data-testid="text-avatar-offline">
                  {avatar.name} is currently offline. Please try again later.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
