const request = require('supertest');
const server = require('../app');  // Import the server

describe('GET /', () => {
  it('should return Hello, World!', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('GET /health', () => {
  it('should return status 200 for health check', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
