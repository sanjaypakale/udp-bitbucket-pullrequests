# Artifactory Plugin

This plugin provides integration with JFrog Artifactory for Backstage, allowing you to view artifacts and repositories directly within your service catalog.

## Features

### Catalog Entity Tab

The plugin provides a catalog entity tab that displays Artifactory artifacts associated with a specific entity. The tab shows:

- **Artifact Information**: Name, path, repository, size, and creation date
- **Summary Statistics**: Total artifacts, total size, and number of repositories
- **Interactive Cards**: Hover effects and direct links to Artifactory
- **Responsive Design**: Adapts to different screen sizes
- **Loading & Error States**: Proper handling of loading and error conditions

### Key Components

- `ArtifactoryCatalogTab`: Main display component with beautiful card-based UI
- `ArtifactoryCatalogTabContainer`: Container component that fetches data from Artifactory
- `EntityArtifactoryTab`: Backstage entity tab extension

## Installation

1. Add the plugin to your Backstage app:

```bash
yarn add @internal/plugin-artifactory
```

2. Add the entity tab to your catalog entity page in `packages/app/src/components/catalog/EntityPage.tsx`:

```tsx
import { EntityArtifactoryTab } from '@internal/plugin-artifactory';

// Add to your entity layout
const serviceEntityPage = (
  <EntityLayout>
    {/* ... other tabs ... */}
    <EntityLayout.Route path="/artifactory" title="Artifactory">
      <EntityArtifactoryTab />
    </EntityLayout.Route>
  </EntityLayout>
);
```

## Configuration

### API Integration

To connect to your Artifactory instance, update the `fetchArtifacts` function in `ArtifactoryCatalogTabContainer.tsx`:

```tsx
const fetchArtifacts = async (entityName: string): Promise<ArtifactoryArtifact[]> => {
  const response = await fetch(`/api/artifactory/artifacts/${entityName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch artifacts: ${response.statusText}`);
  }
  return response.json();
};
```

### Entity Metadata

The plugin uses entity metadata to determine which artifacts to display. You can configure this by adding annotations to your catalog entities:

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    artifactory.io/repository: "libs-release-local"
    artifactory.io/group-id: "com.example"
    artifactory.io/artifact-id: "my-service"
spec:
  type: service
  # ... rest of spec
```

## Data Structure

The plugin expects artifacts in the following format:

```typescript
interface ArtifactoryArtifact {
  name: string;          // Artifact filename
  path: string;          // Full path in repository
  repo: string;          // Repository name
  size: number;          // File size in bytes
  created: string;       // ISO 8601 date string
  modified: string;      // ISO 8601 date string
  updated: string;       // ISO 8601 date string
  createdBy: string;     // User who created the artifact
  modifiedBy: string;    // User who last modified
  updatedBy: string;     // User who last updated
  sha1: string;          // SHA1 checksum
  md5: string;           // MD5 checksum
}
```

## UI Features

### Card Design
- **Hover Effects**: Cards lift slightly on hover for better interactivity
- **Color-coded Chips**: Repository and size information use themed colors
- **Monospace Paths**: File paths use monospace font for better readability
- **Responsive Grid**: Automatically adjusts card layout based on screen size

### Statistics Summary
- **Total Artifacts**: Count of all artifacts
- **Total Size**: Human-readable sum of all artifact sizes
- **Unique Repositories**: Number of different repositories represented

### Date Formatting
Dates are automatically formatted in a user-friendly format:
- `2024-01-15T10:30:00Z` → `Jan 15, 2024, 10:30 AM`

### File Size Formatting
File sizes are automatically converted to human-readable format:
- `1024` → `1.0 KB`
- `1048576` → `1.0 MB`
- `1073741824` → `1.0 GB`

## Development

### Testing

Run the tests:

```bash
yarn test
```

The plugin includes comprehensive tests for:
- Loading states
- Error handling
- Data rendering
- File size formatting
- Date formatting

### Building

Build the plugin:

```bash
yarn build
```

### Linting

Lint the code:

```bash
yarn lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

Apache-2.0
