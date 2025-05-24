import { createDevApp } from '@backstage/dev-utils';
import { bitbucketPullrequestsPlugin, BitbucketPullrequestsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(bitbucketPullrequestsPlugin)
  .addPage({
    element: <BitbucketPullrequestsPage />,
    title: 'Root Page',
    path: '/bitbucket-pullrequests',
  })
  .render();
