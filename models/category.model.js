const db = require('../config/db');

const TABLE = 'categories';

module.exports = {
  async getAll() {
    const [rows] = await db.execute(
      `SELECT id, name FROM ${TABLE} ORDER BY name ASC`
    );
    return rows;
  }
};
