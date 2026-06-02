const db = require('./db');

async function createMessage(topicId, authorId, body) {
  const [result] = await db.query(
    'INSERT INTO messages (topic_id, author_id, body) VALUES (?, ?, ?)',
    [topicId, authorId, body]
  );
  return result.insertId;
}

async function getMessagesByTopic(topicId, sort = 'date') {
  let orderBy = 'm.sent_at DESC';

  if (sort === 'popularity') {
    orderBy = '(SUM(CASE WHEN r.type = "like" THEN 1 ELSE 0 END) - SUM(CASE WHEN r.type = "dislike" THEN 1 ELSE 0 END)) DESC';
  }

  const [rows] = await db.query(`
    SELECT m.*, u.username,
      SUM(CASE WHEN r.type = 'like' THEN 1 ELSE 0 END) as likes,
      SUM(CASE WHEN r.type = 'dislike' THEN 1 ELSE 0 END) as dislikes
    FROM messages m
    JOIN users u ON m.author_id = u.id
    LEFT JOIN reactions r ON m.id = r.message_id
    WHERE m.topic_id = ?
    GROUP BY m.id
    ORDER BY ${orderBy}
  `, [topicId]);
  return rows;
}

async function deleteMessage(messageId) {
  await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
}

async function getMessageById(messageId) {
  const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [messageId]);
  return rows[0];
}

module.exports = { createMessage, getMessagesByTopic, deleteMessage, getMessageById };