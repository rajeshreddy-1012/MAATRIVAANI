import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

import { matchTribalDictionary, TRIBAL_DICTIONARY, normalizeText } from "./src/data/tribalDictionary";

// Multi-model resilient Gemini caller with automatic failover for high-demand (503) or rate-limit (429) errors
async function generateContentWithFallback(options: {
  contents: string;
  config?: any;
  preferredModels?: string[];
}): Promise<any> {
  const ai = getGeminiClient();
  if (!ai) return null;

  // We prioritize gemini-3.1-flash-lite for ultra-fast response and high RPS headroom,
  // followed by gemini-3.8-flash and gemini-flash-latest.
  const models = options.preferredModels || [
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config || { responseMimeType: "application/json" },
      });
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err: any) {
      const isTransient =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("quota") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      if (isTransient) {
        console.info(`Model ${model} busy or rate-limited; automatically failing over to next model...`);
      } else {
        console.warn(`Model ${model} warning: ${err?.message?.slice(0, 80)}`);
      }
    }
  }
  return null;
}

// Multi-model resilient Gemini caller for translations
async function translateWithGeminiFallback(prompt: string): Promise<any> {
  return generateContentWithFallback({
    contents: prompt,
    config: { responseMimeType: "application/json" },
    preferredModels: ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"],
  });
}

// Generates an intelligent phonetic transliteration fallback if completely offline
function generateContextualPhoneticFallback(cleanText: string, targetLang: string): { translatedText: string; phonetic: string; olChiki: string } {
  // Try to decompose by known individual dictionary terms
  const words = cleanText.split(/\s+/);
  const translatedWords: string[] = [];
  const phoneticWords: string[] = [];
  let foundAny = false;

  for (const w of words) {
    const matched = matchTribalDictionary(w, targetLang as any);
    if (matched) {
      translatedWords.push(matched.translatedText);
      phoneticWords.push(matched.phonetic);
      foundAny = true;
    } else {
      translatedWords.push(w);
      phoneticWords.push(w);
    }
  }

  if (foundAny) {
    return {
      translatedText: translatedWords.join(' '),
      phonetic: phoneticWords.join(' '),
      olChiki: targetLang === 'sat' ? translatedWords.join(' ') : '',
    };
  }

  // Fallback to distinct representation for that specific phrase
  return {
    translatedText: cleanText,
    phonetic: cleanText,
    olChiki: '',
  };
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "MaatriVaani",
    version: "1.0.0",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    offlineEngineReady: true,
  });
});

// Translation API (Text & Contextual)
app.post("/api/translate", async (req, res) => {
  const { text, sourceLang = "hi", targetLang = "sat", context = "primary_classroom" } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required for translation" });
  }

  const cleanText = text.trim();
  const direction = sourceLang === "hi" ? "hi_to_sat" : "sat_to_hi";

  // Check verified tribal dictionary first with strict matching (exact phrase / longest sentence)
  const dictMatch = matchTribalDictionary(cleanText, targetLang as any, direction as any);
  if (dictMatch) {
    return res.json({
      translatedText: dictMatch.translatedText,
      phonetic: dictMatch.phonetic,
      olChiki: dictMatch.olChiki,
      sourceText: cleanText,
      sourceLang,
      targetLang,
      isOfflineFallback: false,
      dictionaryVerified: true,
    });
  }

  // Use multi-model Gemini translation pipeline
  const langNames: Record<string, string> = {
    sat: "Santhali (Santali - using Ol Chiki script and English phonetic pronunciation)",
    unr: "Mundari (Austroasiatic tribal language of Jharkhand/Odisha)",
    hoc: "Ho (Warang Chiti / Devanagari script tribal language of Kolhan)",
    hi: "Hindi (Standard Devanagari)",
  };

  const targetName = langNames[targetLang] || "Santhali";
  const sourceName = langNames[sourceLang] || "Hindi";

  const prompt = `You are an expert bilingual linguist for the Smart India Hackathon initiative "MaatriVaani" (SIH26042), an AI mother-tongue classroom assistant for primary school Indian tribal children (Classes 1-5).
Translate the following ${sourceName} classroom phrase accurately into ${targetName}.
Input text: "${cleanText}"
Context: ${context}

Respond in pure JSON matching this schema:
{
  "translatedText": "the native script translation (Ol Chiki for Santhali, Devanagari/recognized script for Mundari/Ho)",
  "phonetic": "simple English/Latin phonetic pronunciation without complex diacritics so any teacher or speech synthesizer can pronounce it",
  "olChiki": "Ol Chiki script version if Santhali, else same as translatedText",
  "explanation": "brief 1-sentence note for the teacher on grammar or cultural nuance"
}`;

  const parsed = await translateWithGeminiFallback(prompt);
  if (parsed && (parsed.translatedText || parsed.phonetic)) {
    return res.json({
      translatedText: parsed.translatedText || cleanText,
      phonetic: parsed.phonetic || cleanText,
      olChiki: parsed.olChiki || parsed.translatedText || "",
      explanation: parsed.explanation || "",
      sourceText: cleanText,
      sourceLang,
      targetLang,
      isOfflineFallback: false,
    });
  }

  // Graceful distinct linguistic fallback if all AI models are unreachable
  const fallback = generateContextualPhoneticFallback(cleanText, targetLang);
  res.json({
    translatedText: fallback.translatedText,
    phonetic: fallback.phonetic,
    olChiki: fallback.olChiki,
    sourceText: cleanText,
    sourceLang,
    targetLang,
    isOfflineFallback: true,
  });
});

// Live Classroom Voice-to-Voice endpoint (<3s latency target)
app.post("/api/live-translate", async (req, res) => {
  const { text, direction = "hi_to_sat", targetLang = "sat" } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required" });
  }

  const cleanText = text.trim();
  const startTime = Date.now();

  // 1. Check verified tribal dictionary first with strict matching
  const dictMatch = matchTribalDictionary(cleanText, targetLang as any, direction as any);
  if (dictMatch) {
    return res.json({
      success: true,
      direction,
      targetLang,
      translatedText: dictMatch.translatedText,
      phonetic: dictMatch.phonetic,
      olChiki: dictMatch.olChiki,
      latencyMs: Date.now() - startTime,
      isOfflineFallback: false,
      dictionaryVerified: true,
    });
  }

  // 2. Multi-model Gemini fallback pipeline
  const targetLabel = targetLang === "unr" ? "Mundari" : targetLang === "hoc" ? "Ho" : "Santhali";
  const prompt = direction === "hi_to_sat"
    ? `You are an expert bilingual primary school educator for tribal children. Translate this teacher's Hindi sentence into ${targetLabel}. Return strictly JSON with:
"translatedText": "native script (Ol Chiki for Santhali, Devanagari/recognized script for Mundari/Ho)",
"phonetic": "simple English/Latin phonetic pronunciation for clear speech synthesis without special diacritics",
"meaning": "English meaning".
Sentence: "${cleanText}"`
    : `You are an expert bilingual primary school educator. Translate this student's ${targetLabel} phrase into simple Hindi. Return strictly JSON with:
"translatedText": "Hindi in Devanagari",
"phonetic": "Hindi pronunciation",
"meaning": "English meaning".
Phrase: "${cleanText}"`;

  const parsed = await translateWithGeminiFallback(prompt);
  const latencyMs = Date.now() - startTime;

  if (parsed && (parsed.translatedText || parsed.phonetic)) {
    return res.json({
      success: true,
      direction,
      targetLang,
      translatedText: parsed.translatedText,
      phonetic: parsed.phonetic,
      olChiki: targetLang === "sat" ? (parsed.olChiki || parsed.translatedText) : "",
      latencyMs,
      isOfflineFallback: false,
    });
  }

  // Graceful distinct linguistic fallback
  const fallback = generateContextualPhoneticFallback(cleanText, targetLang);
  res.json({
    success: true,
    direction,
    targetLang,
    translatedText: fallback.translatedText,
    phonetic: fallback.phonetic,
    olChiki: fallback.olChiki,
    latencyMs,
    isOfflineFallback: true,
  });
});

// Convert raw 16-bit linear PCM to a standard RIFF/WAV buffer
function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const ttsCache = new Map<string, string>();
let ttsRateLimitedUntil = 0;

// Text-to-Speech API (with automatic quota protection & browser TTS failover)
app.post("/api/tts", async (req, res) => {
  const { text, phonetic, language = "sat" } = req.body;
  const targetText = (phonetic || text || "").trim();

  if (!targetText) {
    return res.status(400).json({ error: "Text is required for TTS" });
  }

  // Check in-memory cache
  const cacheKey = `${language}:${targetText.toLowerCase()}`;
  if (ttsCache.has(cacheKey)) {
    return res.json({
      success: true,
      audioBase64: ttsCache.get(cacheKey),
      mimeType: "audio/wav",
      phoneticText: targetText,
      fromCache: true,
    });
  }

  // If Gemini TTS is cooling down from a 429 quota exhaustion, immediately serve client browser TTS
  if (Date.now() < ttsRateLimitedUntil) {
    return res.json({
      success: true,
      audioBase64: null,
      useBrowserTts: true,
      rateLimited: true,
      phoneticText: targetText,
    });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      success: true,
      audioBase64: null,
      useBrowserTts: true,
      phoneticText: targetText,
    });
  }

  try {
    // Generate Speech with gemini-3.1-flash-tts-preview
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: targetText,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const rawPcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (rawPcmBase64) {
      const pcmBuf = Buffer.from(rawPcmBase64, "base64");
      const wavBuf = pcmToWav(pcmBuf, 24000, 1, 16);
      const wavBase64 = wavBuf.toString("base64");

      ttsCache.set(cacheKey, wavBase64);

      return res.json({
        success: true,
        audioBase64: wavBase64,
        mimeType: "audio/wav",
        phoneticText: targetText,
      });
    }

    return res.json({
      success: true,
      audioBase64: null,
      useBrowserTts: true,
      phoneticText: targetText,
    });
  } catch (err: any) {
    const isQuotaError =
      err?.status === 429 ||
      err?.message?.includes("429") ||
      err?.message?.includes("quota") ||
      err?.message?.includes("RESOURCE_EXHAUSTED");

    if (isQuotaError) {
      // Cooldown for 60 seconds to prevent error spamming and ensure 0ms latency client TTS
      ttsRateLimitedUntil = Date.now() + 60000;
      console.info("Gemini TTS free-tier quota reached (10 req/day). Seamlessly using browser audio synthesis.");
    } else {
      console.warn("Gemini TTS API error, falling back to browser synthesis:", err?.message?.slice(0, 80));
    }

    return res.json({
      success: true,
      audioBase64: null,
      useBrowserTts: true,
      rateLimited: isQuotaError,
      phoneticText: targetText,
    });
  }
});

// Worksheet Generator API (Bilingual NIPUN Bharat Aligned)
app.post("/api/generate-worksheet", async (req, res) => {
  const {
    classGrade = 3,
    subject = "EVS",
    topic = "Plants and Nature",
    difficulty = "Easy",
    targetLanguage = "sat",
    numQuestions = 5,
  } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key not configured. Using pre-cached offline worksheets.",
    });
  }

  try {
    const prompt = `Generate a high-quality, primary-school bilingual educational worksheet for Class ${classGrade} ${subject} on the topic "${topic}".
Difficulty: ${difficulty}. Number of questions: ${numQuestions}.
Target tribal language: Santhali (Santali - with Ol Chiki or phonetic transcription).
Language 1: Hindi (Devanagari). Language 2: Santhali (Santali).
The worksheet MUST include a mix of:
- Multiple Choice Questions (MCQ)
- Fill in the Blanks
- Match the following
- True / False
- Picture / Real-life identification question
Align with NIPUN Bharat foundational learning outcomes.`;

    const parsed = await generateContentWithFallback({
      contents: prompt,
      preferredModels: ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            titleTarget: { type: Type.STRING },
            classGrade: { type: Type.INTEGER },
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            learningOutcomeCode: { type: Type.STRING },
            learningOutcomeDesc: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  questionHindi: { type: Type.STRING },
                  questionTarget: { type: Type.STRING },
                  optionsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                  optionsTarget: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanationHindi: { type: Type.STRING },
                  explanationTarget: { type: Type.STRING },
                },
                required: ["id", "type", "questionHindi", "questionTarget", "correctAnswer"],
              },
            },
          },
          required: ["title", "titleTarget", "classGrade", "subject", "topic", "questions"],
        },
      },
    });

    if (parsed && parsed.title && parsed.questions) {
      return res.json({
        ...parsed,
        id: `gen-ws-${Date.now()}`,
        targetLanguage,
        createdDate: new Date().toISOString().split("T")[0],
      });
    }

    throw new Error("Empty worksheet response from AI models");
  } catch (error: any) {
    console.warn("Worksheet generation fell back:", error?.message?.slice(0, 80));
    res.status(500).json({ error: "Failed to generate worksheet with AI. Please use offline cached template." });
  }
});

// Flashcard Generation API
app.post("/api/generate-flashcards", async (req, res) => {
  const { category = "Animals", targetLanguage = "sat", count = 4 } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: "Gemini API key not configured." });
  }

  try {
    const prompt = `Generate ${count} bilingual primary-school flashcards for category "${category}" in Hindi and Santhali (Santali).
Include word in Hindi, target word in Santali (with Ol Chiki if possible), English meaning, simple emoji, phonetic pronunciation, and sample educational sentence.`;

    const parsed = await generateContentWithFallback({
      contents: prompt,
      preferredModels: ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              hindiWord: { type: Type.STRING },
              targetWord: { type: Type.STRING },
              targetScriptOlChiki: { type: Type.STRING },
              targetPhonetic: { type: Type.STRING },
              englishMeaning: { type: Type.STRING },
              imageEmoji: { type: Type.STRING },
              sampleSentenceHindi: { type: Type.STRING },
              sampleSentenceTarget: { type: Type.STRING },
            },
            required: ["id", "hindiWord", "targetWord", "targetPhonetic", "englishMeaning", "imageEmoji"],
          },
        },
      },
    });

    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json(parsed);
    }
    throw new Error("Invalid flashcard output");
  } catch (error: any) {
    console.warn("Flashcard generation fell back:", error?.message?.slice(0, 80));
    res.status(500).json({ error: "Failed to generate flashcards." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MaatriVaani server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
