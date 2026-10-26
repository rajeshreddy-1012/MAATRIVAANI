import React from 'react';
import {
  Mic,
  Languages,
  BookOpen,
  FileSpreadsheet,
  Layers,
  Target,
  BarChart3,
  CheckSquare,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Settings,
  LogOut,
  X,
  Wifi,
  WifiOff,
  Palette,
  ChevronRight,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Pin,
  PinOff
} from 'lucide-react';
import { UserProfile, LanguageCode, ColorTheme } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { themeService, THEME_CONFIGS } from '../services/themeService';

export interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user: UserProfile;
  onSwitchRole: (newRole: 'teacher' | 'student') => void;
  targetLang: LanguageCode;
  onChangeTargetLang: (lang: LanguageCode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  onOpenSettings: () => void;
  onStartDemoTour: () => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  nativeLabel?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'live' | 'ai' | 'standard' | 'nipun';
  };
  requiredRole?: 'teacher' | 'student';
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  currentScreen,
  onNavigate,
  user,
  onSwitchRole,
  targetLang,
  onChangeTargetLang,
  isOffline,
  onToggleOffline,
  currentTheme,
  onChangeTheme,
  onOpenSettings,
  onStartDemoTour,
  onLogout,
}) => {
  const theme = themeService.getThemeConfig(currentTheme);

  const menuSections: MenuSection[] = [
    {
      title: 'Classroom & Speech',
      items: [
        {
          id: 'live-voice',
          label: 'Live Classroom Voice',
          nativeLabel: 'ᱥᱟᱰᱮ ᱛᱚᱨᱡᱚᱢᱟ',
          description: 'Real-time teacher speech to tribal audio with hidden script',
          icon: Mic,
          badge: { text: 'LIVE VOICE', variant: 'live' },
        },
        {
          id: 'text-trans',
          label: 'Text & Phrase Translator',
          nativeLabel: 'ᱚᱞ ᱛᱚᱨᱡᱚᱢᱟ',
          description: 'Bilingual translation with Ol Chiki & phonetic guide',
          icon: Languages,
          badge: { text: 'AI + Offline', variant: 'ai' },
        },
        {
          id: 'lessons',
          label: 'Curriculum Lessons',
          nativeLabel: 'ᱥᱮᱪᱮᱫ ᱯᱟᱲᱦᱟᱣ',
          description: 'NIPUN Bharat bilingual lessons with cultural context',
          icon: BookOpen,
          badge: { text: 'Grades 1-5', variant: 'standard' },
        },
      ],
    },
    {
      title: 'Teaching & Practice Materials',
      items: [
        {
          id: 'worksheets',
          label: 'Bilingual Worksheet Generator',
          nativeLabel: 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ',
          description: 'Customizable PDF/print worksheets with answer keys',
          icon: FileSpreadsheet,
          badge: { text: 'Printable', variant: 'standard' },
        },
        {
          id: 'flashcards',
          label: 'Visual Flashcards',
          nativeLabel: 'ᱪᱤᱛᱟᱹᱨ ᱠᱟᱨᱰ',
          description: 'Illustrated cards with native pronunciations & emojis',
          icon: Layers,
          badge: { text: 'Audio', variant: 'standard' },
        },
        {
          id: 'quiz',
          label: 'Interactive Practice & Quiz',
          nativeLabel: 'ᱵᱤᱰᱟᱹᱣ',
          description: 'Gamified assessments with audio explanations',
          icon: CheckSquare,
          badge: { text: 'Gamified', variant: 'standard' },
        },
      ],
    },
    {
      title: 'Analytics & Benchmarks',
      items: [
        {
          id: 'outcomes',
          label: 'NIPUN Learning Outcomes',
          nativeLabel: 'ᱥᱮᱪᱮᱫ ᱚᱨᱡᱚ',
          description: 'FLN foundational literacy & numeracy benchmarks',
          icon: Target,
          badge: { text: 'NIPUN Bharat', variant: 'nipun' },
        },
        {
          id: 'progress',
          label: 'Student Progress & Analytics',
          nativeLabel: 'ᱞᱟᱦᱟᱱᱛᱤ ᱞᱮᱠᱷᱟ',
          description: 'Mother-tongue retention & classroom performance metrics',
          icon: BarChart3,
          badge: { text: 'Analytics', variant: 'standard' },
        },
      ],
    },
    {
      title: 'Dashboards & Portals',
      items: [
        {
          id: 'teacher-dashboard',
          label: 'Teacher Command Center',
          nativeLabel: 'ᱢᱟᱪᱮᱛ ᱰᱮᱥᱵᱳᱨᱰ',
          description: 'Class overview, schedule & quick launch tools',
          icon: LayoutDashboard,
        },
        {
          id: 'student-dashboard',
          label: 'Student Learning Portal',
          nativeLabel: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱰᱮᱥᱵᱳᱨᱰ',
          description: 'Daily streak, badges, audio books & practice',
          icon: GraduationCap,
        },
      ],
    },
  ];

  const handleItemClick = (screenId: string) => {
    onNavigate(screenId);
    // On mobile or unpinned desktop, close the menu drawer
    if (!isPinned) {
      onClose();
    }
  };

  const getBadgeStyle = (variant: 'live' | 'ai' | 'standard' | 'nipun') => {
    switch (variant) {
      case 'live':
        return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case 'ai':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'nipun':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'standard':
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* Backdrop overlay for mobile or unpinned state */}
      {isOpen && !isPinned && (
        <div
          id="sidemenu-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Side Menu Drawer / Bar */}
      <aside
        id="app-side-menu"
        aria-label="Features Menu"
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 bg-white border-r border-stone-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isPinned ? 'lg:shadow-sm' : ''}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${theme.primarySolid} text-white flex items-center justify-center font-black shadow-sm`}
            >
              <span className="text-xl">ᱢ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-stone-900">
                  MAATRIVAANI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SIH26042
                </span>
              </div>
              <p className="text-[10px] font-semibold text-stone-500">
                All Features & Tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin sidebar on desktop */}
            <button
              onClick={onTogglePin}
              className={`hidden lg:flex p-1.5 rounded-lg border transition ${
                isPinned
                  ? `${theme.primaryLightBg} ${theme.primaryText} ${theme.primaryLightBorder}`
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100 border-transparent'
              }`}
              title={isPinned ? 'Unpin Sidebar (Floating Drawer)' : 'Pin Sidebar as Fixed Navigation'}
            >
              {isPinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              title="Close Menu"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Active User Profile & Role Switcher */}
        <div className="p-3 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                {user.role === 'teacher' ? '👨‍🏫' : '🎒'}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-stone-500 font-medium">
                  {user.schoolName || 'Primary Tribal School'}
                </p>
              </div>
            </div>

            {/* Role switch toggle */}
            <button
              onClick={() =>
                onSwitchRole(user.role === 'teacher' ? 'student' : 'teacher')
              }
              className={`text-[10px] font-bold px-2 py-1 rounded-md border transition ${
                user.role === 'teacher'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Switch between Teacher and Student perspectives"
            >
              Switch to {user.role === 'teacher' ? 'Student' : 'Teacher'}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Features List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 focus:outline-none custom-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>{section.title}</span>
                <span className="text-[9px] font-normal lowercase opacity-70">
                  {section.items.length} tools
                </span>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`sidemenu-item-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-3 group relative ${
                        isActive
                          ? `${theme.primaryLightBg} ${theme.primaryText} font-bold border ${theme.primaryLightBorder} shadow-2xs`
                          : 'hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-transparent'
                      }`}
                    >
                      {/* Left accent bar on active */}
                      {isActive && (
                        <span
                          className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md ${theme.primarySolid}`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isActive
                            ? `${theme.primarySolid} text-white shadow-2xs`
                            : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200 group-hover:text-stone-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border whitespace-nowrap shrink-0 ${getBadgeStyle(
                                item.badge.variant
                              )}`}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </div>

                        {item.nativeLabel && (
                          <span className="text-[10px] text-stone-600 block truncate font-medium">
                            {item.nativeLabel}
                          </span>
                        )}

                        <p className="text-[10px] text-stone-500 truncate leading-snug mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 self-center transition ${
                          isActive
                            ? 'text-stone-700 opacity-100'
                            : 'text-stone-300 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Language Switcher Inside Side Menu */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                Target Tribal Language
              </span>
              <span className="text-[10px] font-bold text-stone-500">
                {currentLangObj.nativeName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = targetLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onChangeTargetLang(lang.code)}
                    className={`p-1.5 text-left rounded-lg text-xs font-bold border transition ${
                      isSelected
                        ? `${theme.primaryLightBg} ${theme.primaryText} ${theme.primaryLightBorder} shadow-2xs`
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="truncate">{lang.name}</div>
                    <div className="text-[9px] font-normal text-stone-600 truncate">
                      {lang.nativeName} ({lang.script})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-stone-200 bg-white space-y-2">
          {/* Quick Toggles: Offline & SIH Demo */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleOffline}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                isOffline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🟢 Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-blue-600" />
                  <span>🔵 Online</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onStartDemoTour();
                if (!isPinned) onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${theme.subtleBadge} hover:opacity-90`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>SIH Tour</span>
            </button>
          </div>

          {/* Settings & Logout */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => {
                onOpenSettings();
                if (!isPinned) onClose();
              }}
              className="flex items-center gap-1.5 py-1.5 px-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings & Sync</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 py-1.5 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
