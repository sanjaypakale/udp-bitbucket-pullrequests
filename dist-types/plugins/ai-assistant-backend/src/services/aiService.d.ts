import { Logger } from 'winston';
import { CatalogApi } from '@backstage/catalog-client';
export interface AIServiceOptions {
    logger: Logger;
    catalogApi: CatalogApi;
    openaiApiKey?: string;
}
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}
export interface QueryContext {
    userId?: string;
    userEmail?: string;
    currentServices?: string[];
    recentDeployments?: string[];
}
export declare class AIService {
    private openai?;
    private logger;
    private catalogApi;
    constructor(options: AIServiceOptions);
    processNaturalLanguageQuery(query: string, context?: QueryContext): Promise<string>;
    private parseQueryIntent;
    private handleServiceListQuery;
    private handleDeploymentQuery;
    private handleSearchQuery;
    private handleCommandHelp;
    private handleGeneralQuery;
    private extractFilters;
    private extractTimeframe;
    private extractSearchTerm;
    private extractCommandTopic;
    private parseTimeframe;
}
