import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useStyles } from './styles';
import { generateAvatarColor, getUserInitials, extractBitbucketInfo, fetchBitbucketAPI } from './utils';

// Skeleton loader for Repository Users
const RepositoryUsersSkeleton = () => {
  const classes = useStyles();
  return (
    <Card className={classes.sectionCard} elevation={2}>
      <CardContent>
        <Box className={classes.sectionHeader}>
          <Skeleton variant="circle" width={24} height={24} />
          <Skeleton variant="text" width="200px" height={28} style={{ marginLeft: 8 }} />
        </Box>
        
        <Box className={classes.searchContainer}>
          <Skeleton variant="rect" width="100%" height={40} />
        </Box>
        
        <Box className={classes.tableWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
            <Table>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell><Skeleton variant="text" width="60px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="60px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="80px" /></TableCell>
                  <TableCell><Skeleton variant="text" width="60px" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Skeleton variant="circle" width={40} height={40} />
                        <Box ml={2}>
                          <Skeleton variant="text" width="120px" height={20} />
                          <Skeleton variant="text" width="80px" height={16} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="150px" height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rect" width="80px" height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rect" width="60px" height={24} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export const RepositoryUsersTab = ({ loading }: { loading: boolean }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [repoUsersData, setRepoUsersData] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get entity and config
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const backendBaseUrl = config.getOptionalString('backend.baseUrl') || '';

  // Extract Bitbucket info from entity
  const { projectKey, repoSlug } = extractBitbucketInfo(entity);

  // Fetch repository users from Bitbucket API
  useEffect(() => {
    const fetchRepositoryUsers = async () => {
      if (!projectKey || !repoSlug || !backendBaseUrl) {
        console.warn('Missing required parameters for Bitbucket API call');
        return;
      }

      setApiLoading(true);
      setApiError(null);

      try {
        // Fetch repository permissions from Bitbucket API
        const response = await fetchBitbucketAPI(
          backendBaseUrl,
          '/permissions/users', // Bitbucket API endpoint for repository users
          projectKey,
          repoSlug
        );

        if (response && response.values) {
          setRepoUsersData(response);
        }
      } catch (error) {
        console.error('Failed to fetch repository users:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch repository users');
      } finally {
        setApiLoading(false);
      }
    };

    // Only fetch if not in loading state from parent
    if (!loading) {
      fetchRepositoryUsers();
    }
  }, [projectKey, repoSlug, backendBaseUrl, loading]);

  const getPermissionChip = (permission: string) => {
    const chipClass = permission === 'REPO_ADMIN' ? classes.adminChip 
                    : permission === 'REPO_WRITE' ? classes.writeChip 
                    : classes.readChip;

    return (
      <Chip
        label={permission.replace('REPO_', '')}
        className={`${classes.permissionChip} ${chipClass}`}
        size="small"
      />
    );
  };

  // Filter users based on search term
  const filteredUsers = repoUsersData?.values?.filter((userPermission: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      userPermission.user.displayName.toLowerCase().includes(searchLower) ||
      userPermission.user.name.toLowerCase().includes(searchLower) ||
      userPermission.user.emailAddress?.toLowerCase().includes(searchLower) ||
      userPermission.permission.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Show pagination only if there are more than 10 users
  const showPagination = filteredUsers.length > 10;

  if (loading || apiLoading) {
    return <RepositoryUsersSkeleton />;
  }

  return (
    <Card className={classes.sectionCard} elevation={2}>
      <CardContent>
        <Box className={classes.sectionHeader}>
          <PersonIcon />
          <Typography variant="h6" component="h3">
            Repository Users ({repoUsersData?.size || 0})
            {apiError && (
              <Typography variant="caption" color="error" style={{ marginLeft: 8 }}>
                (API Error: {apiError})
              </Typography>
            )}
          </Typography>
        </Box>

        <Box className={classes.searchContainer}>
          <TextField
            className={classes.searchField}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search users by name, email, or permission..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box className={classes.tableWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
            <Table stickyHeader>
              <TableHead className={classes.tableHeader}>
                <TableRow style={{backgroundColor: '#fafafa', borderBottom: '1px solidrgb(11, 6, 6)'}}>
                  <TableCell style={{fontWeight: 'bold'}}>User</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Permission</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.slice(page * 10, (page + 1) * 10).map((userPermission: any, index: number) => (
                    <TableRow key={index} className={classes.tableRow}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            className={classes.userAvatar}
                            style={{ 
                              backgroundColor: generateAvatarColor(userPermission.user.displayName),
                              width: 40,
                              height: 40
                            }}
                          >
                            {getUserInitials(userPermission.user.displayName)}
                          </Avatar>
                          <Box ml={2}>
                            <Typography variant="body2">
                              {userPermission.user.displayName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              @{userPermission.user.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {userPermission.user.emailAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getPermissionChip(userPermission.permission)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={userPermission.user.active ? 'Active' : 'Inactive'}
                          color={userPermission.user.active ? 'primary' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box className={classes.noResults}>
                        <Typography variant="body2">
                          {apiError ? 'Failed to load repository users' : 
                           searchTerm ? `No users found matching "${searchTerm}"` : 
                           'No repository users found'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {showPagination && (
            <Box className={classes.paginationContainer}>
              <TablePagination
                rowsPerPageOptions={[10]}
                count={filteredUsers.length}
                rowsPerPage={10}
                page={page}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 