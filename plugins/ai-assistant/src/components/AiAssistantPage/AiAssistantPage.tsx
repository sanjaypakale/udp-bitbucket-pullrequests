import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Chat as BotIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
  Build as BuildIcon,
  Notifications as NotificationsIcon,
  Code as CodeIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { ChatInterface } from '../ChatInterface/ChatInterface';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  chatContainer: {
    height: '70vh',
  },
  featureCard: {
    height: '100%',
  },
  featureIcon: {
    color: theme.palette.primary.main,
  },
  quickStart: {
    marginTop: theme.spacing(2),
  },
  exampleChip: {
    margin: theme.spacing(0.5),
  },
}));

export const AiAssistantPage: React.FC = () => {
  const classes = useStyles();

  const features = [
    {
      icon: <ChatIcon className={classes.featureIcon} />,
      title: 'Natural Language Queries',
      description: 'Ask questions in plain English about your infrastructure, services, and deployments.',
      examples: ['Show me all services deployed last week', 'What services are owned by team-alpha?'],
    },
    {
      icon: <SearchIcon className={classes.featureIcon} />,
      title: 'Smart Search',
      description: 'Find services, APIs, and documentation using intelligent semantic search.',
      examples: ['Search for authentication services', 'Find API documentation'],
    },
    {
      icon: <BuildIcon className={classes.featureIcon} />,
      title: 'Command Assistance',
      description: 'Get help with CLI commands, configurations, and best practices.',
      examples: ['Help me with Kubernetes commands', 'Show me Docker best practices'],
    },
    {
      icon: <NotificationsIcon className={classes.featureIcon} />,
      title: 'Intelligent Notifications',
      description: 'Receive context-aware notifications about deployments, incidents, and changes.',
      examples: ['Deployment notifications', 'Incident alerts', 'PR review requests'],
    },
  ];

  return (
    <Page themeId="tool">
      <Header title="AI DevOps Assistant" subtitle="Your intelligent companion for development and operations">
        <SupportButton>
          Get help with the AI Assistant, including setup instructions and usage examples.
        </SupportButton>
      </Header>
      <Content>
        <ContentHeader title="Chat with AI Assistant">
          <Typography variant="body1">
            Ask questions about your infrastructure, get command help, search for services, and more.
            The AI assistant is integrated with your Backstage catalog and can provide intelligent responses
            about your development environment.
          </Typography>
        </ContentHeader>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className={classes.chatContainer}>
              <CardContent style={{ height: '100%', padding: 0 }}>
                <ChatInterface />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Card className={classes.featureCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        {feature.icon}
                        <Typography variant="h6" style={{ marginLeft: 8 }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {feature.description}
                      </Typography>
                      <Box>
                        {feature.examples.map((example, exampleIndex) => (
                          <Chip
                            key={exampleIndex}
                            label={example}
                            size="small"
                            variant="outlined"
                            className={classes.exampleChip}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <CodeIcon className={classes.featureIcon} style={{ marginRight: 8 }} />
                      Quick Commands
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <BotIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="List Services"
                          secondary="Get a list of all services in your catalog"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <BotIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Recent Deployments"
                          secondary="Show deployments from the last week"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <BotIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Kubernetes Help"
                          secondary="Get help with kubectl commands"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}; 