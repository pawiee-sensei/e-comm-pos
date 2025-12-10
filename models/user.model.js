const db = require('../config/db');

async function findByEmail(email) {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
}

module.exports = {
  findByEmail
};
