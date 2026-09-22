import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, X, Sparkles } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { api } from '../../services/api';

const INITIAL_BOT_MESSAGE = {
  id: 'welcome-1',
  sender: 'bot',
  text: `Hello! 👋 I am **MediBot**, the AI Clinical & Hospital Assistant for **MetroHealth Memorial Hospital**.\n\nI can help you:\n• **Find Specialists** & check OPD schedules\n• **Book, Cancel or View** appointments\n• **Hospital Timings**, visiting hours & departments\n• **Cashless Insurance**, TPA desk & medical reports\n• **Emergency Guidance** & rapid triage\n\nHow can I help you today?`,
  timestamp: new Date(),
  metadata: {},
};

export default function MediBotWidget({
  isOpen,
  setIsOpen,
  user,
  onOpenLogin,
  onBookDoctor,
  externalPrompt,
  onClearExternalPrompt,
}) {
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('medibot_sessionId') || 'session_' + Math.random().toString(36).substring(2, 12);
  });
  const [hasUnread, setHasUnread] = useState(true);
  const [showBubblePrompt, setShowBubblePrompt] = useState(true);

  // Save session ID in storage
  useEffect(() => {
    localStorage.setItem('medibot_sessionId', sessionId);
  }, [sessionId]);

  // Hide floating greeting bubble after 10s or when opened
  useEffect(() => {
    if (isOpen) {
      setShowBubblePrompt(false);
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (userText) => {
    if (!userText.trim()) return;

    // Add user message immediately to state
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.sendChatMessage(userText, sessionId);

      if (res.success && res.data) {
        const botMsg = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: res.data.reply,
          timestamp: new Date(),
          metadata: res.data.metadata || {},
        };

        setMessages((prev) => [...prev, botMsg]);
        if (res.data.suggestedQuestions) {
          setSuggestedQuestions(res.data.suggestedQuestions);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: 'err-' + Date.now(),
            sender: 'bot',
            text: 'I apologize, but I encountered a momentary difficulty retrieving hospital records. Please try again or call our reception directly at +1 (800) 555-0199.',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'bot',
          text: 'Unable to reach the hospital server. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChatHistory(sessionId);
    } catch (err) {
      console.warn('Failed to clear remote chat history:', err);
    }
    const newSession = 'session_' + Math.random().toString(36).substring(2, 12);
    setSessionId(newSession);
    localStorage.setItem('medibot_sessionId', newSession);
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'bot',
        text: 'Chat history cleared. How may I assist you now with MetroHealth services?',
        timestamp: new Date(),
      },
    ]);
    setSuggestedQuestions([]);
  };

  const handleCancelAppointmentFromChat = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        // Send a confirmation notice into chat
        setMessages((prev) => [
          ...prev,
          {
            id: 'cancel-confirm-' + Date.now(),
            sender: 'bot',
            text: `✅ **Appointment Cancelled**: Your appointment #${res.data?.tokenNumber || id} has been successfully cancelled in the hospital database.`,
            timestamp: new Date(),
          },
        ]);
      } else {
        alert(res.message || 'Could not cancel appointment');
      }
    } catch (err) {
      alert('Error cancelling appointment');
    }
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {/* Floating Greeting Pill */}
        {showBubblePrompt && !isOpen && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-slate-200 text-xs font-semibold text-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need doctor advice or booking? Ask MediBot!</span>
            <button
              onClick={() => setShowBubblePrompt(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open MediBot AI Hospital Assistant"
          className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-teal-600 to-sky-500 text-white shadow-xl shadow-sky-600/35 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer select-none"
        >
          {/* Subtle pulse ring around button */}
          <span className="absolute inset-0 rounded-3xl animate-pulse-ring pointer-events-none" />

          {isOpen ? (
            <X className="w-7 h-7 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <Bot className="w-8 h-8 transition-transform group-hover:scale-110 duration-200" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-slate-900 animate-bounce" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window Modal */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        loading={loading}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        suggestedQuestions={suggestedQuestions}
        user={user}
        onOpenLogin={onOpenLogin}
        onBookDoctor={(doc) => {
          setIsOpen(false);
          onBookDoctor(doc);
        }}
        onCancelAppointment={handleCancelAppointmentFromChat}
        externalPrompt={externalPrompt}
      />
    </>
  );
}
