const request = require('supertest');
const { app } = require('../server');
const { seedDatabase } = require('../seed/seedData');

describe('GET /api/barbers', () => {
  beforeAll(() => {
    seedDatabase();
  });

  test('returns default paginated list of barbers with 200 OK', async () => {
    const res = await request(app).get('/api/barbers');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);

    expect(res.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 4,
      limit: 10,
    });

    // Verify sensitive fields (like email) are not exposed
    res.body.data.forEach((barber) => {
      expect(barber).toHaveProperty('id');
      expect(barber).toHaveProperty('name');
      expect(barber).toHaveProperty('specialties');
      expect(barber).toHaveProperty('workingHours');
      expect(barber).not.toHaveProperty('email');
    });
  });

  test('paginates results according to page and limit parameters', async () => {
    const resPage1 = await request(app).get('/api/barbers?page=1&limit=2');

    expect(resPage1.statusCode).toBe(200);
    expect(resPage1.body.data.length).toBe(2);
    expect(resPage1.body.pagination).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalItems: 4,
      limit: 2,
    });

    const resPage2 = await request(app).get('/api/barbers?page=2&limit=2');

    expect(resPage2.statusCode).toBe(200);
    expect(resPage2.body.data.length).toBe(2);
    expect(resPage2.body.pagination.currentPage).toBe(2);

    // Verify different items returned on page 1 and page 2
    expect(resPage1.body.data[0].id).not.toBe(resPage2.body.data[0].id);
  });

  test('returns 400 for invalid page parameter', async () => {
    const resZero = await request(app).get('/api/barbers?page=0');
    expect(resZero.statusCode).toBe(400);
    expect(resZero.body).toHaveProperty('error');

    const resNegative = await request(app).get('/api/barbers?page=-1');
    expect(resNegative.statusCode).toBe(400);

    const resString = await request(app).get('/api/barbers?page=invalid');
    expect(resString.statusCode).toBe(400);
  });

  test('returns 400 for invalid limit parameter', async () => {
    const resZero = await request(app).get('/api/barbers?limit=0');
    expect(resZero.statusCode).toBe(400);
    expect(resZero.body).toHaveProperty('error');

    const resNegative = await request(app).get('/api/barbers?limit=-5');
    expect(resNegative.statusCode).toBe(400);

    const resExceed = await request(app).get('/api/barbers?limit=51');
    expect(resExceed.statusCode).toBe(400);

    const resString = await request(app).get('/api/barbers?limit=abc');
    expect(resString.statusCode).toBe(400);
  });
});

describe('GET /api/barbers/:id', () => {
  let seededBarbers;

  beforeAll(() => {
    const result = seedDatabase();
    seededBarbers = result.barbers;
  });

  test('returns barber details for a valid existing ID without exposing email', async () => {
    const targetBarber = seededBarbers[0];
    const res = await request(app).get(`/api/barbers/${targetBarber.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', targetBarber.id);
    expect(res.body).toHaveProperty('name', targetBarber.name);
    expect(res.body).toHaveProperty('photoUrl');
    expect(res.body).toHaveProperty('bio');
    expect(res.body).toHaveProperty('specialties');
    expect(res.body).toHaveProperty('workingHours');
    expect(res.body).not.toHaveProperty('email');
  });

  test('returns 404 for a non-existing barber ID', async () => {
    const res = await request(app).get('/api/barbers/99999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Barber not found' });
  });

  test('returns 400 for invalid or malformed ID', async () => {
    const resString = await request(app).get('/api/barbers/invalid-id');
    expect(resString.statusCode).toBe(400);
    expect(resString.body).toHaveProperty('error');

    const resZero = await request(app).get('/api/barbers/0');
    expect(resZero.statusCode).toBe(400);

    const resNegative = await request(app).get('/api/barbers/-5');
    expect(resNegative.statusCode).toBe(400);

    const resDecimal = await request(app).get('/api/barbers/1.5');
    expect(resDecimal.statusCode).toBe(400);
  });
});
