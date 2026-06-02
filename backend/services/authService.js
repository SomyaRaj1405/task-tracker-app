const db = require('../config/db');

const authService = {
  /**
   * Creates a new user in the database
   * @param {string} name 
   * @param {string} email 
   * @param {string} hashedPassword 
   * @returns {Promise<object>} Created user details (without password)
   */
  createUser: async (name, email, hashedPassword) => {
    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;
    const result = await db.run(sql, [name, email.toLowerCase(), hashedPassword]);
    return {
      id: result.lastID,
      name,
      email: email.toLowerCase()
    };
  },

  /**
   * Finds a user record by email address
   * @param {string} email 
   * @returns {Promise<object|null>} User record or null if not found
   */
  findUserByEmail: async (email) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const row = await db.get(sql, [email.toLowerCase()]);
    return row || null;
  },

  /**
   * Finds a user by their unique ID
   * @param {number} id 
   * @returns {Promise<object|null>} User details (without password)
   */
  findUserById: async (id) => {
    const sql = `SELECT id, name, email, created_at FROM users WHERE id = ?`;
    const row = await db.get(sql, [id]);
    return row || null;
  }
};

module.exports = authService;
