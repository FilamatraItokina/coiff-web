const db = require('../config/db');

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
}

module.exports = ServiceModel;
