import React, { useState } from 'react';
import {
  Bot,
  User,
  PhoneCall,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  LogIn,
  AlertTriangle,
  Ban,
  CheckCircle2,
} from 'lucide-react';

export default function ChatMessage({
  message,
  onBookDoctor,
  onCancelAppointment,
  onOpenLogin,
}) {
  const isUser = message.sender === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-speech helper
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text
      .replace(/[#*`_]/g, '')
      .replace(/•/g, '')
      .replace(/https?:\/\/[^\s]+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to parse simple markdown to JSX safely
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-sm text-slate-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className="ml-2 text-xs text-slate-700 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>');
  };

  const metadata = message.metadata || {};

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
          isUser
            ? 'bg-sky-600 text-white'
            : metadata.isEmergency
            ? 'bg-red-600 text-white animate-bounce'
            : 'bg-gradient-to-tr from-sky-600 to-teal-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Main Message Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs relative ${
            isUser
              ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
              : metadata.isEmergency
              ? 'bg-red-50 text-red-950 border border-red-200 rounded-tl-none shadow-sm'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
          }`}
        >
          {/* Audio TTS toggle button for bot messages */}
          {!isUser && (
            <button
              onClick={() => handleSpeak(message.text)}
              className="absolute top-2 right-2 text-slate-400 hover:text-sky-600 transition-colors p-1"
              title={isSpeaking ? 'Stop speaking' : 'Listen to message'}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <div className="pr-5">{renderFormattedText(message.text)}</div>

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-2 text-right ${
              isUser ? 'text-sky-100' : 'text-slate-400'
            }`}
          >
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </div>
        </div>

        {/* Rich Cards Section: Emergency Alert */}
        {metadata.isEmergency && (
          <div className="mt-3 p-4 rounded-2xl bg-red-600 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>EMERGENCY DISPATCH INITIATED</span>
            </div>
            <p className="text-xs text-red-100">
              MetroHealth Trauma Center is located at <strong>Ground Floor, Gate 1</strong>. Immediate clinical support is on standby 24/7.
            </p>
            <a
              href="tel:+18005550911"
              className="w-full py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency Hotline +1 (800) 555-0911</span>
            </a>
          </div>
        )}

        {/* Rich Cards Section: Doctors List */}
        {metadata.action === 'SHOW_DOCTORS' && Array.isArray(metadata.data) && metadata.data.length > 0 && (
          <div className="mt-3 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Available Doctors ({metadata.data.length})
            </p>
            <div className="space-y-2">
              {metadata.data.slice(0, 3).map((doc) => (
                <div
                  key={doc._id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                      alt={doc.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">
                        Dr. {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-bold">
                        ${doc.consultationFee} • {doc.opdTimings}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookDoctor(doc)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rich Cards Section: Appointments List */}
        {metadata.action === 'SHOW_APPOINTMENTS' && Array.isArray(metadata.data) && metadata.data.length > 0 && (
          <div className="mt-3 space-y-2">
            {metadata.data.map((appt) => (
              <div
                key={appt._id}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                    {appt.tokenNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      appt.status === 'scheduled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Dr. {appt.doctor?.name || 'Doctor'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {new Date(appt.appointmentDate).toDateString()} at {appt.timeSlot}
                  </p>
                </div>

                {appt.status === 'scheduled' && (
                  <button
                    onClick={() => onCancelAppointment(appt._id)}
                    className="w-full py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel This Appointment</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rich Card: Login Requirement Prompt */}
        {metadata.action === 'REQUIRE_LOGIN' && (
          <div className="mt-3 p-3 bg-sky-50 rounded-xl border border-sky-200 text-center">
            <p className="text-xs text-sky-900 font-semibold mb-2">
              Sign in to your patient account to access personal records & book slots.
            </p>
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In to Patient Portal</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
