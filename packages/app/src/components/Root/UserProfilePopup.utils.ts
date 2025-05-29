/**
 * Generate user initials from display name
 * @param name - The display name of the user
 * @returns The initials (up to 2 characters)
 */
export const getUserInitials = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'U'; // Default for unknown user
  }
  
  return name
    .trim()
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate a consistent avatar color based on initials
 * @param initials - The user initials
 * @returns A hex color string
 */
export const getAvatarColor = (initials: string): string => {
  const colors = [
    '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', 
    '#00796b', '#5d4037', '#455a64', '#e53935', '#fbc02d', 
    '#512da8', '#00acc1', '#8bc34a', '#ff9800', '#9c27b0'
  ];
  
  if (!initials || initials.trim() === '') {
    return colors[0]; // Default color
  }
  
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Default user profile data
 */
export const DEFAULT_USER_PROFILE = {
  displayName: 'Guest User',
  email: 'guest@example.com',
} as const; 