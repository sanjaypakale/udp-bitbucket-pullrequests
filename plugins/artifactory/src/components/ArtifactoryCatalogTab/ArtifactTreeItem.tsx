import React, { useState, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@material-ui/core';
import {
  ExpandMore,
  ChevronRight,
  FolderOpen,
  Folder,
  InsertDriveFile,
} from '@material-ui/icons';
import { ArtifactTreeItemProps } from './types';
import { formatFileSize, getFileIconColor } from './utils';

// Recursive Tree Item Component
export const ArtifactTreeItem = memo<ArtifactTreeItemProps>(({ 
  node, 
  nodeId, 
  level = 0, 
  expandedNodes, 
  onToggleNode 
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);
  
  // Use external expanded state if provided, otherwise use local state
  const expanded = expandedNodes ? expandedNodes.has(nodeId) : localExpanded;
  
  const handleToggle = useCallback(() => {
    if (onToggleNode) {
      onToggleNode(nodeId);
    } else {
      setLocalExpanded(prev => !prev);
    }
  }, [nodeId, onToggleNode]);

  const children = Array.from(node.children.values());
  const hasChildren = children.length > 0;

  // File type detection for better icons
  const getFileIcon = (fileName: string) => {
    const iconStyle = { fontSize: 16 };
    const color = getFileIconColor(fileName);
    return <InsertDriveFile style={{ ...iconStyle, color }} />;
  };

  if (node.isFile) {
    return (
      <ListItem 
        style={{ 
          paddingLeft: level * 24 + 16, 
          paddingTop: 4, 
          paddingBottom: 4,
          paddingRight: 16,
          borderRadius: 4,
          margin: '1px 8px',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <ListItemIcon style={{ minWidth: 28 }}>
          {getFileIcon(node.name)}
        </ListItemIcon>
        <ListItemText 
          primary={
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography 
                variant="body2" 
                style={{ 
                  fontSize: '0.875rem',
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  color: '#424242'
                }}
              >
                {node.name}
              </Typography>
              {node.size && (
                <Chip 
                  label={formatFileSize(node.size)} 
                  size="small" 
                  style={{ 
                    height: 20, 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: '#e8f5e8',
                    color: '#2e7d32',
                    border: '1px solid #c8e6c9'
                  }} 
                />
              )}
            </Box>
          }
        />
      </ListItem>
    );
  }

  return (
    <>
      <ListItem 
        button 
        onClick={handleToggle}
        style={{ 
          paddingLeft: level * 24 + 16, 
          paddingTop: 6, 
          paddingBottom: 6,
          paddingRight: 16,
          borderRadius: 4,
          margin: '1px 8px',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f7ff';
          e.currentTarget.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0px)';
        }}
      >
        <ListItemIcon style={{ minWidth: 28 }}>
          {hasChildren ? (
            expanded ? (
              <FolderOpen style={{ fontSize: 18, color: '#ff8f00' }} />
            ) : (
              <Folder style={{ fontSize: 18, color: '#ffa726' }} />
            )
          ) : (
            <Folder style={{ fontSize: 18, color: '#ffcc02' }} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography 
                variant="body2" 
                style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  color: '#1565c0',
                  fontFamily: 'Monaco, "Lucida Console", monospace'
                }}
              >
                {node.name}
              </Typography>
              {hasChildren && (
                <Chip 
                  label={`${children.length} item${children.length !== 1 ? 's' : ''}`}
                  size="small" 
                  style={{ 
                    height: 20, 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: '#fff3e0',
                    color: '#ef6c00',
                    border: '1px solid #ffcc02'
                  }} 
                />
              )}
            </Box>
          }
        />
        {hasChildren && (
          <ListItemIcon style={{ minWidth: 24 }}>
            {expanded ? (
              <ExpandMore style={{ fontSize: 18, color: '#666', transition: 'transform 0.2s ease' }} />
            ) : (
              <ChevronRight style={{ fontSize: 18, color: '#666', transition: 'transform 0.2s ease' }} />
            )}
          </ListItemIcon>
        )}
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded} timeout={300} unmountOnExit>
          <List component="div" disablePadding style={{ paddingLeft: 0 }}>
            {children
              .sort((a, b) => {
                // Folders first, then files
                if (a.isFile !== b.isFile) {
                  return a.isFile ? 1 : -1;
                }
                return a.name.localeCompare(b.name);
              })
              .map((child, index) => (
                <ArtifactTreeItem
                  key={`${nodeId}-${child.name}`}
                  node={child}
                  nodeId={`${nodeId}-${child.name}`}
                  level={level + 1}
                  expandedNodes={expandedNodes}
                  onToggleNode={onToggleNode}
                />
              ))}
          </List>
        </Collapse>
      )}
    </>
  );
});

ArtifactTreeItem.displayName = 'ArtifactTreeItem'; 