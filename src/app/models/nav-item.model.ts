/**
 * Navigation item model supporting both internal routes and external links.
 */
export interface NavItem {
  label: string;
  type: 'route' | 'external';
  path?: string; // For type 'route'
  url?: string; // For type 'external'
  exact?: boolean; // For routerLinkActiveOptions
  icon?: string; // Bootstrap icon class (e.g., 'bi-discord')
  ariaLabel?: string; // Custom aria-label for accessibility
}

/**
 * Centralized navigation configuration.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', type: 'route', path: '/home', exact: true },
  { label: 'Checklist', type: 'route', path: '/checklist' },
  { label: 'Guides', type: 'route', path: '/guides' },
  { label: 'Timers', type: 'route', path: '/timers' },
  { label: 'Tools', type: 'route', path: '/tools' },
  { label: 'Map', type: 'route', path: '/map' },
  {
    label: 'Community',
    type: 'external',
    url: 'https://discord.gg/2nRR25nqNB',
    icon: 'bi-discord',
    ariaLabel: 'Join WWM Helper Discord (opens in a new tab)',
  },
];
