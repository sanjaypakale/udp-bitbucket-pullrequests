import { Artifact } from '../../api';

export interface ArtifactNode {
  name: string;
  fullPath: string;
  isFile: boolean;
  size?: number;
  created?: string;
  children: Map<string, ArtifactNode>;
  artifact?: Artifact; // Reference to original artifact if it's a file
}

export interface BuildGroup {
  id: string; // Unique identifier for React keys
  moduleName: string;
  branchType: string;
  branchName: string;
  buildNumber: string;
  artifacts: Artifact[];
  artifactTree: ArtifactNode; // Hierarchical structure
  totalSize: number;
  repo: string;
  artifactCount: number;
  latestCreated: string; // For sorting by latest artifact
}

export interface ParsedPath {
  moduleName: string;
  branchType: string;
  branchName: string;
  buildNumber: string;
  artifactPath: string; // Everything after build number
  artifactName: string; // Just the file name
}

export type SortField = 'moduleName' | 'buildNumber' | 'totalSize' | 'artifactCount' | 'repo' | 'latestCreated';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface ArtifactoryCatalogTabProps {
  artifacts: Artifact[];
  loading?: boolean;
  error?: Error;
}

export interface ArtifactTreeItemProps {
  node: ArtifactNode;
  nodeId: string;
  level?: number;
  expandedNodes?: Set<string>;
  onToggleNode?: (nodeId: string) => void;
}

export interface BuildCardProps {
  build: BuildGroup;
  classes: any;
  onDelete?: (build: BuildGroup) => void;
}

export interface BuildListItemProps {
  build: BuildGroup;
  classes: any;
}

export interface SearchAndFiltersProps {
  searchTerm: string;
  repoFilter: string;
  sortField: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
  uniqueRepos: string[];
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRepoFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  onSortFieldChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  onSortOrderToggle: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  classes: any;
}

export interface StatisticsProps {
  filteredBuilds: BuildGroup[];
  totalStatistics: {
    totalBuilds: number;
    totalArtifacts: number;
    totalSize: number;
    totalModules: number;
  };
  repoFilter: string;
  classes: any;
} 