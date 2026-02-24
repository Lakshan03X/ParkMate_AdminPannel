//  Role based navigation configuration

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wallet,
  FileText,
  Settings,
  ParkingSquare,
  DollarSign,
  History,
} from 'lucide-react';

/**
 * Role constants - matching authService roles
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MUNICIPAL_ADMIN: 'MUNICIPAL_ADMIN',
  FINE_CHECKER: 'FINE_CHECKER',
};

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.MUNICIPAL_ADMIN]: 'Municipal Council Admin',
  [ROLES.FINE_CHECKER]: 'Fine Checker',
};

/**
 * Base dashboard paths for each role
 */
export const DASHBOARD_PATHS = {
  [ROLES.SUPER_ADMIN]: '/dashboard/super-admin',
  [ROLES.MUNICIPAL_ADMIN]: '/dashboard/municipal',
  [ROLES.FINE_CHECKER]: '/dashboard/checker',
};

/**
 * Navigation items for Super Admin
 */
const SUPER_ADMIN_NAV = [
  {
    name: 'Dashboard',
    path: '/dashboard/super-admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Vehicle Owners',
    path: '/dashboard/super-admin/vehicle-owners',
    icon: Users,
  },
  {
    name: 'Inspectors',
    path: '/dashboard/super-admin/inspectors',
    icon: ShieldCheck,
  },
  {
    name: 'Council Officers',
    path: '/dashboard/super-admin/council-officers',
    icon: Users,
  },
  // {
  //   name: 'Fine Payments',
  //   path: '/dashboard/super-admin/fine-payments',
  //   icon: Wallet,
  // },
  // {
  //   name: 'Payment History',
  //   path: '/dashboard/super-admin/payment-history',
  //   icon: History,
  // },
  // {
  //   name: 'Parking Revenues',
  //   path: '/dashboard/super-admin/parking-revenues',
  //   icon: DollarSign,
  // },
  // {
  //   name: 'Analytics',
  //   path: '/dashboard/super-admin/analytics',
  //   icon: FileText,
  // },
  {
    name: 'Settings',
    path: '/dashboard/super-admin/settings',
    icon: Settings,
  },
];

/**
 * Navigation items for Municipal Council Admin
 */
const MUNICIPAL_ADMIN_NAV = [
  {
    name: 'Dashboard',
    path: '/dashboard/municipal',
    icon: LayoutDashboard,
  },
  {
    name: 'Parking Zones',
    path: '/dashboard/municipal/parking-zones',
    icon: ParkingSquare,
  },
  {
    name: 'Inspectors',
    path: '/dashboard/municipal/inspectors',
    icon: ShieldCheck,
  },
  {
    name: 'Fine Checkers',
    path: '/dashboard/municipal/fine-checkers',
    icon: Users,
  },
  {
    name: 'Settings',
    path: '/dashboard/municipal/settings',
    icon: Settings,
  },
];

/**
 * Navigation items for Fine Checker
 */
const FINE_CHECKER_NAV = [
  {
    name: 'Dashboard',
    path: '/dashboard/checker',
    icon: LayoutDashboard,
  },
  {
    name: 'Fine Payments',
    path: '/dashboard/checker/fine-payments',
    icon: Wallet,
  },
  {
    name: 'Payment History',
    path: '/dashboard/checker/payment-history',
    icon: History,
  },
  {
    name: 'Parking Revenues',
    path: '/dashboard/checker/parking-revenues',
    icon: DollarSign,
  },
  {
    name: 'Settings',
    path: '/dashboard/checker/settings',
    icon: Settings,
  },
];

/**
 * Navigation configuration map
 */
export const NAVIGATION_CONFIG = {
  [ROLES.SUPER_ADMIN]: SUPER_ADMIN_NAV,
  [ROLES.MUNICIPAL_ADMIN]: MUNICIPAL_ADMIN_NAV,
  [ROLES.FINE_CHECKER]: FINE_CHECKER_NAV,
};

/**
 * Get navigation items for a specific role
 */
export const getNavigationItems = (role) => {
  return NAVIGATION_CONFIG[role] || [];
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || 'Unknown Role';
};

/**
 * Get dashboard path for role
 */
export const getDashboardPath = (role) => {
  return DASHBOARD_PATHS[role] || '/dashboard';
};