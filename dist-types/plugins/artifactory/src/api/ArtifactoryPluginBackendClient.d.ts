import { Entity } from '@backstage/catalog-model';
import { ArtifactoryPluginApi } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { Artifact } from './types';
export declare class ArtifactoryPluginBackendClient implements ArtifactoryPluginApi {
    private readonly discoveryApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
    });
    private handleResponse;
    getHealth(): Promise<{
        status: string;
    }>;
    getArtifacts(entity: Entity): Promise<Artifact[]>;
}
