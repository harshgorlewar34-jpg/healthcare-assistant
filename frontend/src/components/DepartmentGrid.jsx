import React from 'react';
import {
  Heart,
  Brain,
  Baby,
  Bone,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Scan,
  Activity,
  ArrowRight,
} from 'lucide-react';

const iconMap = {
  Heart: Heart,
  Brain: Brain,
  Baby: Baby,
  Bone: Bone,
  ShieldAlert: ShieldAlert,
  Sparkles: Sparkles,
  Stethoscope: Stethoscope,
  Scan: Scan,
};

export default function DepartmentGrid({
  departments,
  selectedDepartment,
  onSelectDepartment,
  onAskBotAboutDept,
}) {
  return (
    <section id="departments" className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Centers of Clinical Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hospital Departments
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
              Equipped with cutting-edge medical technology and interdisciplinary specialist teams.
            </p>
          </div>

          {selectedDepartment && (
            <button
              onClick={() => onSelectDepartment(null)}
              className="mt-4 md:mt-0 text-xs font-bold text-sky-600 hover:text-sky-700 underline"
            >
              Clear filter (Showing all)
            </button>
          )}
        </div>

        {/* Departments Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const IconComponent = iconMap[dept.icon] || Activity;
            const isSelected = selectedDepartment === dept.code;

            return (
              <div
                key={dept._id || dept.code}
                className={`group relative rounded-2xl p-6 transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-sky-300 hover:shadow-lg'
                }`}
                onClick={() => onSelectDepartment(isSelected ? null : dept.code)}
              >
                {/* Icon & Code */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                </div>

                {/* Name & Details */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>

                {/* Common conditions tags */}
                {dept.commonConditions && dept.commonConditions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dept.commonConditions.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Info */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {dept.doctorCount || 'Multiple'} Specialists
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskBotAboutDept(dept);
                    }}
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={`Ask MediBot about ${dept.name}`}
                  >
                    <span>Ask Bot</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
