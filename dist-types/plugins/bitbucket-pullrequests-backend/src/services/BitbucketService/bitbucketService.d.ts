import { LoggerService } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { BitbucketService } from './types';
export declare function createBitbucketService({ logger, catalog, }: {
    logger: LoggerService;
    catalog: typeof catalogServiceRef.T;
}): Promise<BitbucketService>;
