/**
 * User profile data interface
 */
export interface UserProfile {
    displayName: string;
    email: string;
}
/**
 * Props for the UserProfilePopup component
 */
export interface UserProfilePopupProps {
}
/**
 * Avatar configuration interface
 */
export interface AvatarConfig {
    initials: string;
    color: string;
    size: 'small' | 'large';
}
