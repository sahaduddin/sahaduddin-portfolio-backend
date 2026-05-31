const aiService = require('../services/ai.service');
const ApiResponse = require('../utils/response');
const logger = require('../config/logger');

async function handleChat(req, res, next) {
  const { message, history } = req.body;
  
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message field is required and must be a valid string.',
      timestamp: new Date().toISOString()
    });
  }

  try {
    logger.info(`[Chatbot Controller] Processing dialogue request: "${message.substring(0, 50)}..."`);
    
    // Call AI Service to get custom response based on history and message
    const botResponse = await aiService.generateChatbotResponse(message, history);
    
    // Return unified successful response payload
    const response = ApiResponse.success({ response: botResponse }, 'Chat response generated successfully.');
    return response.send(res);
  } catch (err) {
    logger.error(`[Chatbot Controller] Intercepted dialogue generation exception`, err);
    return next(err);
  }
}

module.exports = { handleChat };
