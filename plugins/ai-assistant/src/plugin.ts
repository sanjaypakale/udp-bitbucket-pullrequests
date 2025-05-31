import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const aiAssistantPlugin = createPlugin({
  id: 'ai-assistant',
  routes: {
    root: rootRouteRef,
  },
});

export const AiAssistantPage = aiAssistantPlugin.provide(
  createRoutableExtension({
    name: 'AiAssistantPage',
    component: () =>
      import('./components/AiAssistantPage/AiAssistantPage').then(m => m.AiAssistantPage),
    mountPoint: rootRouteRef,
  }),
);

export const ChatButton = aiAssistantPlugin.provide(
  createComponentExtension({
    name: 'ChatButton',
    component: {
      lazy: () =>
        import('./components/ChatButton/ChatButton').then(m => m.ChatButton),
    },
  }),
);

export const ChatInterface = aiAssistantPlugin.provide(
  createComponentExtension({
    name: 'ChatInterface',
    component: {
      lazy: () =>
        import('./components/ChatInterface/ChatInterface').then(m => m.ChatInterface),
    },
  }),
);
