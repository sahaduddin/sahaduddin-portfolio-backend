const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbot.controller');

// Securely mount POST endpoint for AI Chat conversation triggers
router.post('/', handleChat);

module.exports = router;
