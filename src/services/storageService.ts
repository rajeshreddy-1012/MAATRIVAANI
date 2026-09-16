import {
  UserProfile,
  LanguageCode,
  Worksheet,
  Flashcard,
  StudentProgressRecord,
  QuizAttempt,
  TranslationHistoryItem
} from '../types';
import {
  INITIAL_WORKSHEETS,
  FLASHCARDS_DATA,
  INITIAL_STUDENT_PROGRESS,
  SUPPORTED_LANGUAGES,
  TRIBAL_DICTIONARY
} from '../data/mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'maatri_user_profile',
  TARGET_LANG: 'maatri_target_lang',
  OFFLINE_MODE: 'maatri_is_offline',
  SAVED_WORKSHEETS: 'maatri_saved_worksheets',
  FLASHCARDS: 'maatri_flashcards',
  STUDENT_PROGRESS: 'maatri_student_progress',
  QUIZ_ATTEMPTS: 'maatri_quiz_attempts',
  TRANSLATION_HISTORY: 'maatri_trans_history',
  LAST_SYNC_TIME: 'maatri_last_sync_time',
};

export const defaultTeacherProfile: UserProfile = {
  id: 'teacher-01',
  name: 'रश्मि सोरेन (Rashmi Soren)',
  role: 'teacher',
  emailOrPhone: 'teacher.rashmi@primary.sih.gov.in',
  schoolName: 'राजकीय प्राथमिक विद्यालय (Govt. Primary School, Dumka)',
  district: 'दुमका (Dumka)',
  state: 'झारखंड (Jharkhand)',
  targetLanguage: 'sat',
  sourceLanguage: 'hi',
  classGrade: 3,
};

export const defaultStudentProfile: UserProfile = {
  id: 'student-01',
  name: 'सुनीता मुर्मू (Sunita Murmu)',
  role: 'student',
  emailOrPhone: 'roll-12@gpsdumka.edu',
  schoolName: 'राजकीय प्राथमिक विद्यालय (Dumka)',
  district: 'दुमका (Dumka)',
  state: 'झारखंड (Jharkhand)',
  targetLanguage: 'sat',
  sourceLanguage: 'hi',
  classGrade: 3,
};

export const storageService = {
  // User Profile
  getUserProfile(): UserProfile | null {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  setUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  clearUserProfile(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  // Target Language
  getTargetLanguage(): LanguageCode {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGET_LANG);
    return (saved as LanguageCode) || 'sat';
  },

  setTargetLanguage(lang: LanguageCode): void {
    localStorage.setItem(STORAGE_KEYS.TARGET_LANG, lang);
  },

  // Offline Mode Toggle
  isOfflineMode(): boolean {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
    return saved === 'true';
  },

  setOfflineMode(isOffline: boolean): void {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, String(isOffline));
  },

  // Worksheets
  getWorksheets(): Worksheet[] {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_WORKSHEETS);
    if (!saved) {
      this.saveWorksheets(INITIAL_WORKSHEETS);
      return INITIAL_WORKSHEETS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_WORKSHEETS;
    }
  },

  saveWorksheets(worksheets: Worksheet[]): void {
    localStorage.setItem(STORAGE_KEYS.SAVED_WORKSHEETS, JSON.stringify(worksheets));
  },

  addWorksheet(worksheet: Worksheet): void {
    const current = this.getWorksheets();
    const updated = [worksheet, ...current];
    this.saveWorksheets(updated);
  },

  // Flashcards
  getFlashcards(): Flashcard[] {
    const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    if (!saved) {
      this.saveFlashcards(FLASHCARDS_DATA);
      return FLASHCARDS_DATA;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return FLASHCARDS_DATA;
    }
  },

  saveFlashcards(cards: Flashcard[]): void {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  },

  // Student Progress
  getStudentProgress(): StudentProgressRecord[] {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS);
    if (!saved) {
      this.saveStudentProgress(INITIAL_STUDENT_PROGRESS);
      return INITIAL_STUDENT_PROGRESS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_STUDENT_PROGRESS;
    }
  },

  saveStudentProgress(records: StudentProgressRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROGRESS, JSON.stringify(records));
  },

  // Quiz Attempts
  saveQuizAttempt(attempt: QuizAttempt): void {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    const current: QuizAttempt[] = saved ? JSON.parse(saved) : [];
    current.push(attempt);
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(current));

    // Update active student stats
    const students = this.getStudentProgress();
    if (students.length > 0) {
      students[0].lessonsCompleted = Math.min(students[0].totalLessons, students[0].lessonsCompleted + 1);
      students[0].quizAverageScore = Math.round((students[0].quizAverageScore + (attempt.score / attempt.totalQuestions) * 100) / 2);
      this.saveStudentProgress(students);
    }
  },

  // Translation History
  getTranslationHistory(): TranslationHistoryItem[] {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSLATION_HISTORY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  },

  addTranslationHistory(item: TranslationHistoryItem): void {
    const current = this.getTranslationHistory();
    const updated = [item, ...current.slice(0, 49)]; // keep 50
    localStorage.setItem(STORAGE_KEYS.TRANSLATION_HISTORY, JSON.stringify(updated));
  },

  // Sync details
  getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME) || 'आज सुबह 8:30 AM (Synchronized)';
  },

  setLastSyncTime(timeStr: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, timeStr);
  },

  // Storage Stats for Settings screen
  getStorageUsageSummary(): { itemsCount: number; approxBytes: number } {
    let totalLength = 0;
    let itemsCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('maatri_')) {
        const val = localStorage.getItem(key) || '';
        totalLength += key.length + val.length;
        itemsCount++;
      }
    }
    return {
      itemsCount,
      approxBytes: totalLength * 2, // UTF-16 bytes approx
    };
  },

  clearAllAppData(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('maatri_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },
};
