import React, { useState, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ArtifactoryCatalogTab } from './ArtifactoryCatalogTab';
import { ArtifactoryArtifact } from '../../types';

// Mock API service - replace with actual API implementation
const mockArtifacts: ArtifactoryArtifact[] = [
  {
    name: 'application.jar',
    path: '/com/example/application/1.0.0/application-1.0.0.jar',
    repo: 'libs-release-local',
    size: 15728640, // 15MB
    created: '2024-01-15T10:30:00Z',
    modified: '2024-01-15T10:30:00Z',
    updated: '2024-01-15T10:30:00Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    md5: '5d41402abc4b2a76b9719d911017c592',
  },
  {
    name: 'application-sources.jar',
    path: '/com/example/application/1.0.0/application-1.0.0-sources.jar',
    repo: 'libs-release-local',
    size: 8388608, // 8MB
    created: '2024-01-15T10:30:15Z',
    modified: '2024-01-15T10:30:15Z',
    updated: '2024-01-15T10:30:15Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: 'b94a8fe5ccb19ba61c4c0873d391e987982fbbd4',
    md5: '6d41402abc4b2a76b9719d911017c593',
  },
  {
    name: 'docker-image.tar',
    path: '/docker/example/application/latest/docker-image.tar',
    repo: 'docker-local',
    size: 104857600, // 100MB
    created: '2024-01-16T08:45:00Z',
    modified: '2024-01-16T08:45:00Z',
    updated: '2024-01-16T08:45:00Z',
    createdBy: 'docker-builder',
    modifiedBy: 'docker-builder',
    updatedBy: 'docker-builder',
    sha1: 'c94a8fe5ccb19ba61c4c0873d391e987982fbbd5',
    md5: '7d41402abc4b2a76b9719d911017c594',
  },
  {
    name: 'frontend-app.zip',
    path: '/npm/frontend/app/2.1.0/frontend-app-2.1.0.zip',
    repo: 'npm-local',
    size: 52428800, // 50MB
    created: '2024-01-14T14:20:00Z',
    modified: '2024-01-14T14:20:00Z',
    updated: '2024-01-14T14:20:00Z',
    createdBy: 'npm-publisher',
    modifiedBy: 'npm-publisher',
    updatedBy: 'npm-publisher',
    sha1: 'd94a8fe5ccb19ba61c4c0873d391e987982fbbd6',
    md5: '8d41402abc4b2a76b9719d911017c595',
  },
  {
    name: 'api-documentation.pdf',
    path: '/docs/api/v1/api-documentation-v1.2.pdf',
    repo: 'docs-local',
    size: 2097152, // 2MB
    created: '2024-01-13T09:15:00Z',
    modified: '2024-01-13T09:15:00Z',
    updated: '2024-01-13T09:15:00Z',
    createdBy: 'doc-generator',
    modifiedBy: 'doc-generator',
    updatedBy: 'doc-generator',
    sha1: 'e94a8fe5ccb19ba61c4c0873d391e987982fbbd7',
    md5: '9d41402abc4b2a76b9719d911017c596',
  },
  {
    name: 'microservice-auth.jar',
    path: '/com/company/auth/microservice/3.2.1/microservice-auth-3.2.1.jar',
    repo: 'libs-release-local',
    size: 18874368, // 18MB
    created: '2024-01-12T16:45:00Z',
    modified: '2024-01-12T16:45:00Z',
    updated: '2024-01-12T16:45:00Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: 'f94a8fe5ccb19ba61c4c0873d391e987982fbbd8',
    md5: 'ad41402abc4b2a76b9719d911017c597',
  },
  {
    name: 'database-migration.sql',
    path: '/db/migrations/v2024.01/database-migration-202401.sql',
    repo: 'scripts-local',
    size: 524288, // 512KB
    created: '2024-01-11T11:30:00Z',
    modified: '2024-01-11T11:30:00Z',
    updated: '2024-01-11T11:30:00Z',
    createdBy: 'dba-team',
    modifiedBy: 'dba-team',
    updatedBy: 'dba-team',
    sha1: '194a8fe5ccb19ba61c4c0873d391e987982fbbd9',
    md5: 'bd41402abc4b2a76b9719d911017c598',
  },
  {
    name: 'monitoring-dashboard.war',
    path: '/war/monitoring/dashboard/1.5.0/monitoring-dashboard-1.5.0.war',
    repo: 'libs-release-local',
    size: 31457280, // 30MB
    created: '2024-01-10T13:20:00Z',
    modified: '2024-01-10T13:20:00Z',
    updated: '2024-01-10T13:20:00Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: '294a8fe5ccb19ba61c4c0873d391e987982fbbda',
    md5: 'cd41402abc4b2a76b9719d911017c599',
  },
  {
    name: 'config-templates.tar.gz',
    path: '/configs/templates/prod/config-templates-2024.01.tar.gz',
    repo: 'config-local',
    size: 1048576, // 1MB
    created: '2024-01-09T08:10:00Z',
    modified: '2024-01-09T08:10:00Z',
    updated: '2024-01-09T08:10:00Z',
    createdBy: 'devops-team',
    modifiedBy: 'devops-team',
    updatedBy: 'devops-team',
    sha1: '394a8fe5ccb19ba61c4c0873d391e987982fbbdb',
    md5: 'dd41402abc4b2a76b9719d911017c59a',
  },
  {
    name: 'python-package.whl',
    path: '/python/packages/ml-toolkit/2.3.0/ml-toolkit-2.3.0.whl',
    repo: 'pypi-local',
    size: 12582912, // 12MB
    created: '2024-01-08T15:40:00Z',
    modified: '2024-01-08T15:40:00Z',
    updated: '2024-01-08T15:40:00Z',
    createdBy: 'ml-team',
    modifiedBy: 'ml-team',
    updatedBy: 'ml-team',
    sha1: '494a8fe5ccb19ba61c4c0873d391e987982fbbdc',
    md5: 'ed41402abc4b2a76b9719d911017c59b',
  },
  {
    name: 'helm-chart.tgz',
    path: '/helm/charts/webapp/v1.2.3/webapp-1.2.3.tgz',
    repo: 'helm-local',
    size: 2621440, // 2.5MB
    created: '2024-01-07T12:25:00Z',
    modified: '2024-01-07T12:25:00Z',
    updated: '2024-01-07T12:25:00Z',
    createdBy: 'k8s-team',
    modifiedBy: 'k8s-team',
    updatedBy: 'k8s-team',
    sha1: '594a8fe5ccb19ba61c4c0873d391e987982fbbdd',
    md5: 'fd41402abc4b2a76b9719d911017c59c',
  },
  {
    name: 'test-data.json',
    path: '/test/data/scenarios/test-data-v3.json',
    repo: 'test-local',
    size: 204800, // 200KB
    created: '2024-01-06T10:15:00Z',
    modified: '2024-01-06T10:15:00Z',
    updated: '2024-01-06T10:15:00Z',
    createdBy: 'qa-team',
    modifiedBy: 'qa-team',
    updatedBy: 'qa-team',
    sha1: '694a8fe5ccb19ba61c4c0873d391e987982fbbde',
    md5: '1e41402abc4b2a76b9719d911017c59d',
  },
  {
    name: 'security-scanner.jar',
    path: '/tools/security/scanner/4.1.0/security-scanner-4.1.0.jar',
    repo: 'tools-local',
    size: 25165824, // 24MB
    created: '2024-01-05T14:30:00Z',
    modified: '2024-01-05T14:30:00Z',
    updated: '2024-01-05T14:30:00Z',
    createdBy: 'security-team',
    modifiedBy: 'security-team',
    updatedBy: 'security-team',
    sha1: '794a8fe5ccb19ba61c4c0873d391e987982fbbdf',
    md5: '2e41402abc4b2a76b9719d911017c59e',
  },
  {
    name: 'mobile-app.ipa',
    path: '/mobile/ios/app/2.0.1/mobile-app-2.0.1.ipa',
    repo: 'mobile-local',
    size: 67108864, // 64MB
    created: '2024-01-04T16:20:00Z',
    modified: '2024-01-04T16:20:00Z',
    updated: '2024-01-04T16:20:00Z',
    createdBy: 'mobile-team',
    modifiedBy: 'mobile-team',
    updatedBy: 'mobile-team',
    sha1: '894a8fe5ccb19ba61c4c0873d391e987982fbbe0',
    md5: '3e41402abc4b2a76b9719d911017c59f',
  },
  {
    name: 'backup-script.sh',
    path: '/scripts/backup/daily-backup.sh',
    repo: 'scripts-local',
    size: 4096, // 4KB
    created: '2024-01-03T07:00:00Z',
    modified: '2024-01-03T07:00:00Z',
    updated: '2024-01-03T07:00:00Z',
    createdBy: 'ops-team',
    modifiedBy: 'ops-team',
    updatedBy: 'ops-team',
    sha1: '994a8fe5ccb19ba61c4c0873d391e987982fbbe1',
    md5: '4e41402abc4b2a76b9719d911017c5a0',
  },
  // Add more artifacts to demonstrate pagination
  {
    name: 'analytics-service.jar',
    path: '/com/analytics/service/1.8.2/analytics-service-1.8.2.jar',
    repo: 'libs-release-local',
    size: 22020096, // 21MB
    created: '2024-01-02T11:45:00Z',
    modified: '2024-01-02T11:45:00Z',
    updated: '2024-01-02T11:45:00Z',
    createdBy: 'jenkins',
    modifiedBy: 'jenkins',
    updatedBy: 'jenkins',
    sha1: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbe2',
    md5: '5e41402abc4b2a76b9719d911017c5a1',
  },
  {
    name: 'ui-components.npm',
    path: '/npm/ui/components/3.4.1/ui-components-3.4.1.npm',
    repo: 'npm-local',
    size: 8912896, // 8.5MB
    created: '2024-01-01T09:30:00Z',
    modified: '2024-01-01T09:30:00Z',
    updated: '2024-01-01T09:30:00Z',
    createdBy: 'frontend-team',
    modifiedBy: 'frontend-team',
    updatedBy: 'frontend-team',
    sha1: 'b94a8fe5ccb19ba61c4c0873d391e987982fbbe3',
    md5: '6e41402abc4b2a76b9719d911017c5a2',
  },
  {
    name: 'load-test-scripts.zip',
    path: '/test/performance/load-test-scripts-v2.zip',
    repo: 'test-local',
    size: 15728640, // 15MB
    created: '2023-12-31T14:15:00Z',
    modified: '2023-12-31T14:15:00Z',
    updated: '2023-12-31T14:15:00Z',
    createdBy: 'performance-team',
    modifiedBy: 'performance-team',
    updatedBy: 'performance-team',
    sha1: 'c94a8fe5ccb19ba61c4c0873d391e987982fbbe4',
    md5: '7e41402abc4b2a76b9719d911017c5a3',
  },
];

// Mock API function - replace with actual API call
const fetchArtifacts = async (entityName: string): Promise<ArtifactoryArtifact[]> => {
  // Simulate API delay - increased to better show skeleton loading
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, you would make an API call to your Artifactory instance
  // filtering by the entity name or other criteria
  return mockArtifacts;
};

export const ArtifactoryCatalogTabContainer: React.FC = () => {
  const { entity } = useEntity();
  const [artifacts, setArtifacts] = useState<ArtifactoryArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        setLoading(true);
        setError(undefined);
        
        // Use entity metadata to determine which artifacts to fetch
        const entityName = entity.metadata.name;
        const artifacts = await fetchArtifacts(entityName);
        
        setArtifacts(artifacts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch artifacts'));
      } finally {
        setLoading(false);
      }
    };

    loadArtifacts();
  }, [entity]);

  return (
    <ArtifactoryCatalogTab
      artifacts={artifacts}
      loading={loading}
      error={error}
    />
  );
}; 