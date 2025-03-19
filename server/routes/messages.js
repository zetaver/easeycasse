const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  createConversation,
  deleteMessage,
  getUnreadCount,
  archiveConversation,
  restoreConversation
} = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Conversation routes
router.get('/conversations', authenticate, getConversations);
router.post('/conversations', authenticate, createConversation);
router.get('/conversations/:conversationId', authenticate, getMessages);
router.post('/conversations/:conversationId', authenticate, sendMessage);
router.put('/conversations/:conversationId/read', authenticate, markAsRead);
router.put('/conversations/:conversationId/archive', authenticate, archiveConversation);
router.put('/conversations/:conversationId/restore', authenticate, restoreConversation);

// Message routes
router.delete('/messages/:messageId', authenticate, deleteMessage);

// Utility routes
router.get('/unread-count', authenticate, getUnreadCount);

module.exports = router;