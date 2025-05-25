import React, { useState, useEffect } from 'react';
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
import SecurityIcon from '@material-ui/icons/Security';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useStyles } from './styles';
import { generateAvatarColor, getUserInitials, extractBitbucketInfo, fetchBitbucketAPI } from './utils';

// Skeleton loader for Branch Restrictions
const BranchRestrictionsSkeleton = () => {
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.sectionHeader} mb={3}>
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="text" width="200px" height={28} style={{ marginLeft: 8 }} />
      </Box>

      {[...Array(3)].map((_, index) => (
        <Card key={index} className={classes.restrictionCard} elevation={1}>
          <Box className={classes.restrictionHeader}>
            <Box className={classes.restrictionTitleRow}>
              <Skeleton variant="text" width="150px" height={24} />
              <Box display="flex" alignItems="center">
                <Skeleton variant="rect" width="60px" height={20} style={{ marginRight: 8 }} />
                <Skeleton variant="rect" width="100px" height={20} />
              </Box>
            </Box>
          </Box>
          <Box className={classes.restrictionContent}>
            <Box className={classes.exemptionsSection}>
              <Skeleton variant="text" width="120px" height={20} style={{ marginBottom: 16 }} />
              {[...Array(2)].map((_, userIndex) => (
                <Box key={userIndex} className={classes.userExemption}>
                  <Skeleton variant="circle" width={32} height={32} />
                  <Box ml={1.5}>
                    <Skeleton variant="text" width="100px" height={16} />
                    <Skeleton variant="text" width="120px" height={14} />
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

export const BranchRestrictionsTab = ({ loading }: { loading: boolean }) => {
  const classes = useStyles();
  const [userSearchTerms, setUserSearchTerms] = useState<Record<number, string>>({});
  const [branchRestrictionsData, setBranchRestrictionsData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get entity and config
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const backendBaseUrl = config.getOptionalString('backend.baseUrl') || '';

  // Extract Bitbucket info from entity
  const { projectKey, repoSlug } = extractBitbucketInfo(entity);

  // Fetch branch restrictions from Bitbucket API
  useEffect(() => {
    const fetchBranchRestrictions = async () => {
      if (!projectKey || !repoSlug || !backendBaseUrl) {
        console.warn('Missing required parameters for Bitbucket API call');
        return;
      }

      setApiLoading(true);
      setApiError(null);

      try {
        // Fetch branch restrictions from Bitbucket API
        const response = await fetchBitbucketAPI(
          backendBaseUrl,
          '/restrictions', // Bitbucket API endpoint for branch restrictions
          projectKey,
          repoSlug
        );

        if (response && response.values) {
          setBranchRestrictionsData(response);
        }
      } catch (error) {
        console.error('Failed to fetch branch restrictions:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch branch restrictions');
      } finally {
        setApiLoading(false);
      }
    };

    // Only fetch if not in loading state from parent
    if (!loading) {
      fetchBranchRestrictions();
    }
  }, [projectKey, repoSlug, backendBaseUrl, loading]);

  const getRestrictionTypeChip = (type: string) => {
    const typeMap = {
      'read-only': { class: classes.readOnlyChip, label: 'Read Only' },
      'fast-forward-only': { class: classes.fastForwardChip, label: 'Fast Forward Only' },
      'no-deletes': { class: classes.noDeletesChip, label: 'No Deletes' },
      'pull-request-only': { class: classes.pullRequestChip, label: 'Pull Request Only' },
      'require-reviewers': { class: classes.requireReviewersChip, label: 'Require Reviewers' },
    };

    const config = typeMap[type as keyof typeof typeMap] || { 
      class: classes.restrictionTypeChip, 
      label: type.replace('-', ' ').toUpperCase() 
    };

    return (
      <Chip
        label={config.label}
        size="small"
        className={`${classes.restrictionTypeChipEnhanced} ${config.class}`}
      />
    );
  };

  const handleUserSearch = (restrictionId: number, searchTerm: string) => {
    setUserSearchTerms(prev => ({
      ...prev,
      [restrictionId]: searchTerm
    }));
  };

  const filterUsers = (users: any[], restrictionId: number) => {
    const searchTerm = userSearchTerms[restrictionId] || '';
    if (!searchTerm) return users;
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.displayName.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower) ||
      user.emailAddress.toLowerCase().includes(searchLower)
    );
  };

  if (loading || apiLoading) {
    return <BranchRestrictionsSkeleton />;
  }

  // Handle case when no data is available
  if (!branchRestrictionsData || !branchRestrictionsData.values) {
    return (
      <Box>
        <Box className={classes.sectionHeader} mb={3}>
          <SecurityIcon />
          <Typography variant="h6" component="h3">
            Branch Restrictions (0)
            {apiError && (
              <Typography variant="caption" color="error" style={{ marginLeft: 8 }}>
                (API Error: {apiError})
              </Typography>
            )}
          </Typography>
        </Box>
        <Card className={classes.restrictionCard} elevation={1}>
          <Box className={classes.restrictionContent}>
            <Box className={classes.emptyExemptions}>
              <Typography variant="body2">
                {apiError ? 'Failed to load branch restrictions' : 'No branch restrictions found'}
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
        <SecurityIcon />
        <Typography variant="h6" component="h3">
          Branch Restrictions ({branchRestrictionsData.size || 0})
          {apiError && (
            <Typography variant="caption" color="error" style={{ marginLeft: 8 }}>
              (API Error: {apiError})
            </Typography>
          )}
        </Typography>
      </Box>

      {branchRestrictionsData.values.map((restriction: any, index: number) => {
        const filteredUsers = filterUsers(restriction.users, restriction.id);
        
        return (
          <Card key={restriction.id} className={classes.restrictionCard} elevation={1}>
            <Box className={classes.restrictionHeader}>
              <Box className={classes.restrictionTitleRow}>
                <Typography className={classes.restrictionTitle}>
                  {restriction.matcher.displayId}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Chip
                    label={restriction.matcher.type.name}
                    size="small"
                    className={classes.matcherTypeChip}
                  />
                  <Box ml={1}>
                    {getRestrictionTypeChip(restriction.type)}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className={classes.restrictionContent}>
              <Box className={classes.exemptionsSection}>
                {/* Users Exemptions */}
                {restriction.users.length > 0 ? (
                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography className={classes.exemptionsTitle}>
                        <PersonIcon />
                        Exempt Users ({restriction.users.length})
                      </Typography>
                      {restriction.users.length > 5 && (
                        <TextField
                          size="small"
                          variant="outlined"
                          placeholder="Search users..."
                          value={userSearchTerms[restriction.id] || ''}
                          onChange={(e) => handleUserSearch(restriction.id, e.target.value)}
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
                    <Box className={classes.exemptionsList} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: any, userIndex: number) => (
                          <Box key={userIndex} className={classes.userExemption}>
                            <Avatar 
                              className={classes.userAvatar} 
                              style={{ 
                                backgroundColor: generateAvatarColor(user.displayName),
                                width: 32, 
                                height: 32 
                              }}
                            >
                              {getUserInitials(user.displayName)}
                            </Avatar>
                            <Box ml={1.5}>
                              <Typography variant="body2" style={{ fontWeight: 'medium' }}>
                                {user.displayName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {user.emailAddress}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Box className={classes.emptyExemptions}>
                          <Typography variant="body2">
                            No users found matching "{userSearchTerms[restriction.id]}"
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box className={classes.emptyExemptions}>
                    <Typography variant="body2">
                      No user exemptions configured for this restriction
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}; 