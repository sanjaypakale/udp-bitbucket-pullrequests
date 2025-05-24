import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 320, // Fixed height for all cards
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  statusChip: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
  },
  reviewerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  content: {
    flex: '1 0 auto',
    overflow: 'auto',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
    fontWeight: 500,
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  branchText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
  },
  branchIcon: {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing(1),
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  timeInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
  },
  timeLabel: {
    fontWeight: 500,
    marginRight: theme.spacing(0.5),
    minWidth: 60,
  },
  authorContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  descriptionContainer: {
    overflow: 'hidden',
    flex: 1,
    marginBottom: theme.spacing(1),
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  reviewRequired: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  reviewInProgress: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  approved: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  declined: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  merged: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  statusColumn: {
    height: '100%',
  },
  columnHeader: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    fontWeight: 600,
    textAlign: 'center',
  },
  reviewRequiredHeader: {
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
  },
  reviewInProgressHeader: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  approvedHeader: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  mergedHeader: {
    backgroundColor: 'rgba(103, 58, 183, 0.1)',
  },
  declinedHeader: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  reviewerApproved: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      backgroundColor: theme.palette.success.main,
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
  },
  reviewerNeedsWork: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      backgroundColor: theme.palette.warning.main,
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
  },
  checkIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 12,
    color: 'white',
    zIndex: 1,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
  },
  loadingText: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  skeletonCard: {
    margin: theme.spacing(2, 0),
    minHeight: 250,
  },
  errorContainer: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  emptyContainer: {
    padding: theme.spacing(5),
    margin: theme.spacing(2),
    textAlign: 'center',
  },
})); 