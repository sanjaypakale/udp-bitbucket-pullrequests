import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import express from 'express';
export interface RouterOptions {
    httpAuth: HttpAuthService;
    logger: LoggerService;
    catalogApi: CatalogApi;
    config: {
        openaiApiKey?: string;
        slackSigningSecret?: string;
        slackBotToken?: string;
        slackAppToken?: string;
    };
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
