import { Server as HTTPServer } from 'http';
import { Logger } from 'winston';
import { AIService } from './aiService';
export interface WebSocketServiceOptions {
    logger: Logger;
    aiService: AIService;
    httpServer: HTTPServer;
}
export interface ConnectedUser {
    id: string;
    username?: string;
    email?: string;
    joinedAt: Date;
}
export declare class WebSocketService {
    private io;
    private logger;
    private aiService;
    private connectedUsers;
    private chatHistory;
    constructor(options: WebSocketServiceOptions);
    private setupEventHandlers;
    broadcastNotification(notification: {
        type: 'info' | 'warning' | 'error' | 'success';
        title: string;
        message: string;
        actionUrl?: string;
    }): void;
    broadcastDeploymentUpdate(deployment: {
        serviceName: string;
        version: string;
        environment: string;
        status: 'started' | 'completed' | 'failed';
        deployedBy?: string;
    }): void;
    getConnectedUsersCount(): number;
    getConnectedUsers(): ConnectedUser[];
    sendDirectMessage(socketId: string, message: string, type?: 'info' | 'warning' | 'error'): void;
}
