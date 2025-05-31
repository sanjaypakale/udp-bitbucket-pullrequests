import { Logger } from 'winston';
import { AIService } from './aiService';
export interface SlackServiceOptions {
    logger: Logger;
    aiService: AIService;
    slackSigningSecret?: string;
    slackBotToken?: string;
    slackAppToken?: string;
}
export declare class SlackService {
    private app?;
    private client?;
    private logger;
    private aiService;
    private receiver?;
    constructor(options: SlackServiceOptions);
    private setupEventHandlers;
    sendNotification(channel: string, message: string, blocks?: any[]): Promise<void>;
    sendIntelligentNotification(channel: string, eventType: string, eventData: any): Promise<void>;
    getExpressApp(): import("express").Application | undefined;
}
