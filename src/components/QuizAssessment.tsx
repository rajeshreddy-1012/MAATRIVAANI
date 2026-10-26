import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';

interface QuizAssessmentProps {
  onBack: () => void;
  targetLang: LanguageCode;
}

interface QuestionItem {
  id: number;
  questionHindi: string;
  questionTarget: string;
  phonetic: string;
  visualEmoji: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUIZ_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    questionHindi: 'पेड़ को संथाली में क्या कहते हैं?',
    questionTarget: 'ᱫᱟᱨᱮ ᱫᱚ ᱦᱤᱱᱫᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜ-ᱟ?',
    phonetic: 'Dare do hindi te ched ko metag-a?',
    visualEmoji: '🌳',
    options: [
      { text: 'ᱫᱟᱨᱮ (Dare / Tree)', isCorrect: true },
      { text: 'ᱫᱟᱜ (Daag / Water)', isCorrect: false },
      { text: 'ᱥᱮᱸᱜᱮᱞ (Sengel / Fire)', isCorrect: false },
      { text: 'ᱦᱚᱭ (Hoy / Wind)', isCorrect: false },
    ],
    explanation: 'ᱫᱟᱨᱮ (Dare) means Tree or पेड़ in Hindi.',
  },
  {
    id: 2,
    questionHindi: 'हाथी (Elephant) को संथाली में क्या कहते हैं?',
    questionTarget: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟᱭ?',
    phonetic: 'Haati do ched kanay?',
    visualEmoji: '🐘',
    options: [
      { text: 'ᱛᱟᱹᱨᱩᱵ (Tarub / Tiger)', isCorrect: false },
      { text: 'ᱦᱟᱹᱛᱤ (Haati / Elephant)', isCorrect: true },
      { text: 'ᱜᱟᱹᱭ (Gai / Cow)', isCorrect: false },
      { text: 'ᱥᱮᱛᱟ (Seta / Dog)', isCorrect: false },
    ],
    explanation: 'ᱦᱟᱹᱛᱤ (Haati) is Elephant.',
  },
  {
    id: 3,
    questionHindi: 'पौधों को भोजन बनाने के लिए क्या चाहिए?',
    questionTarget: 'ᱫᱟᱨᱮ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱫᱚᱨᱠᱟᱨ?',
    phonetic: 'Dare jomag benaw lagid ched dorkar?',
    visualEmoji: '☀️',
    options: [
      { text: 'पानी और धूप (ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ)', isCorrect: true },
      { text: 'सिर्फ बर्फ (Only Ice)', isCorrect: false },
      { text: 'अंधेरा (Darkness)', isCorrect: false },
      { text: 'चॉकलेट (Chocolate)', isCorrect: false },
    ],
    explanation: 'पौधे धूप और पानी से प्रकाश-संश्लेषण करते हैं।',
  },
  {
    id: 4,
    questionHindi: 'संथाली में संख्या ३ (Three) को क्या कहते हैं?',
    questionTarget: 'ᱮᱞ ᱓ ᱫᱚ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜ-ᱟ?',
    phonetic: 'El 3 do ched ko metag-a?',
    visualEmoji: '🔢',
    options: [
      { text: 'ᱢᱤᱫ (Mit / 1)', isCorrect: false },
      { text: 'ᱵᱟᱨ (Bar / 2)', isCorrect: false },
      { text: 'ᱯᱮ (Pey / 3)', isCorrect: true },
      { text: 'ᱯᱩᱱ (Pun / 4)', isCorrect: false },
    ],
    explanation: 'ᱯᱮ (Pey) means Three (३).',
  },
];

export const QuizAssessment: React.FC<QuizAssessmentProps> = ({ onBack, targetLang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      audioService.playChime('success');
    } else {
      audioService.playChime('complete');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      storageService.saveQuizAttempt({
        id: `quiz-${Date.now()}`,
        studentId: 'student-01',
        lessonId: 'les-01',
        score: score + (selectedOption !== null && currentQ.options[selectedOption].isCorrect ? 1 : 0),
        totalQuestions: QUIZ_QUESTIONS.length,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handlePlayQuestionAudio = () => {
    audioService.playAudio(`${currentQ.questionHindi} - ${currentQ.phonetic}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white rounded-xl border border-stone-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Practice</span>
        </button>

        {!isCompleted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
              <span>{score} Stars</span>
            </div>
          </div>
        )}
      </div>

      {!isCompleted ? (
        /* Quiz Question Card */
        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl p-6 sm:p-8 text-center space-y-6">
          {/* Big Visual Emoji */}
          <div className="text-6xl animate-bounce my-2">{currentQ.visualEmoji}</div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              {currentQ.questionHindi}
            </h2>
            <p className="text-lg font-bold text-amber-900 font-serif">
              {currentQ.questionTarget}
            </p>
            <p className="text-xs text-stone-500 italic">
              🗣️ Pronunciation: &ldquo;{currentQ.phonetic}&rdquo;
            </p>

            <button
              onClick={handlePlayQuestionAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-100 text-amber-900 text-xs font-bold transition mt-2"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Question</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:border-amber-400';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (selectedOption === idx) {
                  btnStyle = 'bg-red-100 border-red-400 text-red-950 font-bold';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  )}
                  {isAnswered && selectedOption === idx && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-stone-100 space-y-4 animate-fadeIn">
              <p className="text-xs font-bold text-stone-600">
                💡 {currentQ.explanation}
              </p>

              <button
                onClick={handleNext}
                className="w-full py-3 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'See My Stars'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Celebration Card */
        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl p-8 text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              शाबाश! बहुत बढ़िया! 🎉
            </h2>
            <p className="text-sm font-semibold text-stone-500 mt-1">
              You completed the practice game!
            </p>
          </div>

          {/* Stars display */}
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200">
            <div className="flex items-center justify-center gap-2">
              {[...Array(QUIZ_QUESTIONS.length)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < score
                      ? 'fill-amber-500 text-amber-500'
                      : 'fill-stone-200 text-stone-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-lg font-black text-amber-900 mt-3">
              Score: {score} / {QUIZ_QUESTIONS.length}
            </p>
            <p className="text-xs text-amber-800 mt-1">
              {score === QUIZ_QUESTIONS.length
                ? '🌟 Perfect score! Gold Badge awarded!'
                : 'Keep practicing to master your mother-tongue vocabulary!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
