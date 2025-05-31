import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Content,
  Header,
  Page,
  Table,
  TableColumn,
  Link,
  Progress,
  EmptyState,
} from '@backstage/core-components';
import {
  Grid,
  Card,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  IconButton,
  Tooltip,
  makeStyles,
  Select,
} from '@material-ui/core';
import {
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  Assignment as ComponentIcon,
} from '@material-ui/icons';
import {
  useApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { useAsync } from 'react-use';

const useStyles = makeStyles((theme) => ({
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  kindFilter: {
    minWidth: 240,
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1.5),
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      border: `1px solid ${theme.palette.divider}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
        borderColor: theme.palette.primary.light,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}20, 0 4px 8px rgba(0,0,0,0.12)`,
        borderColor: theme.palette.primary.main,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    },
    '& .MuiSelect-select': {
      padding: theme.spacing(1.5, 2),
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    '& .MuiSelect-icon': {
      color: theme.palette.text.secondary,
      transition: 'transform 0.2s ease-in-out',
    },
    '& .MuiSelect-select:focus + .MuiSelect-icon': {
      transform: 'rotate(180deg)',
    },
  },
  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1.5),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.08)',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
  },
  linkCell: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.dark,
    },
  },
  filterSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  filterIcon: {
    color: theme.palette.primary.main,
    fontSize: '1.25rem',
  },
  filterLabel: {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    letterSpacing: '0.02em',
  },
  entityCount: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1, 1.5),
    backgroundColor: theme.palette.primary.main + '08',
    borderRadius: theme.spacing(3),
    border: `1px solid ${theme.palette.primary.main}20`,
  },
}));

interface CatalogEntity extends Entity {
  metadata: {
    name: string;
    namespace?: string;
    description?: string;
    [key: string]: any;
  };
  spec?: {
    type?: string;
    system?: string;
    owner?: string;
    [key: string]: any;
  };
}

const KIND_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Component', value: 'component' },
  { label: 'API', value: 'api' },
  { label: 'System', value: 'system' },
  { label: 'Domain', value: 'domain' },
  { label: 'Resource', value: 'resource' },
  { label: 'Location', value: 'location' },
];

export const CustomCatalogPage = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  
  const [kindFilter, setKindFilter] = useState('component');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<string>('');
  const [userSystems, setUserSystems] = useState<string[]>([]);

  // Fetch current user and their systems
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const identity = await identityApi.getBackstageIdentity();
        setCurrentUser(identity.userEntityRef);
        
        // Fetch user's systems - this could be enhanced based on your specific logic
        const userEntities = await catalogApi.getEntities({
          filter: {
            'relations.ownedBy': identity.userEntityRef,
          },
        });
        
        const systems = userEntities.items
          .filter(entity => entity.spec?.system)
          .map(entity => entity.spec!.system!)
          .filter((system, index, arr) => arr.indexOf(system) === index); // unique systems
        
        setUserSystems(systems as string[]);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [identityApi, catalogApi]);

  // Fetch entities
  const { value: entities = [], loading, error } = useAsync(async () => {
    try {
      const filters: any = {};
      
      // Add kind filter if specified
      if (kindFilter) {
        filters.kind = kindFilter;
      }
      
      // Add system filter for specific systems
      filters['spec.system'] = ['dvx', 'dbb', 'egb'];
      
      const response = await catalogApi.getEntities({
        filter: filters,
      });
      return response.items as CatalogEntity[];
    } catch (err) {
      console.error('Error fetching entities:', err);
      throw err;
    }
  }, [kindFilter]);

  // Filter entities (systems are now filtered at API level)
  const filteredEntities = useMemo(() => {
    if (!entities) return [];
    
    // Entities are already filtered by systems at the API level
    // No additional filtering needed since we're getting specific systems from the API
    return entities;
  }, [entities]);

  // Toggle favorite
  const toggleFavorite = useCallback((entityRef: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(entityRef)) {
        newFavorites.delete(entityRef);
      } else {
        newFavorites.add(entityRef);
      }
      return newFavorites;
    });
  }, []);

  // Generate entity reference for URLs
  const getEntityRef = useCallback((entity: CatalogEntity) => {
    return `${entity.kind.toLowerCase()}:${entity.metadata.namespace || 'default'}/${entity.metadata.name}`;
  }, []);

  // Generate URLs for navigation
  const getNameUrl = useCallback((entity: CatalogEntity) => {
    return `/catalog/default/component/${entity.metadata.name}`;
  }, []);

  const getSystemUrl = useCallback((system: string) => {
    return `/catalog/default/system/${system}`;
  }, []);

  const getOwnerUrl = useCallback((owner: string) => {
    // Determine if owner is a group or user (simplified logic)
    const isGroup = owner.includes(':group/') || owner.startsWith('group:');
    const ownerType = isGroup ? 'group' : 'user';
    const ownerName = owner.includes('/') ? owner.split('/').pop() : owner.replace('group:', '').replace('user:', '');
    return `/catalog/default/${ownerType}/${ownerName}`;
  }, []);

  // Table columns definition
  const columns: TableColumn<CatalogEntity>[] = useMemo(() => [
    {
      title: 'Name',
      field: 'metadata.name',
      render: (entity: CatalogEntity) => (
        <Link
          to={getNameUrl(entity)}
          className={classes.linkCell}
        >
          {entity.metadata.name}
        </Link>
      ),
    },
    {
      title: 'System',
      field: 'spec.system',
      render: (entity: CatalogEntity) => {
        const system = entity.spec?.system;
        return system ? (
          <Link
            to={getSystemUrl(system)}
            className={classes.linkCell}
          >
            {system}
          </Link>
        ) : (
          <Typography variant="body2" color="textSecondary">
            —
          </Typography>
        );
      },
    },
    {
      title: 'Owner',
      field: 'spec.owner',
      render: (entity: CatalogEntity) => {
        const owner = entity.spec?.owner;
        return owner ? (
          <Link
            to={getOwnerUrl(owner)}
            className={classes.linkCell}
          >
            {owner}
          </Link>
        ) : (
          <Typography variant="body2" color="textSecondary">
            —
          </Typography>
        );
      },
    },
    {
      title: 'Type',
      field: 'spec.type',
      render: (entity: CatalogEntity) => (
        <Chip
          label={entity.spec?.type || entity.kind}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      title: 'Description',
      field: 'metadata.description',
      render: (entity: CatalogEntity) => (
        <Typography variant="body2" style={{ maxWidth: 300 }}>
          {entity.metadata.description || '—'}
        </Typography>
      ),
    },
    {
      title: 'Actions',
      field: 'actions',
      sorting: false,
      render: (entity: CatalogEntity) => {
        const entityRef = getEntityRef(entity);
        const isFavorite = favorites.has(entityRef);
        
        return (
          <Box className={classes.actionButtons}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => window.open(getNameUrl(entity), '_blank')}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={() => toggleFavorite(entityRef)}
                color={isFavorite ? 'secondary' : 'default'}
              >
                {isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ], [classes.linkCell, classes.actionButtons, favorites, getEntityRef, getNameUrl, getSystemUrl, getOwnerUrl, toggleFavorite]);

  if (loading) {
    return (
      <Page themeId="home">
        <Header title="Custom Catalog" />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="home">
        <Header title="Custom Catalog" />
        <Content>
          <Typography color="error">Error loading catalog: {error.message}</Typography>
        </Content>
      </Page>
    );
  }

  const hasActiveFilters = kindFilter !== 'component';

  return (
    <Page themeId="home">
      <Header 
        title="Catalog" 
        subtitle="Component catalog filtered by systems: dvx, dbb, egb" 
      />
      <Content>
        <Grid container spacing={2}>
          {/* Filter Section */}
          <Grid item xs={12}>
            <Box className={classes.filterSection}>
              <Box className={classes.filterWrapper}>
                <FilterIcon className={classes.filterIcon} />
                <FormControl className={classes.kindFilter}>
                  <InputLabel>Kind</InputLabel>
                  <Select
                    
                    value={kindFilter}
                    onChange={(e) => setKindFilter(e.target.value as string)}
                  >
                    {KIND_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
             
            </Box>
          </Grid>

          {/* Table Section */}
          <Grid item xs={12}>
            <Card className={classes.tableContainer}>
              {filteredEntities.length === 0 && !loading ? (
                <EmptyState
                  missing="content"
                  title="No components found"
                  description="No components are available in the catalog."
                />
              ) : (
                <Table
                  title={`All Components (${filteredEntities.length})`}
                  isLoading={loading}
                  options={{
                    search: true,
                    paging: filteredEntities.length >= 25,
                    pageSize: 25,
                    pageSizeOptions: [10, 25, 50, 100],
                    sorting: true,
                    filtering: false,
                    exportAllData: true,
                    actionsColumnIndex: -1,
                    toolbar: true,
                    header: true,
                    showTitle: true,
                    padding: 'dense',
                  }}
                  localization={{
                    pagination: {
                      labelDisplayedRows: '{from}-{to} of {count}',
                      labelRowsSelect: 'rows',
                    },
                    toolbar: {
                      searchTooltip: 'Search',
                      exportTitle: 'Export',
                      exportAriaLabel: 'Export',
                      exportCSVName: 'Export as CSV',
                    },
                    header: {
                      actions: 'Actions',
                    },
                    body: {
                      emptyDataSourceMessage: 'No components found',
                    },
                  }}
                  columns={columns}
                  data={filteredEntities}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}; 