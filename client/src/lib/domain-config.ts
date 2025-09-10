// Domain-based configuration and routing
export type DomainType = 'craudiovizai' | 'javariai' | 'craiverse' | 'tools' | 'create' | 'business' | 'localhost';

export interface DomainConfig {
  type: DomainType;
  name: string;
  description: string;
  requiresAuth: boolean;
  redirectUnauth?: string;
  defaultAuthRedirect?: string;
}

export function getCurrentDomain(): DomainType {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('javariai')) return 'javariai';
  if (hostname.includes('craiverse')) return 'craiverse';
  if (hostname.includes('tools')) return 'tools';
  if (hostname.includes('create')) return 'create';
  if (hostname.includes('business')) return 'business';
  if (hostname.includes('craudiovizai')) return 'craudiovizai';
  
  return 'localhost'; // Development
}

export const domainConfigs: Record<DomainType, DomainConfig> = {
  craudiovizai: {
    type: 'craudiovizai',
    name: 'CRAudioVizAI',
    description: 'Your comprehensive AI solutions provider',
    requiresAuth: false
  },
  javariai: {
    type: 'javariai', 
    name: 'Javari AI',
    description: 'Your autonomous AI assistant',
    requiresAuth: true,
    redirectUnauth: '/auth',
    defaultAuthRedirect: '/chat/javari'
  },
  craiverse: {
    type: 'craiverse',
    name: 'CRAIverse',
    description: 'Avatar universe governed by CRAI with immersive digital experiences',
    requiresAuth: true,
    redirectUnauth: '/auth',
    defaultAuthRedirect: '/universe'
  },
  tools: {
    type: 'tools',
    name: 'CRAudioVizAI Tools',
    description: 'AI-powered productivity tools',
    requiresAuth: false
  },
  create: {
    type: 'create',
    name: 'CRAudioVizAI Create',
    description: 'Website creation services',
    requiresAuth: false
  },
  business: {
    type: 'business',
    name: 'CRAudioVizAI Business',
    description: 'Enterprise AI solutions',
    requiresAuth: false
  },
  localhost: {
    type: 'localhost',
    name: 'CRAudioVizAI Development',
    description: 'Development environment',
    requiresAuth: false
  }
};

export function getDomainConfig(): DomainConfig {
  const domain = getCurrentDomain();
  return domainConfigs[domain];
}

export function shouldForceAuth(): boolean {
  const config = getDomainConfig();
  return config.requiresAuth;
}

export function getAuthRedirect(isAdmin: boolean, isCreator: boolean): string {
  const domain = getCurrentDomain();
  
  if (domain === 'javariai') {
    // Javari domain: admins get dashboard, customers get chat
    return (isAdmin || isCreator) ? '/dashboard' : '/chat/javari';
  }
  
  if (domain === 'craiverse') {
    // CRAIverse domain: all users go to universe
    return '/universe';
  }
  
  // Main site: admins get dashboard, customers get redirected to javariai
  if (isAdmin || isCreator) {
    return '/dashboard';
  }
  
  // Regular customers should be sent to javariai.com
  return 'https://javariai.com';
}