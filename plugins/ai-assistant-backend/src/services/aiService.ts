import OpenAI from 'openai';
import { Logger } from 'winston';
import { CatalogApi } from '@backstage/catalog-client';

export interface AIServiceOptions {
  logger: Logger;
  catalogApi: CatalogApi;
  openaiApiKey?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface QueryContext {
  userId?: string;
  userEmail?: string;
  currentServices?: string[];
  recentDeployments?: string[];
}

export class AIService {
  private openai?: OpenAI;
  private logger: Logger;
  private catalogApi: CatalogApi;

  constructor(options: AIServiceOptions) {
    this.logger = options.logger;
    this.catalogApi = options.catalogApi;
    
    if (options.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: options.openaiApiKey,
      });
    }
  }

  async processNaturalLanguageQuery(
    query: string,
    context: QueryContext = {}
  ): Promise<string> {
    try {
      // First, try to understand the intent of the query
      const intent = await this.parseQueryIntent(query);
      
      switch (intent.type) {
        case 'service_list':
          return await this.handleServiceListQuery(intent, context);
        case 'deployment_info':
          return await this.handleDeploymentQuery(intent, context);
        case 'search':
          return await this.handleSearchQuery(intent, context);
        case 'command_help':
          return await this.handleCommandHelp(intent, context);
        case 'general':
        default:
          return await this.handleGeneralQuery(query, context);
      }
    } catch (error) {
      this.logger.error('Error processing natural language query', error);
      return 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.';
    }
  }

  private async parseQueryIntent(query: string): Promise<any> {
    const lowerQuery = query.toLowerCase();
    
    // Simple intent recognition - can be enhanced with ML models
    if (lowerQuery.includes('service') && (lowerQuery.includes('list') || lowerQuery.includes('show'))) {
      return { type: 'service_list', filters: this.extractFilters(query) };
    }
    
    if (lowerQuery.includes('deploy') || lowerQuery.includes('release')) {
      return { type: 'deployment_info', timeframe: this.extractTimeframe(query) };
    }
    
    if (lowerQuery.includes('search') || lowerQuery.includes('find')) {
      return { type: 'search', term: this.extractSearchTerm(query) };
    }
    
    if (lowerQuery.includes('command') || lowerQuery.includes('cli') || lowerQuery.includes('how to')) {
      return { type: 'command_help', topic: this.extractCommandTopic(query) };
    }
    
    return { type: 'general' };
  }

  private async handleServiceListQuery(intent: any, context: QueryContext): Promise<string> {
    try {
      const entities = await this.catalogApi.getEntities({
        filter: { kind: 'Component' },
      });

      let services = entities.items;
      
      // Apply filters based on intent
      if (intent.filters?.deployed && intent.filters?.timeframe) {
        // Filter by deployment time - this would need integration with your deployment system
        const timeFilter = this.parseTimeframe(intent.filters.timeframe);
        // In a real implementation, you'd query your deployment system here
      }

      const serviceList = services
        .slice(0, 10) // Limit to first 10 for better UX
        .map(service => {
          const name = service.metadata.name;
          const description = service.metadata.description || 'No description available';
          const owner = service.spec?.owner || 'Unknown';
          return `• **${name}** (${owner}): ${description}`;
        })
        .join('\n');

      return `Here are the services I found:\n\n${serviceList}\n\n${services.length > 10 ? `... and ${services.length - 10} more services.` : ''}`;
    } catch (error) {
      this.logger.error('Error fetching services', error);
      return 'I encountered an error while fetching the service list. Please check if the catalog is accessible.';
    }
  }

  private async handleDeploymentQuery(intent: any, context: QueryContext): Promise<string> {
    // This would integrate with your deployment system (e.g., Kubernetes, GitOps)
    // For now, providing a template response
    const timeframe = intent.timeframe || 'last week';
    
    return `Here are the deployments from ${timeframe}:

• **user-service** - Deployed 2 days ago by john.doe
• **api-gateway** - Deployed 5 days ago by jane.smith
• **payment-service** - Deployed 1 week ago by dev-team

For more detailed deployment information, you can use:
\`kubectl get deployments --since="${timeframe}"\`

Would you like me to show you the status of any specific service?`;
  }

  private async handleSearchQuery(intent: any, context: QueryContext): Promise<string> {
    const searchTerm = intent.term;
    
    if (!searchTerm) {
      return 'Please specify what you\'d like to search for. For example: "Search for authentication services" or "Find API documentation".';
    }

    try {
      // Search in catalog
      const entities = await this.catalogApi.getEntities({
        filter: {
          kind: ['Component', 'API', 'System'],
        },
      });

      const results = entities.items.filter(entity => 
        entity.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.metadata.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(entity.metadata.tags || []).toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (results.length === 0) {
        return `No results found for "${searchTerm}". Try using different keywords or check the spelling.`;
      }

      const resultList = results
        .slice(0, 5)
        .map(result => {
          const kind = result.kind;
          const name = result.metadata.name;
          const description = result.metadata.description || 'No description';
          return `• **${name}** (${kind}): ${description}`;
        })
        .join('\n');

      return `Found ${results.length} results for "${searchTerm}":\n\n${resultList}${results.length > 5 ? '\n\n...and more results available.' : ''}`;
    } catch (error) {
      this.logger.error('Error performing search', error);
      return 'I encountered an error while searching. Please try again later.';
    }
  }

  private async handleCommandHelp(intent: any, context: QueryContext): Promise<string> {
    const topic = intent.topic?.toLowerCase() || '';
    
    const commandHelp = {
      kubernetes: `**Kubernetes Commands:**
• \`kubectl get pods\` - List all pods
• \`kubectl logs <pod-name>\` - View pod logs
• \`kubectl describe pod <pod-name>\` - Get pod details
• \`kubectl port-forward <pod-name> <local-port>:<pod-port>\` - Port forward`,

      docker: `**Docker Commands:**
• \`docker ps\` - List running containers
• \`docker logs <container-id>\` - View container logs
• \`docker exec -it <container-id> /bin/bash\` - Access container shell
• \`docker build -t <image-name> .\` - Build image`,

      git: `**Git Commands:**
• \`git status\` - Check repository status
• \`git pull origin main\` - Pull latest changes
• \`git checkout -b <branch-name>\` - Create new branch
• \`git push origin <branch-name>\` - Push branch to remote`,

      deployment: `**Deployment Commands:**
• \`helm install <release-name> <chart>\` - Deploy with Helm
• \`kubectl apply -f <manifest.yaml>\` - Apply Kubernetes manifest
• \`terraform plan\` - Preview infrastructure changes
• \`terraform apply\` - Apply infrastructure changes`,
    };

    if (topic.includes('kubernetes') || topic.includes('k8s')) {
      return commandHelp.kubernetes;
    } else if (topic.includes('docker')) {
      return commandHelp.docker;
    } else if (topic.includes('git')) {
      return commandHelp.git;
    } else if (topic.includes('deploy')) {
      return commandHelp.deployment;
    }

    return `**Available Command Help Topics:**
• kubernetes/k8s - Container orchestration commands
• docker - Container management commands
• git - Version control commands
• deployment - Deployment and infrastructure commands

Ask me about any of these topics! For example: "Help me with Kubernetes commands"`;
  }

  private async handleGeneralQuery(query: string, context: QueryContext): Promise<string> {
    if (!this.openai) {
      return 'I can help you with service information, deployments, and command assistance. For AI-powered responses, please configure the OpenAI API key.';
    }

    try {
      const systemPrompt = `You are a helpful DevOps assistant for a Backstage developer portal. 
You help developers with:
- Finding and managing services in the software catalog
- Deployment information and history
- CLI commands and configurations
- Best practices for development and operations

Keep responses concise and practical. When suggesting commands, format them in code blocks.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      this.logger.error('Error calling OpenAI API', error);
      return 'I encountered an error processing your request with AI. Please try a more specific question about services, deployments, or commands.';
    }
  }

  private extractFilters(query: string): any {
    const filters: any = {};
    
    if (query.includes('deployed') && (query.includes('last week') || query.includes('recently'))) {
      filters.deployed = true;
      filters.timeframe = 'last week';
    }
    
    return filters;
  }

  private extractTimeframe(query: string): string {
    if (query.includes('last week')) return 'last week';
    if (query.includes('yesterday')) return 'yesterday';
    if (query.includes('today')) return 'today';
    if (query.includes('last month')) return 'last month';
    return 'recent';
  }

  private extractSearchTerm(query: string): string {
    // Simple extraction - can be improved with NLP
    const searchTermMatch = query.match(/(?:search|find)\s+(?:for\s+)?(.+)/i);
    return searchTermMatch?.[1]?.trim() || '';
  }

  private extractCommandTopic(query: string): string {
    const topicMatch = query.match(/(?:help|command|cli).*?(kubernetes|k8s|docker|git|deploy|helm)/i);
    return topicMatch?.[1] || '';
  }

  private parseTimeframe(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'yesterday':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'last week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'last month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }
} 