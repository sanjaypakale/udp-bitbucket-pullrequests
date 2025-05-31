import { App, ExpressReceiver } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Logger } from 'winston';
import { AIService } from './aiService';

export interface SlackServiceOptions {
  logger: Logger;
  aiService: AIService;
  slackSigningSecret?: string;
  slackBotToken?: string;
  slackAppToken?: string;
}

export class SlackService {
  private app?: App;
  private client?: WebClient;
  private logger: Logger;
  private aiService: AIService;
  private receiver?: ExpressReceiver;

  constructor(options: SlackServiceOptions) {
    this.logger = options.logger;
    this.aiService = options.aiService;

    if (options.slackSigningSecret && options.slackBotToken) {
      this.receiver = new ExpressReceiver({
        signingSecret: options.slackSigningSecret,
      });

      this.app = new App({
        token: options.slackBotToken,
        receiver: this.receiver,
      });

      this.client = new WebClient(options.slackBotToken);
      this.setupEventHandlers();
    }
  }

  private setupEventHandlers(): void {
    if (!this.app) return;

    // Handle direct messages and mentions
    this.app.message(async ({ message, say, client }) => {
      try {
        // Only respond to direct messages or mentions
        if (message.channel_type === 'im' || message.text?.includes('<@')) {
          const userText = message.text?.replace(/<@[^>]+>/g, '').trim() || '';
          
          if (userText.length === 0) {
            await say('Hi! I\'m your DevOps AI assistant. Ask me about services, deployments, or commands!');
            return;
          }

          // Show typing indicator
          await client.reactions.add({
            channel: message.channel,
            timestamp: message.ts,
            name: 'thinking_face',
          });

          const response = await this.aiService.processNaturalLanguageQuery(
            userText,
            {
              userId: message.user,
              // You can add more context here from Slack user info
            }
          );

          // Remove typing indicator
          await client.reactions.remove({
            channel: message.channel,
            timestamp: message.ts,
            name: 'thinking_face',
          });

          await say(response);
        }
      } catch (error) {
        this.logger.error('Error handling Slack message', error);
        await say('Sorry, I encountered an error processing your request. Please try again.');
      }
    });

    // Handle slash commands
    this.app.command('/devops', async ({ command, ack, respond }) => {
      await ack();

      try {
        const query = command.text.trim();
        
        if (!query) {
          await respond({
            text: 'DevOps AI Assistant Commands:',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Available Commands:*\n' +
                        '• `/devops services` - List all services\n' +
                        '• `/devops deployments last week` - Show recent deployments\n' +
                        '• `/devops search <term>` - Search for services or docs\n' +
                        '• `/devops help kubernetes` - Get command help\n' +
                        '• `/devops <any question>` - Ask anything!'
                }
              }
            ]
          });
          return;
        }

        const response = await this.aiService.processNaturalLanguageQuery(query);
        
        await respond({
          text: response,
          response_type: 'ephemeral', // Only visible to the user who ran the command
        });
      } catch (error) {
        this.logger.error('Error handling slash command', error);
        await respond({
          text: 'Sorry, I encountered an error processing your command. Please try again.',
          response_type: 'ephemeral',
        });
      }
    });

    // Handle interactive components (buttons, etc.)
    this.app.action('quick_service_list', async ({ ack, respond }) => {
      await ack();
      
      const response = await this.aiService.processNaturalLanguageQuery('list all services');
      await respond(response);
    });

    // Handle app home tab
    this.app.event('app_home_opened', async ({ event, client }) => {
      try {
        await client.views.publish({
          user_id: event.user,
          view: {
            type: 'home',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Welcome to DevOps AI Assistant!* 🤖\n\nI can help you with:'
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '• 📋 *Service Management* - List, search, and manage services\n' +
                        '• 🚀 *Deployment Info* - Check recent deployments and status\n' +
                        '• 💻 *Command Help* - Get CLI commands and configurations\n' +
                        '• 🔍 *Smart Search* - Find anything in your infrastructure'
                }
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'List Services'
                    },
                    action_id: 'quick_service_list',
                    style: 'primary'
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Quick Commands:*\n' +
                        '• `@devops-ai services` - List all services\n' +
                        '• `@devops-ai deployments last week` - Recent deployments\n' +
                        '• `@devops-ai help kubernetes` - Kubernetes commands\n' +
                        '• Or just ask me anything!'
                }
              }
            ]
          }
        });
      } catch (error) {
        this.logger.error('Error updating app home', error);
      }
    });
  }

  async sendNotification(channel: string, message: string, blocks?: any[]): Promise<void> {
    if (!this.client) {
      this.logger.warn('Slack client not configured, cannot send notification');
      return;
    }

    try {
      await this.client.chat.postMessage({
        channel: channel,
        text: message,
        blocks: blocks,
      });
    } catch (error) {
      this.logger.error('Error sending Slack notification', error);
    }
  }

  async sendIntelligentNotification(
    channel: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    if (!this.client) return;

    let message = '';
    let blocks: any[] = [];

    switch (eventType) {
      case 'deployment':
        message = `🚀 New deployment: ${eventData.serviceName}`;
        blocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${eventData.serviceName}* has been deployed!\n` +
                    `• Environment: ${eventData.environment}\n` +
                    `• Version: ${eventData.version}\n` +
                    `• Deployed by: ${eventData.deployedBy}`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Logs'
                },
                url: eventData.logsUrl || '#',
                style: 'primary'
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Service Details'
                },
                url: eventData.serviceUrl || '#'
              }
            ]
          }
        ];
        break;

      case 'incident':
        message = `🚨 Incident Alert: ${eventData.title}`;
        blocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Incident:* ${eventData.title}\n` +
                    `• Severity: ${eventData.severity}\n` +
                    `• Affected Service: ${eventData.service}\n` +
                    `• Status: ${eventData.status}`
            }
          }
        ];
        break;

      case 'pr_review':
        message = `👀 Pull Request needs review: ${eventData.title}`;
        blocks = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*PR:* ${eventData.title}\n` +
                    `• Author: ${eventData.author}\n` +
                    `• Repository: ${eventData.repository}\n` +
                    `• Changes: ${eventData.changes} files`
            }
          }
        ];
        break;

      default:
        message = eventData.message || 'New notification';
    }

    await this.sendNotification(channel, message, blocks);
  }

  getExpressApp() {
    return this.receiver?.app;
  }
} 