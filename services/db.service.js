const db = require('../config/db');
const logger = require('../config/logger');

class DBService {
  async saveContactMessage(messageData) {
    const { name, email, subject, message, projectType, budget } = messageData;
    
    logger.info(`[DB Service] Initializing MariaDB write for message from ${name}`);
    const sql = 'INSERT INTO contact_messages (name, email, subject, message, project_type, budget, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    
    try {
      await db.query(sql, [name, email, subject || null, message, projectType || null, budget || null]);
      logger.info(`[DB Service] Database record committed successfully for ${name}`);
      return true;
    } catch (err) {
      // Caught as non-blocking fire-and-forget query error
      logger.error(`[DB Service] MariaDB insert operation failed for ${name}`, err);
      return false;
    }
  }
}

module.exports = new DBService();
