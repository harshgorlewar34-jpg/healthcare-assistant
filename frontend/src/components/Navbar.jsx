import React from 'react';
import { Activity, PhoneCall, Calendar, User, LogOut, HeartPulse } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onOpenMyAppointments, onLogout, onOpenChat }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Emergency & Info Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="font-semibold tracking-wide">24/7 EMERGENCY & TRAUMA CENTER:</span>
            <a
              href="tel:+18005550911"
              className="font-bold underline hover:text-red-100 flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" /> +1 (800) 555-0911
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-red-100">
            <span>OPD Hours: Mon - Sat 08:00 AM - 08:00 PM</span>
            <span>•</span>
            <span>Cashless Insurance TPA Desk: Desk 4 (Ground Floor)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Metro<span className="text-sky-600">Health</span>
              </span>
              <span className="text-xs uppercase px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800 font-semibold">
                Hospital
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Memorial & Specialty Medical Center</p>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#departments" className="hover:text-sky-600 transition-colors">
            Departments
          </a>
          <a href="#doctors" className="hover:text-sky-600 transition-colors">
            Specialists
          </a>
          <a href="#services" className="hover:text-sky-600 transition-colors">
            Hospital Timings
          </a>
          <a href="#emergency" className="hover:text-red-600 text-red-600/90 font-bold transition-colors">
            Emergency Care
          </a>
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 text-sm font-semibold transition-all shadow-xs"
          >
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Ask MediBot AI</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenMyAppointments}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-sm font-semibold transition-all"
                title="View your booked appointments"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                <span className="hidden md:inline">My Appointments</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded inline-block mt-0.5">
                    {user.medicalRecordNumber || 'PATIENT'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
