const express = require('express');
const router = express.Router();
const {
  handleChat,
  getChatHistory,
  clearChatHistory,
} = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, handleChat);
router.get('/history', optionalAuth, getChatHistory);
router.delete('/history', optionalAuth, clearChatHistory);

module.exports = router;
