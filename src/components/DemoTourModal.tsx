import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Languages,
  BookOpen,
  FileText,
  Layers,
  Target,
  WifiOff
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToScreen: (screen: string) => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  badge: string;
  icon: any;
  targetScreen: string;
  description: string;
  keyHighlight: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: 'Smart India Hackathon • Problem SIH26042',
    badge: 'Context & Vision',
    icon: Sparkles,
    targetScreen: 'teacher-dashboard',
    description:
      'In primary schools across Jharkhand, Odisha, and West Bengal, teachers instruct in Hindi while young tribal children speak Santhali, Mundari, or Ho. MaatriVaani bridges this linguistic divide in early childhood education.',
    keyHighlight:
      'Key Metric: Over 8.5 million speakers covered, removing early dropouts caused by language barrier.',
  },
  {
    stepNumber: 2,
    title: 'Live Classroom: 2-Way Hidden-Script Audio Bridge',
    badge: 'Core Breakthrough',
    icon: Mic,
    targetScreen: 'live-voice',
    description:
      'The teacher speaks in Hindi. MaatriVaani translates and speaks aloud in Santhali within ≤3 seconds. Crucially, in Voice-to-Voice mode, the translated script is hidden so primary children experience a natural spoken conversation without reading strain.',
    keyHighlight:
      'Acoustic Pipeline: Teacher Hindi Speech → Internal Translation → Mother-Tongue Audio Output.',
  },
  {
    stepNumber: 3,
    title: 'Text Translation & Native Ol Chiki Script',
    badge: 'Dual Script Support',
    icon: Languages,
    targetScreen: 'text-trans',
    description:
      'For teachers preparing lesson plans, the Text Translator displays native Ol Chiki script alongside English Roman phonetic guides for accurate classroom pronunciation.',
    keyHighlight:
      'Includes verified vocabulary dictionary with real-time browser text-to-speech.',
  },
  {
    stepNumber: 4,
    title: 'Curriculum-Mapped Educational Lessons',
    badge: 'Classes 1–5 NCERT',
    icon: BookOpen,
    targetScreen: 'lessons',
    description:
      'Explore standard Class 1-5 Environmental Studies (EVS), Math, and Language lessons with paragraph-by-paragraph bilingual narration, audio playback, and instant live classroom launches.',
    keyHighlight:
      'Directly links textbook chapters (e.g. Parts of a Plant) with tribal vernacular terms.',
  },
  {
    stepNumber: 5,
    title: 'Bilingual Worksheet Generator (Print & PDF)',
    badge: 'Classroom Ready',
    icon: FileText,
    targetScreen: 'worksheets',
    description:
      'Instantly generate printable classroom worksheets featuring MCQs, Fill-in-the-blanks, Match-the-following, and picture-based questions with Hindi and Santhali side-by-side.',
    keyHighlight:
      'Includes Print (`window.print()`) and JSON export for rural teachers without internet.',
  },
  {
    stepNumber: 6,
    title: '9-Category Visual Flashcards with Audio',
    badge: 'Foundational Vocabulary',
    icon: Layers,
    targetScreen: 'flashcards',
    description:
      'Interactive visual flashcards covering Animals, Fruits, Vegetables, Numbers, Colors, Body parts, Family, Nature, and Classroom objects with high-contrast emojis and audio pronunciation.',
    keyHighlight:
      'Features interactive 3D Flip Card study mode tailored for young primary learners.',
  },
  {
    stepNumber: 7,
    title: 'NIPUN Bharat FLN Tracking & Offline Edge Mode',
    badge: 'National Mission',
    icon: Target,
    targetScreen: 'outcomes',
    description:
      'Maps every lesson and worksheet to official NIPUN Bharat Foundational Literacy and Numeracy (FLN) Lakshya competencies. Built with offline-first local caching for zero-internet rural classrooms.',
    keyHighlight:
      '5-Step Pipeline: Learning Outcome → Lesson → Activity → Worksheet → Assessment.',
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToScreen,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIdx + 1 < TOUR_STEPS.length) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleJumpAndClose = () => {
    onJumpToScreen(currentStep.targetScreen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                SIH26042 Presentation Guide
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                MAATRIVAANI DEMO WALKTHROUGH
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-amber-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
            <span>
              Step {currentStep.stepNumber} of {TOUR_STEPS.length}
            </span>
            <span className="text-amber-800 font-extrabold">{currentStep.badge}</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex gap-1">
            {TOUR_STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 rounded-full transition-all ${
                  idx <= currentStepIdx ? 'bg-amber-600' : 'bg-stone-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Step Card Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-stone-900 leading-snug">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Key Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{currentStep.keyHighlight}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200 text-xs font-bold transition disabled:opacity-30 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleJumpAndClose}
            className="text-xs font-extrabold text-amber-800 hover:underline"
          >
            Jump to this Screen →
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <span>
              {currentStepIdx + 1 < TOUR_STEPS.length ? 'Next Step' : 'Finish Tour'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
