import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Grid,
  Link,
  Divider,
  TextField,
  InputAdornment,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  ButtonGroup,
  Button,
} from '@material-ui/core';
import {
  InfoCard,
  Progress,
  EmptyState,
  StatusOK,
  StatusError,
} from '@backstage/core-components';
import {
  Storage,
  Folder,
  AccountTree,
  Schedule,
  Search,
  FilterList,
  ViewModule,
  ViewList,
  SortByAlpha,
} from '@material-ui/icons';
import { ArtifactoryArtifact } from '../../types';
import { useArtifactoryCatalogTabStyles } from './ArtifactoryCatalogTab.styles';
import { 
  ArtifactorySkeletonLoader, 
  StatsSkeletonLoader, 
  SearchFiltersSkeleton 
} from './ArtifactorySkeletonLoader';

interface ArtifactoryCatalogTabProps {
  artifacts: ArtifactoryArtifact[];
  loading?: boolean;
  error?: Error;
}

type SortField = 'name' | 'size' | 'created' | 'repo';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const generateArtifactUrl = (artifact: ArtifactoryArtifact): string => {
  return `https://your-artifactory.com/ui/repos/tree/General/${artifact.repo}${artifact.path}`;
};

export const ArtifactoryCatalogTab: React.FC<ArtifactoryCatalogTabProps> = ({
  artifacts,
  loading = false,
  error,
}) => {
  const classes = useArtifactoryCatalogTabStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [repoFilter, setRepoFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const uniqueRepos = useMemo(() => {
    return Array.from(new Set(artifacts.map(artifact => artifact.repo))).sort();
  }, [artifacts]);

  const filteredAndSortedArtifacts = useMemo(() => {
    let filtered = artifacts.filter(artifact => {
      const matchesSearch = searchTerm === '' || 
        artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.repo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRepo = repoFilter === 'all' || artifact.repo === repoFilter;
      
      return matchesSearch && matchesRepo;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'created') {
        aValue = new Date(a.created).getTime();
        bValue = new Date(b.created).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [artifacts, searchTerm, repoFilter, sortField, sortOrder]);

  const paginatedArtifacts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedArtifacts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedArtifacts, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <InfoCard title="Artifactory Artifacts" variant="gridItem">
        <Box className={classes.root}>
          {/* Loading Statistics */}
          <StatsSkeletonLoader />
          
          {/* Loading Search and Filters */}
          <SearchFiltersSkeleton />
          
          {/* Loading Artifacts */}
          <ArtifactorySkeletonLoader viewMode={viewMode} count={rowsPerPage} />
        </Box>
      </InfoCard>
    );
  }

  if (error) {
    return (
      <EmptyState
        missing="data"
        title="Failed to load artifacts"
        description={error.message}
        action={<StatusError />}
      />
    );
  }

  if (!artifacts || artifacts.length === 0) {
    return (
      <EmptyState
        missing="content"
        title="No artifacts found"
        description="No Artifactory artifacts are associated with this entity."
        action={<StatusOK />}
      />
    );
  }

  const totalSize = artifacts.reduce((sum, artifact) => sum + artifact.size, 0);
  const filteredTotalSize = filteredAndSortedArtifacts.reduce((sum, artifact) => sum + artifact.size, 0);

  const renderGridView = () => (
    <Grid container spacing={3}>
      {paginatedArtifacts.map((artifact, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className={classes.artifactCard} elevation={2}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6" className={classes.artifactName}>
                {artifact.name}
              </Typography>
              
              <Tooltip title={artifact.path} arrow placement="top">
                <Typography className={classes.artifactPath}>
                  {artifact.path}
                </Typography>
              </Tooltip>

              <Box className={classes.metadataRow}>
                <AccountTree />
                <Chip 
                  label={artifact.repo} 
                  size="small" 
                  className={classes.repoChip}
                />
              </Box>

              <Box className={classes.metadataRow}>
                <Storage />
                <Chip 
                  label={formatFileSize(artifact.size)} 
                  size="small" 
                  className={classes.sizeChip}
                />
              </Box>

              <Box className={classes.metadataRow}>
                <Schedule />
                <Typography variant="body2" color="textSecondary">
                  {formatDate(artifact.created)}
                </Typography>
              </Box>
            </CardContent>

            <CardActions className={classes.cardActions}>
              <Link
                href={generateArtifactUrl(artifact)}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.url}
              >
                View in Artifactory
              </Link>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Box>
      {paginatedArtifacts.map((artifact, index) => (
        <Paper key={index} className={classes.listCard} elevation={1}>
          <Box className={classes.listContent}>
            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle1" color="primary" style={{ fontWeight: 600, marginBottom: 4 }}>
                {artifact.name}
              </Typography>
              <Tooltip title={artifact.path} arrow placement="bottom-start">
                <Typography 
                  variant="body2" 
                  className={classes.listPath}
                >
                  {artifact.path}
                </Typography>
              </Tooltip>
            </Box>
            <Box className={classes.listMetadata}>
              <Chip label={artifact.repo} size="small" className={classes.repoChip} />
              <Chip label={formatFileSize(artifact.size)} size="small" className={classes.sizeChip} />
              <Typography variant="body2" color="textSecondary" style={{ minWidth: '100px', textAlign: 'center' }}>
                {formatDate(artifact.created)}
              </Typography>
              <Link
                href={generateArtifactUrl(artifact)}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.url}
              >
                View
              </Link>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <InfoCard title="Artifactory Artifacts" variant="gridItem">
      <Box className={classes.root}>
        {/* Summary Statistics */}
        <Grid container spacing={3} className={classes.statsContainer}>
          <Grid item xs={12} sm={3}>
            <Box className={classes.statCard}>
              <Typography className={classes.statValue}>
                {artifacts.length}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Artifacts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box className={classes.statCard}>
              <Typography className={classes.statValue}>
                {filteredAndSortedArtifacts.length}
              </Typography>
              <Typography className={classes.statLabel}>
                Filtered Results
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box className={classes.statCard}>
              <Typography className={classes.statValue}>
                {formatFileSize(totalSize)}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Size
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box className={classes.statCard}>
              <Typography className={classes.statValue}>
                {uniqueRepos.length}
              </Typography>
              <Typography className={classes.statLabel}>
                Repositories
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper className={classes.searchAndFilters} elevation={0}>
          <TextField
            className={classes.searchBar}
            fullWidth
            placeholder="Search artifacts by name, path, or repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          
          <Box className={classes.filterRow}>
            <FormControl className={classes.filterControl} size="small" variant="outlined">
              <InputLabel>Repository</InputLabel>
              <Select
                value={repoFilter}
                onChange={(e) => setRepoFilter(e.target.value as string)}
                label="Repository"
              >
                <MenuItem value="all">All Repositories</MenuItem>
                {uniqueRepos.map(repo => (
                  <MenuItem key={repo} value={repo}>{repo}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className={classes.filterControl} size="small" variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                label="Sort By"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="created">Created Date</MenuItem>
                <MenuItem value="repo">Repository</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
              <IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <SortByAlpha style={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />
              </IconButton>
            </Tooltip>

            <ButtonGroup className={classes.viewToggle} size="small">
              <Button 
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
              >
                <ViewModule />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
              >
                <ViewList />
              </Button>
            </ButtonGroup>
          </Box>
        </Paper>

        {/* Results */}
        {filteredAndSortedArtifacts.length === 0 ? (
          <Box className={classes.noResults}>
            <Typography variant="h6" gutterBottom>
              No artifacts match your search criteria
            </Typography>
            <Typography color="textSecondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            
            {/* Pagination */}
            <TablePagination
              className={classes.pagination}
              component="div"
              count={filteredAndSortedArtifacts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24, 48]}
              labelRowsPerPage="Artifacts per page:"
            />
          </>
        )}
      </Box>
    </InfoCard>
  );
}; 