import React from 'react';
import {
  Box,
  Grid,
  TablePagination,
  Typography,
} from '@material-ui/core';
import {
  InfoCard,
  EmptyState,
  StatusOK,
  StatusError,
} from '@backstage/core-components';
import { ArtifactoryCatalogTabProps, BuildGroup } from './types';
import { useArtifactoryCatalogTabStyles } from './ArtifactoryCatalogTab.styles';
import { 
  ArtifactorySkeletonLoader, 
  StatsSkeletonLoader, 
  SearchFiltersSkeleton 
} from './ArtifactorySkeletonLoader';
import { useBuildData } from './useBuildData';
import { SearchAndFilters } from './SearchAndFilters';
import { Statistics } from './Statistics';
import { BuildCard } from './BuildCard';
import { BuildListItem } from './BuildListItem';

export const ArtifactoryCatalogTab: React.FC<ArtifactoryCatalogTabProps> = ({
  artifacts,
  loading = false,
  error,
}) => {
  const classes = useArtifactoryCatalogTabStyles();
  
  const {
    // State
    searchTerm,
    repoFilter,
    sortField,
    sortOrder,
    page,
    rowsPerPage,
    viewMode,
    
    // Computed data
    uniqueRepos,
    filteredAndSortedBuilds,
    paginatedBuilds,
    statistics,
    
    // Event handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleRepoFilterChange,
    handleSortFieldChange,
    handleSortOrderToggle,
    handleViewModeChange,
  } = useBuildData(artifacts);

  // Handle build deletion
  const handleDeleteBuild = (buildToDelete: BuildGroup) => {
    // NOTE: Delete functionality is planned for future releases
    // This feature is not currently implemented but will be included in upcoming versions
    console.log('Delete functionality planned for future release. Build selected:', buildToDelete);
    
    // When implemented in future releases, this will:
    // 1. Call an API endpoint to delete the build from Artifactory
    // 2. Update the local state or refetch data to reflect changes
    // 3. Show appropriate success/error messages to the user
    // 4. Handle proper error handling and rollback scenarios
  };

  if (loading) {
    return (
      <InfoCard title="Artifactory Builds" variant="gridItem">
        <Box className={classes.root}>
          <StatsSkeletonLoader />
          <SearchFiltersSkeleton />
          <ArtifactorySkeletonLoader viewMode={viewMode} count={rowsPerPage} />
        </Box>
      </InfoCard>
    );
  }

  if (error) {
    return (
      <EmptyState
        missing="data"
        title="Failed to load builds"
        description={error.message}
        action={<StatusError />}
      />
    );
  }

  if (!artifacts || artifacts.length === 0) {
    return (
      <EmptyState
        missing="content"
        title="No builds found"
        description="No Artifactory builds are associated with this entity."
        action={<StatusOK />}
      />
    );
  }

  const renderGridView = () => (
    <Grid container spacing={3}>
      {paginatedBuilds.map((build) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={build.id}>
          <BuildCard build={build} classes={classes} onDelete={handleDeleteBuild} />
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Box>
      {paginatedBuilds.map((build) => (
        <BuildListItem key={build.id} build={build} classes={classes} />
      ))}
    </Box>
  );

  return (
    <InfoCard title="Artifactory Builds" variant="gridItem">
      <Box className={classes.root}>
        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          repoFilter={repoFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          viewMode={viewMode}
          uniqueRepos={uniqueRepos}
          onSearchChange={handleSearchChange}
          onRepoFilterChange={handleRepoFilterChange}
          onSortFieldChange={handleSortFieldChange}
          onSortOrderToggle={handleSortOrderToggle}
          onViewModeChange={handleViewModeChange}
          classes={classes}
        />

        {/* Statistics */}
        <Statistics
          filteredBuilds={filteredAndSortedBuilds}
          totalStatistics={statistics}
          repoFilter={repoFilter}
          classes={classes}
        />

        {/* Results */}
        {filteredAndSortedBuilds.length === 0 ? (
          <Box className={classes.noResults}>
            <Typography variant="h6" gutterBottom>
              No builds match your search criteria
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
              count={filteredAndSortedBuilds.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24, 48, 100]}
              labelRowsPerPage="Builds per page:"
            />
          </>
        )}
      </Box>
    </InfoCard>
  );
}; 