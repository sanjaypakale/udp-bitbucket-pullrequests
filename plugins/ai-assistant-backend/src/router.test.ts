import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      httpAuth: {} as any,
      catalogApi: {} as any,
      config: {
        openaiApiKey: 'test-key',
      },
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        status: 'ok',
        services: {
          ai: true,
          slack: false,
          websocket: false,
        },
        timestamp: expect.any(String),
      });
    });
  });
});
