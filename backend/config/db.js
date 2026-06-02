const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || 'database.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite Database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log(`Connected to SQLite Database at: ${dbPath}`);
    // Enable Foreign Keys support
    db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
      if (pragmaErr) {
        console.error('Error enabling foreign keys:', pragmaErr.message);
      } else {
        console.log('Foreign keys enabled.');
      }
    });
  }
});

// Wrap sqlite3 operations in Promises for async/await support
const dbOperations = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  // Database schema initializer
  initSchema: async () => {
    const schemaPath = path.resolve(__dirname, '..', 'models', 'schema.sql');
    try {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // SQLite run cannot execute multiple SQL statements at once out of the box,
      // so we use db.exec for batch executing schema creation.
      await new Promise((resolve, reject) => {
        db.exec(schemaSql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('Database tables initialized successfully.');
    } catch (error) {
      console.error('Error initializing database tables:', error.message);
      process.exit(1);
    }
  }
};

module.exports = dbOperations;
