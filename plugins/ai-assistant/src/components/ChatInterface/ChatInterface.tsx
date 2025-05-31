import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
} from '@material-ui/core';
import {
  Send as SendIcon,
  Chat as BotIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useWebSocket } from '../hooks/useWebSocket';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80vh',
  },
  header: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
    maxHeight: '400px',
  },
  messageItem: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageContent: {
    maxWidth: '70%',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    wordBreak: 'break-word',
  },
  userMessageContent: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  assistantMessageContent: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
  },
  inputContainer: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    gap: theme.spacing(1),
  },
  quickCommands: {
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  typingIndicator: {
    padding: theme.spacing(1, 2),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  messageIcon: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  codeBlock: {
    margin: theme.spacing(1, 0),
    borderRadius: theme.spacing(1),
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
  },
  offlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
  },
}));

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'assistant' | 'system';
}

interface ChatInterfaceProps {
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const backendUrl = configApi.getOptionalString('backend.baseUrl') || 'http://localhost:7007';
  
  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    sendQuickCommand,
  } = useWebSocket(backendUrl, {
    onMessage: (message: Message) => {
      setMessages(prev => [...prev, message]);
      setIsLoading(false);
    },
    onTyping: (data: { user: string; isTyping: boolean }) => {
      setTypingUsers(prev => 
        data.isTyping 
          ? [...prev.filter(u => u !== data.user), data.user]
          : prev.filter(u => u !== data.user)
      );
    },
    onError: (error: string) => {
      setError(error);
      setIsLoading(false);
    },
  });

  const quickCommands = [
    { label: 'List Services', command: 'list_services' },
    { label: 'Recent Deployments', command: 'recent_deployments' },
    { label: 'Kubernetes Help', command: 'help_kubernetes' },
    { label: 'Search', command: 'search', needsInput: true },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      user: 'You',
      message: inputValue,
      timestamp: new Date(),
      type: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (isConnected) {
      sendWebSocketMessage(inputValue);
    } else {
      // Fallback to REST API
      try {
        const response = await fetch(`${backendUrl}/api/ai-assistant/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            context: {},
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

        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        setError('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    setInputValue('');
  };

  const handleQuickCommand = (command: string) => {
    if (isConnected) {
      sendQuickCommand(command);
      setIsLoading(true);
    } else {
      setError('WebSocket connection required for quick commands');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <ListItem
        key={message.id}
        className={`${classes.messageItem} ${isUser ? classes.userMessage : classes.assistantMessage}`}
      >
        {!isUser && (
          <Box className={classes.messageIcon}>
            {isSystem ? <SettingsIcon color="action" /> : <BotIcon color="primary" />}
          </Box>
        )}
        <Box
          className={`${classes.messageContent} ${
            isUser ? classes.userMessageContent : classes.assistantMessageContent
          }`}
        >
          {isUser ? (
            <Typography variant="body2">{message.message}</Typography>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow as any}
                      language={match[1]}
                      PreTag="div"
                      className={classes.codeBlock}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.message}
            </ReactMarkdown>
          )}
          <Typography variant="caption" color="textSecondary">
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        </Box>
        {isUser && (
          <Box className={classes.messageIcon}>
            <PersonIcon color="primary" />
          </Box>
        )}
      </ListItem>
    );
  };

  return (
    <Card className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6">AI DevOps Assistant</Typography>
        <Box className={classes.connectionStatus}>
          <Box className={isConnected ? classes.onlineIndicator : classes.offlineIndicator} />
          <Typography variant="caption">
            {isConnected ? 'Connected' : 'Offline'}
          </Typography>
          <IconButton size="small" onClick={clearChat}>
            <ClearIcon />
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box className={classes.chatContainer}>
        <List className={classes.messageList}>
          {messages.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Welcome to AI DevOps Assistant!"
                secondary="Ask me about services, deployments, commands, or anything else. Try the quick commands below to get started."
              />
            </ListItem>
          )}
          {messages.map(renderMessage)}
          {typingUsers.length > 0 && (
            <ListItem>
              <Typography className={classes.typingIndicator}>
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </Typography>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>

        <Divider />

        <Box className={classes.quickCommands}>
          {quickCommands.map((cmd) => (
            <Chip
              key={cmd.command}
              label={cmd.label}
              onClick={() => handleQuickCommand(cmd.command)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>

        <Box className={classes.inputContainer}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            variant="outlined"
            placeholder="Ask me anything about your infrastructure..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Card>
  );
}; 