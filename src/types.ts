export type UserRole = 'teacher' | 'student';

export type LanguageCode = 'hi' | 'sat' | 'unr' | 'hoc';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  speakersCount: string;
  regions: string;
  availableOffline: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  emailOrPhone: string;
  schoolName: string;
  district: string;
  state: string;
  targetLanguage: LanguageCode;
  sourceLanguage: LanguageCode;
  classGrade: number;
}

export interface TranslationHistoryItem {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: 'voice' | 'text';
  contextCategory?: string;
  audioGenerated?: boolean;
}

export interface Flashcard {
  id: string;
  category: 'Animals' | 'Fruits' | 'Vegetables' | 'Numbers' | 'Colors' | 'Body parts' | 'Family' | 'Nature' | 'Classroom objects' | string;
  hindiWord: string;
  hindiPhonetic?: string;
  targetWord: string;
  targetScriptOlChiki?: string;
  targetPhonetic?: string;
  phoneticGuide?: string;
  englishMeaning: string;
  iconName?: string;
  imageEmoji?: string;
  visualEmoji?: string;
  sampleSentenceHindi?: string;
  sampleSentenceTarget?: string;
}

export interface WorksheetQuestion {
  id: string;
  type: 'mcq' | 'fill_in_blank' | 'match' | 'true_false' | 'short_answer' | 'picture_based';
  questionHindi: string;
  questionTarget: string;
  optionsHindi?: string[];
  optionsTarget?: string[];
  correctAnswer: string;
  explanationHindi?: string;
  explanationTarget?: string;
  imageVisual?: string;
}

export interface Worksheet {
  id: string;
  title: string;
  titleTarget: string;
  classGrade: number;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  learningOutcomeCode: string;
  learningOutcomeDesc: string;
  targetLanguage: LanguageCode;
  questions: WorksheetQuestion[];
  createdDate: string;
}

export interface Lesson {
  id: string;
  classGrade: number;
  subject: string;
  chapter: string;
  title: string;
  titleHindi: string;
  titleTarget: string;
  summaryHindi: string;
  summaryTarget: string;
  contentSections: {
    headingHindi: string;
    headingTarget: string;
    bodyHindi: string;
    bodyTarget: string;
    phoneticGuide?: string;
  }[];
  keyVocabulary: {
    hindi: string;
    target: string;
    phonetic: string;
  }[];
  nipunOutcomeCode: string;
  samplePhrases: string[];
}

export interface NipunOutcome {
  id?: string;
  code: string;
  classGrade: number;
  domain: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  targetLanguageSupport?: string;
  targetScore?: number;
  currentStudentMastery?: number;
  masteryPercentage?: number;
  status?: 'Achieved' | 'In Progress' | 'Not Started';
  relatedLessons?: string[];
  mappedLessonId?: string;
  mappedLessonTitle?: string;
  activityDescription?: string;
  assessmentMethod?: string;
}

export interface StudentProgressRecord {
  id?: string;
  studentId?: string;
  name?: string;
  studentName?: string;
  rollNumber?: string;
  primaryLanguage?: string;
  classGrade?: number;
  targetLanguage?: LanguageCode;
  lessonsCompleted: number;
  totalLessons: number;
  worksheetsCompleted: number;
  totalWorksheets?: number;
  quizAverageScore: number;
  voicePracticeMinutes: number;
  nipunCompetenciesMastered?: string[];
  nipunOutcomesMastered?: string[];
  lastActive?: string;
  lastActiveDate?: string;
}

export interface QuizAttempt {
  id: string;
  studentId?: string;
  lessonId: string;
  timestamp?: number;
  score: number;
  totalQuestions: number;
  completedAt?: string;
  answers?: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}
