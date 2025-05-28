import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Link,
  Divider,
  List,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import {
  Storage,
  AccountTree,
  UnfoldMore,
  UnfoldLess,
  Delete,
} from '@material-ui/icons';
import { BuildCardProps, ArtifactNode } from './types';
import { formatFileSize, generateBuildUrl } from './utils';
import { ArtifactTreeItem } from './ArtifactTreeItem';

// Memoized Build Card Component
export const BuildCard = memo<BuildCardProps>(({ build, classes, onDelete }) => {
  const buildUrl = useMemo(() => generateBuildUrl(build), [build]);
  const rootChildren = Array.from(build.artifactTree.children.values());
  
  // State for managing expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Get all folder node IDs recursively
  const getAllFolderNodeIds = useCallback((node: ArtifactNode, nodeId: string, level: number = 0): string[] => {
    const folderIds: string[] = [];
    
    if (!node.isFile && node.children.size > 0) {
      folderIds.push(nodeId);
      
      Array.from(node.children.values()).forEach((child, index) => {
        const childNodeId = `${nodeId}-${child.name}`;
        folderIds.push(...getAllFolderNodeIds(child, childNodeId, level + 1));
      });
    }
    
    return folderIds;
  }, []);
  
  // Get all folder node IDs for this build
  const allFolderNodeIds = useMemo(() => {
    const allIds: string[] = [];
    rootChildren.forEach((child) => {
      const childNodeId = `${build.id}-${child.name}`;
      allIds.push(...getAllFolderNodeIds(child, childNodeId, 0));
    });
    return allIds;
  }, [rootChildren, build.id, getAllFolderNodeIds]);
  
  // Handle expand/collapse all toggle
  const handleToggleExpandAll = useCallback(() => {
    if (expandedNodes.size === 0) {
      // If nothing is expanded, expand all
      setExpandedNodes(new Set(allFolderNodeIds));
    } else {
      // If something is expanded, collapse all
      setExpandedNodes(new Set());
    }
  }, [allFolderNodeIds, expandedNodes.size]);
  
  // Determine if all folders are expanded
  const allExpanded = allFolderNodeIds.length > 0 && expandedNodes.size === allFolderNodeIds.length;
  const someExpanded = expandedNodes.size > 0;
  
  // Handle individual node toggle
  const handleToggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);
  
  // Handle delete button click
  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);
  
  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (onDelete) {
      onDelete(build);
    }
    setDeleteDialogOpen(false);
  }, [onDelete, build]);
  
  // Handle delete cancellation
  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);
  
  return (
    <>
      <Card className={classes.artifactCard} elevation={2}>
        <CardContent className={classes.cardContent}>
          {/* Card Header */}
          <Typography variant="h6" className={classes.artifactName}>
            {build.moduleName}: {build.buildNumber}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
            {build.branchType}/{build.branchName}
          </Typography>

          {/* Card Content - Hierarchical Artifacts Tree */}
          <Box style={{ marginBottom: 16 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ marginBottom: 12 }}>
              <Typography variant="subtitle2" style={{ fontWeight: 600, color: '#1976d2' }}>
                Artifacts ({build.artifactCount})
              </Typography>
              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                <Tooltip 
                  title={
                    allFolderNodeIds.length === 0 
                      ? "No folders to expand" 
                      : someExpanded 
                        ? "Collapse All Folders" 
                        : "Expand All Folders"
                  } 
                  arrow
                >
                  <IconButton 
                    size="small" 
                    style={{ padding: 4 }}
                    onClick={handleToggleExpandAll}
                    disabled={allFolderNodeIds.length === 0}
                  >
                    {someExpanded ? (
                      <UnfoldLess style={{ 
                        fontSize: 16, 
                        color: allFolderNodeIds.length === 0 ? '#ccc' : '#f44336',
                        transition: 'all 0.2s ease'
                      }} />
                    ) : (
                      <UnfoldMore style={{ 
                        fontSize: 16, 
                        color: allFolderNodeIds.length === 0 ? '#ccc' : '#4caf50',
                        transition: 'all 0.2s ease'
                      }} />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Click folders to expand/collapse" arrow>
                  <IconButton size="small" style={{ padding: 4 }}>
                    <AccountTree style={{ fontSize: 16, color: '#757575' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box 
              style={{ 
                maxHeight: 320, 
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                backgroundColor: '#fafafa',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {rootChildren.length > 0 ? (
                <List dense style={{ padding: '8px 0' }}>
                  {rootChildren
                    .sort((a, b) => {
                      // Folders first, then files
                      if (a.isFile !== b.isFile) {
                        return a.isFile ? 1 : -1;
                      }
                      return a.name.localeCompare(b.name);
                    })
                    .map((child) => (
                      <ArtifactTreeItem
                        key={`${build.id}-${child.name}`}
                        node={child}
                        nodeId={`${build.id}-${child.name}`}
                        level={0}
                        expandedNodes={expandedNodes}
                        onToggleNode={handleToggleNode}
                      />
                    ))}
                </List>
              ) : (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  style={{ 
                    height: 80,
                    color: '#9e9e9e',
                    fontStyle: 'italic'
                  }}
                >
                  <Typography variant="body2">
                    No artifacts found
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider style={{ margin: '16px 0', backgroundColor: '#e0e0e0' }} />

          {/* Metadata */}
          <Box className={classes.metadataRow} style={{ marginBottom: 8 }}>
            <AccountTree style={{ color: '#757575', marginRight: 8 }} />
            <Chip 
              label={build.repo} 
              size="small" 
              className={classes.repoChip}
              style={{
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                fontWeight: 500,
                border: '1px solid #bbdefb'
              }}
            />
          </Box>

          <Box className={classes.metadataRow}>
            <Storage style={{ color: '#757575', marginRight: 8 }} />
            <Chip 
              label={formatFileSize(build.totalSize)} 
              size="small" 
              className={classes.sizeChip}
              style={{
                backgroundColor: '#f3e5f5',
                color: '#7b1fa2',
                fontWeight: 500,
                border: '1px solid #ce93d8'
              }}
            />
          </Box>
        </CardContent>

        <CardActions className={classes.cardActions} style={{ padding: '8px 16px 16px', justifyContent: 'space-between' }}>
          {/* Delete Button - Left Side */}
          {onDelete && (
            <Tooltip title="Delete Build" arrow>
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                style={{
                  color: '#f44336',
                  border: '1px solid #f44336',
                  borderRadius: 4,
                  padding: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f44336';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#f44336';
                }}
              >
                <Delete style={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          
          {/* View in Artifactory Link - Right Side */}
          <Link
            href={buildUrl}
            target="_blank"
            rel="noopener noreferrer"
            
            style={{
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #1976d2',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1976d2';
            }}
          >
            View in Artifactory
          </Link>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" style={{ color: '#f44336' }}>
          Delete Build
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the build <strong>{build.moduleName}: {build.buildNumber}</strong>?
            <br />
            <br />
            This action will remove all {build.artifactCount} artifact{build.artifactCount !== 1 ? 's' : ''} 
            ({formatFileSize(build.totalSize)}) from the repository <strong>{build.repo}</strong>.
            <br />
            <br />
            <span style={{ color: '#f44336', fontWeight: 600 }}>This action cannot be undone.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: '8px 24px 16px' }}>
          <Button 
            onClick={handleDeleteCancel} 
            color="primary"
            variant="outlined"
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            style={{
              backgroundColor: '#f44336',
              color: 'white',
            }}
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

BuildCard.displayName = 'BuildCard'; 