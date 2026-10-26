import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { NipunOutcome, Lesson } from '../types';
import { NIPUN_OUTCOMES_DATA, EDUCATIONAL_LESSONS } from '../data/mockData';

interface LearningOutcomesProps {
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenWorksheetWithOutcome?: (outcomeCode: string) => void;
}

export const LearningOutcomes: React.FC<LearningOutcomesProps> = ({
  onBack,
  onSelectLesson,
  onOpenWorksheetWithOutcome,
}) => {
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [activeOutcome, setActiveOutcome] = useState<NipunOutcome>(NIPUN_OUTCOMES_DATA[0]);

  const filteredOutcomes = NIPUN_OUTCOMES_DATA.filter((o) => {
    const classMatch = selectedClass === 0 || o.classGrade === selectedClass;
    const domainMatch = selectedDomain === 'All' || o.domain === selectedDomain;
    return classMatch && domainMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Achieved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              National Foundational Literacy & Numeracy
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              NIPUN BHARAT LEARNING OUTCOMES
            </h1>
          </div>
        </div>

        {/* Filters: Class & Domain */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
            <span className="px-2 text-stone-400">Class:</span>
            {[0, 1, 2, 3].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedClass === c
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'hover:bg-white text-stone-600'
                }`}
              >
                {c === 0 ? 'All' : `C${c}`}
              </button>
            ))}
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-white border border-stone-300 text-xs font-bold text-stone-800 rounded-xl py-1.5 px-3 shadow-xs"
          >
            <option value="All">All Domains</option>
            <option value="Foundational Literacy">Foundational Literacy</option>
            <option value="Foundational Numeracy">Foundational Numeracy</option>
            <option value="Environmental & Scientific Awareness">EVS & Science</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Structure: Outcome List & Pedagogical Pipeline Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Outcomes Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            <span>FLN Lakshya Targets ({filteredOutcomes.length})</span>
            <span>Classroom Mastery</span>
          </div>

          <div className="space-y-2.5">
            {filteredOutcomes.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveOutcome(item)}
                className={`w-full p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  activeOutcome.id === item.id
                    ? 'bg-teal-50/80 border-teal-400 ring-2 ring-teal-500/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono">
                    {item.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status} ({item.masteryPercentage}%)
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900 leading-snug">
                  {item.descriptionHindi}
                </h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                  {item.descriptionEnglish}
                </p>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${item.masteryPercentage}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Pedagogical Pipeline Tracker (Outcome → Lesson → Activity → Worksheet → Assessment) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Active Outcome Details */}
          <div className="pb-4 border-b border-stone-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                {activeOutcome.domain} • Class {activeOutcome.classGrade}
              </span>
              <span className="font-mono text-xs font-extrabold text-stone-700">
                {activeOutcome.code}
              </span>
            </div>

            <h2 className="text-xl font-black text-stone-900 mt-1">
              {activeOutcome.descriptionHindi}
            </h2>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {activeOutcome.descriptionEnglish}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Classroom Mastery
                </span>
                <span className="text-lg font-black text-teal-800">
                  {activeOutcome.masteryPercentage}%
                </span>
              </div>
              <div className="h-8 w-px bg-stone-200"></div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Target Language
                </span>
                <span className="text-stone-800 font-bold">
                  Santhali (Ol Chiki) + Hindi
                </span>
              </div>
            </div>
          </div>

          {/* THE 5-STEP PEDAGOGICAL PIPELINE */}
          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
              Pedagogical Pipeline Execution
            </h3>

            <div className="space-y-4">
              {/* Step 1: Learning Outcome */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-teal-900">
                    Foundational Learning Outcome (Lakshya)
                  </h4>
                  <p className="text-xs text-stone-700 mt-0.5">
                    {activeOutcome.code}: {activeOutcome.descriptionHindi}
                  </p>
                </div>
              </div>

              {/* Step 2: Mapped Curriculum Lesson */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-amber-900">
                      Curriculum Lesson
                    </h4>
                    <button
                      onClick={() => onSelectLesson(activeOutcome.mappedLessonId)}
                      className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <span>Open Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-700 mt-0.5 font-semibold">
                    {activeOutcome.mappedLessonTitle}
                  </p>
                </div>
              </div>

              {/* Step 3: Classroom Mother-Tongue Activity */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-purple-900">
                    Vernacular Mother-Tongue Activity
                  </h4>
                  <p className="text-xs text-stone-700 mt-0.5">
                    {activeOutcome.activityDescription}
                  </p>
                </div>
              </div>

              {/* Step 4: Bilingual Practice Worksheet */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-blue-900">
                      Practice Worksheet
                    </h4>
                    <button
                      onClick={() => onOpenWorksheetWithOutcome && onOpenWorksheetWithOutcome(activeOutcome.code)}
                      className="text-[11px] font-bold text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span>Generate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-700 mt-0.5">
                    Bilingual evaluation sheet aligned with {activeOutcome.code}.
                  </p>
                </div>
              </div>

              {/* Step 5: Formative Assessment */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  5
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-emerald-900">
                    Formative Assessment & Evidence
                  </h4>
                  <p className="text-xs text-stone-700 mt-0.5">
                    {activeOutcome.assessmentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
