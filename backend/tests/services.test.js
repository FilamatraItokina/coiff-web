const request = require('supertest');
const { app } = require('../server');
const { seedDatabase } = require('../seed/seedData');

describe('GET /api/services', () => {
  beforeAll(() => {
    seedDatabase();
  });

  test('returns default paginated list of services with 200 OK', async () => {
    const res = await request(app).get('/api/services');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(7);

    expect(res.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 7,
      limit: 10,
    });

    res.body.data.forEach((service) => {
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('durationMinutes');
      expect(service).toHaveProperty('price');
    });
  });

  test('paginates services properly with page and limit parameters', async () => {
    const resPage1 = await request(app).get('/api/services?page=1&limit=3');

    expect(resPage1.statusCode).toBe(200);
    expect(resPage1.body.data.length).toBe(3);
    expect(resPage1.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 3,
      totalItems: 7,
      limit: 3,
    });

    const resPage2 = await request(app).get('/api/services?page=2&limit=3');

    expect(resPage2.statusCode).toBe(200);
    expect(resPage2.body.data.length).toBe(3);
    expect(resPage2.body.pagination.currentPage).toBe(2);

    expect(resPage1.body.data[0].id).not.toBe(resPage2.body.data[0].id);

    const resPage3 = await request(app).get('/api/services?page=3&limit=3');
    expect(resPage3.statusCode).toBe(200);
    expect(resPage3.body.data.length).toBe(1);
    expect(resPage3.body.pagination.currentPage).toBe(3);
  });

  test('returns 400 for invalid page parameter', async () => {
    const resZero = await request(app).get('/api/services?page=0');
    expect(resZero.statusCode).toBe(400);
    expect(resZero.body).toHaveProperty('error');

    const resNegative = await request(app).get('/api/services?page=-1');
    expect(resNegative.statusCode).toBe(400);

    const resString = await request(app).get('/api/services?page=abc');
    expect(resString.statusCode).toBe(400);
  });

  test('returns 400 for invalid limit parameter', async () => {
    const resZero = await request(app).get('/api/services?limit=0');
    expect(resZero.statusCode).toBe(400);
    expect(resZero.body).toHaveProperty('error');

    const resNegative = await request(app).get('/api/services?limit=-5');
    expect(resNegative.statusCode).toBe(400);

    const resExceed = await request(app).get('/api/services?limit=51');
    expect(resExceed.statusCode).toBe(400);

    const resString = await request(app).get('/api/services?limit=xyz');
    expect(resString.statusCode).toBe(400);
  });
});
