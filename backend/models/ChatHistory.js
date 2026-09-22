const mongoose = require('mongoose');
const { createModelProxy } = require('./modelProxy');
const { memoryChatHistories, MemoryChatHistoryInstance } = require('../config/memoryStore');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot', 'system'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    intent: String,
    action: String,
    data: mongoose.Schema.Types.Mixed,
    isEmergency: Boolean,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const MongooseChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);
module.exports = createModelProxy(
  'ChatHistory',
  MongooseChatHistory,
  memoryChatHistories,
  MemoryChatHistoryInstance
);
