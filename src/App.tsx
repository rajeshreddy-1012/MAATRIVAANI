/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageCode, Lesson, ColorTheme } from './types';
import { storageService, defaultTeacherProfile } from './services/storageService';
import { themeService } from './services/themeService';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { LiveClassroomVoice } from './components/LiveClassroomVoice';
import { TextTranslator } from './components/TextTranslator';
import { LessonsModule } from './components/LessonsModule';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { FlashcardsModule } from './components/FlashcardsModule';
import { LearningOutcomes } from './components/LearningOutcomes';
import { StudentProgress } from './components/StudentProgress';
import { QuizAssessment } from './components/QuizAssessment';
import { SettingsModal } from './components/SettingsModal';
import { DemoTourModal } from './components/DemoTourModal';
import { SideMenu } from './components/SideMenu';
import { EDUCATIONAL_LESSONS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return storageService.getUserProfile() || defaultTeacherProfile;
  });

  const [targetLang, setTargetLang] = useState<LanguageCode>(() => {
    return storageService.getTargetLanguage();
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return storageService.isOfflineMode();
  });

  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    return themeService.getSavedTheme();
  });

  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    return currentUser?.role === 'student' ? 'student-dashboard' : 'teacher-dashboard';
  });

  const [activeLessonForWorksheet, setActiveLessonForWorksheet] = useState<Lesson | null>(null);
  const [activeCategoryForFlashcards, setActiveCategoryForFlashcards] = useState<string>('All');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isSideMenuPinned, setIsSideMenuPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('maatri_sidemenu_pinned') === 'true';
    }
    return false;
  });

  // Apply theme on mount and when changed
  useEffect(() => {
    themeService.applyTheme(currentTheme);
  }, [currentTheme]);

  // Handle Theme Change
  const handleChangeTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    themeService.applyTheme(theme);
  };

  // Handle Target Language change
  const handleChangeTargetLang = (lang: LanguageCode) => {
    setTargetLang(lang);
    storageService.setTargetLanguage(lang);
  };

  // Handle Offline Toggle
  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    storageService.setOfflineMode(next);
  };

  // Handle Pin / Unpin Side Menu
  const handleTogglePinSideMenu = () => {
    setIsSideMenuPinned((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('maatri_sidemenu_pinned', String(next));
      }
      if (next) {
        setIsSideMenuOpen(true);
      }
      return next;
    });
  };

  // Handle Role switch from SideMenu or Dashboard
  const handleSwitchRole = (newRole: 'teacher' | 'student') => {
    if (newRole === 'teacher') {
      setCurrentUser(defaultTeacherProfile);
      storageService.setUserProfile(defaultTeacherProfile);
      setCurrentScreen('teacher-dashboard');
    } else {
      const studentUser: UserProfile = {
        id: 'usr_student_demo',
        name: 'बिरसा मुंडा (Birsa Munda)',
        role: 'student',
        emailOrPhone: 'student@maatri.edu.in',
        schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, खूंटी',
        district: 'Khunti',
        state: 'Jharkhand',
        targetLanguage: targetLang,
        sourceLanguage: 'hi',
        classGrade: 3,
      };
      setCurrentUser(studentUser);
      storageService.setUserProfile(studentUser);
      setCurrentScreen('student-dashboard');
    }
  };

  // Handle Login Success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setUserProfile(user);
    setCurrentScreen(user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    storageService.clearUserProfile();
    setIsSettingsOpen(false);
    setIsSideMenuOpen(false);
  };

  // Navigation router
  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If no logged in user, display Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
        <LoginScreen onLoginSuccess={handleLoginSuccess} currentTheme={currentTheme} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Side Menu containing all features */}
      <SideMenu
        isOpen={isSideMenuOpen || isSideMenuPinned}
        onClose={() => setIsSideMenuOpen(false)}
        isPinned={isSideMenuPinned}
        onTogglePin={handleTogglePinSideMenu}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        user={currentUser}
        onSwitchRole={handleSwitchRole}
        targetLang={targetLang}
        onChangeTargetLang={handleChangeTargetLang}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        currentTheme={currentTheme}
        onChangeTheme={handleChangeTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Shell (Padded when side menu is pinned on desktop) */}
      <div
        className={`flex-1 flex flex-col transition-[padding] duration-300 ${
          isSideMenuPinned ? 'lg:pl-80' : ''
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          user={currentUser}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          targetLang={targetLang}
          onChangeTargetLang={handleChangeTargetLang}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onStartDemoTour={() => setIsDemoTourOpen(true)}
          currentTheme={currentTheme}
          onChangeTheme={handleChangeTheme}
          onToggleSideMenu={() => setIsSideMenuOpen((prev) => !prev)}
          isSideMenuOpen={isSideMenuOpen || isSideMenuPinned}
        />

      {/* Main Screen Content View */}
      <main className="flex-1 pb-12">
        {/* Screen 1: Teacher Dashboard */}
        {currentScreen === 'teacher-dashboard' && (
          <TeacherDashboard
            user={currentUser}
            targetLang={targetLang}
            onChangeTargetLang={handleChangeTargetLang}
            onNavigate={handleNavigate}
            isOffline={isOffline}
            onStartDemoTour={() => setIsDemoTourOpen(true)}
            currentTheme={currentTheme}
          />
        )}

        {/* Screen 2: Student Dashboard */}
        {currentScreen === 'student-dashboard' && (
          <StudentDashboard
            user={currentUser}
            targetLang={targetLang}
            onNavigate={handleNavigate}
            onStartQuiz={() => setCurrentScreen('quiz')}
          />
        )}

        {/* Screen 3: Live Classroom Voice Mode (CRITICAL: HIDDEN SCRIPT) */}
        {currentScreen === 'live-voice' && (
          <LiveClassroomVoice
            onBack={() =>
              setCurrentScreen(
                currentUser.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
              )
            }
            targetLang={targetLang}
            isOffline={isOffline}
            currentTheme={currentTheme}
          />
        )}

        {/* Screen 4: Text Translator */}
        {currentScreen === 'text-trans' && (
          <TextTranslator
            onBack={() => setCurrentScreen('teacher-dashboard')}
            targetLang={targetLang}
            onChangeTargetLang={handleChangeTargetLang}
            isOffline={isOffline}
          />
        )}

        {/* Screen 5: Lessons Module */}
        {currentScreen === 'lessons' && (
          <LessonsModule
            onBack={() =>
              setCurrentScreen(
                currentUser.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
              )
            }
            targetLang={targetLang}
            onStartVoiceWithTopic={(topic) => {
              setCurrentScreen('live-voice');
            }}
            onGenerateWorksheetForLesson={(les) => {
              setActiveLessonForWorksheet(les);
              setCurrentScreen('worksheets');
            }}
            onViewFlashcards={(category) => {
              setActiveCategoryForFlashcards(category);
              setCurrentScreen('flashcards');
            }}
          />
        )}

        {/* Screen 6: Worksheet Generator */}
        {currentScreen === 'worksheets' && (
          <WorksheetGenerator
            onBack={() => setCurrentScreen('teacher-dashboard')}
            targetLang={targetLang}
            initialLesson={activeLessonForWorksheet}
            isOffline={isOffline}
          />
        )}

        {/* Screen 7: Visual Flashcards */}
        {currentScreen === 'flashcards' && (
          <FlashcardsModule
            onBack={() =>
              setCurrentScreen(
                currentUser.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
              )
            }
            targetLang={targetLang}
            initialCategory={activeCategoryForFlashcards}
          />
        )}

        {/* Screen 8: Learning Outcomes (NIPUN Bharat) */}
        {currentScreen === 'outcomes' && (
          <LearningOutcomes
            onBack={() => setCurrentScreen('teacher-dashboard')}
            onSelectLesson={(lesId) => {
              setCurrentScreen('lessons');
            }}
            onOpenWorksheetWithOutcome={(code) => {
              setCurrentScreen('worksheets');
            }}
          />
        )}

        {/* Screen 9: Student Progress */}
        {currentScreen === 'progress' && (
          <StudentProgress
            onBack={() =>
              setCurrentScreen(
                currentUser.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
              )
            }
          />
        )}

        {/* Screen 10: Interactive Quiz Practice */}
        {currentScreen === 'quiz' && (
          <QuizAssessment
            onBack={() => setCurrentScreen('student-dashboard')}
            targetLang={targetLang}
          />
        )}
      </main>

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-800">MAATRIVAANI</span>
              <span>•</span>
              <span className="text-stone-700 font-semibold">
                SIH26042 Mother-Tongue Primary Education
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setIsDemoTourOpen(true)}
                className="text-stone-600 hover:underline"
              >
                SIH Presentation Tour
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-stone-600 hover:underline"
              >
                Theme & Settings
              </button>
              <span>•</span>
              <span className="text-stone-400">
                झारखंड, ओडिशा, पश्चिम बंगाल प्राथमिक शिक्षा
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
        targetLang={targetLang}
        onChangeTargetLang={handleChangeTargetLang}
        onLogout={handleLogout}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        currentTheme={currentTheme}
        onChangeTheme={handleChangeTheme}
      />

      {/* SIH Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onJumpToScreen={handleNavigate}
      />
    </div>
  );
}
