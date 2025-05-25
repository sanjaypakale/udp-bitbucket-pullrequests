import { createDevApp } from '@backstage/dev-utils';
import { artifactoryPlugin, ArtifactoryPage } from '../src/plugin';

createDevApp()
  .registerPlugin(artifactoryPlugin)
  .addPage({
    element: <ArtifactoryPage />,
    title: 'Root Page',
    path: '/artifactory',
  })
  .render();
