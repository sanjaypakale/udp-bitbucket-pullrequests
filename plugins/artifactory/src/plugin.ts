import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const artifactoryPlugin = createPlugin({
  id: 'artifactory',
  routes: {
    root: rootRouteRef,
  },
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
