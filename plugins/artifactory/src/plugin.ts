import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
  createApiFactory,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { ArtifactoryPluginApiRef } from './api/types';
import { ArtifactoryPluginBackendClient } from './api/ArtifactoryPluginBackendClient';

export const artifactoryPlugin = createPlugin({
  id: 'artifactory',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: ArtifactoryPluginApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new ArtifactoryPluginBackendClient({ discoveryApi }),
    }),
  ],
});

export const ArtifactoryPage = artifactoryPlugin.provide(
  createRoutableExtension({
    name: 'ArtifactoryPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityArtifactoryTab = artifactoryPlugin.provide(
  createComponentExtension({
    name: 'EntityArtifactoryTab',
    component: {
      lazy: () =>
        import('./components/ArtifactoryCatalogTab').then(
          ({ ArtifactoryCatalogTabContainer }) => ArtifactoryCatalogTabContainer,
        ),
    },
  }),
);
