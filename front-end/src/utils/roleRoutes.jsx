// Role constants - matching DynamoDB schema
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MUNICIPAL_ADMIN: 'MUNICIPAL_ADMIN',
  FINE_CHECKER: 'FINE_CHECKER'
};

// Route mapping for each role
export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/dashboard/super-admin',
  [ROLES.MUNICIPAL_ADMIN]: '/dashboard/municipal',
  [ROLES.FINE_CHECKER]: '/dashboard/checker'
};

/**
 * Navigate user to appropriate dashboard based on their role
 */
export const navigateByRole = (role) => {
  const route = ROLE_ROUTES[role];
  
  if (!route) {
    console.error(`Invalid role: ${role}`);
    // Fallback to login if role is invalid
    window.location.href = '/login';
    return;
  }

  // Navigate to role-specific dashboard
  window.location.href = route;
};

/**
 * Check if user has required role for a route
 */
export const hasRequiredRole = (userRole, requiredRole) => {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
};

/**
 * Get user-friendly role name
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.SUPER_ADMIN]: 'Super Administrator',
    [ROLES.MUNICIPAL_ADMIN]: 'Municipal Council Admin',
    [ROLES.FINE_CHECKER]: 'Fine Checker'
  };

  return displayNames[role] || 'Unknown Role';
};

/**
 * Check if user can access admin features
 */
export const canAccessAdminFeatures = (role) => {
  return role === ROLES.SUPER_ADMIN || role === ROLES.MUNICIPAL_ADMIN;
};

/**
 * Check if user is Super Admin
 */
export const isSuperAdmin = (role) => {
  return role === ROLES.SUPER_ADMIN;
};