import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import crypto from 'node:crypto';
import { TodoItem, BitbucketService } from './types';

export async function createBitbucketService({
  logger,
  catalog,
}: {
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
}): Promise<BitbucketService> {
  logger.info('Initializing BitbucketService');

  const storedTodos = new Array<TodoItem>();

  return {
    

    async getBitbucketPullRequests(request: { projectKey: string, repositorySlug: string }) :Promise<any>{
      const {projectKey, repositorySlug} = request;
      logger.info(`Fetching pull requests for project ${projectKey} and repository ${repositorySlug}`);
      return null;
    }
    ,
  };
}
