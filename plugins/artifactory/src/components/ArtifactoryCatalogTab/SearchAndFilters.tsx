import React, { memo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
  Tooltip,
  ButtonGroup,
  Button,
} from '@material-ui/core';
import {
  Search,
  SortByAlpha,
  ViewModule,
  ViewList,
} from '@material-ui/icons';
import { SearchAndFiltersProps } from './types';

export const SearchAndFilters = memo<SearchAndFiltersProps>(({
  searchTerm,
  repoFilter,
  sortField,
  sortOrder,
  viewMode,
  uniqueRepos,
  onSearchChange,
  onRepoFilterChange,
  onSortFieldChange,
  onSortOrderToggle,
  onViewModeChange,
  classes,
}) => {
  return (
    <Paper className={classes.searchAndFilters} elevation={0}>
      <TextField
        className={classes.searchBar}
        fullWidth
        placeholder="Search builds by module, branch, build number, or artifact name..."
        value={searchTerm}
        onChange={onSearchChange}
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
            onChange={onRepoFilterChange}
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
            onChange={onSortFieldChange}
            label="Sort By"
          >
            <MenuItem value="moduleName">Module Name</MenuItem>
            <MenuItem value="buildNumber">Build Number</MenuItem>
            <MenuItem value="totalSize">Total Size</MenuItem>
            <MenuItem value="artifactCount">Artifact Count</MenuItem>
            <MenuItem value="latestCreated">Latest Created</MenuItem>
            <MenuItem value="repo">Repository</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
          <IconButton onClick={onSortOrderToggle}>
            <SortByAlpha style={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
        </Tooltip>

        <ButtonGroup className={classes.viewToggle} size="small">
          <Button 
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('grid')}
          >
            <ViewModule />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('list')}
          >
            <ViewList />
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
});

SearchAndFilters.displayName = 'SearchAndFilters'; 