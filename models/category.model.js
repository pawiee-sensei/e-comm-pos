const db = require('../config/db');
const TABLE = 'categories';

module.exports = {
  async getAll() {
    const [rows] = await db.execute(
      `SELECT id, name FROM ${TABLE} ORDER BY name ASC`
    );
    return rows;
  },

  async create(name) {
    const [res] = await db.execute(
      `INSERT INTO ${TABLE} (name) VALUES (?)`,
      [name]
    );
    return res.insertId;
  },

  async update(id, name) {
    const [res] = await db.execute(
      `UPDATE ${TABLE} SET name=? WHERE id=? LIMIT 1`,
      [name, id]
    );
    return res.affectedRows;
  },

  async remove(id) {
    const [res] = await db.execute(
      `DELETE FROM ${TABLE} WHERE id=? LIMIT 1`,
      [id]
    );
    return res.affectedRows;
  }
};
