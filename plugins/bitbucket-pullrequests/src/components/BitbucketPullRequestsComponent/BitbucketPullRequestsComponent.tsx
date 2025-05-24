import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip,
  Paper,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { InfoCard, Progress, ResponseErrorPanel } from '@backstage/core-components';
import Skeleton from '@material-ui/lab/Skeleton';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useStyles } from './styles';
import { BitbucketPullRequest, BitbucketResponse, PullRequestStatus } from '../../types/BitbucketPullRequest';
import { determinePullRequestStatus, formatRelativeTime } from '../../utils/pullRequestUtils';
import GitBranchIcon from '@material-ui/icons/AccountTree';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

// Function to fetch pull requests from Bitbucket API
const fetchBitbucketPullRequests = async (
  baseUrl: string,
  projectKey?: string,
  repoSlug?: string,
  token?: string,
): Promise<BitbucketPullRequest[]> => {
  if (!projectKey || !repoSlug) {
    throw new Error('Project key and repository slug are required');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${baseUrl}/rest/api/1.0/projects/${projectKey}/repos/${repoSlug}/pull-requests?state=ALL&limit=100`;
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pull requests: ${response.statusText}`);
  }
  
  const data: BitbucketResponse = await response.json();
  return data.values;
};

// Loading skeleton component for pull request cards
const PullRequestSkeleton = () => {
  const classes = useStyles();
  return (
    <Card className={classes.skeletonCard} variant="outlined">
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="40%" height={24} style={{ marginTop: 8, marginBottom: 16 }} />
        <Skeleton variant="rect" width="100%" height={100} style={{ marginBottom: 16 }} />
        <Box display="flex" alignItems="center">
          <Skeleton variant="circle" width={32} height={32} style={{ marginRight: 8 }} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Create a simple user avatar component that doesn't rely on external services
const UserAvatar = ({ name, size = 32 }: { name: string; size?: number }) => {
  const classes = useStyles();
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Create a deterministic color based on the name
  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`;
  };

  const backgroundColor = getColorFromName(name);
  const textColor = '#000000';

  return (
    <div
      className={classes.avatar}
      style={{
        backgroundColor,
        color: textColor,
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 'bold',
      }}
    >
      {initials}
    </div>
  );
};

export const BitbucketPullRequestCard = ({ pullRequest }: { pullRequest: BitbucketPullRequest }) => {
  const classes = useStyles();
  const status = determinePullRequestStatus(pullRequest);

  const getStatusChip = (status: PullRequestStatus) => {
    switch (status) {
      case 'OPEN':
        return <Chip label="OPEN" size="small" className={`${classes.statusChip} ${classes.reviewRequired}`} />;
      case 'REVIEW_IN_PROGRESS':
        return <Chip label="REVIEW IN PROGRESS" size="small" className={`${classes.statusChip} ${classes.reviewInProgress}`} />;
      case 'APPROVED':
        return <Chip label="APPROVED" size="small" className={`${classes.statusChip} ${classes.approved}`} />;
      case 'DECLINED':
        return <Chip label="DECLINED" size="small" className={`${classes.statusChip} ${classes.declined}`} />;
      case 'MERGED':
        return <Chip label="MERGED" size="small" className={`${classes.statusChip} ${classes.merged}`} />;
      default:
        return <Chip label={status} size="small" className={classes.statusChip} />;
    }
  };

  const openPullRequest = () => {
    if (pullRequest.links.self && pullRequest.links.self.length > 0) {
      window.open(pullRequest.links.self[0].href, '_blank');
    }
  };

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.content}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography className={classes.title} color="textPrimary">
            {pullRequest.title}
          </Typography>
          {getStatusChip(status)}
        </Box>
        
        <div className={classes.metadata}>
          <GitBranchIcon className={classes.branchIcon} />
          <Tooltip title={`${pullRequest.fromRef.displayId} → ${pullRequest.toRef.displayId}`}>
            <Typography variant="body2" color="textSecondary" className={classes.branchText}>
              {pullRequest.fromRef.displayId} → {pullRequest.toRef.displayId}
            </Typography>
          </Tooltip>
        </div>
        
        <div className={classes.authorContainer}>
          <Tooltip title={`Author: ${pullRequest.author.user.displayName}`}>
            <div>
              <UserAvatar name={pullRequest.author.user.displayName} />
            </div>
          </Tooltip>
          <Typography variant="body2" style={{ marginLeft: 8, fontWeight: 500 }}>
            {pullRequest.author.user.displayName}
          </Typography>
        </div>

        {pullRequest.description && (
          <div className={classes.descriptionContainer}>
            <Typography variant="body2" color="textSecondary" className={classes.description}>
              {pullRequest.description}
            </Typography>
          </div>
        )}

        {pullRequest.reviewers.length > 0 && (
          <div className={classes.reviewerContainer}>
            <Typography variant="body2" color="textSecondary" style={{ marginRight: 8, fontWeight: 500 }}>
              Reviewers:
            </Typography>
            <Box display="flex" flexWrap="wrap">
              {pullRequest.reviewers.map((reviewer, index) => {
                // Determine reviewer status for styling
                const isApproved = reviewer.approved;
                const needsWork = reviewer.status === 'NEEDS_WORK';
                
                let reviewerClass = '';
                if (isApproved) {
                  reviewerClass = classes.reviewerApproved;
                } else if (needsWork) {
                  reviewerClass = classes.reviewerNeedsWork;
                }
                
                return (
                  <Tooltip 
                    key={index} 
                    title={`${reviewer.user.displayName} (${reviewer.status})`}
                    placement="top"
                  >
                    <div style={{ margin: '0 4px 4px 0' }} className={reviewerClass}>
                      <UserAvatar name={reviewer.user.displayName} size={28} />
                      {isApproved && <CheckIcon className={classes.checkIcon} fontSize="small" />}
                      {needsWork && <WarningIcon className={classes.checkIcon} fontSize="small" />}
                    </div>
                  </Tooltip>
                );
              })}
            </Box>
          </div>
        )}
      </CardContent>
      
      <div className={classes.footer}>
        <div className={classes.timeInfo}>
          <div className={classes.timeRow}>
            <Typography variant="caption" color="textSecondary" className={classes.timeLabel}>
              Created:
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatRelativeTime(pullRequest.createdDate)}
            </Typography>
          </div>
          <div className={classes.timeRow}>
            <Typography variant="caption" color="textSecondary" className={classes.timeLabel}>
              Updated:
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatRelativeTime(pullRequest.updatedDate)}
            </Typography>
          </div>
        </div>
        <Button 
          size="small" 
          color="primary" 
          startIcon={<OpenInNewIcon />}
          onClick={openPullRequest}
        >
          View
        </Button>
      </div>
    </Card>
  );
};

export const BitbucketPullRequestsComponent = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  const config = useApi(configApiRef);
  
  // Extract Bitbucket details from the entity annotations
  let bitbucketBaseUrl = config.getOptionalString('bitbucket.baseUrl');
  const bitbucketToken = config.getOptionalString('bitbucket.token');
  
  // Extract project key, repo slug and base URL from source-location annotation
  let projectKey: string | undefined;
  let repoSlug: string | undefined;
  
  const sourceLocation = entity.metadata.annotations?.['backstage.io/source-location'];
  
  if (sourceLocation && sourceLocation.startsWith('url:')) {
    // Extract from url:https://bitbucket.example.com/projects/<projectname>/repos/<reponame>
    const url = sourceLocation.substring(4); // Remove 'url:' prefix
    
    // Extract the base URL (everything before /projects)
    const projectsIndex = url.indexOf('/projects/');
    if (projectsIndex > 0) {
      // Set the base URL if not already set
      bitbucketBaseUrl = bitbucketBaseUrl || url.substring(0, projectsIndex);
      
      // Extract project and repo from the URL pattern
      const matches = url.match(/projects\/([^\/]+)\/repos\/([^\/]+)/);
      if (matches && matches.length === 3) {
        projectKey = matches[1];
        repoSlug = matches[2];
      }
    }
  }
  
  // Default Bitbucket base URL if not found anywhere else
  bitbucketBaseUrl = bitbucketBaseUrl || 'https://bitbucket.org';
  
  // Fetch pull requests from Bitbucket API
  const { value, loading, error } = useAsync(async () => {
    if (!projectKey || !repoSlug) {
      return [];
    }
    
    return await fetchBitbucketPullRequests(
      bitbucketBaseUrl,
      projectKey,
      repoSlug,
      bitbucketToken
    );
  }, [bitbucketBaseUrl, projectKey, repoSlug, bitbucketToken]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  // Group pull requests by status for display
  const pullRequestsByStatus = {
    OPEN: value?.filter(pr => determinePullRequestStatus(pr) === 'OPEN') || [],
    REVIEW_IN_PROGRESS: value?.filter(pr => determinePullRequestStatus(pr) === 'REVIEW_IN_PROGRESS') || [],
    APPROVED: value?.filter(pr => determinePullRequestStatus(pr) === 'APPROVED') || [],
    MERGED: value?.filter(pr => determinePullRequestStatus(pr) === 'MERGED') || [],
    DECLINED: value?.filter(pr => determinePullRequestStatus(pr) === 'DECLINED') || [],
  };

  return (
    <InfoCard title="Bitbucket Pull Requests">
      {loading ? (
        <>
          <Grid container spacing={3}>
            {/* Loading skeleton for Open PRs */}
            <Grid item xs={12} md={4} className={classes.statusColumn}>
              <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewRequiredHeader}`}>
                <Typography variant="subtitle1">Open</Typography>
              </Paper>
              <PullRequestSkeleton />
              <PullRequestSkeleton />
            </Grid>
            
            {/* Loading skeleton for In Review */}
            <Grid item xs={12} md={4} className={classes.statusColumn}>
              <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewInProgressHeader}`}>
                <Typography variant="subtitle1">In Review</Typography>
              </Paper>
              <PullRequestSkeleton />
            </Grid>
            
            {/* Loading skeleton for Merged/Approved */}
            <Grid item xs={12} md={4} className={classes.statusColumn}>
              <Paper elevation={0} className={`${classes.columnHeader} ${classes.mergedHeader}`}>
                <Typography variant="subtitle1">Merged/Approved</Typography>
              </Paper>
              <PullRequestSkeleton />
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container spacing={3}>
          {/* Open PRs Column */}
          <Grid item xs={12} md={4} className={classes.statusColumn}>
            <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewRequiredHeader}`}>
              <Typography variant="subtitle1">
                Open ({pullRequestsByStatus.OPEN.length})
              </Typography>
            </Paper>
            {pullRequestsByStatus.OPEN.map(pr => (
              <BitbucketPullRequestCard key={pr.id} pullRequest={pr} />
            ))}
            {pullRequestsByStatus.OPEN.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center">
                No open pull requests
              </Typography>
            )}
          </Grid>
          
          {/* In Review Column */}
          <Grid item xs={12} md={4} className={classes.statusColumn}>
            <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewInProgressHeader}`}>
              <Typography variant="subtitle1">
                In Review ({pullRequestsByStatus.REVIEW_IN_PROGRESS.length})
              </Typography>
            </Paper>
            {pullRequestsByStatus.REVIEW_IN_PROGRESS.map(pr => (
              <BitbucketPullRequestCard key={pr.id} pullRequest={pr} />
            ))}
            {pullRequestsByStatus.REVIEW_IN_PROGRESS.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center">
                No pull requests in review
              </Typography>
            )}
          </Grid>
          
          {/* Merged/Approved Column */}
          <Grid item xs={12} md={4} className={classes.statusColumn}>
            <Paper elevation={0} className={`${classes.columnHeader} ${classes.mergedHeader}`}>
              <Typography variant="subtitle1">
                Merged/Approved ({pullRequestsByStatus.MERGED.length + pullRequestsByStatus.APPROVED.length})
              </Typography>
            </Paper>
            {[...pullRequestsByStatus.MERGED, ...pullRequestsByStatus.APPROVED].map(pr => (
              <BitbucketPullRequestCard key={pr.id} pullRequest={pr} />
            ))}
            {(pullRequestsByStatus.MERGED.length + pullRequestsByStatus.APPROVED.length) === 0 && (
              <Typography variant="body2" color="textSecondary" align="center">
                No merged or approved pull requests
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </InfoCard>
  );
}; 