import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const bitbucketPullrequestsPlugin = createPlugin({
  id: 'bitbucket-pullrequests',
  routes: {
    root: rootRouteRef,
  },
});

export const BitbucketPullrequestsPage = bitbucketPullrequestsPlugin.provide(
  createRoutableExtension({
    name: 'BitbucketPullrequestsPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
