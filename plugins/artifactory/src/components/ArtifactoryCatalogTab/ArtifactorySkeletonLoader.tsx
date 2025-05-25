import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useArtifactoryCatalogTabStyles } from './ArtifactoryCatalogTab.styles';

interface SkeletonLoaderProps {
  viewMode: 'grid' | 'list';
  count?: number;
}

export const ArtifactorySkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  viewMode,
  count = 12,
}) => {
  const classes = useArtifactoryCatalogTabStyles();

  const renderGridSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className={classes.skeletonCard} elevation={2}>
            <CardContent className={classes.skeletonContent}>
              {/* Artifact name skeleton */}
              <Box display="flex" alignItems="center" marginBottom={1}>
                <Skeleton variant="text" width="70%" height={24} />
              </Box>
              
              {/* Path skeleton */}
              <Box className={classes.skeletonPath}>
                <Skeleton variant="rect" width="100%" height={32} style={{ borderRadius: 4 }} />
              </Box>

              {/* Metadata chips skeleton */}
              <Box className={classes.skeletonChips}>
                <Skeleton variant="circle" width={16} height={16} />
                <Skeleton variant="rect" width={80} height={24} style={{ borderRadius: 12 }} />
              </Box>

              <Box className={classes.skeletonChips}>
                <Skeleton variant="circle" width={16} height={16} />
                <Skeleton variant="rect" width={60} height={24} style={{ borderRadius: 12 }} />
              </Box>

              <Box className={classes.skeletonChips}>
                <Skeleton variant="circle" width={16} height={16} />
                <Skeleton variant="text" width="50%" height={20} />
              </Box>
            </CardContent>

            <CardActions style={{ padding: 16, paddingTop: 0 }}>
              <Skeleton variant="text" width={120} height={20} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListSkeleton = () => (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Paper key={index} className={classes.skeletonListCard} elevation={1}>
          <Box className={classes.skeletonListContent}>
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: 4 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Box className={classes.skeletonListMetadata}>
              <Skeleton variant="rect" width={80} height={24} style={{ borderRadius: 12 }} />
              <Skeleton variant="rect" width={60} height={24} style={{ borderRadius: 12 }} />
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={40} height={16} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return viewMode === 'grid' ? renderGridSkeleton() : renderListSkeleton();
};

export const StatsSkeletonLoader: React.FC = () => {
  const classes = useArtifactoryCatalogTabStyles();

  return (
    <Grid container spacing={3} className={classes.statsContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <Box className={classes.statCard}>
            <Skeleton 
              variant="text" 
              width={80} 
              height={60} 
              style={{ margin: '0 auto' }} 
            />
            <Skeleton 
              variant="text" 
              width={120} 
              height={16} 
              style={{ margin: '8px auto 0' }} 
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export const SearchFiltersSkeleton: React.FC = () => {
  const classes = useArtifactoryCatalogTabStyles();

  return (
    <Paper className={classes.searchAndFilters} elevation={0}>
      <Box className={classes.searchBar}>
        <Skeleton variant="rect" width="100%" height={40} style={{ borderRadius: 4 }} />
      </Box>
      
      <Box className={classes.filterRow}>
        <Skeleton variant="rect" width={150} height={40} style={{ borderRadius: 4 }} />
        <Skeleton variant="rect" width={150} height={40} style={{ borderRadius: 4 }} />
        <Skeleton variant="circle" width={40} height={40} />
        <Box style={{ marginLeft: 'auto' }}>
          <Skeleton variant="rect" width={80} height={32} style={{ borderRadius: 4 }} />
        </Box>
      </Box>
    </Paper>
  );
}; 