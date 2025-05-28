import React, { useMemo, memo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Link,
  Paper,
} from '@material-ui/core';
import { BuildListItemProps } from './types';
import { formatFileSize, generateBuildUrl, getAllFiles } from './utils';

// Memoized List Item Component
export const BuildListItem = memo<BuildListItemProps>(({ build, classes }) => {
  const buildUrl = useMemo(() => generateBuildUrl(build), [build]);
  
  const allFiles = useMemo(() => getAllFiles(build.artifactTree), [build.artifactTree]);
  const fileNames = useMemo(() => 
    allFiles.slice(0, 3).map(f => f.name).join(', ') + 
    (allFiles.length > 3 ? ` +${allFiles.length - 3} more` : ''), 
    [allFiles]
  );
  
  return (
    <Paper className={classes.listCard} elevation={1}>
      <Box className={classes.listContent}>
        <Box flex={1} minWidth={0}>
          <Typography variant="subtitle1" color="primary" style={{ fontWeight: 600, marginBottom: 4 }}>
            {build.moduleName}: {build.buildNumber}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            {build.branchType}/{build.branchName}
          </Typography>
          <Typography variant="body2" style={{ marginBottom: 4 }}>
            {build.artifactCount} artifact{build.artifactCount !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {fileNames}
          </Typography>
        </Box>
        <Box className={classes.listMetadata}>
          <Chip label={build.repo} size="small" className={classes.repoChip} />
          <Chip label={formatFileSize(build.totalSize)} size="small" className={classes.sizeChip} />
          <Link
            href={buildUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.url}
          >
            View
          </Link>
        </Box>
      </Box>
    </Paper>
  );
});

BuildListItem.displayName = 'BuildListItem'; 