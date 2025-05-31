import { Entity } from '@backstage/catalog-model';
export declare const generateAvatarColor: (name: string) => string;
export declare const getUserInitials: (name: string) => string;
export declare const generateDummyUsers: (count: number) => {
    name: string;
    emailAddress: string;
    id: number;
    displayName: string;
    active: boolean;
    slug: string;
    type: string;
}[];
export declare const extractBitbucketInfo: (entity: Entity) => {
    projectKey?: string;
    repoSlug?: string;
};
export declare const fetchBitbucketAPI: (backendBaseUrl: string, endpoint: string, projectKey?: string, repoSlug?: string, options?: RequestInit) => Promise<any>;
