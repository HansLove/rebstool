/**
 * Sub-Affiliate Routes Configuration
 * 
 * Organized into logical sections for better maintainability:
 * - CORE: Primary dashboard and overview routes
 * - EARNINGS: Financial tracking and performance routes
 * - NETWORK: User network and registration management
 * - RESOURCES: Supporting tools, tutorials, and settings
 */

export const SUBS_ROUTE_PATHS = {
  // Core Routes
  DASHBOARD: 'dashboard',
  RESUME: 'resume',
  ONE_VIEW: 'one-view',
  
  // Earnings Routes
  YOUR_EARNINGS: 'yourEarnings',
  PAYOUTS: 'payouts',
  PERFORMANCE: 'performance',
  
  // Network Routes
  MY_NETWORK: 'mynetwork',
  REGISTRATIONS: 'sub/registrations',
  
  // Resource Routes
  MARKETING: 'marketing',
  TUTORIAL: 'sub-affiliate-tutorial',
  SETTINGS: 'yourConfig',
  LANDING_BUILDER: 'landing-builder',
} as const;

export const ROUTE_GROUPS = {
  CORE: ['dashboard', 'resume', 'one-view'],
  EARNINGS: ['yourEarnings', 'payouts', 'performance'],
  NETWORK: ['mynetwork', 'sub/registrations'],
  RESOURCES: ['marketing', 'sub-affiliate-tutorial', 'yourConfig', 'landing-builder'],
} as const;


