# Artifactory Plugin Backend Setup

This guide explains how to set up the backend API that the `useArtifactoryObjects` hook expects.

## Backend API Requirements

The frontend hook calls a backend API with the following endpoints:

### 1. Health Check Endpoint
- **URL**: `GET /api/artifactory/health`
- **Response**: `{ "status": "ok" }`

### 2. Artifacts Endpoint
- **URL**: `POST /api/artifactory/artifacts`
- **Request Body**: 
  ```json
  {
    "entityRef": "Component:default/my-service"
  }
  ```
- **Response**: 
  ```json
  {
    "artifacts": [
      {
        "name": "my-service-1.0.0.jar",
        "path": "/com/example/my-service/1.0.0/my-service-1.0.0.jar",
        "repo": "libs-release-local",
        "size": 15728640,
        "created": "2024-01-15T10:30:00Z",
        "modified": "2024-01-15T10:30:00Z",
        "updated": "2024-01-15T10:30:00Z",
        "createdBy": "jenkins",
        "modifiedBy": "jenkins",
        "updatedBy": "jenkins",
        "sha1": "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3",
        "md5": "5d41402abc4b2a76b9719d911017c592"
      }
    ]
  }
  ```

## Backend Implementation Example

Here's a basic Node.js/Express implementation:

```typescript
// backend/src/plugins/artifactory.ts
import { Router } from 'express';
import { Entity } from '@backstage/catalog-model';

export interface ArtifactoryConfig {
  baseUrl: string;
  apiKey?: string;
}

export function createArtifactoryRouter(config: ArtifactoryConfig): Router {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Artifacts endpoint
  router.post('/artifacts', async (req, res) => {
    try {
      const { entityRef } = req.body;
      
      // Parse entity reference
      const [kind, namespace, name] = entityRef.split(':')[1].split('/');
      
      // Call Artifactory API
      const artifacts = await fetchArtifactsFromArtifactory(config, {
        entityName: name,
        namespace,
        kind
      });
      
      res.json({ artifacts });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artifacts' });
    }
  });

  return router;
}

async function fetchArtifactsFromArtifactory(
  config: ArtifactoryConfig, 
  entity: { entityName: string; namespace?: string; kind: string }
) {
  const headers: HeadersInit = {
    'Content-Type': 'text/plain',
  };

  if (config.apiKey) {
    headers['X-JFrog-Art-Api'] = config.apiKey;
  }

  // Build AQL query
  const aqlQuery = `items.find({
    "name":{"$match":"*${entity.entityName}*"}
  }).include("name","repo","path","actual_md5","actual_sha1","size","created","modified","created_by","modified_by")`;

  const response = await fetch(`${config.baseUrl}/api/search/aql`, {
    method: 'POST',
    headers,
    body: aqlQuery,
  });

  if (!response.ok) {
    throw new Error(`Artifactory API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Transform to expected format
  return data.results?.map((item: any) => ({
    name: item.name || '',
    path: item.path ? `${item.path}/${item.name}` : item.name || '',
    repo: item.repo || '',
    size: parseInt(item.size) || 0,
    created: item.created || new Date().toISOString(),
    modified: item.modified || new Date().toISOString(),
    updated: item.modified || new Date().toISOString(),
    createdBy: item.created_by || 'unknown',
    modifiedBy: item.modified_by || 'unknown',
    updatedBy: item.modified_by || 'unknown',
    sha1: item.actual_sha1 || '',
    md5: item.actual_md5 || '',
  })) || [];
}
```

## Backstage Backend Integration

Add the router to your Backstage backend:

```typescript
// packages/backend/src/index.ts
import { createArtifactoryRouter } from './plugins/artifactory';

// ... existing code ...

async function main() {
  // ... existing setup ...

  // Add Artifactory plugin
  const artifactoryRouter = createArtifactoryRouter({
    baseUrl: config.getString('artifactory.baseUrl'),
    apiKey: config.getOptionalString('artifactory.apiKey'),
  });
  
  apiRouter.use('/artifactory', artifactoryRouter);

  // ... rest of setup ...
}
```

## Configuration

Add to your `app-config.yaml`:

```yaml
artifactory:
  baseUrl: 'https://your-company.jfrog.io/artifactory'
  apiKey: '${ARTIFACTORY_API_KEY}'
```

## Entity Annotations

The backend can use entity annotations to customize searches:

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    # These can be used by the backend for more specific searches
    artifactory.io/repository: "libs-release-local"
    artifactory.io/group-id: "com.example"
    artifactory.io/artifact-id: "my-service"
spec:
  type: service
```

## Advanced Backend Features

You can enhance the backend to:

1. **Use Entity Annotations**: Parse annotations from the entity reference for more targeted searches
2. **Caching**: Implement caching to reduce Artifactory API calls
3. **Authentication**: Add proper authentication and authorization
4. **Error Handling**: Implement comprehensive error handling and logging
5. **Rate Limiting**: Add rate limiting to prevent API abuse

## Testing the Backend

Test your backend endpoints:

```bash
# Health check
curl http://localhost:7007/api/artifactory/health

# Get artifacts
curl -X POST http://localhost:7007/api/artifactory/artifacts \
  -H "Content-Type: application/json" \
  -d '{"entityRef": "Component:default/my-service"}'
```

## Troubleshooting

1. **CORS Issues**: Ensure CORS is properly configured for frontend-backend communication
2. **Authentication**: Verify Artifactory API key has proper permissions
3. **Network**: Ensure backend can reach your Artifactory instance
4. **Entity References**: Verify entity reference format matches your catalog structure 