export type BitbucketUser = {
    name: string;
    displayName: string;
    emailAddress?: string;
    active: boolean;
    slug?: string;
    type?: string;
};
export type BitbucketRepository = {
    slug: string;
    name: string | null;
    project: {
        key: string;
    };
};
export type BitbucketRef = {
    id: string;
    displayId: string;
    latestCommit: string;
    repository: BitbucketRepository;
};
export type BitbucketParticipant = {
    user: BitbucketUser;
    role: string;
    approved: boolean;
    status: string;
};
export type BitbucketPullRequest = {
    id: number;
    version: number;
    title: string;
    description: string;
    state: string;
    open: boolean;
    closed: boolean;
    createdDate: number;
    updatedDate: number;
    fromRef: BitbucketRef;
    toRef: BitbucketRef;
    locked: boolean;
    author: BitbucketParticipant;
    reviewers: BitbucketParticipant[];
    participants: BitbucketParticipant[];
    links: {
        self: Array<{
            href: string;
        }>;
    };
};
export type BitbucketResponse = {
    size: number;
    limit: number;
    isLastPage: boolean;
    values: BitbucketPullRequest[];
    start: number;
};
export type PullRequestStatus = 'OPEN' | 'REVIEW_IN_PROGRESS' | 'APPROVED' | 'DECLINED' | 'MERGED';
