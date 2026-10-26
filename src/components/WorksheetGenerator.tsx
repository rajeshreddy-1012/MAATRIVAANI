import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  Save,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Worksheet, WorksheetQuestion, LanguageCode, Lesson } from '../types';
import { SUPPORTED_LANGUAGES, INITIAL_WORKSHEETS } from '../data/mockData';
import { storageService } from '../services/storageService';

interface WorksheetGeneratorProps {
  onBack: () => void;
  targetLang: LanguageCode;
  initialLesson?: Lesson | null;
  isOffline: boolean;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  onBack,
  targetLang,
  initialLesson,
  isOffline,
}) => {
  const [classGrade, setClassGrade] = useState<number>(initialLesson?.classGrade || 3);
  const [subject, setSubject] = useState<string>(initialLesson?.subject || 'EVS');
  const [topic, setTopic] = useState<string>(initialLesson?.title || 'पौधों के भाग (Parts of a Plant)');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Challenging'>('Easy');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeWorksheet, setActiveWorksheet] = useState<Worksheet>(INITIAL_WORKSHEETS[0]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const targetLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      if (isOffline) {
        // Offline generated template with custom topic injected
        await new Promise((r) => setTimeout(r, 600));
        const newOfflineWs: Worksheet = {
          id: `ws-off-${Date.now()}`,
          title: `${topic} - अभ्यास कार्यपत्रक`,
          titleTarget: `${topic} - ᱥᱟᱱᱛᱟᱲᱤ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ`,
          classGrade,
          subject,
          topic,
          difficulty,
          learningOutcomeCode: 'FLN-EVS-C3-02',
          learningOutcomeDesc: 'Identify core parts and functions in Hindi & tribal mother-tongue.',
          targetLanguage: targetLang,
          createdDate: new Date().toISOString().split('T')[0],
          questions: [
            {
              id: 'q1',
              type: 'mcq',
              questionHindi: `१. ${topic} के संदर्भ में सही विकल्प चुनिए:`,
              questionTarget: `᱑. ${topic} ᱞᱟᱹᱜᱤᱫ ᱥᱟᱹᱨᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:`,
              optionsHindi: ['क) जड़ (Root)', 'ख) पत्ती (Leaf)', 'ग) तना (Stem)', 'घ) सभी सही'],
              optionsTarget: ['ᱠ) ᱨᱮᱦᱮᱫ', 'ᱠᱷ) ᱥᱟᱠᱟᱢ', 'ᱜ) ᱰᱟᱹᱨ', 'ᱜᱷ) ᱡᱚᱛᱚ ᱥᱟᱹᱨᱤ'],
              correctAnswer: 'घ) सभी सही (All of the above)',
            },
            {
              id: 'q2',
              type: 'fill_in_blank',
              questionHindi: '२. पौधे जीवित रहने के लिए ______ और धूप की आवश्यकता रखते हैं।',
              questionTarget: '᱒. ᱫᱟᱨᱮ ᱵᱟᱧᱪᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ______ ᱟᱨ ᱥᱤᱛᱩᱝ ᱫᱚᱨᱠᱟᱨ᱾',
              correctAnswer: 'पानी (ᱫᱟᱜ / Daag)',
            },
            {
              id: 'q3',
              type: 'picture_based',
              questionHindi: '३. चित्र में देखकर पहचानें: हरा रंग किसकी उपस्थिति दर्शाता है?',
              questionTarget: '᱓. ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ: ᱦᱟᱹᱨᱭᱟᱹᱲ ᱨᱚᱝ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',
              optionsHindi: ['क) पत्ती (Leaf)', 'ख) जड़ (Root)'],
              optionsTarget: ['ᱠ) ᱥᱟᱠᱟᱢ (Sakam)', 'ᱠᱷ) ᱨᱮᱦᱮᱫ (Rehed)'],
              correctAnswer: 'क) पत्ती (ᱥᱟᱠᱟᱢ)',
              imageVisual: '🌱',
            },
            {
              id: 'q4',
              type: 'true_false',
              questionHindi: '४. क्या पेड़ हमें शुद्ध हवा और फल देते हैं? (सही / गलत)',
              questionTarget: '᱔. ᱪᱮᱫ ᱫᱟᱨᱮ ᱟᱵᱚ ᱯᱷᱟᱨᱪᱟ ᱦᱚᱭ ᱟᱨ ᱡᱚᱭ ᱮᱢᱟᱵᱚᱱᱟ? (ᱥᱟᱹᱨᱤ / ᱵᱟᱹᱲᱤᱡ)',
              correctAnswer: 'सही (ᱥᱟᱹᱨᱤ)',
            },
            {
              id: 'q5',
              type: 'short_answer',
              questionHindi: '५. अपने आस-पास पाए जाने वाले दो पेड़ों के नाम संथाली में लिखें।',
              questionTarget: '᱕. ᱟᱯᱱᱟᱨ ᱟᱹᱛᱩ ᱨᱮ ᱧᱟᱢᱚᱜ ᱵᱟᱨᱭᱟ ᱫᱟᱨᱮ ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ᱾',
              correctAnswer: 'ᱩᱞ ᱫᱟᱨᱮ (Mango Tree), ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ (Mahua Tree)',
            },
          ],
        };
        setActiveWorksheet(newOfflineWs);
      } else {
        const response = await fetch('/api/generate-worksheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classGrade,
            subject,
            topic,
            difficulty,
            targetLanguage: targetLang,
            numQuestions,
          }),
        });

        if (response.ok) {
          const generated = await response.json();
          setActiveWorksheet(generated);
        } else {
          throw new Error('Fallback to template');
        }
      }
    } catch (e) {
      console.warn('AI worksheet error, using rich fallback:', e);
      setActiveWorksheet(INITIAL_WORKSHEETS[0]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    storageService.addWorksheet(activeWorksheet);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeWorksheet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Worksheet_${activeWorksheet.topic.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 shadow-xs transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Bilingual Pedagogy Engine
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-1">
              WORKSHEET GENERATOR
            </h1>
          </div>
        </div>

        {/* Top Actions: Print / Save */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 shadow-xs transition"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-stone-600" />
                <span>Save Worksheet</span>
              </>
            )}
          </button>

          <button
            id="btn-print-worksheet"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-white shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Generator Controls Card (Hidden during print) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Customize Worksheet Parameters</span>
          </h2>
          <span className="text-xs text-stone-500">
            Hindi + {targetLangObj.name} ({targetLangObj.nativeName})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Class */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
              Class Grade
            </label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
            >
              {[1, 2, 3, 4, 5].map((c) => (
                <option key={c} value={c}>
                  Class {c} (कक्षा {c})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
            >
              <option value="EVS">EVS (पर्यावरण)</option>
              <option value="Mathematics">Mathematics (गणित)</option>
              <option value="Language">Language (भाषा)</option>
              <option value="Science">General Science</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
              Topic / Chapter
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Parts of a Plant"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
            >
              <option value="Easy">Easy (सरल / Basic)</option>
              <option value="Medium">Medium (मध्यम)</option>
              <option value="Challenging">Challenging (उन्नत)</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              id="btn-generate-ws"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Worksheet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKSHEET PREVIEW CANVAS (Styled like official Indian school exam sheet) */}
      {/* ========================================================================= */}
      <div
        id="printable-worksheet"
        className="bg-white rounded-3xl border border-stone-300 shadow-xl p-6 sm:p-10 text-stone-900 space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Formal Institutional Header */}
        <div className="text-center pb-4 border-b-2 border-stone-800 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-600">
            राजकीय प्राथमिक विद्यालय • Govt. Primary School (SIH-FLN Program)
          </p>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            {activeWorksheet.title}
          </h2>
          <p className="text-sm font-bold text-amber-900 font-serif">
            {activeWorksheet.titleTarget}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600 pt-1">
            <span>Class: {activeWorksheet.classGrade}</span>
            <span>•</span>
            <span>Subject: {activeWorksheet.subject}</span>
            <span>•</span>
            <span>Language Pair: Hindi + {targetLangObj.name}</span>
            <span>•</span>
            <span>NIPUN Code: {activeWorksheet.learningOutcomeCode}</span>
          </div>
        </div>

        {/* Student Fill Details Line (Name, Roll No, Date) */}
        <div className="grid grid-cols-3 gap-4 text-xs font-bold border-b border-stone-200 pb-3">
          <div>विद्यार्थी का नाम (Name): _________________</div>
          <div>अनुक्रमांक (Roll No): ________</div>
          <div>दिनांक (Date): ____________</div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6 pt-2">
          {activeWorksheet.questions.map((q, idx) => (
            <div key={q.id} className="space-y-2 pb-4 border-b border-stone-100 last:border-0">
              {/* Question Text in Hindi and Target Language */}
              <div className="font-bold text-sm text-stone-900">
                <p>{q.questionHindi}</p>
                <p className="text-amber-950 font-serif font-semibold mt-0.5">
                  {q.questionTarget}
                </p>
              </div>

              {/* Optional Visual Illustration for Picture-based question */}
              {q.imageVisual && (
                <div className="p-3 bg-stone-50 inline-block rounded-xl border border-stone-200 text-3xl">
                  {q.imageVisual}
                </div>
              )}

              {/* Multiple Choice Options */}
              {q.optionsHindi && q.optionsTarget && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsHindi.map((optH, optIdx) => (
                    <div
                      key={optIdx}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium"
                    >
                      <span>{optH}</span>
                      <span className="text-amber-900 font-serif font-semibold ml-2">
                        / {q.optionsTarget?.[optIdx]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Teacher Answer Key Note (Collapsible or visible) */}
              <div className="text-[11px] text-stone-500 font-medium pt-1">
                <span className="font-bold text-stone-700">उत्तर (Answer Key): </span>
                <span className="italic text-emerald-800 font-semibold">{q.correctAnswer}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evaluation Signature Footer */}
        <div className="pt-8 flex items-center justify-between text-xs font-bold border-t border-stone-300">
          <div>शिक्षक हस्ताक्षर (Teacher&apos;s Signature)</div>
          <div>अंक / ग्रेड (Grade): ________ / {activeWorksheet.questions.length * 2}</div>
        </div>
      </div>
    </div>
  );
};
