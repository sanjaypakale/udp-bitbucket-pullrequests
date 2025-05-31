export interface TodoItem {
    title: string;
    id: string;
    createdBy: string;
    createdAt: string;
}
export interface BitbucketService {
    getBitbucketPullRequests(request: {
        projectKey: string;
        repositorySlug: string;
    }): Promise<TodoItem>;
}
