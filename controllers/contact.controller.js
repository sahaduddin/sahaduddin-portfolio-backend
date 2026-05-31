const aiService = require('../services/ai.service');
const emailService = require('../services/email.service');
const whatsappService = require('../services/whatsapp.service');
const dbService = require('../services/db.service');
const ApiResponse = require('../utils/response');
const logger = require('../config/logger');

async function handleContact(req, res, next) {
  const { name, email } = req.body;
  
  try {
    logger.info(`[Contact Controller] Initiating processing pipeline for contact: ${name} (${email})`);
    
    // 1. Generate AI summary for developer alert and personalized AI response for client in parallel
    const [summary, autoReply] = await Promise.all([
      aiService.generateMessageSummary(req.body.message),
      aiService.generateClientAutoReply(req.body)
    ]);
    
    // 2. Dispatch all notifications in parallel (Email Alert, AI Client Email, and WhatsApp Alert)
    // We catch WhatsApp failures so it is purely non-blocking and never interrupts the main flow
    await Promise.all([
      emailService.sendAdminInquiryAlert(req.body, summary),
      emailService.sendUserAutoReply(email, autoReply),
      whatsappService.sendAdminAlert(req.body, summary).catch(err => {
        logger.error('[Contact Controller] WhatsApp alert failed to send, continuing...', err);
      })
    ]);
    
    // 3. Asynchronous fire-and-forget MariaDB database commit
    dbService.saveContactMessage(req.body);
    
    // 4. Return standardized unified success JSON structure
    const response = ApiResponse.success(null, 'Inquiry processed and sent successfully.');
    return response.send(res);
  } catch (err) {
    // Propagate standard or custom exceptions to centralized error middleware
    logger.error(`[Contact Controller] Exception intercepted during inquiry dispatch`, err);
    return next(err);
  }
}

module.exports = { handleContact };
