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
import { useStyles } from './styles';
import { BitbucketPullRequest, BitbucketResponse, PullRequestStatus } from '../../types/BitbucketPullRequest';
import { determinePullRequestStatus, formatRelativeTime } from '../../utils/pullRequestUtils';
import GitBranchIcon from '@material-ui/icons/AccountTree';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

// In a real implementation, this would fetch from the Bitbucket API
const fetchPullRequests = async (): Promise<BitbucketPullRequest[]> => {
  // This would be replaced with actual API calls to Bitbucket
  return new Promise(resolve => {
    // Simulated API response
    const response: BitbucketResponse = {
      "size": 7,
      "limit": 100,
      "isLastPage": true,
      "values": [
        {
          "id": 101,
          "version": 3,
          "title": "Feature: Add login page",
          "description": "This PR adds a new login page with authentication logic.",
          "state": "MERGED",
          "open": false,
          "closed": true,
          "createdDate": 1672608000000,
          "updatedDate": 1672700000000,
          "fromRef": {
            "id": "refs/heads/feature/login-page",
            "displayId": "feature/login-page",
            "latestCommit": "a1b2c3d4e5",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "f6g7h8i9j0",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "johndoe",
              "emailAddress": "johndoe@example.com",
              "displayName": "John Doe",
              "active": true,
              "slug": "johndoe",
              "type": "NORMAL"
            },
            "role": "AUTHOR",
            "approved": true,
            "status": "APPROVED"
          },
          "reviewers": [
            {
              "user": {
                "name": "janedoe",
                "displayName": "Jane Doe",
                "active": true
              },
              "role": "REVIEWER",
              "approved": true,
              "status": "APPROVED"
            }
          ],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/101"
              }
            ]
          }
        },
        {
          "id": 102,
          "version": 1,
          "title": "Fix: typo in README",
          "description": "Corrected a small typo in the README file.",
          "state": "DECLINED",
          "open": false,
          "closed": true,
          "createdDate": 1672800000000,
          "updatedDate": 1672850000000,
          "fromRef": {
            "id": "refs/heads/fix/readme-typo",
            "displayId": "fix/readme-typo",
            "latestCommit": "b2c3d4e5f6",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "c7d8e9f0g1",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "janedoe",
              "displayName": "Jane Doe",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/102"
              }
            ]
          }
        },
        {
          "id": 103,
          "version": 2,
          "title": "Major update to authentication system",
          "description": "Implements OAuth2 and SAML integrations with multiple identity providers",
          "state": "OPEN",
          "open": true,
          "closed": false,
          "createdDate": 1672900000000,
          "updatedDate": 1672950000000,
          "fromRef": {
            "id": "refs/heads/feature/authentication-system-refactoring-with-oauth-and-saml-support",
            "displayId": "feature/authentication-system-refactoring-with-oauth-and-saml-support",
            "latestCommit": "d5e6f7g8h9",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/release/2023-q2-security-improvements",
            "displayId": "release/2023-q2-security-improvements",
            "latestCommit": "i9j0k1l2m3",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "securitydev",
              "displayName": "Security Developer",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [
            {
              "user": {
                "name": "securitylead",
                "displayName": "Security Team Lead",
                "active": true
              },
              "role": "REVIEWER",
              "approved": false,
              "status": "NEEDS_WORK"
            },
            {
              "user": {
                "name": "cto",
                "displayName": "Chief Technology Officer",
                "active": true
              },
              "role": "REVIEWER",
              "approved": false,
              "status": "UNAPPROVED"
            }
          ],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/103"
              }
            ]
          }
        },
        {
          "id": 104,
          "version": 1,
          "title": "Feature: Add dark theme support",
          "description": "Adds dark theme support with automatic system preference detection and manual toggle option in user settings.",
          "state": "OPEN",
          "open": true,
          "closed": false,
          "createdDate": 1673000000000,
          "updatedDate": 1673050000000,
          "fromRef": {
            "id": "refs/heads/feature/dark-theme",
            "displayId": "feature/dark-theme",
            "latestCommit": "f1e2d3c4b5",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "a6b7c8d9e0",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "uidesigner",
              "displayName": "UI Designer",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [
            {
              "user": {
                "name": "frontenddev",
                "displayName": "Frontend Developer",
                "active": true
              },
              "role": "REVIEWER",
              "approved": false,
              "status": "UNAPPROVED"
            }
          ],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/104"
              }
            ]
          }
        },
        {
          "id": 105,
          "version": 1,
          "title": "Feature: Implement user notifications",
          "description": "Adds a notification system for users with real-time updates using WebSockets and a notifications center.",
          "state": "OPEN",
          "open": true,
          "closed": false,
          "createdDate": 1673100000000,
          "updatedDate": 1673150000000,
          "fromRef": {
            "id": "refs/heads/feature/notification-system",
            "displayId": "feature/notification-system",
            "latestCommit": "g1h2i3j4k5",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "l6m7n8o9p0",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "backenddev",
              "displayName": "Backend Developer",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/105"
              }
            ]
          }
        },
        {
          "id": 106,
          "version": 1,
          "title": "Fix: Mobile layout issues",
          "description": "Fixes responsive design issues on mobile devices including navigation menu and form input fields.",
          "state": "OPEN",
          "open": true,
          "closed": false,
          "createdDate": 1673200000000,
          "updatedDate": 1673250000000,
          "fromRef": {
            "id": "refs/heads/fix/mobile-layout",
            "displayId": "fix/mobile-layout",
            "latestCommit": "q1r2s3t4u5",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "v6w7x8y9z0",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "mobiledeveloper",
              "displayName": "Mobile Developer",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [
            {
              "user": {
                "name": "uidesigner",
                "displayName": "UI Designer",
                "active": true
              },
              "role": "REVIEWER",
              "approved": false,
              "status": "UNAPPROVED"
            }
          ],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/106"
              }
            ]
          }
        },
        {
          "id": 107,
          "version": 1,
          "title": "Feature: Add API documentation",
          "description": "Adds Swagger/OpenAPI documentation for the REST APIs with interactive testing functionality.",
          "state": "OPEN",
          "open": true,
          "closed": false,
          "createdDate": 1673300000000,
          "updatedDate": 1673350000000,
          "fromRef": {
            "id": "refs/heads/feature/api-docs",
            "displayId": "feature/api-docs",
            "latestCommit": "a1b2c3d4e5",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "toRef": {
            "id": "refs/heads/develop",
            "displayId": "develop",
            "latestCommit": "f6g7h8i9j0",
            "repository": {
              "slug": "my-repo",
              "name": null,
              "project": {
                "key": "PRJ"
              }
            }
          },
          "locked": false,
          "author": {
            "user": {
              "name": "apideveloper",
              "displayName": "API Developer",
              "active": true
            },
            "role": "AUTHOR",
            "approved": false,
            "status": "UNAPPROVED"
          },
          "reviewers": [
            {
              "user": {
                "name": "techlead",
                "displayName": "Tech Lead",
                "active": true
              },
              "role": "REVIEWER",
              "approved": false,
              "status": "UNAPPROVED"
            }
          ],
          "participants": [],
          "links": {
            "self": [
              {
                "href": "https://bitbucket.org/projects/PRJ/repos/my-repo/pull-requests/107"
              }
            ]
          }
        }
      ],
      "start": 0
    };
    
    setTimeout(() => {
      resolve(response.values);
    }, 1000);
  });
};

type BitbucketPullRequestCardProps = {
  pullRequest: BitbucketPullRequest;
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

export const BitbucketPullRequestCard = ({ pullRequest }: BitbucketPullRequestCardProps) => {
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

export const BitbucketPullRequestsComponent = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  
  // In a real implementation, you would use the entity to fetch relevant pull requests
  const { value, loading, error } = useAsync(fetchPullRequests);

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