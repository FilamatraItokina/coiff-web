const db = require('../config/db');

class BarberModel {
  static create({ name, email, photoUrl = '', bio = '', specialties = [], workingHours = {} }) {
    if (!name) {
      throw new Error('Barber name is required');
    }
    if (!email) {
      throw new Error('Barber email is required');
    }

    const stmt = db.prepare(`
      INSERT INTO barbers (name, email, photoUrl, bio, specialties, workingHours)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      photoUrl,
      bio,
      JSON.stringify(specialties),
      JSON.stringify(workingHours)
    );

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM barbers WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.formatRow(row);
  }

  static findAll() {
    const stmt = db.prepare('SELECT * FROM barbers');
    const rows = stmt.all();
    return rows.map((row) => this.formatRow(row));
  }

  static count() {
    const stmt = db.prepare('SELECT COUNT(*) AS total FROM barbers');
    const result = stmt.get();
    return result ? result.total : 0;
  }

  static findPaginated({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const totalItems = this.count();
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    const stmt = db.prepare('SELECT * FROM barbers LIMIT ? OFFSET ?');
    const rows = stmt.all(limit, offset);

    return {
      data: rows.map((row) => this.formatPublicRow(row)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      },
    };
  }

  static formatRow(row) {
    return {
      ...row,
      specialties: row.specialties ? JSON.parse(row.specialties) : [],
      workingHours: row.workingHours ? JSON.parse(row.workingHours) : {},
    };
  }

  static formatPublicRow(row) {
    if (!row) return null;
    const formatted = this.formatRow(row);
    delete formatted.email;
    return formatted;
  }
}

module.exports = BarberModel;
