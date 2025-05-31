import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'assistant' | 'system';
}

interface WebSocketHookOptions {
  onMessage: (message: Message) => void;
  onTyping: (data: { user: string; isTyping: boolean }) => void;
  onError: (error: string) => void;
}

export const useWebSocket = (backendUrl: string, options: WebSocketHookOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // For now, we'll just set connected to false since WebSocket is disabled
    // In the future, we can re-enable this when WebSocket support is added back
    setIsConnected(false);

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [backendUrl]);

  const sendMessage = async (message: string, context?: any) => {
    // Since WebSocket is disabled, we'll use REST API directly
    try {
      const response = await fetch(`${backendUrl}/api/ai-assistant/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        user: 'AI Assistant',
        message: data.response,
        timestamp: new Date(),
        type: 'assistant',
      };

      options.onMessage(assistantMessage);
    } catch (error) {
      options.onError('Failed to send message. Please try again.');
    }
  };

  const sendQuickCommand = async (command: string, params?: any) => {
    try {
      const response = await fetch(`${backendUrl}/api/ai-assistant/commands/${command}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params || {}),
      });

      if (!response.ok) {
        throw new Error('Failed to execute command');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        user: 'AI Assistant',
        message: data.response,
        timestamp: new Date(),
        type: 'assistant',
      };

      options.onMessage(assistantMessage);
    } catch (error) {
      options.onError('Failed to execute command. Please try again.');
    }
  };

  const sendTyping = (_isTyping: boolean) => {
    // No-op for now since WebSocket is disabled
  };

  return {
    isConnected,
    sendMessage,
    sendQuickCommand,
    sendTyping,
  };
}; 