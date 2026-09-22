import React from 'react';
import { Bot, Calendar, PhoneCall, ShieldCheck, Clock, Award, Star } from 'lucide-react';

export default function HeroSection({ onOpenChat, onBookNow }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-sky-50/70 via-slate-50 to-white">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-6 shadow-xs border border-sky-200">
              <span className="flex h-2 w-2 rounded-full bg-sky-600 animate-ping" />
              <span>Introducing MediBot AI • 24/7 Instant Patient Assistance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              World-Class Healthcare,{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Powered by Compassion & AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to MetroHealth Memorial Hospital. Connect with world-renowned specialists, access round-the-clock emergency care, or chat instantly with <strong>MediBot</strong> for real-time doctor schedules, appointments, and hospital guidance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                onClick={onOpenChat}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Bot className="w-5 h-5 text-sky-200" />
                <span>Chat with MediBot AI</span>
              </button>

              <button
                onClick={onBookNow}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-sky-600" />
                <span>Find Doctors & Book</span>
              </button>
            </div>

            {/* Micro Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-slate-900">4.9/5</p>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center lg:justify-start">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 12,000+ Reviews
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">24/7</p>
                <p className="text-xs text-slate-500 font-medium">Emergency & Trauma</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Cashless Insurance</p>
              </div>
            </div>
          </div>

          {/* Right Hero Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-200/70 relative">
              {/* Bot Floating Notification */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 text-sm">MediBot Hospital AI</h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    "Hello! Need appointment slots or doctor guidance? Ask me anything!"
                  </p>
                </div>
              </div>

              {/* Sample AI Capabilities List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Live Hospital Timings & OPD</h3>
                    <p className="text-[11px] text-slate-500">Check active consultation hours and room numbers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Award className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Specialist Matching</h3>
                    <p className="text-[11px] text-slate-500">Find cardiologists, neurologists, oncologists & more</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Medical Safety First</h3>
                    <p className="text-[11px] text-slate-500">Ethical AI that prioritizes human clinical triage</p>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <button
                onClick={onOpenChat}
                className="w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch MediBot Assistant Now</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
