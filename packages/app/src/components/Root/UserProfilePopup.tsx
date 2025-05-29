import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Popover,
    Avatar,
    Button,
    Divider,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';

// Local imports
import { useUserProfilePopupStyles } from './UserProfilePopup.styles';
import { getUserInitials, getAvatarColor, DEFAULT_USER_PROFILE } from './UserProfilePopup.utils';
import { UserProfile, UserProfilePopupProps, AvatarConfig } from './UserProfilePopup.types';


export const UserProfilePopup: React.FC<UserProfilePopupProps> = () => {
    const classes = useUserProfilePopupStyles();
    const identityApi = useApi(identityApiRef);
    
    // State management
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Computed values
    const isOpen = Boolean(anchorEl);
    
    const avatarConfig: AvatarConfig | null = useMemo(() => {
        if (!userProfile?.displayName) return null;
        
        const initials = getUserInitials(userProfile.displayName);
        const color = getAvatarColor(initials);
        
        return {
            initials,
            color,
            size: 'small',
        };
    }, [userProfile?.displayName]);

    // Event handlers
    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            await identityApi.signOut();
            handleClose();
        } catch (signOutError) {
            console.error('Failed to sign out:', signOutError);
            setError('Failed to sign out. Please try again.');
        }
    }, [identityApi, handleClose]);

    // Effects
    useEffect(() => {
        let isMounted = true;

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const profile = await identityApi.getProfileInfo();
                
                if (isMounted) {
                    setUserProfile({
                        displayName: profile.displayName || DEFAULT_USER_PROFILE.displayName,
                        email: profile.email || DEFAULT_USER_PROFILE.email,
                    });
                }
            } catch (fetchError) {
                console.error('Failed to fetch user profile:', fetchError);
                
                if (isMounted) {
                    setError('Failed to load user profile');
                    setUserProfile(DEFAULT_USER_PROFILE);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();

        return () => {
            isMounted = false;
        };
    }, [identityApi]);

    // Early returns for loading and error states
    if (loading || !userProfile || !avatarConfig) {
        return null;
    }

    return (
        <>
            {/* Sidebar Item */}
            <Box className={classes.sidebarItemContent} onClick={handleClick}>
                <Avatar 
                    className={classes.sidebarAvatar}
                    style={{ backgroundColor: avatarConfig.color }}
                    aria-label={`${userProfile.displayName} profile`}
                >
                    {avatarConfig.initials}
                </Avatar>
                <Box className={classes.userInfo}>
                    <Typography className={classes.displayName}>
                        {userProfile.displayName}
                    </Typography>
                </Box>
            </Box>
            
            {/* Popover */}
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                container={document.body}
                disablePortal={false}
                PaperProps={{
                    className: classes.popoverContainer,
                    style: { 
                        marginLeft: '4px',
                        zIndex: 10000,
                        position: 'relative',
                    },
                }}
                style={{ zIndex: 10000 }}
                marginThreshold={12}
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                {/* Arrow indicators */}
                <Box className={classes.arrow} />
                <Box className={classes.arrowBorder} />
                
                {/* Header */}
                <Box className={classes.header}>
                    <Avatar 
                        className={classes.userAvatar}
                        style={{ backgroundColor: avatarConfig.color }}
                    >
                        {avatarConfig.initials}
                    </Avatar>
                    <Box className={classes.headerContent}>
                        <Typography className={classes.userName}>
                            {userProfile.displayName}
                        </Typography>
                        <Typography className={classes.userEmailPopover}>
                            {userProfile.email}
                        </Typography>
                    </Box>
                </Box>
                
                {/* Content */}
                <Box className={classes.content}>
                    {error && (
                        <Typography color="error" variant="caption">
                            {error}
                        </Typography>
                    )}
                    
                    <Divider style={{ margin: '8px 0' }} />
                    
                    <Button
                        className={classes.signOutButton}
                        startIcon={<ExitToAppIcon />}
                        onClick={handleSignOut}
                        aria-label="Sign out of application"
                    >
                        Sign Out
                    </Button>
                </Box>
            </Popover>
        </>
    );
}; 