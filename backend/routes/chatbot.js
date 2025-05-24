const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post("/chatbot", chatbotController.chatbotResponse);

module.exports = router;