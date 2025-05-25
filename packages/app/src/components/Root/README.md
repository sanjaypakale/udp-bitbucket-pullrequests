# User Profile Popup Component

This directory contains the `UserProfilePopup` component that provides a modern, hover-activated user profile popup in the Backstage sidebar.

## Features

- **Hover Activation**: The popup appears when hovering over the user avatar in the sidebar
- **User Information Display**: Shows user avatar, display name, and email address
- **Sign Out Functionality**: Includes a prominent sign out button that properly logs out the user
- **Modern Design**: Features a gradient header, clean typography, and smooth animations
- **Responsive**: Adapts to different screen sizes and maintains proper positioning

## Components

### UserProfilePopup.tsx
The main component that renders:
- A hover-sensitive wrapper around the existing `UserSettingsSignInAvatar`
- A Material-UI Popover with user information
- User avatar with initials fallback
- User display name and email
- Sign out button with proper authentication handling

## Usage

The component is integrated into the `Root.tsx` component and replaces the standard settings sidebar group:

```tsx
import { UserProfilePopup } from './UserProfilePopup';

// In the sidebar:
<UserProfilePopup />
```

## Styling

The component uses Material-UI's `makeStyles` with:
- Gradient background for the header
- Clean white content area
- Smooth hover transitions
- Professional typography
- Consistent spacing and shadows

## Authentication

The component uses Backstage's `identityApi` to:
- Fetch user profile information
- Handle sign out functionality
- Provide fallback values for guest users

## Dependencies

- `@backstage/core-plugin-api` - For identity API access
- `@backstage/plugin-user-settings` - For the base avatar component
- `@material-ui/core` - For UI components and styling
- `@material-ui/icons` - For the sign out icon 