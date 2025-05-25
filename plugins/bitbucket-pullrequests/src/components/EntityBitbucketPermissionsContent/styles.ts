import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  tabsContainer: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(3),
  },
  tabPanel: {
    padding: 0,
  },
  sectionCard: {
    '& .MuiCardContent-root': {
      padding: theme.spacing(3),
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      fontSize: '1.25rem',
    },
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  permissionChip: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
  },
  adminChip: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  writeChip: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  readChip: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  userAvatar: {
    width: 40,
    height: 40,
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  restrictionTypeChip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  branchInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
  },
  reviewerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
  },
  approvalBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: theme.palette.success.main,
      color: 'white',
      fontWeight: 'bold',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  tableContainer: {
    maxHeight: 400,
    overflow: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  tableWrapper: {
    position: 'relative',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[50],
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.grey[100],
      fontWeight: 600,
      fontSize: '0.875rem',
      color: theme.palette.text.primary,
      borderBottom: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(2),
    },
  },
  tableRow: {
    '& .MuiTableCell-body': {
      padding: theme.spacing(1.5, 2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '&:last-child .MuiTableCell-body': {
      borderBottom: 0,
    },
  },
  groupChip: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    margin: theme.spacing(0.5),
  },
  patternText: {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  // Branch Restrictions specific styles
  restrictionCard: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  },
  restrictionHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  restrictionContent: {
    padding: theme.spacing(2.5),
  },
  restrictionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  restrictionTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
    },
  },
  restrictionTypeChipEnhanced: {
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  readOnlyChip: {
    backgroundColor: '#e53e3e',
    color: 'white',
  },
  fastForwardChip: {
    backgroundColor: '#3182ce',
    color: 'white',
  },
  noDeletesChip: {
    backgroundColor: '#d69e2e',
    color: 'white',
  },
  pullRequestChip: {
    backgroundColor: '#38a169',
    color: 'white',
  },
  requireReviewersChip: {
    backgroundColor: '#805ad5',
    color: 'white',
  },
  branchMatcherInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  matcherTypeChip: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.info.main,
    color: 'white',
    fontSize: '0.7rem',
    height: 20,
  },
  exemptionsSection: {
    marginTop: theme.spacing(2),
  },
  exemptionsTitle: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.5),
      fontSize: '1.1rem',
    },
  },
  exemptionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  userExemption: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  groupExemptionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  groupExemptionChip: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    fontWeight: 500,
    '& .MuiChip-icon': {
      color: 'white',
    },
  },
  emptyExemptions: {
    padding: theme.spacing(1.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
  },
  // Default Reviewers specific styles
  reviewerCard: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  },
  reviewerHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  reviewerContent: {
    padding: theme.spacing(2.5),
  },
  reviewerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  reviewerTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
    },
  },
  sourceMatcherInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  reviewersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
  reviewerItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  reviewerApprovalBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  approvalCountChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    minWidth: '24px',
    height: '24px',
    '& .MuiChip-label': {
      padding: theme.spacing(0, 0.5),
    },
  },
  sourceTypeChip: {
    marginLeft: theme.spacing(1),
    fontSize: '0.7rem',
    height: 20,
  },
  patternChip: {
    backgroundColor: theme.palette.info.main,
    color: 'white',
  },
  branchChip: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  modelBranchChip: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
  // Source/Target matcher flow styles
  matcherFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  matcherBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    minWidth: 150,
  },
  matcherLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: theme.spacing(0.5),
  },
  matcherValue: {
    fontWeight: 500,
    fontSize: '0.875rem',
    textAlign: 'center',
    marginBottom: theme.spacing(0.5),
  },
  flowArrow: {
    color: theme.palette.primary.main,
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  pullRequestFlowLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing(0.5),
  },
  ruleApprovalsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.grey[50],
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
  },
  approvalsLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  approvalsCount: {
    backgroundColor: theme.palette.primary.main,
    marginTop: '9px',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.8rem',
    minWidth: '28px',
    height: '28px',
    '& .MuiChip-label': {
      padding: theme.spacing(0, 1),
      fontWeight: 700,
    },
  },
})); 