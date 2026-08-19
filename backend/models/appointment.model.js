const db = require('../config/db');

class AppointmentModel {
  static create({ barberId, serviceId, date, time, clientName, clientPhone, status = 'confirmed' }) {
    if (!barberId) throw new Error('barberId is required');
    if (!serviceId) throw new Error('serviceId is required');
    if (!date) throw new Error('date is required');
    if (!time) throw new Error('time is required');
    if (!clientName) throw new Error('clientName is required');
    if (!clientPhone) throw new Error('clientPhone is required');

    const stmt = db.prepare(`
      INSERT INTO appointments (barberId, serviceId, date, time, clientName, clientPhone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(barberId, serviceId, date, time, clientName, clientPhone, status);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
    const row = stmt.get(id);
    return row || null;
  }

  static findByBarberAndDate(barberId, date) {
    const stmt = db.prepare('SELECT * FROM appointments WHERE barberId = ? AND date = ?');
    return stmt.all(barberId, date);
  }
}

module.exports = AppointmentModel;
