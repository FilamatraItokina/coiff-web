const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || './data/database.sqlite';
const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

let db;

try {
  const dir = path.dirname(absoluteDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(absoluteDbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  initTables(db);
} catch (error) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

function initTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      photoUrl TEXT,
      bio TEXT,
      specialties TEXT,
      workingHours TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      durationMinutes INTEGER NOT NULL,
      price REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barberId INTEGER NOT NULL,
      serviceId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (barberId) REFERENCES barbers(id) ON DELETE CASCADE,
      FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE,
      UNIQUE(barberId, date, time)
    );
  `);

  // Migrate missing email column if table already existed prior to task 3
  const barberCols = database.prepare("PRAGMA table_info(barbers)").all();
  const hasEmail = barberCols.some((col) => col.name === 'email');
  if (!hasEmail && barberCols.length > 0) {
    database.exec("ALTER TABLE barbers ADD COLUMN email TEXT DEFAULT ''");
  }
}

module.exports = db;
