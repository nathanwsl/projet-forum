const db = require('./db');

async function createMessage(topicId, authorId, body, parentId = null) {
  const [result] = await db.query(
    'INSERT INTO messages (topic_id, author_id, body, parent_id) VALUES (?, ?, ?, ?)',
    [topicId, authorId, body, parentId]
  );
  return result.insertId;
}

async function getMessagesByTopic(topicId, sort = 'date', limit = 10, offset = 0) {
  let orderBy = 'm.sent_at DESC';

  if (sort === 'popularity') {
    orderBy = '(SUM(CASE WHEN r.type = "like" THEN 1 ELSE 0 END) - SUM(CASE WHEN r.type = "dislike" THEN 1 ELSE 0 END)) DESC';
  }

  const [rows] = await db.query(`
    SELECT m.*, u.username,
      SUM(CASE WHEN r.type = 'like' THEN 1 ELSE 0 END) as likes,
      SUM(CASE WHEN r.type = 'dislike' THEN 1 ELSE 0 END) as dislikes,
      p.body as parent_body,
      pu.username as parent_username
    FROM messages m
    JOIN users u ON m.author_id = u.id
    LEFT JOIN reactions r ON m.id = r.message_id
    LEFT JOIN messages p ON m.parent_id = p.id
    LEFT JOIN users pu ON p.author_id = pu.id
    WHERE m.topic_id = ?
    GROUP BY m.id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `, [topicId, limit, offset]);
  return rows;
}

async function countMessages(topicId) {
  const [rows] = await db.query(
    'SELECT COUNT(*) as total FROM messages WHERE topic_id = ?',
    [topicId]
  );
  return rows[0].total;
}

async function deleteMessage(messageId) {
  await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
}

async function getMessageById(messageId) {
  const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);
  return rows[0];
}

module.exports = { createMessage, getMessagesByTopic, deleteMessage, getMessageById, countMessages };