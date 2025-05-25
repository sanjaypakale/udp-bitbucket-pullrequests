import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightTheme } from '@backstage/theme';
import { ArtifactoryCatalogTab } from './ArtifactoryCatalogTab';
import { ArtifactorySkeletonLoader, StatsSkeletonLoader, SearchFiltersSkeleton } from './ArtifactorySkeletonLoader';
import { ArtifactoryArtifact } from '../../types';

const mockArtifacts: ArtifactoryArtifact[] = [
  {
    name: 'test-app.jar',
    path: '/com/example/test-app/1.0.0/test-app-1.0.0.jar',
    repo: 'libs-release-local',
    size: 1024000,
    created: '2024-01-15T10:30:00Z',
    modified: '2024-01-15T10:30:00Z',
    updated: '2024-01-15T10:30:00Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    md5: '5d41402abc4b2a76b9719d911017c592',
  },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
  );
};

describe('ArtifactoryCatalogTab', () => {
  it('renders loading skeleton when loading is true', () => {
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={[]} loading={true} />
    );
    
    // Should show skeleton loading instead of progress
    expect(screen.getByText('Artifactory Artifacts')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to fetch');
    
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={[]} error={error} />
    );
    
    expect(screen.getByText('Failed to load artifacts')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('renders empty state when no artifacts', () => {
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={[]} />
    );
    
    expect(screen.getByText('No artifacts found')).toBeInTheDocument();
    expect(screen.getByText('No Artifactory artifacts are associated with this entity.')).toBeInTheDocument();
  });

  it('renders artifacts correctly', () => {
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={mockArtifacts} />
    );
    
    // Check title
    expect(screen.getByText('Artifactory Artifacts')).toBeInTheDocument();
    
    // Check statistics
    expect(screen.getByText('1')).toBeInTheDocument(); // Total Artifacts
    expect(screen.getByText('Total Artifacts')).toBeInTheDocument();
    expect(screen.getByText('1000.0 KB')).toBeInTheDocument(); // Total Size
    expect(screen.getByText('Total Size')).toBeInTheDocument();
    
    // Check artifact details
    expect(screen.getByText('test-app.jar')).toBeInTheDocument();
    expect(screen.getByText('/com/example/test-app/1.0.0/test-app-1.0.0.jar')).toBeInTheDocument();
    expect(screen.getByText('libs-release-local')).toBeInTheDocument();
    expect(screen.getByText('View in Artifactory')).toBeInTheDocument();
  });

  it('formats file sizes correctly', () => {
    const artifacts = [
      {
        ...mockArtifacts[0],
        size: 1024, // 1 KB
      },
      {
        ...mockArtifacts[0],
        name: 'large-file.tar',
        size: 1073741824, // 1 GB
      },
    ];
    
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={artifacts} />
    );
    
    expect(screen.getByText('1.0 KB')).toBeInTheDocument();
    expect(screen.getByText('1.0 GB')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={mockArtifacts} />
    );
    
    // Should format the date in a readable format
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
  });

  it('renders search functionality', () => {
    renderWithTheme(
      <ArtifactoryCatalogTab artifacts={mockArtifacts} />
    );
    
    // Check for search input
    expect(screen.getByPlaceholderText('Search artifacts by name, path, or repository...')).toBeInTheDocument();
    
    // Check for filter controls
    expect(screen.getByText('Repository')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });
});

describe('Skeleton Loaders', () => {
  it('renders grid skeleton loader', () => {
    renderWithTheme(
      <ArtifactorySkeletonLoader viewMode="grid" count={6} />
    );
    
    // Should render skeleton elements
    const skeletons = screen.getAllByTestId(/MuiSkeleton/);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders list skeleton loader', () => {
    renderWithTheme(
      <ArtifactorySkeletonLoader viewMode="list" count={6} />
    );
    
    // Should render skeleton elements
    const skeletons = screen.getAllByTestId(/MuiSkeleton/);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders stats skeleton loader', () => {
    renderWithTheme(
      <StatsSkeletonLoader />
    );
    
    // Should render 4 skeleton stat cards
    const skeletons = screen.getAllByTestId(/MuiSkeleton/);
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders search filters skeleton', () => {
    renderWithTheme(
      <SearchFiltersSkeleton />
    );
    
    // Should render skeleton elements for search and filters
    const skeletons = screen.getAllByTestId(/MuiSkeleton/);
    expect(skeletons.length).toBeGreaterThan(0);
  });
}); 