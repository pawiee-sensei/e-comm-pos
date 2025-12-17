const db = require('../config/db');

const TABLE = 'products_v2';

module.exports = {
  async getAll({ search, category, sort, limit, offset }) {
    let sql = `
      SELECT p.*, c.name AS category_name
      FROM ${TABLE} p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1
    `;
    const params = [];

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }

    if (sort) {
      const map = {
        price_asc: 'p.price ASC',
        price_desc: 'p.price DESC',
        stock_asc: 'p.stock ASC',
        stock_desc: 'p.stock DESC'
      };
      if (map[sort]) sql += ` ORDER BY ${map[sort]}`;
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(sql, params);
    return rows;
  },

  async countAll({ search, category }) {
    let sql = `SELECT COUNT(*) as total FROM ${TABLE} WHERE 1`;
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category_id = ?';
      params.push(category);
    }

    const [[row]] = await db.execute(sql, params);
    return row.total;
  },

  async findById(id) {
    const [[row]] = await db.execute(
      `SELECT * FROM ${TABLE} WHERE id = ?`,
      [id]
    );
    return row;
  },

  async create(data) {
    const sql = `
      INSERT INTO ${TABLE}
      (uuid, name, sku, description, price, category_id, image, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, data);
  },

  /* =========================
     UPDATE PRODUCT (SAFE IMAGE)
  ========================= */
  async update(id, data) {
    let sql = `
      UPDATE ${TABLE}
      SET
        name = ?,
        description = ?,
        price = ?,
        category_id = ?
    `;
    const params = [
      data.name,
      data.description,
      data.price,
      data.category_id
    ];

    // ✅ ONLY update image if a new one exists
    if (data.image !== undefined) {
      sql += `, image = ?`;
      params.push(data.image);
    }

    sql += ` WHERE id = ? LIMIT 1`;
    params.push(id);

    const [result] = await db.execute(sql, params);
    return result.affectedRows;
  },

  async remove(id) {
    await db.execute(
      `DELETE FROM ${TABLE} WHERE id = ? LIMIT 1`,
      [id]
    );
  }
};
