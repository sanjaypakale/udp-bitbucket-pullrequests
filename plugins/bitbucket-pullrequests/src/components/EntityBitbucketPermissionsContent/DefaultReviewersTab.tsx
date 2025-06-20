import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SearchIcon from '@material-ui/icons/Search';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useStyles } from './styles';
import { generateAvatarColor, getUserInitials, extractBitbucketInfo, fetchBitbucketAPI } from './utils';

// Skeleton loader for Default Reviewers
const DefaultReviewersSkeleton = () => {
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.sectionHeader} mb={3}>
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="text" width="200px" height={28} style={{ marginLeft: 8 }} />
      </Box>

      {[...Array(2)].map((_, index) => (
        <Card key={index} className={classes.reviewerCard} elevation={1}>
          <Box className={classes.reviewerHeader}>
            <Box className={classes.reviewerTitleRow}>
              <Skeleton variant="text" width="150px" height={24} />
              <Box display="flex" alignItems="center" style={{ gap: '16px' }}>
                <Skeleton variant="text" width="80px" height={16} />
                <Box display="flex" alignItems="center" style={{ gap: '8px' }}>
                  <Skeleton variant="text" width="100px" height={16} />
                  <Skeleton variant="rect" width={28} height={28} />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.reviewerContent}>
            <Box className={classes.matcherFlow}>
              <Box className={classes.matcherBox}>
                <Skeleton variant="text" width="60px" height={16} />
                <Skeleton variant="text" width="80px" height={20} />
                <Skeleton variant="rect" width="60px" height={20} />
              </Box>
              <Skeleton variant="circle" width={32} height={32} />
              <Box className={classes.matcherBox}>
                <Skeleton variant="text" width="60px" height={16} />
                <Skeleton variant="text" width="80px" height={20} />
                <Skeleton variant="rect" width={60} height={20} />
              </Box>
            </Box>
            <Skeleton variant="text" width="150px" height={20} style={{ marginBottom: 16 }} />
            <Box className={classes.reviewersList}>
              {[...Array(3)].map((_, reviewerIndex) => (
                <Box key={reviewerIndex} className={classes.reviewerItem}>
                  <Box className={classes.reviewerInfo}>
                    <Skeleton variant="circle" width={36} height={36} />
                    <Box ml={2}>
                      <Skeleton variant="text" width="100px" height={16} />
                      <Skeleton variant="text" width="120px" height={14} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export const DefaultReviewersTab = ({ loading }: { loading: boolean }) => {
  const classes = useStyles();
  const [reviewerSearchTerms, setReviewerSearchTerms] = useState<Record<number, string>>({});
  const [defaultReviewersData, setDefaultReviewersData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get entity and config
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const backendBaseUrl = config.getOptionalString('backend.baseUrl') || '';

  // Extract Bitbucket info from entity
  const { projectKey, repoSlug } = extractBitbucketInfo(entity);

  // Fetch default reviewers from Bitbucket API
  useEffect(() => {
    const fetchDefaultReviewers = async () => {
      if (!projectKey || !repoSlug || !backendBaseUrl) {
        console.warn('Missing required parameters for Bitbucket API call');
        return;
      }

      setApiLoading(true);
      setApiError(null);

      try {
        // Fetch default reviewers from Bitbucket API
        const response = await fetchBitbucketAPI(
          backendBaseUrl,
          '/settings/pull-requests/default-reviewers', // Bitbucket API endpoint for default reviewers
          projectKey,
          repoSlug
        );

        if (response && Array.isArray(response)) {
          setDefaultReviewersData(response);
        }
      } catch (error) {
        console.error('Failed to fetch default reviewers:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch default reviewers');
      } finally {
        setApiLoading(false);
      }
    };

    // Only fetch if not in loading state from parent
    if (!loading) {
      fetchDefaultReviewers();
    }
  }, [projectKey, repoSlug, backendBaseUrl, loading]);

  const getSourceTypeChip = (type: string) => {
    const typeMap = {
      'PATTERN': { class: classes.patternChip, label: 'Pattern' },
      'BRANCH': { class: classes.branchChip, label: 'Branch' },
      'ANY_REF': { class: classes.sourceTypeChip, label: 'Any Ref' },
      'MODEL_BRANCH': { class: classes.modelBranchChip, label: 'Model Branch' },
    };

    const config = typeMap[type as keyof typeof typeMap] || { 
      class: classes.sourceTypeChip, 
      label: type 
    };

    return (
      <Chip
        label={config.label}
        size="small"
        className={`${classes.sourceTypeChip} ${config.class}`}
      />
    );
  };

  const getScopeTypeChip = (scopeType: string) => {
    const scopeMap = {
      'REPOSITORY': { class: classes.writeChip, label: 'Repository Level' },
      'PROJECT': { class: classes.adminChip, label: 'Project Level' },
    };

    const config = scopeMap[scopeType as keyof typeof scopeMap] || { 
      class: classes.readChip, 
      label: scopeType || 'Unknown' 
    };

    return (
      <Chip
        label={config.label}
        size="small"
        className={`${classes.permissionChip} ${config.class}`}
        variant="outlined"
      />
    );
  };

  // Helper function to get source display value based on type
  const getSourceDisplayValue = (sourceRefMatcher: any) => {
    if (!sourceRefMatcher) return 'Unknown';
    
    if (sourceRefMatcher.type?.id === 'PATTERN') {
      return sourceRefMatcher.displayId || 'Unknown Pattern';
    } else {
      return sourceRefMatcher.type?.name || 'Unknown Type';
    }
  };

  // Helper function to get target display value based on type
  const getTargetDisplayValue = (targetRefMatcher: any) => {
    if (!targetRefMatcher) return 'Unknown';
    
    if (targetRefMatcher.type?.id === 'PATTERN') {
      return targetRefMatcher.displayId || 'Unknown Pattern';
    } else {
      return targetRefMatcher.type?.name || 'Unknown Type';
    }
  };

  const handleReviewerSearch = (ruleId: number, searchTerm: string) => {
    setReviewerSearchTerms(prev => ({
      ...prev,
      [ruleId]: searchTerm
    }));
  };

  const filterReviewers = (reviewers: any[], ruleId: number) => {
    const searchTerm = reviewerSearchTerms[ruleId] || '';
    if (!searchTerm) return reviewers;
    
    const searchLower = searchTerm.toLowerCase();
    return reviewers.filter(reviewer => 
      reviewer.displayName?.toLowerCase().includes(searchLower) ||
      reviewer.name?.toLowerCase().includes(searchLower) ||
      reviewer.emailAddress?.toLowerCase().includes(searchLower)
    );
  };

  if (loading || apiLoading) {
    return <DefaultReviewersSkeleton />;
  }

  // Handle case when no data is available
  if (!defaultReviewersData || !Array.isArray(defaultReviewersData)) {
    return (
      <Box>
        <Box className={classes.sectionHeader} mb={3}>
          <RateReviewIcon />
          <Typography variant="h6" component="h3">
            Default Reviewers (0)
            {apiError && (
              <Typography variant="caption" color="error" style={{ marginLeft: 8 }}>
                (API Error: {apiError})
              </Typography>
            )}
          </Typography>
        </Box>
        <Card className={classes.reviewerCard} elevation={1}>
          <Box className={classes.reviewerContent}>
            <Box className={classes.emptyExemptions}>
              <Typography variant="body2">
                {apiError ? 'Failed to load default reviewers' : 'No default reviewers found'}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box className={classes.sectionHeader} mb={3}>
        <RateReviewIcon />
        <Typography variant="h6" component="h3">
          Default Reviewers ({defaultReviewersData.length || 0})
          {apiError && (
            <Typography variant="caption" color="error" style={{ marginLeft: 8 }}>
              (API Error: {apiError})
            </Typography>
          )}
        </Typography>
      </Box>

      {defaultReviewersData.map((reviewerConfig: any, index: number) => (
        <Card key={reviewerConfig.id || index} className={classes.reviewerCard} elevation={1}>
          <Box className={classes.reviewerHeader}>
            <Box className={classes.reviewerTitleRow}>
              <Box display="flex" alignItems="center" style={{ gap: '12px' }}>
                <Typography className={classes.reviewerTitle}>
                  Pull Request Rule #{reviewerConfig.id || index + 1}
                </Typography>
                {getScopeTypeChip(reviewerConfig.scope?.type)}
              </Box>
              <Box display="flex" alignItems="center" style={{ gap: '16px' }}>
                <Box display="flex" alignItems="center" style={{ gap: '8px' }}>
                  <Typography variant="body2" color="textPrimary" style={{ fontWeight: 500 }}>
                    Approvals required:
                  </Typography>
                  <Chip
                    label={(reviewerConfig.requiredApprovals || 0).toString()}
                    className={classes.approvalsCount}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className={classes.reviewerContent}>
            {/* Source → Target Flow Visualization */}
            <Box className={classes.matcherFlow}>
              <Box className={classes.matcherBox}>
                <Typography className={classes.matcherLabel}>
                  Source
                </Typography>
                <Typography className={classes.matcherValue}>
                  {getSourceDisplayValue(reviewerConfig.sourceRefMatcher)}
                </Typography>
                {getSourceTypeChip(reviewerConfig.sourceRefMatcher?.type?.id || 'UNKNOWN')}
              </Box>
              
              <Box display="flex" flexDirection="column" alignItems="center">
                <ArrowForwardIcon className={classes.flowArrow} />
                <Typography className={classes.pullRequestFlowLabel}>
                  Pull Request
                </Typography>
              </Box>
              
              <Box className={classes.matcherBox}>
                <Typography className={classes.matcherLabel}>
                  Target
                </Typography>
                <Typography className={classes.matcherValue}>
                  {getTargetDisplayValue(reviewerConfig.targetRefMatcher)}
                </Typography>
                {getSourceTypeChip(reviewerConfig.targetRefMatcher?.type?.id || 'UNKNOWN')}
              </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 0 }}>
                Required Reviewers ({reviewerConfig.reviewers?.length || 0}):
              </Typography>
              {reviewerConfig.reviewers && reviewerConfig.reviewers.length > 5 && (
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search reviewers..."
                  value={reviewerSearchTerms[reviewerConfig.id] || ''}
                  onChange={(e) => handleReviewerSearch(reviewerConfig.id, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  style={{ width: '200px' }}
                />
              )}
            </Box>
            
            <Box 
              className={classes.reviewersList}
              style={{ 
                maxHeight: reviewerConfig.reviewers && reviewerConfig.reviewers.length > 5 ? '300px' : 'auto',
                overflowY: reviewerConfig.reviewers && reviewerConfig.reviewers.length > 5 ? 'auto' : 'visible'
              }}
            >
              {filterReviewers(reviewerConfig.reviewers || [], reviewerConfig.id).length > 0 ? (
                filterReviewers(reviewerConfig.reviewers || [], reviewerConfig.id).map((reviewer: any, reviewerIndex: number) => (
                  <Box key={reviewerIndex} className={classes.reviewerItem}>
                    <Box className={classes.reviewerInfo}>
                      <Avatar 
                        className={classes.userAvatar} 
                        style={{ 
                          backgroundColor: generateAvatarColor(reviewer.displayName || 'Unknown'),
                          width: 36, 
                          height: 36 
                        }}
                      >
                        {getUserInitials(reviewer.displayName || 'Unknown')}
                      </Avatar>
                      <Box ml={2}>
                        <Typography variant="body2" style={{ fontWeight: 500 }}>
                          {reviewer.displayName || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {reviewer.emailAddress || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box className={classes.emptyExemptions}>
                  <Typography variant="body2">
                    {reviewerSearchTerms[reviewerConfig.id] ? 
                      `No reviewers found matching "${reviewerSearchTerms[reviewerConfig.id]}"` :
                      'No reviewers configured for this rule'
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}; 