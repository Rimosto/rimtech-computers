import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('API basics', () => {
  it('GET /api/health reports the service is up', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('rimtech-api');
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns a JSON 400 for malformed JSON bodies', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_JSON');
  });

  it('rejects oversized request bodies', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ data: 'x'.repeat(200 * 1024) }));
    expect(res.status).toBe(413);
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('sends security headers and hides the framework', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('allows the RimTech frontend through CORS', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('does not allow other websites through CORS', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('sends rate limit headers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['ratelimit']).toBeDefined();
  });
});
