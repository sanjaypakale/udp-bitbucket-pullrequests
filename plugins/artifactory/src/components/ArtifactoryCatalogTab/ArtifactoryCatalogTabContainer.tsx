import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ArtifactoryCatalogTab } from './ArtifactoryCatalogTab';
import { Artifact } from '../../api';

// Complex sample data with nested folder structures for testing
const sampleArtifacts: Artifact[] = [
  // Payment Service Build 1023 - Complex structure
  {
    "name": "payment-service-1.0.0.jar",
    "path": "payment/feature/feature-user-auth/1023/binaries/services",
    "repo": "libs-release-local",
    "size": 2456789,
    "created": "2025-05-27T08:15:00.000Z",
    "modified": "2025-05-27T08:45:00.000Z",
    "updated": "2025-05-27T08:45:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "e9b1c9e1d8e1234567890abcdef1234567890abcd",
    "md5": "7c6a180b36896a0a8c02787eeafb0e4c"
  },
  {
    "name": "auth-lib-2.1.0.jar",
    "path": "payment/feature/feature-user-auth/1023/binaries/libs/auth",
    "repo": "libs-release-local",
    "size": 1234567,
    "created": "2025-05-27T08:16:00.000Z",
    "modified": "2025-05-27T08:46:00.000Z",
    "updated": "2025-05-27T08:46:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "1c9e1d8e1234567890abcdef1234567890abcde9b",
    "md5": "8f14e45fceea167a5a36dedd4bea2543"
  },
  {
    "name": "crypto-utils-1.5.2.jar",
    "path": "payment/feature/feature-user-auth/1023/binaries/libs/crypto",
    "repo": "libs-release-local",
    "size": 876543,
    "created": "2025-05-27T08:17:00.000Z",
    "modified": "2025-05-27T08:47:00.000Z",
    "updated": "2025-05-27T08:47:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "abc1234def5678ghijklmnopqrstuvwxyzaaaa111",
    "md5": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "name": "database-connector-3.0.1.jar",
    "path": "payment/feature/feature-user-auth/1023/binaries/libs/database",
    "repo": "libs-release-local",
    "size": 654321,
    "created": "2025-05-27T08:18:00.000Z",
    "modified": "2025-05-27T08:48:00.000Z",
    "updated": "2025-05-27T08:48:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "def5678abc1234ghijklmnopqrstuvwxyzaaaa222",
    "md5": "e41d8cd98f00b204e9800998ecf8427f"
  },
  {
    "name": "application.yml",
    "path": "payment/feature/feature-user-auth/1023/configs/application",
    "repo": "libs-release-local",
    "size": 4567,
    "created": "2025-05-27T08:19:00.000Z",
    "modified": "2025-05-27T08:49:00.000Z",
    "updated": "2025-05-27T08:49:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "ghi9012jkl3456mnopqrstuvwxyzaaaa333bbbccc",
    "md5": "f41d8cd98f00b204e9800998ecf8427g"
  },
  {
    "name": "database.properties",
    "path": "payment/feature/feature-user-auth/1023/configs/database",
    "repo": "libs-release-local",
    "size": 2345,
    "created": "2025-05-27T08:20:00.000Z",
    "modified": "2025-05-27T08:50:00.000Z",
    "updated": "2025-05-27T08:50:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "jkl3456mno9012pqrstuvwxyzaaaa444bbbcccddd",
    "md5": "g41d8cd98f00b204e9800998ecf8427h"
  },
  {
    "name": "security.conf",
    "path": "payment/feature/feature-user-auth/1023/configs/security",
    "repo": "libs-release-local",
    "size": 3456,
    "created": "2025-05-27T08:21:00.000Z",
    "modified": "2025-05-27T08:51:00.000Z",
    "updated": "2025-05-27T08:51:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "mno9012pqr3456stuvwxyzaaaa555bbbcccdddee",
    "md5": "h41d8cd98f00b204e9800998ecf8427i"
  },
  {
    "name": "deploy.sh",
    "path": "payment/feature/feature-user-auth/1023/scripts/deployment",
    "repo": "libs-release-local",
    "size": 1234,
    "created": "2025-05-27T08:22:00.000Z",
    "modified": "2025-05-27T08:52:00.000Z",
    "updated": "2025-05-27T08:52:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "pqr3456stu9012vwxyzaaaa666bbbcccdddeeefff",
    "md5": "i41d8cd98f00b204e9800998ecf8427j"
  },
  {
    "name": "rollback.sh",
    "path": "payment/feature/feature-user-auth/1023/scripts/deployment",
    "repo": "libs-release-local",
    "size": 987,
    "created": "2025-05-27T08:23:00.000Z",
    "modified": "2025-05-27T08:53:00.000Z",
    "updated": "2025-05-27T08:53:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "stu9012vwx3456yzaaaa777bbbcccdddeeefff000",
    "md5": "j41d8cd98f00b204e9800998ecf8427k"
  },
  {
    "name": "README.md",
    "path": "payment/feature/feature-user-auth/1023/docs",
    "repo": "libs-release-local",
    "size": 5678,
    "created": "2025-05-27T08:24:00.000Z",
    "modified": "2025-05-27T08:54:00.000Z",
    "updated": "2025-05-27T08:54:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "vwx3456yza9012aaaa888bbbcccdddeeefff000111",
    "md5": "k41d8cd98f00b204e9800998ecf8427l"
  },
  {
    "name": "API_GUIDE.pdf",
    "path": "payment/feature/feature-user-auth/1023/docs/api",
    "repo": "libs-release-local",
    "size": 1567890,
    "created": "2025-05-27T08:25:00.000Z",
    "modified": "2025-05-27T08:55:00.000Z",
    "updated": "2025-05-27T08:55:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "yza9012aaa3456bbb999cccdddeeefff000111222",
    "md5": "l41d8cd98f00b204e9800998ecf8427m"
  },

  // Analytics Service Build 201 - Different structure
  {
    "name": "analytics-engine.zip",
    "path": "analytics/hotfix/hotfix-login-crash/201/dist",
    "repo": "libs-snapshot-local",
    "size": 15678901,
    "created": "2025-05-25T10:00:00.000Z",
    "modified": "2025-05-25T10:20:00.000Z",
    "updated": "2025-05-25T10:20:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "aaa3456bbb9012ccc000dddeeefffggg111222333",
    "md5": "m41d8cd98f00b204e9800998ecf8427n"
  },
  {
    "name": "reporting-lib-2.1.0.jar",
    "path": "analytics/hotfix/hotfix-login-crash/201/libs/reporting",
    "repo": "libs-snapshot-local",
    "size": 3456789,
    "created": "2025-05-25T10:01:00.000Z",
    "modified": "2025-05-25T10:21:00.000Z",
    "updated": "2025-05-25T10:21:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "bbb9012ccc3456ddd111eeefff000ggg222333444",
    "md5": "n41d8cd98f00b204e9800998ecf8427o"
  },
  {
    "name": "metrics-collector-1.8.3.jar",
    "path": "analytics/hotfix/hotfix-login-crash/201/libs/metrics",
    "repo": "libs-snapshot-local",
    "size": 2345678,
    "created": "2025-05-25T10:02:00.000Z",
    "modified": "2025-05-25T10:22:00.000Z",
    "updated": "2025-05-25T10:22:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "ccc3456ddd9012eee222fff111ggg333444555666",
    "md5": "o41d8cd98f00b204e9800998ecf8427p"
  },
  {
    "name": "dashboard.tar.gz",
    "path": "analytics/hotfix/hotfix-login-crash/201/frontend/dashboard",
    "repo": "libs-snapshot-local",
    "size": 8901234,
    "created": "2025-05-25T10:03:00.000Z",
    "modified": "2025-05-25T10:23:00.000Z",
    "updated": "2025-05-25T10:23:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "ddd9012eee3456fff333ggg222444555666777888",
    "md5": "p41d8cd98f00b204e9800998ecf8427q"
  },
  {
    "name": "widgets.js",
    "path": "analytics/hotfix/hotfix-login-crash/201/frontend/assets/js",
    "repo": "libs-snapshot-local",
    "size": 123456,
    "created": "2025-05-25T10:04:00.000Z",
    "modified": "2025-05-25T10:24:00.000Z",
    "updated": "2025-05-25T10:24:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "eee3456fff9012ggg444hhh333555666777888999",
    "md5": "q41d8cd98f00b204e9800998ecf8427r"
  },
  {
    "name": "styles.css",
    "path": "analytics/hotfix/hotfix-login-crash/201/frontend/assets/css",
    "repo": "libs-snapshot-local",
    "size": 67890,
    "created": "2025-05-25T10:05:00.000Z",
    "modified": "2025-05-25T10:25:00.000Z",
    "updated": "2025-05-25T10:25:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "fff9012ggg3456hhh555iii444666777888999aaa",
    "md5": "r41d8cd98f00b204e9800998ecf8427s"
  },

  // User Management Service Build 567 - Another complex structure
  {
    "name": "user-service-core.jar",
    "path": "user-management/release/release-v2.0/567/services/core",
    "repo": "libs-release-local",
    "size": 4567890,
    "created": "2025-05-26T14:30:00.000Z",
    "modified": "2025-05-26T15:00:00.000Z",
    "updated": "2025-05-26T15:00:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "ggg3456hhh9012iii666jjj555777888999aaabbb",
    "md5": "s41d8cd98f00b204e9800998ecf8427t"
  },
  {
    "name": "user-service-api.jar",
    "path": "user-management/release/release-v2.0/567/services/api",
    "repo": "libs-release-local",
    "size": 1890123,
    "created": "2025-05-26T14:31:00.000Z",
    "modified": "2025-05-26T15:01:00.000Z",
    "updated": "2025-05-26T15:01:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "hhh9012iii3456jjj777kkk666888999aaabbbccc",
    "md5": "t41d8cd98f00b204e9800998ecf8427u"
  },
  {
    "name": "validation-rules.json",
    "path": "user-management/release/release-v2.0/567/config/validation",
    "repo": "libs-release-local",
    "size": 12345,
    "created": "2025-05-26T14:32:00.000Z",
    "modified": "2025-05-26T15:02:00.000Z",
    "updated": "2025-05-26T15:02:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "iii3456jjj9012kkk888lll777999aaabbbcccdd",
    "md5": "u41d8cd98f00b204e9800998ecf8427v"
  },
  {
    "name": "email-templates.zip",
    "path": "user-management/release/release-v2.0/567/resources/templates/email",
    "repo": "libs-release-local",
    "size": 567890,
    "created": "2025-05-26T14:33:00.000Z",
    "modified": "2025-05-26T15:03:00.000Z",
    "updated": "2025-05-26T15:03:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "jjj9012kkk3456lll999mmm888aaabbbcccdddeee",
    "md5": "v41d8cd98f00b204e9800998ecf8427w"
  },
  {
    "name": "migration-v2.0.sql",
    "path": "user-management/release/release-v2.0/567/database/migrations/v2.0",
    "repo": "libs-release-local",
    "size": 89012,
    "created": "2025-05-26T14:34:00.000Z",
    "modified": "2025-05-26T15:04:00.000Z",
    "updated": "2025-05-26T15:04:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "kkk3456lll9012mmm000nnn999bbbcccdddeeefffg",
    "md5": "w41d8cd98f00b204e9800998ecf8427x"
  },
  {
    "name": "test-data.sql",
    "path": "user-management/release/release-v2.0/567/database/test-data",
    "repo": "libs-release-local",
    "size": 234567,
    "created": "2025-05-26T14:35:00.000Z",
    "modified": "2025-05-26T15:05:00.000Z",
    "updated": "2025-05-26T15:05:00.000Z",
    "createdBy": "release-bot",
    "modifiedBy": "release-bot",
    "updatedBy": "release-bot",
    "sha1": "lll9012mmm3456nnn111ooo000cccdddeeefffggg",
    "md5": "x41d8cd98f00b204e9800998ecf8427y"
  },

  // Notification Service Build 89 - Microservice structure
  {
    "name": "notification-service.war",
    "path": "notification/bugfix/bugfix-email-retry/89/webapp",
    "repo": "libs-snapshot-local",
    "size": 12345678,
    "created": "2025-05-24T16:45:00.000Z",
    "modified": "2025-05-24T17:15:00.000Z",
    "updated": "2025-05-24T17:15:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "mmm3456nnn9012ooo222ppp111dddeeefffggghh",
    "md5": "y41d8cd98f00b204e9800998ecf8427z"
  },
  {
    "name": "email-service.jar",
    "path": "notification/bugfix/bugfix-email-retry/89/microservices/email",
    "repo": "libs-snapshot-local",
    "size": 3456789,
    "created": "2025-05-24T16:46:00.000Z",
    "modified": "2025-05-24T17:16:00.000Z",
    "updated": "2025-05-24T17:16:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "nnn9012ooo3456ppp333qqq222eeefffggghhhii",
    "md5": "z41d8cd98f00b204e9800998ecf84271"
  },
  {
    "name": "sms-service.jar",
    "path": "notification/bugfix/bugfix-email-retry/89/microservices/sms",
    "repo": "libs-snapshot-local",
    "size": 2345678,
    "created": "2025-05-24T16:47:00.000Z",
    "modified": "2025-05-24T17:17:00.000Z",
    "updated": "2025-05-24T17:17:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "ooo3456ppp9012qqq444rrr333fffggghhhiiijjj",
    "md5": "141d8cd98f00b204e9800998ecf84272"
  },
  {
    "name": "push-service.jar",
    "path": "notification/bugfix/bugfix-email-retry/89/microservices/push",
    "repo": "libs-snapshot-local",
    "size": 1987654,
    "created": "2025-05-24T16:48:00.000Z",
    "modified": "2025-05-24T17:18:00.000Z",
    "updated": "2025-05-24T17:18:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "ppp9012qqq3456rrr555sss444ggghhhiiijjjkkk",
    "md5": "241d8cd98f00b204e9800998ecf84273"
  },
  {
    "name": "docker-compose.yml",
    "path": "notification/bugfix/bugfix-email-retry/89/deployment/docker",
    "repo": "libs-snapshot-local",
    "size": 6789,
    "created": "2025-05-24T16:49:00.000Z",
    "modified": "2025-05-24T17:19:00.000Z",
    "updated": "2025-05-24T17:19:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "qqq3456rrr9012sss666ttt555hhhiiijjjkkklll",
    "md5": "341d8cd98f00b204e9800998ecf84274"
  },
  {
    "name": "kubernetes-manifests.tar",
    "path": "notification/bugfix/bugfix-email-retry/89/deployment/k8s",
    "repo": "libs-snapshot-local",
    "size": 45678,
    "created": "2025-05-24T16:50:00.000Z",
    "modified": "2025-05-24T17:20:00.000Z",
    "updated": "2025-05-24T17:20:00.000Z",
    "createdBy": "dev-team",
    "modifiedBy": "dev-team",
    "updatedBy": "dev-team",
    "sha1": "rrr9012sss3456ttt777uuu666iiijjjkkklllmmm",
    "md5": "441d8cd98f00b204e9800998ecf84275"
  },

  // Test artifacts directly in build folder (no subfolders)
  {
    "name": "build-info.json",
    "path": "payment/feature/feature-user-auth/1023",
    "repo": "libs-release-local",
    "size": 1024,
    "created": "2025-05-27T08:10:00.000Z",
    "modified": "2025-05-27T08:40:00.000Z",
    "updated": "2025-05-27T08:40:00.000Z",
    "createdBy": "ci-pipeline",
    "modifiedBy": "ci-pipeline",
    "updatedBy": "ci-pipeline",
    "sha1": "abc123def456ghi789jkl012mno345pqr678stu901",
    "md5": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  },
  {
    "name": "CHANGELOG.txt",
    "path": "analytics/hotfix/hotfix-login-crash/201",
    "repo": "libs-snapshot-local",
    "size": 2048,
    "created": "2025-05-25T09:55:00.000Z",
    "modified": "2025-05-25T10:15:00.000Z",
    "updated": "2025-05-25T10:15:00.000Z",
    "createdBy": "hotfix-user",
    "modifiedBy": "ci-bot",
    "updatedBy": "ci-bot",
    "sha1": "def456ghi789jkl012mno345pqr678stu901vwx234",
    "md5": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
  }
];

export const ArtifactoryCatalogTabContainer: React.FC = () => {
  const { entity } = useEntity();
  
  // Using sample data instead of the hook for testing
  // const { artifacts, loading, error } = useArtifactoryObjects(entity);
  
  return (
    <ArtifactoryCatalogTab
      artifacts={sampleArtifacts}
      loading={false}
      error={undefined}
    />
  );
}; 