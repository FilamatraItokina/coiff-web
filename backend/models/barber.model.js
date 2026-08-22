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

  static formatRow(row) {
    return {
      ...row,
      specialties: row.specialties ? JSON.parse(row.specialties) : [],
      workingHours: row.workingHours ? JSON.parse(row.workingHours) : {},
    };
  }
}

module.exports = BarberModel;
