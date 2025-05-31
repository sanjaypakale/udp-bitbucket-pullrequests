import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { AIService } from './services/aiService';
import { SlackService } from './services/slackService';

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

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { httpAuth, logger, catalogApi, config } = options;
  const router = Router();
  router.use(express.json());

  // Initialize services
  const aiService = new AIService({
    logger: logger as any, // Cast to any to handle winston Logger type mismatch
    catalogApi: catalogApi,
    openaiApiKey: config.openaiApiKey,
  });

  const slackService = new SlackService({
    logger: logger as any, // Cast to any to handle winston Logger type mismatch
    aiService: aiService,
    slackSigningSecret: config.slackSigningSecret,
    slackBotToken: config.slackBotToken,
    slackAppToken: config.slackAppToken,
  });

  // Input schemas
  const chatQuerySchema = z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    context: z.object({
      userId: z.string().optional(),
      userEmail: z.string().optional(),
      currentServices: z.array(z.string()).optional(),
      recentDeployments: z.array(z.string()).optional(),
    }).optional(),
  });

  const notificationSchema = z.object({
    channel: z.string(),
    type: z.enum(['deployment', 'incident', 'pr_review', 'custom']),
    data: z.object({
      serviceName: z.string().optional(),
      environment: z.string().optional(),
      version: z.string().optional(),
      deployedBy: z.string().optional(),
      title: z.string().optional(),
      severity: z.string().optional(),
      status: z.string().optional(),
      message: z.string().optional(),
    }),
  });

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      services: {
        ai: !!config.openaiApiKey,
        slack: !!(config.slackSigningSecret && config.slackBotToken),
        websocket: false, // Disabled for now
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Chat endpoint for direct API queries
  router.post('/chat', async (req, res) => {
    try {
      const parsed = chatQuerySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new InputError(parsed.error.toString());
      }

      const { message, context } = parsed.data;
      
      // Get user credentials for context
      const credentials = await httpAuth.credentials(req, { allow: ['user'] });
      const userContext = {
        ...context,
        userId: credentials?.principal?.userEntityRef,
      };

      const response = await aiService.processNaturalLanguageQuery(message, userContext);
      
      res.json({
        query: message,
        response: response,
        timestamp: new Date().toISOString(),
        context: userContext,
      });
    } catch (error) {
      logger.error('Error processing chat query', error as Error);
      res.status(500).json({
        error: 'Failed to process chat query',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Quick commands endpoint
  router.post('/commands/:command', async (req, res) => {
    try {
      const command = req.params.command;
      const params = req.body;

      let query = '';
      switch (command) {
        case 'services':
          query = 'list all services';
          break;
        case 'deployments':
          const timeframe = params.timeframe || 'last week';
          query = `show me deployments from ${timeframe}`;
          break;
        case 'search':
          const term = params.term || '';
          query = `search for ${term}`;
          break;
        case 'help':
          const topic = params.topic || '';
          query = `help me with ${topic} commands`;
          break;
        default:
          query = command;
      }

      const credentials = await httpAuth.credentials(req, { allow: ['user'] });
      const response = await aiService.processNaturalLanguageQuery(query, {
        userId: credentials?.principal?.userEntityRef,
      });

      res.json({
        command,
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error processing command', error as Error);
      res.status(500).json({
        error: 'Failed to process command',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Slack integration endpoints
  if (slackService.getExpressApp()) {
    router.use('/slack', slackService.getExpressApp()!);
  }

  // Send Slack notification endpoint
  router.post('/notifications/slack', async (req, res) => {
    try {
      const parsed = notificationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new InputError(parsed.error.toString());
      }

      const { channel, type, data } = parsed.data;
      
      await slackService.sendIntelligentNotification(channel, type, data);
      
      res.json({
        success: true,
        message: 'Notification sent successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error sending Slack notification', error as Error);
      res.status(500).json({
        error: 'Failed to send notification',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Configuration endpoint
  router.get('/config', (_req, res) => {
    res.json({
      features: {
        openai: !!config.openaiApiKey,
        slack: !!(config.slackSigningSecret && config.slackBotToken),
        websocket: false, // Disabled for now
      },
      endpoints: {
        chat: '/api/ai-assistant/chat',
        commands: '/api/ai-assistant/commands/{command}',
        slack: '/api/ai-assistant/slack',
      },
    });
  });

  // Error handling middleware
  router.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('AI Assistant router error', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
