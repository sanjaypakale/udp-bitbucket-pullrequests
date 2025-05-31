interface Message {
    id: string;
    user: string;
    message: string;
    timestamp: Date;
    type: 'user' | 'assistant' | 'system';
}
interface WebSocketHookOptions {
    onMessage: (message: Message) => void;
    onTyping: (data: {
        user: string;
        isTyping: boolean;
    }) => void;
    onError: (error: string) => void;
}
export declare const useWebSocket: (backendUrl: string, options: WebSocketHookOptions) => {
    isConnected: boolean;
    sendMessage: (message: string, context?: any) => Promise<void>;
    sendQuickCommand: (command: string, params?: any) => Promise<void>;
    sendTyping: (isTyping: boolean) => void;
};
export {};
