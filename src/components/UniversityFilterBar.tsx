import React from 'react';
import { UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { GraduationCap, MapPin } from 'lucide-react';

interface UniversityFilterBarProps {
  selectedUniversity: UniversityId;
  onSelectUniversity: (id: UniversityId) => void;
}

export const UniversityFilterBar: React.FC<UniversityFilterBarProps> = ({
  selectedUniversity,
  onSelectUniversity,
}) => {
  const activeUni = UNIVERSITIES.find((u) => u.id === selectedUniversity) || UNIVERSITIES[0];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Select Campus Hub</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{activeUni.city}</span>
            <span>·</span>
            <span className="italic">{activeUni.studentSlang}</span>
          </div>
        </div>

        {/* Horizontal scrollable university selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {UNIVERSITIES.map((uni) => {
            const isSelected = selectedUniversity === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => onSelectUniversity(uni.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm font-semibold ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                aria-label={`Filter by ${uni.name}`}
              >
                {uni.shortName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
