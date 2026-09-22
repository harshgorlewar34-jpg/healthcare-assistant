import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Send,
  Mic,
  MicOff,
  Bot,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';

const DEFAULT_SUGGESTIONS = [
  'How can I book an appointment?',
  'Which cardiologists are available?',
  'What are the hospital timings?',
  'What departments are available?',
  'Show my appointments',
  'How can I cancel my appointment?',
];

export default function ChatWindow({
  isOpen,
  onClose,
  messages,
  loading,
  onSendMessage,
  onClearChat,
  suggestedQuestions,
  user,
  onOpenLogin,
  onBookDoctor,
  onCancelAppointment,
  externalPrompt,
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Handle incoming external prompt (e.g. from department or emergency button)
  useEffect(() => {
    if (externalPrompt) {
      onSendMessage(externalPrompt);
    }
  }, [externalPrompt]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;
    const msg = inputMessage;
    setInputMessage('');
    onSendMessage(msg);
  };

  // Web Speech API for voice input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-slate-200 overflow-hidden ${
        isMaximized
          ? 'inset-3 sm:inset-6 rounded-3xl'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[640px] max-h-[88vh] rounded-3xl'
      }`}
    >
      {/* Chat Window Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between shadow-md select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm tracking-tight text-white">
                MediBot AI
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              MetroHealth Clinical Assistant
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
            title={isMaximized ? 'Restore window size' : 'Expand window'}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close MediBot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Patient Auth Banner Status */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0">
        {user ? (
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Logged in: <strong>{user.name}</strong>
            </span>
            <span className="font-mono text-[10px] text-sky-700 bg-sky-100 px-1 py-0.2 rounded">
              {user.medicalRecordNumber || 'PATIENT'}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-500 text-[11px]">
              Guest Mode • Log in to see your appointments
            </span>
            <button
              onClick={onOpenLogin}
              className="text-sky-600 hover:text-sky-700 font-bold text-[11px] underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Clear Chat Confirmation Banner */}
      {showClearConfirm && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex items-center justify-between animate-in fade-in shrink-0">
          <span className="text-amber-900 font-medium">
            Clear all chat messages for this session?
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClearChat();
                setShowClearConfirm(false);
              }}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold text-[11px] hover:bg-rose-700"
            >
              Clear
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md font-bold text-[11px] hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            message={msg}
            onBookDoctor={onBookDoctor}
            onCancelAppointment={onCancelAppointment}
            onOpenLogin={onOpenLogin}
          />
        ))}

        {/* Typing Loading Indicator */}
        {loading && (
          <div className="flex gap-3 mb-4 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium mr-1">
                MediBot is thinking
              </span>
              <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <SuggestedQuestions
        questions={
          suggestedQuestions && suggestedQuestions.length > 0
            ? suggestedQuestions
            : DEFAULT_SUGGESTIONS
        }
        onSelectQuestion={(q) => onSendMessage(q)}
      />

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Voice input'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type symptoms, doctors, appointments..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all disabled:opacity-60"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Medical Guardrail Footer Notice */}
        <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>General health info only. In an emergency, dial 911 or +1 (800) 555-0911.</span>
        </p>
      </div>
    </div>
  );
}
