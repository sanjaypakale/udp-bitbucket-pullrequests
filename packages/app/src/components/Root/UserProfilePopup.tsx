import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Popover,
  Typography,
  Avatar,
  Button,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { useSidebarOpenState } from '@backstage/core-components';

const useStyles = makeStyles((theme) => ({
  sidebarItem: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
    position: 'relative',
    color: theme.palette.navigation?.color || theme.palette.text.primary,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.navigation?.navItem?.hoverBackground || theme.palette.action.hover,
    },
    '&.active': {
      backgroundColor: theme.palette.navigation?.navItem?.hoverBackground || theme.palette.action.selected,
      borderRight: `3px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
      '& $avatar': {
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
      },
      '& $itemText': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
  },
  itemIcon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    backgroundColor: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  itemText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    transition: 'all 0.2s ease',
  },
  popupPaper: {
    position: 'relative',
    padding: 0,
    minWidth: 320,
    maxWidth: 360,
    borderRadius: 8,
    overflow: 'visible',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
    marginLeft: theme.spacing(6),
  },
  arrow: {
    position: 'absolute',
    left: -12,
    bottom: theme.spacing(4), // Position near the bottom of the popup
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderRight: '12px solid white',
    zIndex: 1,
  },
  popupContent: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(3),
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  popupAvatar: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: '1.5rem',
    fontWeight: 700,
    border: '3px solid rgba(255, 255, 255, 0.3)',
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: 'white',
    marginBottom: theme.spacing(0.5),
  },
  email: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
  signOutButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 16px rgba(238, 90, 82, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(238, 90, 82, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(238, 90, 82, 0.3)',
    },
  },
  signOutIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.1rem',
  },
}));

export const UserProfilePopup = () => {
  const classes = useStyles();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userProfile, setUserProfile] = useState({
    displayName: 'Sanjay Pakale',
    email: 'sanjaypakale@gmail.com',
  });
  const identityApi = useApi(identityApiRef);
  const { isOpen: sidebarIsOpen } = useSidebarOpenState();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const handlePopupClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleSignOut = async () => {
    try {
      await identityApi.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Fetch real user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await identityApi.getProfileInfo();
        setUserProfile({
          displayName: profile.displayName || 'Guest User',
          email: profile.email || 'guest@example.com',
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [identityApi]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div 
        className={`${classes.sidebarItem} ${isPopupOpen ? 'active' : ''}`}
        onClick={handleClick}
        data-testid="user-profile-sidebar-item"
      >
        <div className={classes.itemIcon}>
          <Avatar className={classes.avatar}>
            {getInitials(userProfile.displayName)}
          </Avatar>
        </div>
        {sidebarIsOpen && (
          <span className={classes.itemText}>
            {userProfile.displayName}
          </span>
        )}
      </div>
      
      <Popover
        open={isPopupOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        PaperProps={{
          className: classes.popupPaper,
          onClick: handlePopupClick,
          elevation: 0,
        }}
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        style={{ 
          marginLeft: 32, // Increased margin to ensure no overlap
        }}
      >
        <div className={classes.arrow} />
        <div className={classes.popupContent}>
          <div className={classes.header}>
            <div className={classes.userInfo}>
              <Avatar className={classes.popupAvatar}>
                {getInitials(userProfile.displayName)}
              </Avatar>
              <div className={classes.userDetails}>
                <Typography className={classes.displayName}>
                  {userProfile.displayName}
                </Typography>
                <Typography className={classes.email}>
                  {userProfile.email}
                </Typography>
              </div>
            </div>
          </div>
          
          <div className={classes.content}>
            <Button
              className={classes.signOutButton}
              onClick={handleSignOut}
              variant="contained"
              fullWidth
            >
              <ExitToAppIcon className={classes.signOutIcon} />
              Sign Out
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
}; 