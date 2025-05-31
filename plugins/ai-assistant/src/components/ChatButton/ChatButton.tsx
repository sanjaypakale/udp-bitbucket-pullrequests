import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogContent,
  Slide,
  Badge,
} from '@material-ui/core';
import {
  Chat as BotIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import { ChatInterface } from '../ChatInterface/ChatInterface';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: theme.zIndex.speedDial,
  },
  dialog: {
    '& .MuiDialog-paper': {
      margin: theme.spacing(2),
      width: '90%',
      maxWidth: '800px',
      height: '80vh',
      maxHeight: '600px',
    },
  },
  dialogContent: {
    padding: 0,
    height: '100%',
    overflow: 'hidden',
  },
}));

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ChatButtonProps {
  notificationCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ notificationCount = 0 }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Badge badgeContent={notificationCount} color="error">
        <Fab
          color="primary"
          aria-label="AI Assistant"
          className={classes.fab}
          onClick={handleToggle}
        >
          {open ? <CloseIcon /> : <BotIcon />}
        </Fab>
      </Badge>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        className={classes.dialog}
        maxWidth={false}
      >
        <DialogContent className={classes.dialogContent}>
          <ChatInterface onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}; 