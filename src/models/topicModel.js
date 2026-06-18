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

async function getAllTopics(limit = 10, offset = 0) {
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
    LIMIT ? OFFSET ?
  `, [limit, offset]);
  return rows;
}

async function countTopics() {
  const [rows] = await db.query(`
    SELECT COUNT(*) as total FROM topics
    WHERE status != 'archived' AND visibility = 'public'
  `);
  return rows[0].total;
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

async function getTopicsByTag(tagName, limit = 10, offset = 0) {
  const [rows] = await db.query(`
    SELECT t.*, u.username,
      GROUP_CONCAT(tg.name SEPARATOR ', ') as tags
    FROM topics t
    JOIN users u ON t.author_id = u.id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.status != 'archived' AND t.visibility = 'public'
    AND t.id IN (
      SELECT tt2.topic_id FROM topic_tags tt2
      JOIN tags tg2 ON tt2.tag_id = tg2.id
      WHERE tg2.name = ?
    )
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `, [tagName, limit, offset]);
  return rows;
}

async function searchTopics(query, limit = 10, offset = 0) {
  const search = `%${query}%`;
  const [rows] = await db.query(`
    SELECT t.*, u.username,
      GROUP_CONCAT(tg.name SEPARATOR ', ') as tags
    FROM topics t
    JOIN users u ON t.author_id = u.id
    LEFT JOIN topic_tags tt ON t.id = tt.topic_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.status != 'archived' AND t.visibility = 'public'
    AND (t.title LIKE ? OR tg.name LIKE ?)
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `, [search, search, limit, offset]);
  return rows;
}

async function getAllTags() {
  const [rows] = await db.query('SELECT * FROM tags ORDER BY name');
  return rows;
}

async function updateTopic(topicId, title, body, tags) {
  await db.query(
    'UPDATE topics SET title = ?, body = ? WHERE id = ?',
    [title, body, topicId]
  );

  // Supprimer les anciens tags
  await db.query('DELETE FROM topic_tags WHERE topic_id = ?', [topicId]);

  // Ajouter les nouveaux tags
  for (const tagName of tags) {
    const trimmed = tagName.trim();
    if (!trimmed) continue;
    await db.query('INSERT IGNORE INTO tags (name) VALUES (?)', [trimmed]);
    const [tagRows] = await db.query('SELECT id FROM tags WHERE name = ?', [trimmed]);
    const tagId = tagRows[0].id;
    await db.query('INSERT INTO topic_tags (topic_id, tag_id) VALUES (?, ?)', [topicId, tagId]);
  }
}

async function deleteTopic(topicId) {
  await db.query('DELETE FROM topics WHERE id = ?', [topicId]);
}

module.exports = { createTopic, getAllTopics, getTopicById, countTopics, getTopicsByTag, searchTopics, getAllTags, updateTopic, deleteTopic };