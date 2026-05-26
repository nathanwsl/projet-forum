const db = require('./db');

async function createTopic(title, body, authorId, tags) {
  const [result] = await db.query(
    'INSERT INTO topics (title, body, author_id) VALUES (?, ?, ?)',
    [title, body, authorId]
  );
  const topicId = result.insertId;

  // Ajouter les tags
  for (const tagName of tags) {
    const trimmed = tagName.trim();
    if (!trimmed) continue;

    // Créer le tag s'il n'existe pas
    await db.query('INSERT IGNORE INTO tags (name) VALUES (?)', [trimmed]);
    const [tagRows] = await db.query('SELECT id FROM tags WHERE name = ?', [trimmed]);
    const tagId = tagRows[0].id;

    await db.query('INSERT INTO topic_tags (topic_id, tag_id) VALUES (?, ?)', [topicId, tagId]);
  }

  return topicId;
}

async function getAllTopics() {
  const [rows] = await db.query(`
    SELECT t.*, u.username,
      GROUP_CONCAT(tg.name SEPARATOR ', ') as tags
    FROM topics t
    JOIN users u ON t.author_id = u.id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.status != 'archived' AND t.visibility = 'public'
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
  return rows;
}

async function getTopicById(id) {
  const [rows] = await db.query(`
    SELECT t.*, u.username,
      GROUP_CONCAT(tg.name SEPARATOR ', ') as tags
    FROM topics t
    JOIN users u ON t.author_id = u.id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.id = ?
    GROUP BY t.id
  `, [id]);
  return rows[0];
}

module.exports = { createTopic, getAllTopics, getTopicById };