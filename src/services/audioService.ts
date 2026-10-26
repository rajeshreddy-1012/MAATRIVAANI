// Audio Service for MaatriVaani (SIH26042)
// Handles Speech-to-Text, Audio decoding/playback, Web Speech API fallback, and low-latency metrics

export type AudioState = 'idle' | 'listening' | 'processing' | 'playing' | 'stopped' | 'error';

class AudioService {
  private recognition: any = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initSpeechRecognition();
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const load = () => {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices() || [];
          if (this.cachedVoices.length > 0) {
            this.voicesLoaded = true;
          }
        } catch (e) {
          // ignore
        }
      };
      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }

  private ensureAudioContext(): AudioContext | null {
    try {
      if (!this.audioContext && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioContext;
    } catch (e) {
      return null;
    }
  }

  private initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.lang = 'hi-IN'; // Default to Hindi for teacher input
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  // Listen for speech with fallback timeout
  public startListening(
    lang: string = 'hi-IN',
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onStateChange: (state: AudioState) => void
  ): { stop: () => void } {
    this.ensureAudioContext();
    onStateChange('listening');

    if (!this.recognition) {
      console.warn('Web Speech API not supported on this browser');
      setTimeout(() => {
        onError('Microphone speech recognition is not supported in this browser environment. You can use the quick phrase buttons or type a phrase below.');
        onStateChange('idle');
      }, 800);
      return { stop: () => {} };
    }

    try {
      this.recognition.lang = lang;

      this.recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onStateChange('processing');
          onResult(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event?.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission was denied or restricted. Please allow mic access or use the quick phrase selector below.');
        } else if (event.error === 'no-speech') {
          onError('No speech was detected. Please speak clearly or select a classroom phrase.');
        } else {
          onError(`Speech recognition note: ${event.error || 'idle'}. You can also type or choose a phrase below.`);
        }
        onStateChange('idle');
      };

      this.recognition.onend = () => {
        // Recognition cycle ended
      };

      this.recognition.start();

      return {
        stop: () => {
          try {
            this.recognition.stop();
          } catch (e) {
            // ignore
          }
        },
      };
    } catch (err: any) {
      console.warn('Microphone start error:', err);
      onError('Microphone could not start. Please select a classroom phrase or type below.');
      onStateChange('idle');
      return { stop: () => {} };
    }
  }

  // Play audio from base64 WAV or fallback to speech synthesis / acoustic tone
  public async playAudio(
    textToSpeak: string,
    base64Audio?: string | null,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stopAudio();
    this.ensureAudioContext();

    if (base64Audio) {
      try {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`;
        const audio = new Audio(audioUrl);
        this.currentAudioElement = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (err) => {
          console.warn('Base64 audio playback failed, falling back to Web Speech synthesis:', err);
          this.playBrowserTTS(textToSpeak, onStart, onEnd);
        };

        await audio.play();
        return;
      } catch (e) {
        console.warn('Error playing base64 audio element, falling back to Web Speech:', e);
      }
    }

    // Fallback: Browser Web Speech API
    this.playBrowserTTS(textToSpeak, onStart, onEnd);
  }

  public playBrowserTTS(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    langHint?: string
  ): void {
    if (typeof window === 'undefined') {
      if (onStart) onStart();
      if (onEnd) onEnd();
      return;
    }

    const cleanText = (text || '').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    if (!window.speechSynthesis) {
      // Acoustic fallback
      this.playAcousticVoiceSyllables(cleanText, onStart, onEnd);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.activeUtterance = utterance;

      // Determine appropriate language code:
      const hasOlChiki = /[\u1C50-\u1C7F]/.test(cleanText);
      const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
      const hasLatin = /[a-zA-Z]/.test(cleanText);

      // If text only contains Ol Chiki script characters, Web Speech API cannot synthesize it,
      // so fallback directly to phonetic acoustic syllables.
      if (hasOlChiki && !hasLatin && !hasDevanagari) {
        this.playAcousticVoiceSyllables(cleanText, onStart, onEnd);
        return;
      }

      let targetLangCode = 'hi-IN';
      if (hasLatin) {
        targetLangCode = 'en-IN'; // Indian English handles phonetic Santali/Mundari words accurately
      } else if (hasDevanagari) {
        targetLangCode = 'hi-IN';
      } else if (langHint) {
        targetLangCode = langHint;
      }

      utterance.lang = targetLangCode;
      utterance.rate = 0.88; // clear and steady for children
      utterance.pitch = 1.05;

      // Find best matching voice
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('in') ||
          v.lang.toLowerCase().includes('hi') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('hindi')
      ) || voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      let hasFinished = false;
      const finish = () => {
        if (!hasFinished) {
          hasFinished = true;
          this.activeUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        finish();
      };

      // Watchdog timeout to prevent frozen UI in browsers where speech synthesis pauses
      const estimatedDuration = Math.max(1500, cleanText.length * 90);
      setTimeout(() => {
        if (!hasFinished) {
          finish();
        }
      }, estimatedDuration + 1000);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Browser TTS threw exception, using acoustic fallback:', e);
      this.playAcousticVoiceSyllables(cleanText, onStart, onEnd);
    }
  }

  // Pure Web Audio API synthesized phonetic tone for guaranteed audible sound
  public playAcousticVoiceSyllables(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) {
      if (onStart) onStart();
      if (onEnd) onEnd();
      return;
    }

    try {
      if (onStart) onStart();

      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = Math.min(words.length, 6);
      const now = ctx.currentTime;
      const syllableDuration = 0.22;

      for (let i = 0; i < wordCount; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Formant-like frequencies
        const baseFreq = 260 + (i % 3) * 60;
        const startTime = now + i * (syllableDuration + 0.05);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, startTime + syllableDuration * 0.5);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, startTime + syllableDuration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + syllableDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + syllableDuration);
      }

      const totalTime = wordCount * (syllableDuration + 0.05);
      setTimeout(() => {
        if (onEnd) onEnd();
      }, totalTime * 1000);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  // Play pleasant acoustic feedback chime for rural school devices
  public playChime(type: 'start' | 'success' | 'complete'): void {
    try {
      const ctx = this.ensureAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(659.25, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // ignore
    }
  }

  public testAudioOutput(onSuccess?: () => void): void {
    this.ensureAudioContext();
    this.playChime('success');
    setTimeout(() => {
      this.playBrowserTTS('MaatriVaani audio is active. Johar!', () => {}, onSuccess);
    }, 300);
  }

  public stopAudio(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
      } catch (e) {}
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.activeUtterance = null;
  }
}

export const audioService = new AudioService();
