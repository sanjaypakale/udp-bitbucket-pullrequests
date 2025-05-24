import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles,
  Chip,
  Avatar,
  Box,
  Tooltip,
  Paper,
} from '@material-ui/core';
import { InfoCard, Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
  },
  reviewerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  content: {
    flex: '1 0 auto',
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
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing(1),
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
}));

type Reviewer = {
  name: string;
  avatarUrl: string;
};

type Author = {
  name: string;
  avatarUrl: string;
};

type PullRequestStatus = 'REVIEW_REQUIRED' | 'REVIEW_IN_PROGRESS' | 'APPROVED';

type PullRequest = {
  id: number;
  title: string;
  status: PullRequestStatus;
  repoName: string;
  branch: string;
  author: Author;
  reviewers: Reviewer[];
  createdAt: string;
  updatedAt: string;
};

// Dummy pull request data based on the image
const dummyPullRequests: PullRequest[] = [
  {
    id: 1,
    title: 'chore(deps): bump async from 2.6.3 to 2.6.4',
    status: 'REVIEW_REQUIRED',
    repoName: 'backstage',
    branch: 'dependabot',
    author: {
      name: 'dependabot',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=dependabot',
    },
    reviewers: [
      { name: 'gregorytalita', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=gregorytalita' },
    ],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 2,
    title: 'feat: init React project',
    status: 'REVIEW_IN_PROGRESS',
    repoName: 'rms',
    branch: 'feature/init-react',
    author: {
      name: 'rms',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=rms',
    },
    reviewers: [
      { name: 'gregorytalita', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=gregorytalita' },
    ],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 3,
    title: 'chore(deps): bump async from 2.6.3 to 2.6.4',
    status: 'APPROVED',
    repoName: 'landing-page',
    branch: 'dependabot',
    author: {
      name: 'dependabot',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=dependabot',
    },
    reviewers: [
      { name: 'crivetechie', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=crivetechie' },
      { name: 'gregorytalita', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=gregorytalita' },
    ],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 4,
    title: 'feat: add 4Town package',
    status: 'REVIEW_REQUIRED',
    repoName: 'turning-red',
    branch: 'feature/4town',
    author: {
      name: 'meiLee',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=meiLee',
    },
    reviewers: [],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 5,
    title: 'feat: New email template added',
    status: 'REVIEW_REQUIRED',
    repoName: 'templates',
    branch: 'feature/email-template',
    author: {
      name: 'capyccino',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=capyccino',
    },
    reviewers: [],
    createdAt: '2 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 6,
    title: 'feat: Migrate workflow',
    status: 'REVIEW_IN_PROGRESS',
    repoName: 'lms-database',
    branch: 'feature/migrate-workflow',
    author: {
      name: 'gregorytalita',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=gregorytalita',
    },
    reviewers: [
      { name: 'migliorMentore', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=migliorMentore' },
    ],
    createdAt: '2 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 7,
    title: 'feat: Upgrade Backstage to 1.1.0',
    status: 'APPROVED',
    repoName: 'backstage',
    branch: 'feature/upgrade-1.1.0',
    author: {
      name: 'crivetechie',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=crivetechie',
    },
    reviewers: [
      { name: 'najlepšiMentor', avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=najlepšiMentor' },
    ],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
  {
    id: 8,
    title: 'feat: Update Must Read list',
    status: 'REVIEW_REQUIRED',
    repoName: 'onboarding',
    branch: 'feature/must-read-update',
    author: {
      name: 'gregorytalita',
      avatarUrl: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=gregorytalita',
    },
    reviewers: [],
    createdAt: '3 months ago',
    updatedAt: '3 months ago',
  },
];

// In a real implementation, this would fetch from the Bitbucket API
const fetchPullRequests = async (): Promise<PullRequest[]> => {
  // This would be replaced with actual API calls to Bitbucket
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyPullRequests);
    }, 1000);
  });
};

type BitbucketPullRequestCardProps = {
  pullRequest: PullRequest;
};

export const BitbucketPullRequestCard = ({ pullRequest }: BitbucketPullRequestCardProps) => {
  const classes = useStyles();

  const getStatusChip = (status: PullRequestStatus) => {
    switch (status) {
      case 'REVIEW_REQUIRED':
        return <Chip label="REVIEW REQUIRED" size="small" className={`${classes.statusChip} ${classes.reviewRequired}`} />;
      case 'REVIEW_IN_PROGRESS':
        return <Chip label="REVIEW IN PROGRESS" size="small" className={`${classes.statusChip} ${classes.reviewInProgress}`} />;
      case 'APPROVED':
        return <Chip label="APPROVED" size="small" className={`${classes.statusChip} ${classes.approved}`} />;
      default:
        return <Chip label={status} size="small" className={classes.statusChip} />;
    }
  };

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.content}>
        <Typography className={classes.title} color="textPrimary">
          {pullRequest.title}
        </Typography>
        
        <div className={classes.metadata}>
          <Typography variant="body2" color="textSecondary">
            {pullRequest.repoName} • {pullRequest.branch}
          </Typography>
        </div>
        
        <Box display="flex" alignItems="center" mb={1}>
          {getStatusChip(pullRequest.status)}
        </Box>

        <Box display="flex" alignItems="center">
          <Tooltip title={`Author: ${pullRequest.author.name}`}>
            <Avatar
              src={pullRequest.author.avatarUrl}
              className={classes.avatar}
            />
          </Tooltip>
          <Typography variant="body2">{pullRequest.author.name}</Typography>
        </Box>

        {pullRequest.reviewers.length > 0 && (
          <div className={classes.reviewerContainer}>
            <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
              Reviewers:
            </Typography>
            {pullRequest.reviewers.map((reviewer, index) => (
              <Tooltip key={index} title={reviewer.name}>
                <Avatar
                  src={reviewer.avatarUrl}
                  className={classes.avatar}
                />
              </Tooltip>
            ))}
          </div>
        )}
      </CardContent>
      
      <Box px={2} pb={1} className={classes.footer}>
        <Typography variant="caption" color="textSecondary">
          Created: {pullRequest.createdAt}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Updated: {pullRequest.updatedAt}
        </Typography>
      </Box>
    </Card>
  );
};

export const BitbucketPullRequestsComponent = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  
  // In a real implementation, you would use the entity to fetch relevant pull requests
  const { value, loading, error } = useAsync(fetchPullRequests);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const pullRequestsByStatus = {
    REVIEW_REQUIRED: value?.filter(pr => pr.status === 'REVIEW_REQUIRED') || [],
    REVIEW_IN_PROGRESS: value?.filter(pr => pr.status === 'REVIEW_IN_PROGRESS') || [],
    APPROVED: value?.filter(pr => pr.status === 'APPROVED') || [],
  };

  return (
    <InfoCard title="Bitbucket Pull Requests">
      <Grid container spacing={3}>
        {/* Review Required Column */}
        <Grid item xs={12} md={4} className={classes.statusColumn}>
          <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewRequiredHeader}`}>
            <Typography variant="subtitle1">
              Review Required ({pullRequestsByStatus.REVIEW_REQUIRED.length})
            </Typography>
          </Paper>
          {pullRequestsByStatus.REVIEW_REQUIRED.map(pr => (
            <BitbucketPullRequestCard key={pr.id} pullRequest={pr} />
          ))}
          {pullRequestsByStatus.REVIEW_REQUIRED.length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center">
              No pull requests waiting for review
            </Typography>
          )}
        </Grid>
        
        {/* Review In Progress Column */}
        <Grid item xs={12} md={4} className={classes.statusColumn}>
          <Paper elevation={0} className={`${classes.columnHeader} ${classes.reviewInProgressHeader}`}>
            <Typography variant="subtitle1">
              Review In Progress ({pullRequestsByStatus.REVIEW_IN_PROGRESS.length})
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
        
        {/* Approved Column */}
        <Grid item xs={12} md={4} className={classes.statusColumn}>
          <Paper elevation={0} className={`${classes.columnHeader} ${classes.approvedHeader}`}>
            <Typography variant="subtitle1">
              Approved ({pullRequestsByStatus.APPROVED.length})
            </Typography>
          </Paper>
          {pullRequestsByStatus.APPROVED.map(pr => (
            <BitbucketPullRequestCard key={pr.id} pullRequest={pr} />
          ))}
          {pullRequestsByStatus.APPROVED.length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center">
              No approved pull requests
            </Typography>
          )}
        </Grid>
      </Grid>
    </InfoCard>
  );
}; 