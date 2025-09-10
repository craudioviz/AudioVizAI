import { Link } from "wouter";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar } from "@shared/schema";

interface AvatarCardProps {
  avatar: Avatar;
  index: number;
}

export default function AvatarCard({ avatar, index }: AvatarCardProps) {
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

  return (
    <Card 
      className="content-card text-center animate-slide-up hover:scale-105 transition-transform"
      style={{ animationDelay: `${index * 0.1}s` }}
      data-testid={`avatar-card-${avatar.name.toLowerCase()}`}
    >
      <CardContent className="p-6">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${getAvatarGradient(avatar.name)} avatar-glow flex items-center justify-center`}>
          <i className={`${getAvatarIcon(avatar.name)} text-white text-2xl`}></i>
        </div>
        <h3 className="text-xl font-semibold mb-2" data-testid={`text-avatar-name-${avatar.name.toLowerCase()}`}>
          {avatar.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4" data-testid={`text-avatar-description-${avatar.name.toLowerCase()}`}>
          {avatar.description}
        </p>
        <div className="flex justify-center space-x-2 mb-4">
          <span className={`w-3 h-3 rounded-full ${avatar.status === "live" ? "bg-green-500" : "bg-gray-500"}`}></span>
          <Badge 
            variant={avatar.status === "live" ? "default" : "secondary"}
            className="text-sm"
            data-testid={`badge-status-${avatar.name.toLowerCase()}`}
          >
            {avatar.status === "live" ? "Live" : "Offline"}
          </Badge>
        </div>
        <Link href={`/chat/${avatar.name.toLowerCase()}`}>
          <Button 
            className="w-full" 
            disabled={avatar.status !== "live"}
            data-testid={`button-chat-${avatar.name.toLowerCase()}`}
          >
            {avatar.status === "live" ? "Chat Now" : "Offline"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
