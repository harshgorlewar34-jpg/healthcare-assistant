import React, { useState } from 'react';
import { Search, Star, Calendar, Clock, DollarSign, Award, Bot, CheckCircle } from 'lucide-react';

export default function DoctorDirectory({
  doctors,
  departments,
  selectedDepartment,
  onSelectDepartment,
  onBookDoctor,
  onAskBotAboutDoctor,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept =
      !selectedDepartment ||
      doc.department?.code === selectedDepartment ||
      doc.department?._id === selectedDepartment;

    const matchesSearch =
      searchTerm === '' ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDept && matchesSearch;
  });

  return (
    <section id="doctors" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Consult With Leading Medical Authorities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Specialist Physicians
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Schedule consultations or ask MediBot to recommend the ideal specialist based on your needs.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctor name, specialty, or condition..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedDepartment || ''}
              onChange={(e) => onSelectDepartment(e.target.value || null)}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 text-base font-semibold">
              No doctors found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                onSelectDepartment(null);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Card Top Banner & Image */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available Today" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating || 4.8}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount || 100}+)</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        Dr. {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md inline-block mt-1 truncate max-w-full">
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Info Details */}
                  <div className="px-5 pb-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <p className="text-slate-500 font-medium">
                      <span className="font-semibold text-slate-700">Dept:</span> {doc.department?.name || 'Specialty'}
                    </p>
                    <p className="text-slate-500">
                      <span className="font-semibold text-slate-700">Exp:</span> {doc.experienceYears} Years • {doc.qualification}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.opdTimings}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">Consultation Fee</span>
                      <span className="text-sm font-extrabold text-emerald-700">
                        ${doc.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onBookDoctor(doc)}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>

                  <button
                    onClick={() => onAskBotAboutDoctor(doc)}
                    className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer"
                    title={`Ask MediBot about Dr. ${doc.name}`}
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
