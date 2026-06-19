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
async function updateUser(id, bio, avatar) {
  await db.query(
    'UPDATE users SET bio = ?, avatar = ? WHERE id = ?',
    [bio, avatar, id]
  );
}

async function updateLastLogin(id) {
  await db.query(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [id]
  );
}

async function getUserStats(id) {
  const [messages] = await db.query(
    'SELECT COUNT(*) as total FROM messages WHERE author_id = ?',
    [id]
  );
  const [topics] = await db.query(
    'SELECT COUNT(*) as total FROM topics WHERE author_id = ?',
    [id]
  );
  return {
    messages: messages[0].total,
    topics: topics[0].total
  };
}

module.exports = { createUser, findUserByIdentifier, findUserById, hashPassword, updateUser, updateLastLogin, getUserStats };