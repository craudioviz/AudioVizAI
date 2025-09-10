import { Link } from "wouter";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { UniverseZone } from "@shared/schema";

interface UniverseCardProps {
  zone: UniverseZone;
  onAgeVerificationRequired?: () => void;
}

export default function UniverseCard({ zone, onAgeVerificationRequired }: UniverseCardProps) {
  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      'G': 'rating-g bg-green-500',
      'PG': 'rating-pg bg-yellow-500', 
      'PG-13': 'rating-pg13 bg-orange-500',
      'R': 'rating-r bg-red-500',
      'X': 'rating-x bg-red-700'
    };
    return colors[rating] || 'bg-gray-500';
  };

  const getZoneIcon = (name: string) => {
    const icons: Record<string, string> = {
      'family zone': 'fas fa-home',
      'creative studio': 'fas fa-palette',
      'business hub': 'fas fa-building',
      'entertainment zone': 'fas fa-gamepad',
      'only avatar': 'fas fa-lock'
    };
    return icons[name.toLowerCase()] || 'fas fa-globe';
  };

  const getZoneGradient = (name: string) => {
    const gradients: Record<string, string> = {
      'family zone': 'from-green-400 to-blue-500',
      'creative studio': 'from-purple-400 to-pink-500', 
      'business hub': 'from-gray-600 to-blue-600',
      'entertainment zone': 'from-red-500 to-orange-500',
      'only avatar': 'from-black to-red-900'
    };
    return gradients[name.toLowerCase()] || 'from-gray-500 to-gray-700';
  };

  const getStatusColor = (rating: string) => {
    const colors: Record<string, string> = {
      'G': 'text-green-500',
      'PG': 'text-blue-500',
      'PG-13': 'text-yellow-500',
      'R': 'text-orange-500', 
      'X': 'text-red-500'
    };
    return colors[rating] || 'text-gray-500';
  };

  const getStatusText = (rating: string) => {
    const texts: Record<string, string> = {
      'G': 'All Ages Welcome',
      'PG': 'Creator Tools',
      'PG-13': 'Professional',
      'R': '18+ Required',
      'X': 'Adult Content'
    };
    return texts[rating] || 'Available';
  };

  const handleEnterZone = () => {
    if (zone.requiresAgeVerification && onAgeVerificationRequired) {
      onAgeVerificationRequired();
    } else {
      // Navigate to zone
      const zonePath = zone.name.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/universe/${zonePath}`;
    }
  };

  return (
    <Card 
      className={`content-card overflow-hidden relative ${zone.rating === 'X' ? 'border-2 border-red-500' : ''}`}
      data-testid={`universe-card-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Badge 
        className={`rating-badge absolute top-2 right-2 ${getRatingColor(zone.rating)} text-white font-bold text-sm px-3 py-1`}
        data-testid={`badge-rating-${zone.rating.toLowerCase()}`}
      >
        {zone.rating}
      </Badge>
      
      <div className={`h-48 bg-gradient-to-br ${getZoneGradient(zone.name)} flex items-center justify-center`}>
        <i className={`${getZoneIcon(zone.name)} text-white text-4xl`}></i>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2" data-testid={`text-zone-name-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}>
          {zone.name}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid={`text-zone-description-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}>
          {zone.description}
        </p>

        {zone.rating === 'X' && (
          <div className="mb-4">
            <div className="text-xs text-red-400 mb-2">
              <i className="fas fa-exclamation-triangle"></i> Adult Content Warning
            </div>
            <div className="text-xs text-gray-400">
              • Age verification required<br/>
              • Private virtual experiences<br/>
              • Creator monetization available
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className={`text-sm ${getStatusColor(zone.rating)}`} data-testid={`text-zone-status-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}>
            {getStatusText(zone.rating)}
          </span>
          {zone.isActive ? (
            <Button 
              className={`text-sm ${zone.rating === 'X' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={handleEnterZone}
              data-testid={`button-enter-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {zone.requiresAgeVerification ? 'Age Verify & Enter' : 'Explore'}
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              disabled
              className="text-sm"
              data-testid={`button-coming-soon-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              Coming Soon
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
