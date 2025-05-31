/**
 * Generate user initials from display name
 * @param name - The display name of the user
 * @returns The initials (up to 2 characters)
 */
export declare const getUserInitials: (name: string) => string;
/**
 * Generate a consistent avatar color based on initials
 * @param initials - The user initials
 * @returns A hex color string
 */
export declare const getAvatarColor: (initials: string) => string;
/**
 * Default user profile data
 */
export declare const DEFAULT_USER_PROFILE: {
    readonly displayName: "Guest User";
    readonly email: "guest@example.com";
};
