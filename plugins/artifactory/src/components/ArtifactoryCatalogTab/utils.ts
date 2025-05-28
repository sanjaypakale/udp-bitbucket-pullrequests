import { Artifact } from '../../api';
import { ArtifactNode, BuildGroup, ParsedPath } from './types';

// Memoized utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

// Optimized path parsing with caching
const pathCache = new Map<string, ParsedPath | null>();

export const parsePath = (path: string): ParsedPath | null => {
  if (pathCache.has(path)) {
    return pathCache.get(path)!;
  }

  const parts = path.split('/');
  if (parts.length >= 4) {
    const artifactPath = parts.slice(4).join('/');
    const artifactName = parts[parts.length - 1];
    
    const result: ParsedPath = {
      moduleName: parts[0],
      branchType: parts[1],
      branchName: parts[2],
      buildNumber: parts[3],
      artifactPath,
      artifactName,
    };
    pathCache.set(path, result);
    return result;
  }
  
  pathCache.set(path, null);
  return null;
};

// Build hierarchical tree structure for artifacts
export const buildArtifactTree = (artifacts: Artifact[]): ArtifactNode => {
  const root: ArtifactNode = {
    name: 'root',
    fullPath: '',
    isFile: false,
    children: new Map(),
  };

  artifacts.forEach(artifact => {
    const pathInfo = parsePath(artifact.path);
    if (pathInfo && pathInfo.artifactPath) {
      const pathParts = pathInfo.artifactPath.split('/');
      let currentNode = root;

      // Navigate/create folder structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        if (!currentNode.children.has(folderName)) {
          currentNode.children.set(folderName, {
            name: folderName,
            fullPath: pathParts.slice(0, i + 1).join('/'),
            isFile: false,
            children: new Map(),
          });
        }
        currentNode = currentNode.children.get(folderName)!;
      }

      // Add the file
      const fileName = pathParts[pathParts.length - 1];
      currentNode.children.set(fileName, {
        name: fileName,
        fullPath: pathInfo.artifactPath,
        isFile: true,
        size: artifact.size,
        created: artifact.created,
        children: new Map(),
        artifact,
      });
    }
  });

  return root;
};

export const generateBuildUrl = (build: BuildGroup): string => {
  const basePath = `${build.moduleName}/${build.branchType}/${build.branchName}/${build.buildNumber}`;
  return `https://your-artifactory.com/ui/repos/tree/General/${build.repo}/${basePath}`;
};

// File type detection for better icons
export const getFileIconColor = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'jar':
    case 'war':
      return '#f57c00';
    case 'zip':
    case 'tar':
    case 'gz':
      return '#9c27b0';
    case 'yml':
    case 'yaml':
    case 'json':
    case 'properties':
    case 'conf':
      return '#2196f3';
    case 'sql':
      return '#4caf50';
    case 'js':
    case 'css':
      return '#ff9800';
    case 'pdf':
      return '#f44336';
    case 'md':
      return '#607d8b';
    case 'sh':
      return '#795548';
    default:
      return '#757575';
  }
};

// Get all files from artifact tree
export const getAllFiles = (node: ArtifactNode): ArtifactNode[] => {
  let files: ArtifactNode[] = [];
  if (node.isFile) {
    files.push(node);
  } else {
    for (const child of node.children.values()) {
      files = files.concat(getAllFiles(child));
    }
  }
  return files;
}; 