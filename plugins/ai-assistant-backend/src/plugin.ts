import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

/**
 * aiAssistantPlugin backend plugin
 *
 * @public
 */
export const aiAssistantPlugin = createBackendPlugin({
  pluginId: 'ai-assistant',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
        config: coreServices.rootConfig,
      },
      async init({ logger, httpAuth, httpRouter, catalog, config }) {
        // Read AI Assistant configuration
        const aiConfig = config.getOptionalConfig('aiAssistant');
        
        const pluginConfig = {
          openaiApiKey: aiConfig?.getOptionalString('openai.apiKey') || process.env.OPENAI_API_KEY,
          slackSigningSecret: aiConfig?.getOptionalString('slack.signingSecret') || process.env.SLACK_SIGNING_SECRET,
          slackBotToken: aiConfig?.getOptionalString('slack.botToken') || process.env.SLACK_BOT_TOKEN,
          slackAppToken: aiConfig?.getOptionalString('slack.appToken') || process.env.SLACK_APP_TOKEN,
        };

        // Log configuration status (without exposing secrets)
        logger.info('AI Assistant plugin configuration:', {
          openaiConfigured: !!pluginConfig.openaiApiKey,
          slackConfigured: !!(pluginConfig.slackSigningSecret && pluginConfig.slackBotToken),
        });

        const catalogApi = catalog;

        httpRouter.use(
          await createRouter({
            httpAuth,
            logger,
            catalogApi: catalogApi as any, // Cast to handle CatalogApi type mismatch
            config: pluginConfig,
          }),
        );

        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });

        httpRouter.addAuthPolicy({
          path: '/config',
          allow: 'unauthenticated',
        });

        httpRouter.addAuthPolicy({
          path: '/slack',
          allow: 'unauthenticated', // Slack handles its own authentication
        });

        logger.info('AI Assistant plugin initialized successfully');
      },
    });
  },
});
