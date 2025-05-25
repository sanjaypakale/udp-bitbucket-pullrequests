import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ArtifactoryCatalogTab } from './ArtifactoryCatalogTab';
import { useArtifactoryObjects } from '../../hooks/useArtifactoryPlugin';

export const ArtifactoryCatalogTabContainer: React.FC = () => {
  const { entity } = useEntity();
  const { artifacts, loading, error } = useArtifactoryObjects(entity);

  return (
    <ArtifactoryCatalogTab
      artifacts={artifacts}
      loading={loading}
      error={error ? new Error('Failed to fetch artifacts') : undefined}
    />
  );
}; 