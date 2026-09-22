import React from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function EmergencyBanner({ onOpenChat }) {
  return (
    <section id="emergency" className="py-14 bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4 backdrop-blur-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>CRITICAL CARE & TRAUMA TRIAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Facing a Medical Emergency?
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">
              Do not hesitate. Our Level 1 Trauma Center, cardiac catheterization labs, stroke resuscitation units, and adult/pediatric ICUs are operational 24/7 with zero waiting time.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start text-xs font-semibold text-red-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>24/7 Rapid Ambulance Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Gate 1, Emergency Ground Floor</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <a
              href="tel:+18005550911"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <span>Call +1 (800) 555-0911</span>
            </a>

            <button
              onClick={() => onOpenChat('I have an urgent medical emergency. Please guide me immediately.')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-red-950/60 hover:bg-red-950/80 text-white font-bold text-sm border border-white/30 backdrop-blur-md transition-all cursor-pointer text-center"
            >
              Get MediBot Emergency Triage
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
