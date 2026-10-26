import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Layers,
  Award,
  Volume2,
  Sparkles,
  Star,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { audioService } from '../services/audioService';

interface StudentDashboardProps {
  user: UserProfile;
  targetLang: LanguageCode;
  onNavigate: (screen: string) => void;
  onStartQuiz: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  targetLang,
  onNavigate,
  onStartQuiz,
}) => {
  const [starsEarned, setStarsEarned] = useState(18);

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const studentActions = [
    {
      id: 'learn',
      title: '📚 Learn (पाठ पढ़ें)',
      subtitle: 'मजेदार पाठ और कहानियाँ',
      screen: 'lessons',
      bgColor: 'bg-emerald-500 hover:bg-emerald-600',
      textColor: 'text-white',
      badge: '3 New Lessons',
    },
    {
      id: 'speak',
      title: '🎤 Speak (बोलें)',
      subtitle: 'अपनी भाषा में बोलें और सीखें',
      screen: 'live-voice',
      bgColor: 'bg-amber-500 hover:bg-amber-600',
      textColor: 'text-white',
      badge: 'Real-Time Voice',
    },
    {
      id: 'flashcards',
      title: '🖼️ Flashcards (चित्र कार्ड)',
      subtitle: 'जानवर, फल, रंग और संख्याएँ',
      screen: 'flashcards',
      bgColor: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white',
      badge: 'Fun Cards',
    },
    {
      id: 'practice',
      title: '📝 Practice (अभ्यास खेल)',
      subtitle: 'तारे जीतें और खेल-खेल में सीखें',
      action: onStartQuiz,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      badge: 'Earn 5 Stars',
    },
    {
      id: 'listen',
      title: '🔊 Listen (ध्वनि सुनें)',
      subtitle: 'संथाली और हिंदी शुद्ध उच्चारण',
      screen: 'text-trans',
      bgColor: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
      badge: 'Audio Voices',
    },
    {
      id: 'progress',
      title: '🏆 Progress (मेरी उपलब्धियाँ)',
      subtitle: 'आपने क्या-क्या सीखा',
      screen: 'progress',
      bgColor: 'bg-teal-500 hover:bg-teal-600',
      textColor: 'text-white',
      badge: 'Badge Level 2',
    },
  ];

  const handlePlayWelcomeAudio = () => {
    audioService.playChime('success');
    audioService.playAudio(
      'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ! ᱛᱮᱦᱮᱧ ᱪᱮᱫ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ? (Johar Gidra! Welcome to learning!)'
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Friendly Child Banner Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur">
              <span>🌟 Primary Class {user.classGrade} Learner</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              नमस्ते, {user.name.split(' ')[0]}! 🌈
            </h1>
            <p className="text-emerald-100 text-sm font-medium">
              आपकी मातृभाषा <span className="font-bold underline">{targetLangObj.name}</span> में आपका स्वागत है!
            </p>
          </div>

          {/* Gamified Star Counter & Audio Greeting */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 font-black shadow-lg text-lg animate-pulse">
              <Star className="w-6 h-6 fill-amber-950 text-amber-950" />
              <span>{starsEarned} Stars</span>
            </div>

            <button
              onClick={handlePlayWelcomeAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>सुनें (Listen)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Child-Friendly Primary Buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-stone-900">
            आज आप क्या करना चाहते हैं?
          </h2>
          <span className="text-xs font-bold text-stone-400">
            Tap any activity to start
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {studentActions.map((btn) => (
            <button
              key={btn.id}
              onClick={() => (btn.action ? btn.action() : onNavigate(btn.screen!))}
              className={`p-6 sm:p-7 rounded-3xl ${btn.bgColor} ${btn.textColor} shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left flex flex-col justify-between min-h-[160px] relative overflow-hidden group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur">
                    {btn.badge}
                  </span>
                  <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  {btn.title}
                </h3>
              </div>

              <p className="text-xs font-semibold opacity-90 mt-3">
                {btn.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Motivation Card */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🌱</div>
          <div>
            <h4 className="font-extrabold text-base">
              दैनिक शब्द (Word of the Day): ᱫᱟᱨᱮ (Dare / पेड़)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              पेड़ हमें छाया, फल और शुद्ध हवा देते हैं।
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            audioService.playAudio('ᱫᱟᱨᱮ (Dare - Tree)');
          }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5"
        >
          <Volume2 className="w-4 h-4" />
          <span>उच्चारण सुनें</span>
        </button>
      </div>
    </div>
  );
};
