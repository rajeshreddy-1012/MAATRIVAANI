import React, { useState } from 'react';
import {
  Layers,
  Volume2,
  ArrowLeft,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Square,
  Play
} from 'lucide-react';
import { Flashcard, LanguageCode } from '../types';
import { FLASHCARDS_DATA, SUPPORTED_LANGUAGES } from '../data/mockData';
import { audioService } from '../services/audioService';

interface FlashcardsModuleProps {
  onBack: () => void;
  targetLang: LanguageCode;
  initialCategory?: string;
}

export const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({
  onBack,
  targetLang,
  initialCategory = 'All',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'study' | 'grid'>('study');

  const categories = [
    'All',
    'Animals',
    'Fruits',
    'Vegetables',
    'Numbers',
    'Colors',
    'Body parts',
    'Family',
    'Nature',
    'Classroom objects',
  ];

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const filteredCards = FLASHCARDS_DATA.filter(
    (c) => selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const currentCard = filteredCards[currentIndex] || FLASHCARDS_DATA[0];

  const handlePlayAudio = (e: React.MouseEvent, card: Flashcard) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      audioService.stopAudio();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const spoken = card.phoneticGuide || card.targetWord;
    audioService.playAudio(
      spoken,
      null,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleNext = () => {
    setIsFlipped(false);
    audioService.stopAudio();
    setIsPlayingAudio(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    audioService.stopAudio();
    setIsPlayingAudio(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Visual Foundational Vocabulary
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              VISUAL FLASHCARDS
            </h1>
          </div>
        </div>

        {/* View Mode Toggle: Interactive Study vs Grid Overview */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-bold text-stone-700">
            <button
              onClick={() => setViewMode('study')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'study' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
              }`}
            >
              Flip Study Mode
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
              }`}
            >
              All Cards Grid
            </button>
          </div>
        </div>
      </div>

      {/* 9 Categories Horizontal Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-purple-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mode 1: Interactive Flip Card Study Mode */}
      {viewMode === 'study' ? (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto py-4">
          {/* Progress Indicator */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-stone-500 mb-3 px-2">
            <span>Category: {currentCard.category}</span>
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
          </div>

          {/* FLIP CARD CONTAINER */}
          <div
            id="flashcard-study-card"
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-96 rounded-3xl bg-white border-2 border-stone-200 hover:border-purple-400 shadow-xl cursor-pointer p-8 flex flex-col justify-between items-center text-center transition-all duration-300 relative select-none group"
          >
            {/* Top Indicator */}
            <div className="w-full flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-stone-100 font-bold text-stone-600">
                {isFlipped ? `${targetLangObj.name} Side` : 'Hindi Side'}
              </span>
              <span className="text-[11px] text-stone-400 flex items-center gap-1 group-hover:text-purple-600">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap to flip</span>
              </span>
            </div>

            {/* Central Graphic / Emoji */}
            <div className="text-8xl my-auto animate-bounce">
              {currentCard.visualEmoji}
            </div>

            {/* Bottom Content depending on flipped state */}
            <div className="w-full space-y-2">
              {!isFlipped ? (
                <div>
                  <h3 className="text-3xl font-black text-stone-900">
                    {currentCard.hindiWord}
                  </h3>
                  <p className="text-sm font-semibold text-stone-500">
                    {currentCard.englishMeaning}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <h3 className="text-3xl font-black text-purple-900 font-serif">
                    {currentCard.targetWord}
                  </h3>
                  <p className="text-sm font-bold text-stone-700">
                    🗣️ &ldquo;{currentCard.phoneticGuide}&rdquo;
                  </p>
                  <p className="text-xs text-stone-500">
                    Hindi: {currentCard.hindiWord} ({currentCard.englishMeaning})
                  </p>
                </div>
              )}

              {/* Pronunciation Speaker Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => handlePlayAudio(e, currentCard)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs shadow-xs transition"
                >
                  <Volume2 className="w-4 h-4 text-purple-700" />
                  <span>Listen in {targetLangObj.name}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Prev / Next */}
          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-xs transition flex items-center gap-1"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCw className="w-4 h-4" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition flex items-center gap-1"
            >
              <span>Next Card</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Grid Overview of All Flashcards */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-purple-400 hover:shadow-md transition text-center flex flex-col justify-between group"
            >
              <div className="text-5xl mb-2 group-hover:scale-110 transition">
                {card.visualEmoji}
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  {card.category}
                </span>
                <h4 className="text-base font-black text-stone-900 mt-0.5">
                  {card.hindiWord}
                </h4>
                <p className="text-sm font-bold text-purple-900 font-serif mt-0.5">
                  {card.targetWord}
                </p>
                <p className="text-[11px] text-stone-500 italic">
                  &ldquo;{card.phoneticGuide}&rdquo;
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100">
                <button
                  onClick={(e) => handlePlayAudio(e, card)}
                  className="w-full py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>Pronounce</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
