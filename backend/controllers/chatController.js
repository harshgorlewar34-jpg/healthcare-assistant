const ChatHistory = require('../models/ChatHistory');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');
const { generateChatResponse } = require('../services/aiService');

const handleChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const currentSessionId = sessionId || 'session_' + Math.random().toString(36).substring(2, 12);

    // 1. Gather Hospital Context
    const [departments, doctors] = await Promise.all([
      Department.find().select('name code description location contactPhone'),
      Doctor.find().populate('department', 'name code').select('-__v'),
    ]);

    // 2. Gather User Context
    let userAppointments = [];
    if (req.user) {
      userAppointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name specialization consultationFee roomNumber')
        .populate('department', 'name code')
        .sort({ appointmentDate: 1 });
    }

    const hospitalContext = { departments, doctors };
    const userContext = {
      isLoggedIn: !!req.user,
      user: req.user
        ? {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            medicalRecordNumber: req.user.medicalRecordNumber,
          }
        : null,
      appointments: userAppointments,
    };

    // 3. Generate AI or Knowledge Response
    const aiResult = await generateChatResponse(message, hospitalContext, userContext);

    // 4. Save to Chat History
    const userMsg = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };

    const botMsg = {
      sender: 'bot',
      text: aiResult.text,
      timestamp: new Date(),
      metadata: aiResult.metadata || {},
    };

    let chatSession = await ChatHistory.findOne({
      $or: [
        { sessionId: currentSessionId },
        ...(req.user ? [{ user: req.user._id }] : []),
      ],
    });

    if (!chatSession) {
      chatSession = new ChatHistory({
        sessionId: currentSessionId,
        user: req.user ? req.user._id : null,
        messages: [userMsg, botMsg],
      });
    } else {
      if (req.user && !chatSession.user) {
        chatSession.user = req.user._id;
      }
      chatSession.messages.push(userMsg, botMsg);
    }

    await chatSession.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId: currentSessionId,
        reply: aiResult.text,
        metadata: aiResult.metadata || {},
        suggestedQuestions: aiResult.suggestedQuestions || [],
      },
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    let query = {};

    if (req.user) {
      query = { user: req.user._id };
    } else if (sessionId) {
      query = { sessionId };
    } else {
      return res.status(200).json({ success: true, data: [] });
    }

    const chatSession = await ChatHistory.findOne(query);

    return res.status(200).json({
      success: true,
      data: chatSession ? chatSession.messages : [],
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.body;
    let query = {};

    if (req.user) {
      query = { user: req.user._id };
    } else if (sessionId) {
      query = { sessionId };
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or Auth required' });
    }

    await ChatHistory.findOneAndDelete(query);

    return res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    console.error('Clear chat history error:', error);
    return res.status(500).json({ success: false, message: 'Server error clearing history' });
  }
};

module.exports = {
  handleChat,
  getChatHistory,
  clearChatHistory,
};
