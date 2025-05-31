import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import { BitbucketService } from './services/BitbucketService/types';
export declare function createRouter({ httpAuth, todoListService, }: {
    httpAuth: HttpAuthService;
    todoListService: BitbucketService;
}): Promise<express.Router>;
