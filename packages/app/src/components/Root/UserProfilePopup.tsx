import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Popover,
  Avatar,
  Button,
  makeStyles,
  Divider,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { UserSettingsSignInAvatar } from '@backstage/plugin-user-settings';
import { SidebarItem } from '@backstage/core-components';

const useStyles = makeStyles((theme) => ({
  popoverContainer: {
    width: 320,
    borderRadius: theme.spacing(1),
    overflow: 'visible',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    marginLeft: theme.spacing(0.5),
    maxHeight: 'none',
    height: 'auto',
  },
  arrow: {
    position: 'absolute',
    left: -18,
    bottom: '10px',
    width: 0,
    height: 0,
    borderTop: '18px solid transparent',
    borderBottom: '18px solid transparent',
    borderRight: '18px solid #ffffff',
    zIndex: 10,
    filter: 'drop-shadow(-2px 0px 4px rgba(0,0,0,0.15))',
  },
  arrowBorder: {
    position: 'absolute',
    left: -20,
    bottom: '78px',
    width: 0,
    height: 0,
    borderTop: '20px solid transparent',
    borderBottom: '20px solid transparent',
    borderRight: '20px solid rgba(0,0,0,0.1)',
    zIndex: 9,
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(3),
    color: 'white',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    minHeight: 'auto',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  content: {
    padding: theme.spacing(2),
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  userAvatar: {
    width: 64,
    height: 64,
    fontSize: '1.5rem',
    fontWeight: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    flexShrink: 0,
  },
  userName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    lineHeight: 1.3,
    hyphens: 'auto',
  },
  userEmailPopover: {
    fontSize: '0.875rem',
    opacity: 0.9,
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    lineHeight: 1.2,
    hyphens: 'auto',
  },
  menuItem: {
    width: '100%',
    padding: theme.spacing(1.5, 2),
    textAlign: 'left',
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
  signOutButton: {
    width: '100%',
    padding: theme.spacing(1.5),
    color: '#e53e3e',
    fontWeight: 500,
    textTransform: 'none',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: '#fed7d7',
    },
  },
  sidebarItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    cursor: 'pointer',
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(0.5),
    margin: theme.spacing(0),
    width: '100%',
    minHeight: '48px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    flex: 1,
  },
  displayName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.common.white,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '150px',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

// Generate user initials from display name
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const UserProfilePopup = () => {
  const classes = useStyles();
  const identityApi = useApi(identityApiRef);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userProfile, setUserProfile] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await identityApi.getProfileInfo();
        setUserProfile({
          displayName: profile.displayName || 'sanjay pakale asdfafaasdfasdfa',
          email: profile.email || 'sanjaypakale@gmail.com',
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserProfile({
          displayName: 'sanjay pakale adffdasdfasdfasdf',
          email: 'sanjaypakale@gmail.com',
        });
      }
    };

    fetchUserProfile();
  }, [identityApi]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await identityApi.signOut();
      handleClose();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const open = Boolean(anchorEl);

  if (!userProfile) {
    return null;
  }

  return (
    <>
      <Box className={classes.sidebarItemContent} onClick={handleClick}>
        <UserSettingsSignInAvatar />
        <Box className={classes.userInfo}>
          <Typography className={classes.displayName}>
            {userProfile.displayName}
          </Typography>
        </Box>
      </Box>
      
      <Popover
        open={open}
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
        <Box className={classes.arrow} />
        <Box className={classes.arrowBorder} />
        
        <Box className={classes.header}>
          <Avatar className={classes.userAvatar}>
            {getUserInitials(userProfile.displayName)}
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
        
        <Box className={classes.content}>
          
          
          <Button
            className={classes.signOutButton}
            startIcon={<ExitToAppIcon />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Popover>
    </>
  );
}; 