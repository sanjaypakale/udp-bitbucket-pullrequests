import { useState, useMemo, useCallback } from 'react';
import { Artifact } from '../../api';
import { BuildGroup, SortField, SortOrder, ViewMode } from './types';
import { parsePath, buildArtifactTree } from './utils';

export const useBuildData = (artifacts: Artifact[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [repoFilter, setRepoFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('moduleName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Optimized build grouping with performance considerations
  const buildGroups = useMemo(() => {
    if (!artifacts || artifacts.length === 0) return [];
    
    const groups = new Map<string, BuildGroup>();
    
    // Single pass through artifacts for grouping
    for (let i = 0; i < artifacts.length; i++) {
      const artifact = artifacts[i];
      const pathInfo = parsePath(artifact.path, artifact.name);
      
      if (pathInfo) {
        const key = `${pathInfo.moduleName}|${pathInfo.branchType}|${pathInfo.branchName}|${pathInfo.buildNumber}|${artifact.repo}`;
        
        let group = groups.get(key);
        if (!group) {
          group = {
            id: key, // Use key as unique ID
            moduleName: pathInfo.moduleName,
            branchType: pathInfo.branchType,
            branchName: pathInfo.branchName,
            buildNumber: pathInfo.buildNumber,
            artifacts: [],
            artifactTree: {
              name: 'root',
              fullPath: '',
              isFile: false,
              children: new Map(),
            },
            totalSize: 0,
            repo: artifact.repo,
            artifactCount: 0,
            latestCreated: artifact.created,
          };
          groups.set(key, group);
        }
        
        group.artifacts.push(artifact);
        group.totalSize += artifact.size;
        group.artifactCount++;
        
        // Track latest created date for sorting
        if (artifact.created > group.latestCreated) {
          group.latestCreated = artifact.created;
        }
      }
    }
    
    // Build hierarchical trees for each group
    for (const group of groups.values()) {
      group.artifactTree = buildArtifactTree(group.artifacts);
    }
    
    return Array.from(groups.values());
  }, [artifacts]);

  // Memoized unique values for filters
  const uniqueRepos = useMemo(() => {
    const repos = new Set<string>();
    for (const group of buildGroups) {
      repos.add(group.repo);
    }
    return Array.from(repos).sort();
  }, [buildGroups]);

  const uniqueModules = useMemo(() => {
    const modules = new Set<string>();
    for (const group of buildGroups) {
      modules.add(group.moduleName);
    }
    return Array.from(modules).sort();
  }, [buildGroups]);

  // Optimized filtering and sorting
  const filteredAndSortedBuilds = useMemo(() => {
    let filtered = buildGroups;
    
    // Apply filters
    if (searchTerm || repoFilter !== 'all') {
      const searchLower = searchTerm.toLowerCase();
      filtered = buildGroups.filter(build => {
        const matchesRepo = repoFilter === 'all' || build.repo === repoFilter;
        
        if (!searchTerm) return matchesRepo;
        
        const matchesSearch = 
          build.moduleName.toLowerCase().includes(searchLower) ||
          build.branchName.toLowerCase().includes(searchLower) ||
          build.buildNumber.toLowerCase().includes(searchLower) ||
          build.artifacts.some(artifact => 
            artifact.name.toLowerCase().includes(searchLower)
          );
      
        return matchesSearch && matchesRepo;
      });
    }

    // Apply sorting - create a new array to avoid mutation
    if (filtered.length > 1) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'moduleName':
            comparison = a.moduleName.localeCompare(b.moduleName);
            break;
          case 'buildNumber':
            comparison = (parseInt(a.buildNumber) || 0) - (parseInt(b.buildNumber) || 0);
            break;
          case 'totalSize':
            comparison = a.totalSize - b.totalSize;
            break;
          case 'artifactCount':
            comparison = a.artifactCount - b.artifactCount;
            break;
          case 'repo':
            comparison = a.repo.localeCompare(b.repo);
            break;
          case 'latestCreated':
            comparison = new Date(a.latestCreated).getTime() - new Date(b.latestCreated).getTime();
            break;
          default:
            comparison = a.moduleName.localeCompare(b.moduleName);
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [buildGroups, searchTerm, repoFilter, sortField, sortOrder]);

  // Memoized pagination
  const paginatedBuilds = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedBuilds.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedBuilds, page, rowsPerPage]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const totalArtifacts = artifacts.length;
    const totalSize = artifacts.reduce((sum, artifact) => sum + artifact.size, 0);
    
    return {
      totalBuilds: buildGroups.length,
      totalArtifacts,
      totalSize,
      totalModules: uniqueModules.length,
    };
  }, [artifacts, buildGroups.length, uniqueModules.length]);

  // Event handlers
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  }, []);

  const handleRepoFilterChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setRepoFilter(event.target.value as string);
    setPage(0); // Reset to first page when filtering
  }, []);

  const handleSortFieldChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setSortField(event.target.value as SortField);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    // State
    searchTerm,
    repoFilter,
    sortField,
    sortOrder,
    page,
    rowsPerPage,
    viewMode,
    
    // Computed data
    buildGroups,
    uniqueRepos,
    uniqueModules,
    filteredAndSortedBuilds,
    paginatedBuilds,
    statistics,
    
    // Event handlers
    handleChangePage,
    handleChangeRowsPerPage,
    handleSort,
    handleSearchChange,
    handleRepoFilterChange,
    handleSortFieldChange,
    handleSortOrderToggle,
    handleViewModeChange,
  };
}; 