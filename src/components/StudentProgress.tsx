import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  FileText,
  Mic,
  Star,
  CheckCircle2,
  ArrowLeft,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { StudentProgressRecord } from '../types';
import { storageService } from '../services/storageService';

interface StudentProgressProps {
  onBack: () => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({ onBack }) => {
  const [students, setStudents] = useState<StudentProgressRecord[]>(
    storageService.getStudentProgress()
  );
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRecord>(
    students[0]
  );

  // Classroom averages
  const avgLessons = (
    students.reduce((acc, s) => acc + s.lessonsCompleted, 0) / students.length
  ).toFixed(1);
  const avgQuiz = Math.round(
    students.reduce((acc, s) => acc + s.quizAverageScore, 0) / students.length
  );
  const totalVoiceMin = students.reduce((acc, s) => acc + s.voicePracticeMinutes, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Classroom Analytics & NIPUN Tracking
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              STUDENT PROGRESS & COMPETENCY
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 px-3 py-1.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
            Class 3A • Dumka District
          </span>
        </div>
      </div>

      {/* Classroom Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-stone-900">{avgLessons} / 15</span>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            Avg Lessons Completed
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-stone-900">{avgQuiz}%</span>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            Quiz Assessment Average
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-stone-900">{totalVoiceMin} min</span>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            Total Voice Practice Time
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-stone-900">88%</span>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            NIPUN FLN Retention
          </p>
        </div>
      </div>

      {/* Main Two-Column View: Student List + Detailed Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Student Roster Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            <span>Primary Students Roster ({students.length})</span>
            <span>FLN Level</span>
          </div>

          <div className="space-y-2.5">
            {students.map((st, i) => (
              <button
                key={st.id || st.studentId || `student-${i}`}
                onClick={() => setSelectedStudent(st)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  (selectedStudent.id || selectedStudent.studentId) === (st.id || st.studentId)
                    ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 font-black text-sm flex items-center justify-center border border-stone-200">
                    {st.rollNumber || `0${i + 1}`}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      {st.name || st.studentName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Mother Tongue: <span className="font-semibold">{st.primaryLanguage || 'संथाली (Santhali)'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-indigo-900 block">
                    {st.quizAverageScore}%
                  </span>
                  <span className="text-[10px] font-bold text-stone-400">
                    {st.lessonsCompleted}/{st.totalLessons} Lessons
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Student Mastery Profile */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  Roll No: {selectedStudent.rollNumber || selectedStudent.studentId || '01'}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  FLN Ready
                </span>
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                {selectedStudent.name || selectedStudent.studentName}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Primary Language: {selectedStudent.primaryLanguage || 'संथाली (Santhali)'} • Last Active: {selectedStudent.lastActiveDate || selectedStudent.lastActive || 'आज'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-indigo-700">
                {selectedStudent.quizAverageScore}%
              </span>
              <p className="text-xs font-semibold text-stone-400">Overall Score</p>
            </div>
          </div>

          {/* Metric Breakdown Progress Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Competency Breakdown
            </h3>

            {/* 1. Lessons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Lessons Completed</span>
                <span className="text-stone-900">
                  {selectedStudent.lessonsCompleted} / {selectedStudent.totalLessons} (
                  {Math.round((selectedStudent.lessonsCompleted / selectedStudent.totalLessons) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{
                    width: `${(selectedStudent.lessonsCompleted / selectedStudent.totalLessons) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 2. Worksheets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Worksheets Submitted</span>
                <span className="text-stone-900">
                  {selectedStudent.worksheetsCompleted} / {selectedStudent.totalWorksheets || 10}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{
                    width: `${(selectedStudent.worksheetsCompleted / (selectedStudent.totalWorksheets || 10)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 3. Voice Minutes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Live Voice Practice</span>
                <span className="text-amber-800">
                  {selectedStudent.voicePracticeMinutes} minutes logged
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (selectedStudent.voicePracticeMinutes / 60) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mastered NIPUN Competencies Chips */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              Mastered NIPUN Bharat Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(selectedStudent.nipunCompetenciesMastered || selectedStudent.nipunOutcomesMastered || ['FLN-LANG-C1-01']).map((comp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{comp}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
