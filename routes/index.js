const express = require('express');
const router = express.Router();
const contactRoutes = require('./contact');
const chatbotRoutes = require('./chatbot');

// Register all modular routers
router.use('/contact', contactRoutes);
router.use('/chatbot', chatbotRoutes);

module.exports = router;
