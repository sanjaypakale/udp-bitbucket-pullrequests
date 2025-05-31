import { Entity } from '@backstage/catalog-model';
import { Artifact } from '../api/types';
export declare const useArtifactoryObjects: (entity: Entity) => {
    error: boolean;
    loading: boolean;
    artifacts: Artifact[];
};
