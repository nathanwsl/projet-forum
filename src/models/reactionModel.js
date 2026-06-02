const db = require('./db');

async function reactToMessage(messageId, userId, type) {
  // Vérifier si une réaction existe déjà
  const [existing] = await db.query(
    'SELECT * FROM reactions WHERE message_id = ? AND user_id = ?',
    [messageId, userId]
  );

  if (existing.length > 0) {
    if (existing[0].type === type) {
      // Même réaction -> on la supprime (toggle)
      await db.query('DELETE FROM reactions WHERE message_id = ? AND user_id = ?', [messageId, userId]);
    } else {
      // Réaction différente -> on la met à jour
      await db.query(
        'UPDATE reactions SET type = ? WHERE message_id = ? AND user_id = ?',
        [type, messageId, userId]
      );
    }
  } else {
    // Pas de réaction -> on la crée
    await db.query(
      'INSERT INTO reactions (message_id, user_id, type) VALUES (?, ?, ?)',
      [messageId, userId, type]
    );
  }
}

module.exports = { reactToMessage };