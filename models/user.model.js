const db = require('../config/db');

const TABLE = 'users';

module.exports = {
  async findByEmail(email) {
    const [[row]] = await db.execute(
      `SELECT * FROM ${TABLE} WHERE email = ? LIMIT 1`,
      [email]
    );
    return row;
  },

  async create({ name, email, password }) {
    const [res] = await db.execute(
      `INSERT INTO ${TABLE} (name, email, password) VALUES (?, ?, ?)`,
      [name, email, password]
    );
    return res.insertId;
  }
};
