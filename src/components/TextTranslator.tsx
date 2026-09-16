import React, { useState } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Trash2,
  Sparkles,
  ArrowLeft,
  Check,
  RotateCcw,
  Square,
  BookOpen
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, matchTribalDictionary } from '../data/mockData';
import { audioService } from '../services/audioService';

interface TextTranslatorProps {
  onBack: () => void;
  targetLang: LanguageCode;
  onChangeTargetLang: (lang: LanguageCode) => void;
  isOffline: boolean;
}

export const TextTranslator: React.FC<TextTranslatorProps> = ({
  onBack,
  targetLang,
  onChangeTargetLang,
  isOffline,
}) => {
  const [sourceText, setSourceText] = useState('आज हम पौधों के बारे में सीखेंगे।');
  const [translatedText, setTranslatedText] = useState('ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱵᱚ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ');
  const [phonetic, setPhonetic] = useState('Teheñ do abo dare-nari babot bon chedog-a');
  const [olChiki, setOlChiki] = useState('ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱵᱚ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [directionReversed, setDirectionReversed] = useState(false);

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);

    try {
      if (isOffline) {
        // Fast offline dictionary search with clean exact and phrase matching
        const match = matchTribalDictionary(
          sourceText.trim(),
          targetLang as any,
          directionReversed ? 'sat_to_hi' : 'hi_to_sat'
        );

        if (match) {
          setTranslatedText(match.translatedText);
          setPhonetic(match.phonetic);
          setOlChiki(match.olChiki);
        } else {
          setTranslatedText(`${sourceText} [ᱛᱚᱨᱡᱚᱢᱟ - Offline Mode]`);
          setPhonetic(sourceText);
          setOlChiki('');
        }
      } else {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: sourceText,
            sourceLang: directionReversed ? targetLang : 'hi',
            targetLang: directionReversed ? 'hi' : targetLang,
          }),
        });

        const data = await response.json();
        setTranslatedText(data.translatedText);
        setPhonetic(data.phonetic);
        setOlChiki(data.olChiki || data.translatedText);
      }
    } catch (e) {
      console.warn('Translation error:', e);
      setTranslatedText('अनुवाद प्राप्त नहीं हुआ। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      audioService.stopAudio();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = phonetic || translatedText;
    if (!textToSpeak) return;

    setIsPlaying(true);
    audioService.playChime('start');

    try {
      let base64Audio: string | null = null;
      // Try to get high quality synthesized TTS
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translatedText,
          phonetic: phonetic || translatedText,
          language: targetLang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          base64Audio = data.audioBase64;
        }
      }

      await audioService.playAudio(
        textToSpeak,
        base64Audio,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    } catch (e) {
      // Fallback
      await audioService.playAudio(
        textToSpeak,
        null,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const handleCopy = () => {
    const textToCopy = `${translatedText} (${phonetic})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setPhonetic('');
    setOlChiki('');
  };

  const handleSwap = () => {
    setDirectionReversed(!directionReversed);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const samplePhrases = [
    'आज हम पौधों के बारे में सीखेंगे।',
    'पौधे को पानी और धूप चाहिए।',
    'आप कितने रंग देख सकते हैं?',
    'क्या आप इस जानवर का नाम बता सकते हैं?',
    'साफ पानी पीना चाहिए।',
    'किताब ध्यान से पढ़ें।',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Target Tribal Tongue:</span>
          <select
            value={targetLang}
            onChange={(e) => onChangeTargetLang(e.target.value as LanguageCode)}
            className="bg-white border border-stone-300 text-xs font-bold text-amber-900 rounded-lg py-1 px-2.5 shadow-xs"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Translation Workspace */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Workspace Title Bar */}
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Languages className="w-6 h-6 text-amber-600" />
              <span>TEXT TRANSLATOR</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Bilingual lesson and script editor with Ol Chiki and phonetic support
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
              {directionReversed
                ? `${targetLangObj.name} → हिन्दी (Hindi)`
                : `हिन्दी (Hindi) → ${targetLangObj.name}`}
            </span>
            <button
              onClick={handleSwap}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
          {/* Left: Source Text Area */}
          <div className="p-6 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                <span>{directionReversed ? targetLangObj.name : 'हिन्दी (Hindi - Source)'}</span>
                {sourceText && (
                  <button
                    onClick={handleClear}
                    className="text-stone-400 hover:text-red-600 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={
                  directionReversed
                    ? `Enter ${targetLangObj.name} text...`
                    : 'यहाँ हिंदी पाठ या वाक्य दर्ज करें (Enter Hindi text)...'
                }
                rows={6}
                className="w-full text-base sm:text-lg text-stone-800 placeholder-stone-400 bg-transparent border-0 focus:outline-none resize-none font-sans"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-stone-100">
              <span className="text-[11px] text-stone-400">
                {sourceText.length} characters
              </span>
              <button
                id="btn-translate-submit"
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-600/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Target Translation Output */}
          <div className="p-6 bg-stone-50/40 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                <span>{directionReversed ? 'हिन्दी (Hindi)' : `${targetLangObj.name} (Target)`}</span>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    className="text-stone-500 hover:text-amber-700 flex items-center gap-1 text-xs font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* Native Script Output */}
              <div className="min-h-[90px]">
                {translatedText ? (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-amber-950 font-serif leading-relaxed">
                      {translatedText}
                    </p>
                    {phonetic && phonetic !== translatedText && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-100/60 border border-amber-200">
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">
                          Phonetic Pronunciation Guide:
                        </span>
                        <p className="text-sm font-semibold text-amber-900 mt-0.5">
                          🗣️ &ldquo;{phonetic}&rdquo;
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-stone-400 italic text-sm mt-4">
                    Translation will appear here in native script and phonetic English...
                  </p>
                )}
              </div>
            </div>

            {/* Audio Controls for Translated Text */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  id="btn-listen-translation"
                  onClick={handlePlayAudio}
                  disabled={!translatedText}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isPlaying
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  } disabled:opacity-40`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-4 h-4" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span>🔊 Listen Aloud</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[10px] text-stone-400">
                Primary Classroom Voice Engine
              </span>
            </div>
          </div>
        </div>

        {/* Quick Classroom Phrases Bar */}
        <div className="p-6 bg-stone-100/70 border-t border-stone-200">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2.5">
            Quick Primary Classroom Examples
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePhrases.map((phrase, i) => (
              <button
                key={i}
                onClick={() => {
                  setSourceText(phrase);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-800 transition shadow-2xs hover:bg-amber-50/50"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
