import { bitbucketPullrequestsPlugin } from './plugin';

describe('bitbucket-pullrequests', () => {
  it('should export plugin', () => {
    expect(bitbucketPullrequestsPlugin).toBeDefined();
  });
});
