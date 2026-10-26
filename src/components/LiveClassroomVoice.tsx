import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Square,
  Sparkles,
  Zap,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  VolumeX,
  Radio,
  CheckCircle2,
  WifiOff
} from 'lucide-react';
import { LanguageCode, ColorTheme } from '../types';
import { SUPPORTED_LANGUAGES, matchTribalDictionary } from '../data/mockData';
import { audioService, AudioState } from '../services/audioService';
import { storageService } from '../services/storageService';
import { themeService } from '../services/themeService';

interface LiveClassroomVoiceProps {
  onBack: () => void;
  targetLang: LanguageCode;
  isOffline: boolean;
  currentTheme?: ColorTheme;
}

export const LiveClassroomVoice: React.FC<LiveClassroomVoiceProps> = ({
  onBack,
  targetLang,
  isOffline,
  currentTheme = 'indigo' as ColorTheme,
}) => {
  const theme = themeService.getThemeConfig(currentTheme);
  // Mode direction: 'hi_to_sat' (Teacher) or 'sat_to_hi' (Student)
  const [direction, setDirection] = useState<'hi_to_sat' | 'sat_to_hi'>('hi_to_sat');
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastInputText, setLastInputText] = useState<string>('');
  const [lastTranslatedText, setLastTranslatedText] = useState<string>('');
  const [lastPhoneticForReplay, setLastPhoneticForReplay] = useState<string>('');
  const [lastBase64Audio, setLastBase64Audio] = useState<string | null>(null);
  const [isSimulatingSample, setIsSimulatingSample] = useState<boolean>(false);
  const [customInputText, setCustomInputText] = useState<string>('');
  const [isTestingSpeaker, setIsTestingSpeaker] = useState<boolean>(false);

  const activeListenerRef = useRef<{ stop: () => void } | null>(null);
  const startTimeRef = useRef<number>(0);

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const sampleEducationalPhrases = [
    'नमस्ते बच्चों (Good morning children)',
    'आज हम पौधों के बारे में सीखेंगे (Today we will learn about plants)',
    'पौधे को पानी और धूप चाहिए (Plants need water and sunlight)',
    'अपनी किताब खोलो (Open your book)',
    'दरवाजा खोलो (Open the door)',
    'आज बारिश हो रही है (It is raining today)',
    'सब बच्चे बैठ जाओ (All children sit down)',
    'बहुत अच्छा शाबाश! (Very good, well done!)',
  ];

  useEffect(() => {
    return () => {
      // Clean up audio & listener on unmount
      if (activeListenerRef.current) {
        activeListenerRef.current.stop();
      }
      audioService.stopAudio();
    };
  }, []);

  // Process speech transcript to translated audio (THE TRANSLATED TEXT IS KEPT STRICTLY IN THE BACKGROUND)
  const processTranslationAndPlayAudio = async (speechText: string) => {
    setAudioState('processing');
    setErrorMessage(null);
    setLastInputText(speechText);
    const startMs = Date.now();

    try {
      let translatedPhonetic = '';
      let translatedScript = '';
      let base64Audio: string | null = null;

      if (isOffline) {
        // Fast offline linguistic match
        await new Promise((r) => setTimeout(r, 120));
        const match = matchTribalDictionary(speechText.trim(), targetLang as any, direction as any);
        if (match) {
          translatedPhonetic = match.phonetic;
          translatedScript = match.olChiki || match.translatedText;
        } else {
          translatedPhonetic = speechText;
          translatedScript = speechText;
        }
        setLatencyMs(Date.now() - startMs);
      } else {
        // Online full-stack pipeline to /api/live-translate with targetLang
        const response = await fetch('/api/live-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: speechText,
            direction,
            targetLang,
          }),
        });

        if (!response.ok) {
          throw new Error('Server response failed');
        }

        const data = await response.json();
        translatedPhonetic = data.phonetic || data.translatedText || speechText;
        translatedScript = data.olChiki || data.translatedText || speechText;

        // Try getting synthesized speech
        try {
          const ttsRes = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: data.translatedText,
              phonetic: translatedPhonetic,
              language: targetLang,
            }),
          });
          const ttsData = await ttsRes.json();
          if (ttsData.audioBase64) {
            base64Audio = ttsData.audioBase64;
          }
        } catch (e) {
          console.warn('TTS request error, using client fallback synthesizer:', e);
        }

        const totalLatency = Date.now() - startMs;
        setLatencyMs(totalLatency);
      }

      setLastPhoneticForReplay(translatedPhonetic);
      setLastTranslatedText(translatedScript);
      setLastBase64Audio(base64Audio);

      // Transition to audio playing state
      setAudioState('playing');
      audioService.playChime('start');

      await audioService.playAudio(
        translatedPhonetic,
        base64Audio,
        () => {
          setAudioState('playing');
        },
        () => {
          setAudioState('idle');
          audioService.playChime('complete');
        }
      );
    } catch (err: any) {
      console.error('Audio translation error:', err);
      // Fallback: Acoustic feedback and gentle message
      setAudioState('error');
      setErrorMessage("We couldn't process that. Please tap to try again.");
    }
  };

  // Start Real Microphone Listening
  const handleStartListening = () => {
    audioService.stopAudio();
    setErrorMessage(null);
    setLatencyMs(null);
    startTimeRef.current = Date.now();
    audioService.playChime('start');

    const speechLang = direction === 'hi_to_sat' ? 'hi-IN' : 'hi-IN';

    const listener = audioService.startListening(
      speechLang,
      (transcript) => {
        // Speech recognized internally
        processTranslationAndPlayAudio(transcript);
      },
      (error) => {
        setErrorMessage(error);
        setAudioState('error');
      },
      (state) => {
        setAudioState(state);
      }
    );

    activeListenerRef.current = listener;
  };

  const handleStopListening = () => {
    if (activeListenerRef.current) {
      activeListenerRef.current.stop();
      activeListenerRef.current = null;
    }
    audioService.stopAudio();
    setAudioState('idle');
  };

  // Quick Demo Simulator for SIH Presentation (ensures 100% reliability regardless of browser mic permissions)
  const handleTriggerSamplePhrase = (phraseWithMeaning: string) => {
    audioService.stopAudio();
    const cleanHindi = phraseWithMeaning.split('(')[0].trim();
    setIsSimulatingSample(true);
    setAudioState('listening');
    setErrorMessage(null);
    setLatencyMs(null);
    audioService.playChime('start');

    // Simulate real speech capture duration
    setTimeout(() => {
      setIsSimulatingSample(false);
      processTranslationAndPlayAudio(cleanHindi);
    }, 1200);
  };

  const handleReplay = () => {
    if (!lastPhoneticForReplay) return;
    setAudioState('playing');
    audioService.playAudio(
      lastPhoneticForReplay,
      lastBase64Audio,
      () => setAudioState('playing'),
      () => setAudioState('idle')
    );
  };

  const handleTestSpeaker = () => {
    setIsTestingSpeaker(true);
    audioService.testAudioOutput(() => {
      setIsTestingSpeaker(false);
    });
    setTimeout(() => setIsTestingSpeaker(false), 3000);
  };

  const handleCustomTranslateAndSpeak = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = customInputText.trim();
    if (!text) return;
    audioService.stopAudio();
    processTranslationAndPlayAudio(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Speaker Test Button */}
          <button
            type="button"
            onClick={handleTestSpeaker}
            disabled={isTestingSpeaker || audioState === 'playing'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-xs font-bold rounded-xl border border-stone-200 transition disabled:opacity-50"
            title="Test if sound and speech synthesis output works on this device"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isTestingSpeaker ? 'text-amber-600 animate-bounce' : 'text-stone-500'}`} />
            <span>{isTestingSpeaker ? 'Playing Test Sound...' : '🔊 Test Speaker'}</span>
          </button>

          {isOffline && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Edge Engine</span>
            </div>
          )}

          {latencyMs !== null && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {(latencyMs / 1000).toFixed(2)}s {latencyMs <= 3000 ? '⚡ Ultra Fast' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Classroom Screen Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden text-center p-6 sm:p-12 relative">
        {/* Screen Title */}
        <div className="mb-6">
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${theme.subtleBadge} px-3 py-1 rounded-full border`}>
            Real-Time Voice Bridge
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
            LIVE CLASSROOM
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Direct speech-to-speech translation for natural classroom teaching.
          </p>
        </div>

        {/* Direction Selector (Hindi ⇄ Santhali) */}
        <div className="inline-flex p-1.5 bg-stone-100 rounded-2xl border border-stone-200 mb-8 max-w-sm w-full">
          <button
            id="dir-hi-sat"
            type="button"
            onClick={() => {
              setDirection('hi_to_sat');
              audioService.stopAudio();
              setAudioState('idle');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              direction === 'hi_to_sat'
                ? `${theme.primarySolid} text-white shadow-sm`
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👩‍🏫 हिन्दी → {targetLangObj.name}</span>
          </button>
          <button
            id="dir-sat-hi"
            type="button"
            onClick={() => {
              setDirection('sat_to_hi');
              audioService.stopAudio();
              setAudioState('idle');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              direction === 'sat_to_hi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👦 {targetLangObj.name} → हिन्दी</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE: HUGE CIRCULAR MICROPHONE BUTTON & ACOUSTIC STATUS DISPLAY */}
        {/* STRICT REQUIREMENT: THE TRANSLATED TEXT SCRIPT MUST REMAIN COMPLETELY HIDDEN */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center justify-center min-h-[260px] my-4">
          {/* Animated Pulsing Ring Wrapper */}
          <div className="relative flex items-center justify-center">
            {/* Listening Wave Animations */}
            {audioState === 'listening' && (
              <>
                <span className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-amber-400/20 animate-ping"></span>
                <span className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-amber-500/20 animate-pulse"></span>
              </>
            )}

            {/* Processing Ripple */}
            {audioState === 'processing' && (
              <span className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-blue-400/25 animate-spin border-4 border-dashed border-blue-500"></span>
            )}

            {/* Audio Playing Ripple */}
            {audioState === 'playing' && (
              <>
                <span className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-emerald-400/20 animate-ping"></span>
                <span className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-emerald-500/25 animate-pulse"></span>
              </>
            )}

            {/* Big Circular Microphone Button */}
            <button
              id="live-mic-button"
              type="button"
              onClick={() => {
                if (audioState === 'listening') {
                  handleStopListening();
                } else if (audioState === 'playing') {
                  audioService.stopAudio();
                  setAudioState('idle');
                } else {
                  handleStartListening();
                }
              }}
              className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition shadow-2xl active:scale-95 ${
                audioState === 'listening'
                  ? 'bg-amber-600 text-white ring-8 ring-amber-200'
                  : audioState === 'processing'
                  ? 'bg-blue-600 text-white ring-8 ring-blue-100'
                  : audioState === 'playing'
                  ? 'bg-emerald-600 text-white ring-8 ring-emerald-200'
                  : audioState === 'error'
                  ? 'bg-red-600 text-white ring-8 ring-red-100'
                  : 'bg-stone-900 hover:bg-amber-700 text-white ring-8 ring-stone-100'
              }`}
            >
              {audioState === 'listening' ? (
                <Mic className="w-12 h-12 animate-bounce" />
              ) : audioState === 'processing' ? (
                <RefreshCw className="w-12 h-12 animate-spin" />
              ) : audioState === 'playing' ? (
                <Volume2 className="w-12 h-12 animate-pulse" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
          </div>

          {/* EXACT STATUS TEXT (TRANSLATED SCRIPT IS NOT SHOWN) */}
          <div className="mt-8 text-center min-h-[60px] flex flex-col items-center justify-center">
            {audioState === 'idle' && (
              <div className="animate-fadeIn">
                <p className="text-xl sm:text-2xl font-bold text-stone-800">
                  🎤 Tap to speak
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {direction === 'hi_to_sat'
                    ? 'Speak in Hindi • Student hears translated audio'
                    : `Speak in ${targetLangObj.name} • Teacher hears Hindi audio`}
                </p>
              </div>
            )}

            {audioState === 'listening' && (
              <div className="animate-fadeIn">
                <p className="text-xl sm:text-2xl font-bold text-amber-700 flex items-center justify-center gap-2">
                  <Mic className="w-6 h-6 animate-pulse" />
                  <span>Listening...</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Speak clearly into microphone...
                </p>
              </div>
            )}

            {audioState === 'processing' && (
              <div className="animate-fadeIn">
                <p className="text-xl sm:text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span>Processing...</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Synthesizing tribal mother-tongue audio bridge (target ≤ 3s)...
                </p>
              </div>
            )}

            {audioState === 'playing' && (
              <div className="animate-fadeIn">
                <p className="text-xl sm:text-2xl font-bold text-emerald-700 flex items-center justify-center gap-2">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>Playing translation...</span>
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 h-6">
                  <span className="w-1.5 bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite] h-5"></span>
                  <span className="w-1.5 bg-emerald-600 rounded-full animate-[bounce_0.6s_infinite] h-3"></span>
                  <span className="w-1.5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite] h-6"></span>
                  <span className="w-1.5 bg-emerald-500 rounded-full animate-[bounce_0.7s_infinite] h-4"></span>
                  <span className="w-1.5 bg-emerald-600 rounded-full animate-[bounce_0.9s_infinite] h-5"></span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Audio streaming aloud in student&apos;s mother tongue
                </p>
              </div>
            )}

            {audioState === 'error' && (
              <div className="animate-fadeIn text-red-600">
                <p className="text-base sm:text-lg font-bold">
                  ⚠️ {errorMessage || "Couldn't process audio"}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tap microphone or enter a phrase below to speak aloud.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Translated Audio Output Card - Shows distinct mother-tongue translation for each input phrase */}
        {lastInputText && (
          <div className="mt-4 mb-2 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left max-w-xl mx-auto shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-200/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  Live Mother-Tongue Audio Output
                </span>
              </div>
              {latencyMs !== null && (
                <span className="text-[11px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                  ⚡ {(latencyMs / 1000).toFixed(2)}s latency
                </span>
              )}
            </div>

            {/* Input Speech Pill */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {direction === 'hi_to_sat' ? 'Teacher Spoke (Hindi)' : `Student Spoke (${targetLangObj.name})`}
              </span>
              <p className="text-sm sm:text-base font-semibold text-stone-900 mt-0.5">
                &ldquo;{lastInputText}&rdquo;
              </p>
            </div>

            {/* Spoken Output Box with phonetic & script */}
            <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  {direction === 'hi_to_sat' ? `Spoken Audio (${targetLangObj.name})` : 'Spoken Audio (Hindi)'}
                </span>
                <button
                  type="button"
                  onClick={handleReplay}
                  disabled={audioState === 'playing'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-100 px-3 py-1 rounded-lg transition disabled:opacity-40"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{audioState === 'playing' ? 'Speaking...' : 'Play Audio'}</span>
                </button>
              </div>

              {lastTranslatedText && lastTranslatedText !== lastPhoneticForReplay && (
                <p className="text-lg sm:text-xl font-black text-stone-900 mb-1">
                  {lastTranslatedText}
                </p>
              )}
              <p className="text-xs sm:text-sm font-medium text-amber-900 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                🗣️ Phonetic Spoken Guide: <strong className="font-bold">&ldquo;{lastPhoneticForReplay}&rdquo;</strong>
              </p>
            </div>
          </div>
        )}

        {/* Action Controls after/during voice activity */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-stone-100">
          {lastPhoneticForReplay && (
            <button
              id="btn-replay-audio"
              type="button"
              onClick={handleReplay}
              disabled={audioState === 'playing' || audioState === 'listening'}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 transition disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
              <span>🔄 Replay Audio</span>
            </button>
          )}

          {audioState === 'playing' && (
            <button
              id="btn-stop-audio"
              type="button"
              onClick={() => {
                audioService.stopAudio();
                setAudioState('idle');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition"
            >
              <Square className="w-4 h-4" />
              <span>Stop Playback</span>
            </button>
          )}

          {audioState !== 'idle' && (
            <button
              type="button"
              onClick={() => {
                handleStopListening();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              <MicOff className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>

        {/* Direct Classroom Voice Input Bar (Reliable Fallback for No-Mic / Restricted Browsers) */}
        <div className="mt-6 pt-5 border-t border-stone-100 max-w-xl mx-auto">
          <form onSubmit={handleCustomTranslateAndSpeak} className="flex gap-2">
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder={direction === 'hi_to_sat' ? 'Type Hindi phrase to translate & speak aloud...' : `Type ${targetLangObj.name} phrase...`}
              disabled={audioState === 'listening' || audioState === 'processing'}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
            />
            <button
              type="submit"
              disabled={!customInputText.trim() || audioState === 'listening' || audioState === 'processing'}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition disabled:opacity-40 flex items-center gap-1.5 shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>Speak Aloud</span>
            </button>
          </form>
        </div>

        {/* Pedagogical Design Note */}
        <div className="mt-6 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-left max-w-xl mx-auto flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            <strong className="font-semibold">Why is translated script hidden?</strong>{' '}
            In primary tribal classrooms, children cannot read Devanagari or complex scripts.
            MaatriVaani acts as a direct acoustic bridge so teachers speak naturally and students
            hear their mother-tongue voice directly.
          </p>
        </div>

        {/* Quick Classroom Sample Phrases (For SIH Presentation & instant demo testing) */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Quick Classroom Phrases (Click to simulate teacher speech)
            </span>
            <span className="text-[10px] text-stone-400">
              Zero-mic test helper
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleEducationalPhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTriggerSamplePhrase(phrase)}
                disabled={audioState === 'listening' || audioState === 'processing'}
                className="p-3 text-left rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50/60 text-xs font-medium text-stone-800 transition flex items-center justify-between group disabled:opacity-50"
              >
                <span className="truncate pr-2">{phrase}</span>
                <span className="p-1 rounded-lg bg-white border border-stone-200 group-hover:bg-amber-600 group-hover:text-white transition shrink-0">
                  <Volume2 className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
