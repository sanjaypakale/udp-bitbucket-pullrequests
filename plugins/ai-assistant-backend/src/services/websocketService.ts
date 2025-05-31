import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Logger } from 'winston';
import { AIService, ChatMessage } from './aiService';

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

export class WebSocketService {
  private io: SocketIOServer;
  private logger: Logger;
  private aiService: AIService;
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private chatHistory: ChatMessage[] = [];

  constructor(options: WebSocketServiceOptions) {
    this.logger = options.logger;
    this.aiService = options.aiService;

    this.io = new SocketIOServer(options.httpServer, {
      cors: {
        origin: "*", // Configure this properly for production
        methods: ["GET", "POST"]
      },
      path: '/api/ai-assistant/socket.io'
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      this.logger.info(`User connected: ${socket.id}`);

      // Handle user authentication/identification
      socket.on('authenticate', (userData: { username?: string; email?: string }) => {
        const user: ConnectedUser = {
          id: socket.id,
          username: userData.username,
          email: userData.email,
          joinedAt: new Date(),
        };
        
        this.connectedUsers.set(socket.id, user);
        
        // Send welcome message and recent chat history
        socket.emit('authenticated', {
          success: true,
          user: user,
          chatHistory: this.chatHistory.slice(-20), // Last 20 messages
        });

        // Notify other users (optional)
        socket.broadcast.emit('user_joined', {
          user: user.username || user.id,
          timestamp: new Date(),
        });
      });

      // Handle chat messages
      socket.on('chat_message', async (data: { message: string; context?: any }) => {
        try {
          const user = this.connectedUsers.get(socket.id);
          
          // Add user message to history
          const userMessage: ChatMessage = {
            role: 'user',
            content: data.message,
            timestamp: new Date(),
          };
          this.chatHistory.push(userMessage);

          // Broadcast user message to all clients
          this.io.emit('new_message', {
            id: `${socket.id}-${Date.now()}`,
            user: user?.username || 'Anonymous',
            message: data.message,
            timestamp: new Date(),
            type: 'user',
          });

          // Show typing indicator
          socket.broadcast.emit('typing', {
            user: 'AI Assistant',
            isTyping: true,
          });

          // Process with AI
          const aiResponse = await this.aiService.processNaturalLanguageQuery(
            data.message,
            {
              userId: socket.id,
              userEmail: user?.email,
              ...data.context,
            }
          );

          // Add AI response to history
          const aiMessage: ChatMessage = {
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
          };
          this.chatHistory.push(aiMessage);

          // Stop typing indicator
          socket.broadcast.emit('typing', {
            user: 'AI Assistant',
            isTyping: false,
          });

          // Broadcast AI response
          this.io.emit('new_message', {
            id: `ai-${Date.now()}`,
            user: 'AI Assistant',
            message: aiResponse,
            timestamp: new Date(),
            type: 'assistant',
          });

          // Keep chat history manageable
          if (this.chatHistory.length > 100) {
            this.chatHistory = this.chatHistory.slice(-80);
          }

        } catch (error) {
          this.logger.error('Error processing chat message', error);
          socket.emit('error', {
            message: 'Failed to process your message. Please try again.',
          });
        }
      });

      // Handle typing indicators
      socket.on('typing', (data: { isTyping: boolean }) => {
        const user = this.connectedUsers.get(socket.id);
        socket.broadcast.emit('typing', {
          user: user?.username || 'Anonymous',
          isTyping: data.isTyping,
        });
      });

      // Handle quick commands
      socket.on('quick_command', async (data: { command: string; params?: any }) => {
        try {
          let query = '';
          
          switch (data.command) {
            case 'list_services':
              query = 'list all services';
              break;
            case 'recent_deployments':
              query = 'show me deployments from last week';
              break;
            case 'help_kubernetes':
              query = 'help me with kubernetes commands';
              break;
            case 'search':
              query = `search for ${data.params?.term || ''}`;
              break;
            default:
              query = data.command;
          }

          const response = await this.aiService.processNaturalLanguageQuery(query);
          
          socket.emit('quick_command_response', {
            command: data.command,
            response: response,
            timestamp: new Date(),
          });

        } catch (error) {
          this.logger.error('Error processing quick command', error);
          socket.emit('error', {
            message: 'Failed to process command. Please try again.',
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.logger.info(`User disconnected: ${socket.id}`);
        
        const user = this.connectedUsers.get(socket.id);
        this.connectedUsers.delete(socket.id);

        // Notify other users
        if (user) {
          socket.broadcast.emit('user_left', {
            user: user.username || user.id,
            timestamp: new Date(),
          });
        }
      });
    });
  }

  // Send system notifications to all connected clients
  public broadcastNotification(notification: {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    actionUrl?: string;
  }): void {
    this.io.emit('system_notification', {
      ...notification,
      timestamp: new Date(),
    });
  }

  // Send deployment notifications
  public broadcastDeploymentUpdate(deployment: {
    serviceName: string;
    version: string;
    environment: string;
    status: 'started' | 'completed' | 'failed';
    deployedBy?: string;
  }): void {
    const message = `${deployment.serviceName} deployment ${deployment.status} in ${deployment.environment}`;
    
    this.io.emit('deployment_update', {
      ...deployment,
      message,
      timestamp: new Date(),
    });

    // Also add to chat history as a system message
    this.chatHistory.push({
      role: 'system' as any,
      content: `🚀 ${message}`,
      timestamp: new Date(),
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get connected users info
  public getConnectedUsers(): ConnectedUser[] {
    return Array.from(this.connectedUsers.values());
  }

  // Send direct message to specific user
  public sendDirectMessage(socketId: string, message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
    this.io.to(socketId).emit('direct_message', {
      message,
      type,
      timestamp: new Date(),
    });
  }
} 