import React from 'react';
import { HeartPulse, ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="services" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">MetroHealth</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              A quaternary care academic medical institution dedicated to patient-first clinical excellence, advanced medical research, and compassionate healing.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>450 Medical Center Boulevard, Healthcare District</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+1 (800) 555-0199 (Reception)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>care@metrohealth-hospital.org</span>
              </p>
            </div>
          </div>

          {/* Col 2: Hospital Timings */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Hospital Timings
            </h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              <li className="flex justify-between pb-1 border-b border-slate-800">
                <span>Emergency & Trauma</span>
                <span className="text-emerald-400 font-bold">24/7 Always Open</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-slate-800">
                <span>OPD Consultations</span>
                <span className="text-slate-200">08:00 AM – 08:00 PM</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-slate-800">
                <span>In-House Pharmacy</span>
                <span className="text-emerald-400 font-bold">24/7 (Ground Floor)</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-slate-800">
                <span>Lab Diagnostics</span>
                <span className="text-slate-200">07:00 AM – 09:00 PM</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-slate-800">
                <span>Visiting Hours</span>
                <span className="text-slate-200">11 AM - 1 PM & 5 PM - 7 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Care Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Patient Services
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Cashless Insurance Desk (Desk 4)</li>
              <li>• Online Lab Report Download</li>
              <li>• Ambulance Service & Dispatch</li>
              <li>• Preventive Health Checkup Packages</li>
              <li>• International Patient Assistance</li>
              <li>• Dietary & Nutritional Counseling</li>
            </ul>
          </div>

          {/* Col 4: Medical AI Disclaimer */}
          <div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>MediBot Safety Disclaimer</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                MediBot provides general healthcare educational guidance and administrative hospital assistance. It is not an alternative to licensed clinical diagnosis or prescription. Always consult a qualified medical professional for personal clinical concerns.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MetroHealth Memorial Hospital. All rights reserved.</p>
          <p>Powered by MediBot AI Clinical Suite</p>
        </div>
      </div>
    </footer>
  );
}
