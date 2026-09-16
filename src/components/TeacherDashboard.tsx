import React from 'react';
import {
  Mic,
  Languages,
  BookOpen,
  FileText,
  Layers,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  ArrowRight,
  Wifi,
  WifiOff,
  GraduationCap,
  Play,
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';

interface TeacherDashboardProps {
  user: UserProfile;
  targetLang: LanguageCode;
  onChangeTargetLang: (lang: LanguageCode) => void;
  onNavigate: (screen: string) => void;
  isOffline: boolean;
  onStartDemoTour: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  targetLang,
  onChangeTargetLang,
  onNavigate,
  isOffline,
  onStartDemoTour,
}) => {
  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const dashboardCards = [
    {
      id: 'live-voice',
      title: 'Live Voice Translation',
      screen: 'live-voice',
      icon: Mic,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50 text-amber-900 border-amber-200',
      iconColor: 'text-amber-600',
      description: 'Hidden-script 2-way audio bridge between teacher Hindi & student mother tongue.',
      badge: 'Centerpiece • ≤ 3s',
      highlight: true,
    },
    {
      id: 'text-trans',
      title: 'Text Translation',
      screen: 'text-trans',
      icon: Languages,
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50 text-orange-900 border-orange-200',
      iconColor: 'text-orange-600',
      description: 'Interactive script translation with Ol Chiki writing and phonetic guides.',
      badge: 'Ol Chiki & Roman',
    },
    {
      id: 'lessons',
      title: 'Lessons',
      screen: 'lessons',
      icon: BookOpen,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      iconColor: 'text-emerald-600',
      description: 'Classes 1–5 NCERT/State curriculum translated paragraph-by-paragraph with audio.',
      badge: 'Class 1–5 EVS/Math',
    },
    {
      id: 'worksheets',
      title: 'Worksheets',
      screen: 'worksheets',
      icon: FileText,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-900 border-blue-200',
      iconColor: 'text-blue-600',
      description: 'Generate bilingual printed worksheets with MCQs, Fill-in-blanks, & pictures.',
      badge: 'Print & PDF Export',
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      screen: 'flashcards',
      icon: Layers,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-900 border-purple-200',
      iconColor: 'text-purple-600',
      description: '9 visual primary categories (Animals, Fruits, Numbers, Nature) with audio.',
      badge: '9 Categories',
    },
    {
      id: 'outcomes',
      title: 'Learning Outcomes',
      screen: 'outcomes',
      icon: Target,
      color: 'bg-teal-600',
      lightColor: 'bg-teal-50 text-teal-900 border-teal-200',
      iconColor: 'text-teal-600',
      description: 'Official NIPUN Bharat Foundational Literacy and Numeracy (FLN) tracker.',
      badge: 'NIPUN Lakshya FLN',
    },
    {
      id: 'progress',
      title: 'Student Progress',
      screen: 'progress',
      icon: BarChart3,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      iconColor: 'text-indigo-600',
      description: 'Track lesson completions, worksheet scores, and student mastery metrics.',
      badge: 'Analytics & Mastery',
    },
    {
      id: 'settings',
      title: 'Settings',
      screen: 'settings',
      icon: Settings,
      color: 'bg-stone-700',
      lightColor: 'bg-stone-100 text-stone-900 border-stone-300',
      iconColor: 'text-stone-700',
      description: 'Configure offline packs, audio playback rate, and classroom tablets.',
      badge: 'Offline Cache & Audio',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
            <span>{user.schoolName}</span>
            <span>•</span>
            <span>कक्षा {user.classGrade} (Class {user.classGrade})</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Good Morning, Teacher 👋
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Teaching in the learner&apos;s mother tongue with AI contextual understanding.
          </p>
        </div>

        {/* SIH Presentation Demo Button */}
        <div className="flex items-center gap-3">
          <button
            id="dash-start-tour-btn"
            onClick={onStartDemoTour}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/20 hover:from-amber-700 hover:to-amber-800 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>SIH 2026 Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Prominent Language Selection & Hero Action Banner */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute right-32 top-0 w-32 h-32 rounded-full bg-amber-500/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 backdrop-blur mb-3">
              <span>Selected Classroom Language Pair</span>
              {isOffline && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px]">
                  Offline Ready
                </span>
              )}
            </div>

            {/* Prominent Language Display */}
            <div className="flex flex-wrap items-center gap-3 text-2xl sm:text-4xl font-black tracking-tight">
              <span className="bg-white/10 px-3 py-1 rounded-xl">हिन्दी (Hindi)</span>
              <span className="text-amber-300 font-serif">→</span>
              <span className="bg-amber-500/30 px-3 py-1 rounded-xl text-amber-100 border border-amber-400/40">
                {targetLangObj.name} ({targetLangObj.nativeName})
              </span>
            </div>

            <p className="text-amber-100/90 text-xs sm:text-sm mt-3 leading-relaxed">
              Script: <span className="font-semibold text-white">{targetLangObj.script}</span> •{' '}
              Regions: <span className="font-semibold text-white">{targetLangObj.regions}</span> (
              {targetLangObj.speakersCount} speakers)
            </p>
          </div>

          {/* QUICK-ACTION BUTTON: START LIVE TRANSLATION */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="hero-start-live-trans"
              onClick={() => onNavigate('live-voice')}
              className="py-4 px-7 rounded-2xl font-black text-sm sm:text-base bg-white hover:bg-amber-50 text-amber-950 shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-3 group"
            >
              <span className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                <Mic className="w-5 h-5 animate-pulse" />
              </span>
              <span className="tracking-wide">START LIVE TRANSLATION</span>
              <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Quick Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-stone-900">28</span>
            <p className="text-xs text-stone-500">Students in Class</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-stone-900">12/15</span>
            <p className="text-xs text-stone-500">Curriculum Lessons</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-stone-900">4</span>
            <p className="text-xs text-stone-500">Bilingual Worksheets</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-stone-900">84%</span>
            <p className="text-xs text-stone-500">NIPUN FLN Mastery</p>
          </div>
        </div>
      </div>

      {/* Main 8 Module Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">
            Educational Modules & Tools
          </h2>
          <span className="text-xs text-stone-500">
            Click any card to open the assistant module
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                id={`card-${card.id}`}
                onClick={() => onNavigate(card.screen)}
                className={`p-6 rounded-3xl text-left bg-white border border-stone-200 hover:border-amber-400 hover:shadow-lg transition flex flex-col justify-between group relative overflow-hidden ${
                  card.highlight ? 'ring-2 ring-amber-500/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${card.lightColor} border flex items-center justify-center shadow-xs group-hover:scale-105 transition`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 group-hover:text-amber-800 transition">
                    {card.title}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
