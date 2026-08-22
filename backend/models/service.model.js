const db = require('../config/db');
const { formatPaginationResponse } = require('../utils/paginate');

class ServiceModel {
  static create({ name, description = '', durationMinutes, price }) {
    if (!name) throw new Error('Service name is required');
    if (durationMinutes === undefined || durationMinutes === null) throw new Error('durationMinutes is required');
    if (price === undefined || price === null) throw new Error('price is required');

    const stmt = db.prepare(`
      INSERT INTO services (name, description, durationMinutes, price)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, description, durationMinutes, price);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
    const row = stmt.get(id);
    return row || null;
  }

  static findAll() {
    const stmt = db.prepare('SELECT * FROM services');
    return stmt.all();
  }

  static count() {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM services');
    const result = stmt.get();
    return result ? result.total : 0;
  }

  static findPaginated({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const totalItems = this.count();

    const stmt = db.prepare('SELECT * FROM services LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset);

    return formatPaginationResponse({
      data: rows,
      totalItems,
      page,
      limit,
    });
  }
}

module.exports = ServiceModel;
