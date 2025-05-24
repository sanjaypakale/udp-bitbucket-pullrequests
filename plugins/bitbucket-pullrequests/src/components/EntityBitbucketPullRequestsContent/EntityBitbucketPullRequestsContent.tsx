import React from 'react';
import { Grid } from '@material-ui/core';
import { BitbucketPullRequestsComponent } from '../BitbucketPullRequestsComponent';

export const EntityBitbucketPullRequestsContent = () => {
  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item xs={12}>
        <BitbucketPullRequestsComponent />
      </Grid>
    </Grid>
  );
}; 