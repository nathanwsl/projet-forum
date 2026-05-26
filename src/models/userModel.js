const db = require('./db');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

async function createUser(username, email, password) {
  const hashed = hashPassword(password);
  const [result] = await db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashed]
  );
  return result;
}

async function findUserByIdentifier(identifier) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createUser, findUserByIdentifier, findUserById, hashPassword };