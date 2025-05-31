import { Entity } from '@backstage/catalog-model';
export interface ArtifactoryPluginApi {
    getHealth(): Promise<{
        status: string;
    }>;
    getArtifacts(entity: Entity): Promise<Artifact[]>;
}
export declare const ArtifactoryPluginApiRef: import("@backstage/core-plugin-api").ApiRef<ArtifactoryPluginApi>;
export type Artifact = {
    name: string;
    path: string;
    repo: string;
    size: number;
    created: string;
    modified: string;
    updated: string;
    createdBy: string;
    modifiedBy: string;
    updatedBy: string;
    sha1: string;
    md5: string;
};
