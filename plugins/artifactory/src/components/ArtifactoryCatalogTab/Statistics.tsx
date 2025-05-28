import React, { useMemo, memo } from 'react';
import {
  Box,
  Typography,
  Grid,
} from '@material-ui/core';
import { StatisticsProps } from './types';
import { formatFileSize } from './utils';

export const Statistics = memo<StatisticsProps>(({
  filteredBuilds,
  totalStatistics,
  repoFilter,
  classes,
}) => {
  const filteredStatistics = useMemo(() => {
    if (repoFilter === 'all') {
      return {
        builds: totalStatistics.totalBuilds,
        artifacts: totalStatistics.totalArtifacts,
        size: totalStatistics.totalSize,
        modules: totalStatistics.totalModules,
      };
    }

    return {
      builds: filteredBuilds.length,
      artifacts: filteredBuilds.reduce((sum, build) => sum + build.artifactCount, 0),
      size: filteredBuilds.reduce((sum, build) => sum + build.totalSize, 0),
      modules: Array.from(new Set(filteredBuilds.map(build => build.moduleName))).length,
    };
  }, [filteredBuilds, totalStatistics, repoFilter]);

  const getLabel = (baseLabel: string) => {
    return repoFilter === 'all' ? `Total ${baseLabel}` : `${baseLabel} in ${repoFilter}`;
  };

  return (
    <Grid container spacing={3} className={classes.statsContainer} style={{ marginTop: 16 }}>
      <Grid item xs={12} sm={3}>
        <Box className={classes.statCard}>
          <Typography className={classes.statValue}>
            {filteredStatistics.builds}
          </Typography>
          <Typography className={classes.statLabel}>
            {getLabel('Builds')}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box className={classes.statCard}>
          <Typography className={classes.statValue}>
            {filteredStatistics.artifacts}
          </Typography>
          <Typography className={classes.statLabel}>
            {getLabel('Artifacts')}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box className={classes.statCard}>
          <Typography className={classes.statValue}>
            {formatFileSize(filteredStatistics.size)}
          </Typography>
          <Typography className={classes.statLabel}>
            {getLabel('Size')}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box className={classes.statCard}>
          <Typography className={classes.statValue}>
            {filteredStatistics.modules}
          </Typography>
          <Typography className={classes.statLabel}>
            {getLabel('Modules')}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
});

Statistics.displayName = 'Statistics'; 