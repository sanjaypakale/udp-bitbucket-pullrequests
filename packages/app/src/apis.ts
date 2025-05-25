import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  analyticsApiRef,
  errorApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GenericAnalyticsAPI } from '@pfeifferj/backstage-plugin-analytics-generic';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  // Add GenericAnalyticsAPI for ELK integration
  createApiFactory({
    api: analyticsApiRef,
    deps: {
      configApi: configApiRef,
      errorApi: errorApiRef,
      identityApi: identityApiRef,
      catalogApi: catalogApiRef,
    },
    factory: ({ configApi, errorApi, identityApi, catalogApi }) =>
      GenericAnalyticsAPI.fromConfig(
        configApi,
        errorApi,
        identityApi,
        catalogApi,
      ),
  }),
];
