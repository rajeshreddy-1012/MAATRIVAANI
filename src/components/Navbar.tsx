import React, { useState } from 'react';
import {
  Menu,
  Volume2,
  Wifi,
  WifiOff,
  Settings,
  LogOut,
  User,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Languages,
  Palette,
  Check
} from 'lucide-react';
import { UserProfile, LanguageCode, ColorTheme } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { THEME_CONFIGS, themeService } from '../services/themeService';

interface NavbarProps {
  user: UserProfile;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  targetLang: LanguageCode;
  onChangeTargetLang: (lang: LanguageCode) => void;
  onOpenSettings: () => void;
  onStartDemoTour: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  onToggleSideMenu: () => void;
  isSideMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentScreen,
  onNavigate,
  onLogout,
  isOffline,
  onToggleOffline,
  targetLang,
  onChangeTargetLang,
  onOpenSettings,
  onStartDemoTour,
  currentTheme,
  onChangeTheme,
  onToggleSideMenu,
  isSideMenuOpen,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const theme = themeService.getThemeConfig(currentTheme);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            {/* Side Menu Toggle Button */}
            <button
              id="nav-side-menu-toggle"
              onClick={onToggleSideMenu}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                isSideMenuOpen
                  ? `${theme.primaryLightBg} ${theme.primaryText} ${theme.primaryLightBorder} shadow-2xs`
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="Open Side Menu Containing All Features"
              aria-label="Open side menu"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Features</span>
            </button>

            <button
              onClick={() =>
                onNavigate(
                  user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
                )
              }
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div
                className={`w-10 h-10 rounded-xl ${theme.primarySolid} text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition`}
              >
                <span className="text-xl">ᱢ</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-stone-900">
                    MAATRIVAANI
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SIH26042
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-stone-500 hidden sm:block">
                  AI Mother-Tongue Classroom Assistant
                </p>
              </div>
            </button>
          </div>

          {/* Center: Language Pair Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-100/90 rounded-full border border-stone-200 text-xs">
            <span className="font-semibold text-stone-700">हिन्दी (Hindi)</span>
            <span className="text-stone-400 font-bold">⇄</span>
            <select
              value={targetLang}
              onChange={(e) => onChangeTargetLang(e.target.value as LanguageCode)}
              className={`bg-white font-bold ${theme.primaryText} py-0.5 px-2 rounded-lg border border-stone-300 shadow-2xs focus:outline-none cursor-pointer`}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Color Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                  showThemePicker
                    ? `${theme.primaryLightBg} ${theme.primaryLightBorder} ${theme.primaryText}`
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
                title="Change Interface Color Theme"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Theme</span>
                <span className={`w-2.5 h-2.5 rounded-full ${theme.swatchBg}`}></span>
              </button>

              {/* Popover Swatches */}
              {showThemePicker && (
                <div className="absolute right-0 mt-2 w-56 p-3 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 animate-fadeIn">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-2">
                    Select Interface Colour
                  </span>
                  <div className="space-y-1.5">
                    {(Object.keys(THEME_CONFIGS) as ColorTheme[]).map((thmKey) => {
                      const t = THEME_CONFIGS[thmKey];
                      const isSelected = currentTheme === thmKey;
                      return (
                        <button
                          key={thmKey}
                          onClick={() => {
                            onChangeTheme(thmKey);
                            setShowThemePicker(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-bold transition ${
                            isSelected
                              ? `${t.primaryLightBg} ${t.primaryText} border ${t.primaryLightBorder}`
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-4 h-4 rounded-full ${t.swatchBg} shrink-0 shadow-2xs`}></span>
                            <span>{t.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SIH Demo Tour Button */}
            <button
              id="nav-demo-tour-btn"
              onClick={onStartDemoTour}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs border ${theme.subtleBadge} hover:opacity-90`}
              title="Start SIH Presentation Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>SIH Demo Tour</span>
            </button>

            {/* Offline / Online Mode Toggle */}
            <button
              id="nav-offline-toggle"
              onClick={onToggleOffline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                isOffline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
              title="Click to toggle offline classroom simulation"
            >
              {isOffline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="hidden sm:inline">🟢 Offline Mode</span>
                  <span className="sm:hidden">Offline</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">🔵 Online Syncing</span>
                  <span className="sm:hidden">Online</span>
                </>
              )}
            </button>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-100 text-stone-700 rounded-xl border border-stone-200">
              {user.role === 'teacher' ? (
                <GraduationCap className={`w-3.5 h-3.5 ${theme.primaryText}`} />
              ) : (
                <User className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span className="font-bold capitalize">{user.role}</span>
            </div>

            {/* Settings */}
            <button
              id="nav-settings-btn"
              onClick={onOpenSettings}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
              title="Settings & Data Management"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              id="nav-logout-btn"
              onClick={onLogout}
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-bar for Language pair */}
        <div className="md:hidden py-1.5 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Languages className={`w-3.5 h-3.5 ${theme.primaryText}`} />
            <span>हिन्दी ⇄</span>
            <select
              value={targetLang}
              onChange={(e) => onChangeTargetLang(e.target.value as LanguageCode)}
              className={`font-bold ${theme.primaryText} bg-transparent border-0 underline`}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onStartDemoTour}
            className={`text-[11px] ${theme.primaryText} font-bold underline`}
          >
            SIH Demo Flow
          </button>
        </div>
      </div>
    </header>
  );
};
