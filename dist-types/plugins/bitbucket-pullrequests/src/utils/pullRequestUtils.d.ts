import { BitbucketPullRequest, PullRequestStatus } from '../types/BitbucketPullRequest';
export declare const determinePullRequestStatus: (pr: BitbucketPullRequest) => PullRequestStatus;
export declare const formatRelativeTime: (timestamp: number) => string;
