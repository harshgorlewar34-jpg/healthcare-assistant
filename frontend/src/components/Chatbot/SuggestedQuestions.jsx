import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedQuestions({ questions, onSelectQuestion }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="py-2 px-3 border-t border-slate-100 bg-slate-50/80">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
        <Sparkles className="w-3 h-3 text-sky-500" />
        <span>Suggested questions:</span>
      </div>
      <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-h-24 overflow-y-auto">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="text-xs font-medium text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 border border-slate-200 px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
