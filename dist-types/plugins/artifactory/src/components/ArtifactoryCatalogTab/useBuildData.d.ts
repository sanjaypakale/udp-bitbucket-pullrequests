import { Artifact } from '../../api';
import { BuildGroup, SortField, SortOrder, ViewMode } from './types';
export declare const useBuildData: (artifacts: Artifact[]) => {
    searchTerm: string;
    repoFilter: string;
    sortField: SortField;
    sortOrder: SortOrder;
    page: number;
    rowsPerPage: number;
    viewMode: ViewMode;
    buildGroups: BuildGroup[];
    uniqueRepos: string[];
    uniqueModules: string[];
    filteredAndSortedBuilds: BuildGroup[];
    paginatedBuilds: BuildGroup[];
    statistics: {
        totalBuilds: number;
        totalArtifacts: number;
        totalSize: number;
        totalModules: number;
    };
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSort: (field: SortField) => void;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRepoFilterChange: (event: React.ChangeEvent<{
        value: unknown;
    }>) => void;
    handleSortFieldChange: (event: React.ChangeEvent<{
        value: unknown;
    }>) => void;
    handleSortOrderToggle: () => void;
    handleViewModeChange: (mode: ViewMode) => void;
};
