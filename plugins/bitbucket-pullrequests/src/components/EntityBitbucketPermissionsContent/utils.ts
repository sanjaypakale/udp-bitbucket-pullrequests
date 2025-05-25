import { Entity } from '@backstage/catalog-model';

// Utility function to generate consistent colors based on name
export const generateAvatarColor = (name: string): string => {
  const colors = [
    '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', '#00796b', '#5d4037', '#455a64',
    '#e53935', '#fbc02d', '#512da8', '#00acc1', '#8bc34a', '#ff9800', '#9c27b0', '#607d8b',
    '#795548', '#009688', '#3f51b5', '#ff5722',
  ];
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Utility function to get user initials from display name
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Generate dummy users for testing
export const generateDummyUsers = (count: number) => {
  const users = [];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Mark', 'Anna', 'Tom', 'Kate', 'Paul', 'Susan', 'James', 'Mary', 'Steve', 'Linda', 'Alex', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    
    users.push({
      name: username,
      emailAddress: `${username}@example.com`,
      id: 100 + i,
      displayName: `${firstName} ${lastName}`,
      active: Math.random() > 0.1, // 90% active users
      slug: username,
      type: "NORMAL"
    });
  }
  return users;
};

// Utility function to extract Bitbucket project key and repository slug from entity annotations
export const extractBitbucketInfo = (entity: Entity): { projectKey?: string; repoSlug?: string } => {
  const sourceLocation = entity.metadata.annotations?.['backstage.io/source-location'];
  
  if (!sourceLocation || !sourceLocation.startsWith('url:')) {
    return { projectKey: undefined, repoSlug: undefined };
  }

  // Extract from url:https://bitbucket.example.com/projects/<projectname>/repos/<reponame>
  const url = sourceLocation.substring(4); // Remove 'url:' prefix
  
  // Extract the base URL (everything before /projects)
  const projectsIndex = url.indexOf('/projects/');
  if (projectsIndex <= 0) {
    return { projectKey: undefined, repoSlug: undefined };
  }
  
  // Extract project and repo from the URL pattern
  const matches = url.match(/projects\/([^\/]+)\/repos\/([^\/]+)/);
  if (matches && matches.length === 3) {
    return {
      projectKey: matches[1],
      repoSlug: matches[2]
    };
  }

  return { projectKey: undefined, repoSlug: undefined };
};

// Generic Bitbucket API utility function
export const fetchBitbucketAPI = async (
  backendBaseUrl: string,
  endpoint: string,
  projectKey?: string,
  repoSlug?: string,
  options: RequestInit = {}
): Promise<any> => {
  if (!projectKey || !repoSlug) {
    throw new Error('Project key and repository slug are required for Bitbucket API calls');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Construct the full API URL
  const url = `${backendBaseUrl}/rest/api/1.0/projects/${projectKey}/repos/${repoSlug}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`Bitbucket API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}; 