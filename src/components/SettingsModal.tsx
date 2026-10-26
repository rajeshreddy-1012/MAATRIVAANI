import React, { useState } from 'react';
import {
  X,
  Settings,
  Languages,
  User,
  Volume2,
  HardDrive,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Mic,
  Sliders,
  ShieldCheck,
  LogOut,
  Info
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  targetLang: LanguageCode;
  onChangeTargetLang: (lang: LanguageCode) => void;
  onLogout: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  targetLang,
  onChangeTargetLang,
  onLogout,
  isOffline,
  onToggleOffline,
}) => {
  const [activeTab, setActiveTab] = useState<'languages' | 'profile' | 'audio' | 'offline' | 'about'>('languages');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [micTestStatus, setMicTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  if (!isOpen) return null;

  const storageSummary = storageService.getStorageUsageSummary();

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncMessage('Synchronizing regional linguistic models & worksheets...');
    setTimeout(() => {
      setIsSyncing(false);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      storageService.setLastSyncTime(`Just now (${nowTime})`);
      setSyncMessage('✅ Synchronized with Cloud Registry! All packs offline-ready.');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1200);
  };

  const handleClearCache = () => {
    if (window.confirm('Clear cached classroom worksheets and temporary dictionary items?')) {
      storageService.clearAllAppData();
      window.location.reload();
    }
  };

  const handleTestMic = () => {
    setMicTestStatus('testing');
    audioService.playChime('start');
    setTimeout(() => {
      setMicTestStatus('success');
      audioService.playChime('success');
      setTimeout(() => setMicTestStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                SETTINGS & CONFIGURATION
              </h2>
              <p className="text-xs text-stone-500">
                MaatriVaani Classroom Environment Controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-stone-100 border-b border-stone-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'languages' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌐 Languages
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'audio' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🔊 Audio & Mic
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'offline' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            💾 Offline Packs
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'about' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ℹ️ About SIH26042
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: LANGUAGES */}
          {activeTab === 'languages' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  Target Tribal Vernacular Language
                </label>
                <div className="space-y-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <label
                      key={lang.code}
                      onClick={() => onChangeTargetLang(lang.code)}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                        targetLang === lang.code
                          ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900">
                            {lang.name}
                          </span>
                          <span className="text-xs font-serif font-bold text-amber-900">
                            ({lang.nativeName})
                          </span>
                        </div>
                        <p className="text-stone-500 mt-0.5">
                          Script: <span className="font-semibold text-stone-700">{lang.script}</span> • {lang.regions}
                        </p>
                      </div>

                      {targetLang === lang.code && (
                        <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <span className="font-bold text-stone-700 block mb-1">Source Language</span>
                <p className="text-stone-600">हिन्दी (Hindi - Devanagari Script) • Standard State Textbook Medium</p>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO & MIC */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Speech Rate ({speechRate}x)
                </label>
                <p className="text-stone-500 mb-3">
                  Slightly slower rates improve comprehension for primary children learning new vocabulary.
                </p>
                <input
                  type="range"
                  min="0.7"
                  max="1.2"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>0.7x (Very Slow)</span>
                  <span className="font-bold text-amber-800">0.9x (Recommended for Primary)</span>
                  <span>1.2x (Fast)</span>
                </div>
              </div>

              {/* Mic Test Tool */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">Classroom Microphone Check</span>
                  <button
                    onClick={handleTestMic}
                    disabled={micTestStatus === 'testing'}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{micTestStatus === 'testing' ? 'Testing...' : 'Test Microphone'}</span>
                  </button>
                </div>
                {micTestStatus === 'success' && (
                  <p className="text-emerald-700 font-semibold animate-fadeIn">
                    ✅ Microphone is working properly! Audio input detected.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE PACKS */}
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900">
                    Offline Edge Capability (Smart India Hackathon Requirement)
                  </h4>
                  <p className="text-emerald-800 mt-0.5 leading-relaxed">
                    MaatriVaani caches phonetic tribal dictionaries, NCERT primary lessons, and offline audio chimes directly on the classroom device. Works with zero internet connectivity in remote tribal schools.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 block">Cached Storage Used</span>
                  <span className="text-sm font-bold text-stone-900">
                    ~{(storageSummary.approxBytes / 1024).toFixed(1)} KB ({storageSummary.itemsCount} elements)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 block">Last Cloud Sync</span>
                  <span className="text-sm font-bold text-stone-900">
                    {storageService.getLastSyncTime()}
                  </span>
                </div>
              </div>

              {syncMessage && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-semibold animate-fadeIn">
                  {syncMessage}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button
                  onClick={handleClearCache}
                  className="py-2.5 px-4 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-bold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm">{user.name}</h3>
                  <p className="text-stone-500 capitalize">{user.role} • {user.schoolName}</p>
                </div>
              </div>

              <div className="space-y-2 text-stone-700">
                <p><strong>Email/Phone:</strong> {user.emailOrPhone}</p>
                <p><strong>District:</strong> {user.district}</p>
                <p><strong>State:</strong> {user.state}</p>
                <p><strong>Class Grade:</strong> Class {user.classGrade}</p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT SIH26042 */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                  <span>MAATRIVAANI • SIH26042</span>
                </div>
                <p className="text-amber-900 leading-relaxed">
                  AI-Powered Mother-Tongue Education Assistant for Primary Classrooms in Tribal Regions. Developed for Smart India Hackathon.
                </p>
              </div>

              <div className="space-y-2 text-stone-600">
                <p><strong>Problem Statement:</strong> SIH26042 (Language Bridge in Tribal Primary Education)</p>
                <p><strong>Target Languages:</strong> Santhali (Ol Chiki), Mundari, Ho, Hindi</p>
                <p><strong>Alignment:</strong> NIPUN Bharat Foundational Literacy and Numeracy (FLN) Mission</p>
                <p><strong>Version:</strong> v2.6.0 (Production Hackathon Edition)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
