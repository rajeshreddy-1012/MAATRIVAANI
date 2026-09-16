import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Mic,
  FileText,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Square,
  Languages
} from 'lucide-react';
import { Lesson, LanguageCode } from '../types';
import { EDUCATIONAL_LESSONS, SUPPORTED_LANGUAGES } from '../data/mockData';
import { audioService } from '../services/audioService';

interface LessonsModuleProps {
  onBack: () => void;
  targetLang: LanguageCode;
  onStartVoiceWithTopic?: (topic: string) => void;
  onGenerateWorksheetForLesson?: (lesson: Lesson) => void;
  onViewFlashcards?: (category: string) => void;
}

export const LessonsModule: React.FC<LessonsModuleProps> = ({
  onBack,
  targetLang,
  onStartVoiceWithTopic,
  onGenerateWorksheetForLesson,
  onViewFlashcards,
}) => {
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson>(EDUCATIONAL_LESSONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showTargetScript, setShowTargetScript] = useState<boolean>(true);

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const filteredLessons = EDUCATIONAL_LESSONS.filter((les) => {
    const classMatch = selectedClass === 0 || les.classGrade === selectedClass;
    const subjectMatch =
      selectedSubject === 'All' || les.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    return classMatch && subjectMatch;
  });

  const handlePlaySectionAudio = async (textToSpeak: string, phoneticGuide?: string) => {
    if (isPlayingAudio) {
      audioService.stopAudio();
      setIsPlayingAudio(false);
      return;
    }
    const spoken = phoneticGuide || textToSpeak;
    if (!spoken) return;

    setIsPlayingAudio(true);
    audioService.playChime('start');

    try {
      let base64Audio: string | null = null;
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          phonetic: spoken,
          language: targetLang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          base64Audio = data.audioBase64;
        }
      }

      await audioService.playAudio(
        spoken,
        base64Audio,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    } catch (e) {
      await audioService.playAudio(
        spoken,
        null,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Primary Curriculum Bridge
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              EDUCATIONAL LESSONS
            </h1>
          </div>
        </div>

        {/* Filter Controls: Class & Subject */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
            <span className="px-2 text-stone-400">Class:</span>
            {[1, 2, 3, 4, 5].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedClass === cls
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'hover:bg-white text-stone-600'
                }`}
              >
                C{cls}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white border border-stone-300 text-xs font-bold text-stone-800 rounded-xl py-1.5 px-3 shadow-xs focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Subjects</option>
            <option value="EVS">EVS (पर्यावरण)</option>
            <option value="गणित">Mathematics (गणित)</option>
            <option value="भाषा">Language (भाषा)</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Lesson Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Directory Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            <span>Available Lessons ({filteredLessons.length})</span>
            <span>Hierarchy: Class → Subject</span>
          </div>

          <div className="space-y-2.5">
            {filteredLessons.map((les) => (
              <button
                key={les.id}
                onClick={() => {
                  setActiveLesson(les);
                  audioService.stopAudio();
                  setIsPlayingAudio(false);
                }}
                className={`w-full p-4 text-left rounded-2xl border transition flex flex-col justify-between ${
                  activeLesson.id === les.id
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    Class {les.classGrade} • {les.subject}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    {les.nipunOutcomeCode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug">
                  {les.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {les.summaryHindi}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Full Bilingual Lesson Content & Action Hub */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Lesson Header */}
          <div className="pb-4 border-b border-stone-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {activeLesson.chapter}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTargetScript(!showTargetScript)}
                  className="text-xs font-semibold px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300 transition flex items-center gap-1.5"
                >
                  <Languages className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {showTargetScript ? 'Hide Tribal Script' : 'Show Tribal Script'}
                  </span>
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-black text-stone-900">
              {activeLesson.titleHindi}
            </h2>
            {showTargetScript && (
              <p className="text-lg font-bold text-amber-900 font-serif mt-1">
                {activeLesson.titleTarget}
              </p>
            )}
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {activeLesson.summaryHindi}
            </p>
          </div>

          {/* Action Toolbar for this specific Lesson */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-700 px-1">Lesson Actions:</span>

            {/* 1. Start Voice Mode with this lesson */}
            <button
              onClick={() => onStartVoiceWithTopic && onStartVoiceWithTopic(activeLesson.title)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Live Voice</span>
            </button>

            {/* 2. Generate Worksheet */}
            <button
              onClick={() => onGenerateWorksheetForLesson && onGenerateWorksheetForLesson(activeLesson)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Worksheet</span>
            </button>

            {/* 3. Generate / View Flashcards */}
            <button
              onClick={() => onViewFlashcards && onViewFlashcards('Nature')}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View Flashcards</span>
            </button>
          </div>

          {/* Lesson Content Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Lesson Sections & Mother-Tongue Narration
            </h3>

            {activeLesson.contentSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-stone-900">
                    {sec.headingHindi}
                  </h4>
                  <button
                    onClick={() => handlePlaySectionAudio(sec.bodyTarget, sec.phoneticGuide)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-amber-50 hover:text-amber-800 text-xs font-bold text-stone-700 shadow-2xs transition"
                  >
                    <Volume2 className="w-4 h-4 text-amber-600" />
                    <span>Listen Aloud</span>
                  </button>
                </div>

                <p className="text-sm text-stone-800 leading-relaxed">
                  {sec.bodyHindi}
                </p>

                {showTargetScript && (
                  <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 space-y-1">
                    <p className="text-base font-bold text-amber-950 font-serif leading-relaxed">
                      {sec.bodyTarget}
                    </p>
                    {sec.phoneticGuide && (
                      <p className="text-xs font-semibold text-amber-800 italic">
                        🗣️ Pronunciation: &ldquo;{sec.phoneticGuide}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Vocabulary Table */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
              Key Classroom Vocabulary (हिन्दी ⇄ {targetLangObj.name})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeLesson.keyVocabulary.map((voc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-stone-200 text-xs shadow-2xs"
                >
                  <span className="font-bold text-stone-900 block">{voc.hindi}</span>
                  <span className="font-bold text-amber-800 font-serif block mt-0.5">
                    {voc.target}
                  </span>
                  <span className="text-[11px] text-stone-500 italic block">
                    &ldquo;{voc.phonetic}&rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
