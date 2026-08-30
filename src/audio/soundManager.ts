/**
 * 8-bit / 16-bit Retro Chiptune Sound Synthesizer using Web Audio API
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimeout: number | null = null;
  private bgmStepIndex: number = 0;
  public isMuted: boolean = false;
  public isBgmMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.bgmGain && this.ctx) {
      this.bgmGain = this.ctx.createGain();
      this.bgmFilter = this.ctx.createBiquadFilter();
      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.setValueAtTime(3600, this.ctx.currentTime);
      this.bgmFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.bgmGain.connect(this.bgmFilter);
      this.bgmFilter.connect(this.ctx.destination);
    }
  }

  public playJump() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playCoin() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Note 1: B5
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.14, now + 0.008);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Note 2: E6 (Higher chime)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.51, now + 0.07);
      gain2.gain.setValueAtTime(0.0001, now + 0.07);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.078);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.36);
    } catch {}
  }

  public playOwlHoot() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Owl double hoot: Hoo... Hoo-oo!
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      osc.frequency.setValueAtTime(560, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.35);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.19);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  public playVoldemortLaugh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Dark low resonant undertone rumble
      const darkOsc = this.ctx.createOscillator();
      const darkGain = this.ctx.createGain();
      darkOsc.type = 'triangle';
      darkOsc.frequency.setValueAtTime(110, now);
      darkOsc.frequency.exponentialRampToValueAtTime(45, now + 0.8);
      darkGain.gain.setValueAtTime(0.0001, now);
      darkGain.gain.linearRampToValueAtTime(0.1, now + 0.02);
      darkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      darkOsc.connect(darkGain);
      darkGain.connect(this.ctx.destination);
      darkOsc.start(now);
      darkOsc.stop(now + 0.82);

      // Voldemort high-pitched staccato cackle "NYEH-HEH-HEH-HEH-HEEEEHHH!"
      const laughBursts = [
        { tOffset: 0.00, dur: 0.11, startF: 440, endF: 490, vol: 0.13 }, // "Ehh"
        { tOffset: 0.12, dur: 0.09, startF: 520, endF: 460, vol: 0.15 }, // "Heh"
        { tOffset: 0.22, dur: 0.09, startF: 540, endF: 480, vol: 0.15 }, // "Heh"
        { tOffset: 0.32, dur: 0.10, startF: 560, endF: 500, vol: 0.16 }, // "Heh"
        { tOffset: 0.43, dur: 0.12, startF: 580, endF: 520, vol: 0.17 }, // "Heh"
        { tOffset: 0.56, dur: 0.30, startF: 620, endF: 400, vol: 0.18 }, // "Heeeee-aaahh!"
      ];

      laughBursts.forEach(burst => {
        if (!this.ctx) return;
        const bStart = now + burst.tOffset;

        // Clean triangle throat vocal oscillator (zero harsh buzz)
        const vOsc = this.ctx.createOscillator();
        const vGain = this.ctx.createGain();
        vOsc.type = 'triangle';
        vOsc.frequency.setValueAtTime(burst.startF, bStart);
        vOsc.frequency.exponentialRampToValueAtTime(burst.endF, bStart + burst.dur);

        // Smooth anti-click attack and decay
        vGain.gain.setValueAtTime(0.0001, bStart);
        vGain.gain.linearRampToValueAtTime(burst.vol, bStart + 0.015);
        vGain.gain.exponentialRampToValueAtTime(0.0001, bStart + burst.dur);

        vOsc.connect(vGain);
        vGain.connect(this.ctx.destination);

        vOsc.start(bStart);
        vOsc.stop(bStart + burst.dur + 0.02);

        // Soft sine overtone for resonance
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(burst.startF * 1.5, bStart);
        sOsc.frequency.exponentialRampToValueAtTime(burst.endF * 1.5, bStart + burst.dur);

        sGain.gain.setValueAtTime(0.0001, bStart);
        sGain.gain.linearRampToValueAtTime(burst.vol * 0.35, bStart + 0.015);
        sGain.gain.exponentialRampToValueAtTime(0.0001, bStart + burst.dur);

        sOsc.connect(sGain);
        sGain.connect(this.ctx.destination);

        sOsc.start(bStart);
        sOsc.stop(bStart + burst.dur + 0.02);
      });
    } catch {}
  }

  public playDumbledoreBlessing() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Ascending Phoenix Glissando (C5, E5, G5, B5, C6, E6)
      const celestialNotes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      celestialNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.06;

        // Celesta Bell
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        const dur = idx === celestialNotes.length - 1 ? 0.7 : 0.28;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.03);

        // Shimmer overtone
        const shimmer = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(freq * 2, noteStart);

        shimGain.gain.setValueAtTime(0.0001, noteStart);
        shimGain.gain.linearRampToValueAtTime(0.05, noteStart + 0.01);
        shimGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + Math.min(dur, 0.4));

        shimmer.connect(shimGain);
        shimGain.connect(this.ctx.destination);
        shimmer.start(noteStart);
        shimmer.stop(noteStart + dur + 0.03);
      });
    } catch {}
  }

  public playDracoTaunt() {
    this.playVoldemortLaugh();
  }

  // Character Loading Themes & Spell Sounds
  public playSnitchFlutter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Golden Snitch Rapid Wing Flutters + Chime
      for (let i = 0; i < 6; i++) {
        const t = now + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400 + Math.sin(i * 2) * 400, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.04);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      }

      // Golden bell shimmer
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(2093, now + 0.15); // C7
      bellGain.gain.setValueAtTime(0.0001, now + 0.15);
      bellGain.gain.linearRampToValueAtTime(0.12, now + 0.16);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(now + 0.15);
      bellOsc.stop(now + 0.65);
    } catch {}
  }

  public playFlyingCarEngine() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Retro chiptune engine hum & flying whoosh
      const engOsc = this.ctx.createOscillator();
      const engGain = this.ctx.createGain();
      engOsc.type = 'sawtooth';
      engOsc.frequency.setValueAtTime(110, now);
      engOsc.frequency.linearRampToValueAtTime(160, now + 0.3);
      engOsc.frequency.linearRampToValueAtTime(130, now + 0.7);

      engGain.gain.setValueAtTime(0.0001, now);
      engGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      engGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      engOsc.connect(engGain);
      engGain.connect(this.ctx.destination);
      engOsc.start(now);
      engOsc.stop(now + 0.9);

      // Flying whoosh wind
      const whooshOsc = this.ctx.createOscillator();
      const whooshGain = this.ctx.createGain();
      whooshOsc.type = 'triangle';
      whooshOsc.frequency.setValueAtTime(320, now + 0.1);
      whooshOsc.frequency.exponentialRampToValueAtTime(120, now + 0.6);
      whooshGain.gain.setValueAtTime(0.0001, now + 0.1);
      whooshGain.gain.linearRampToValueAtTime(0.07, now + 0.18);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      whooshOsc.connect(whooshGain);
      whooshGain.connect(this.ctx.destination);
      whooshOsc.start(now + 0.1);
      whooshOsc.stop(now + 0.7);
    } catch {}
  }

  // Pre-cached voices for immediate playback
  private britishVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const allVoices = window.speechSynthesis.getVoices();
          this.britishVoices = allVoices.filter(v => 
            v.lang.includes('en-GB') || 
            v.lang.includes('en_GB') ||
            v.name.toLowerCase().includes('british') ||
            v.name.toLowerCase().includes('uk') ||
            (v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
          );
        } catch {}
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public playTimeTurner() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Rapid Celestial Clockwork Ticks & Gear Ratchets (Time spinning backwards)
      for (let i = 0; i < 12; i++) {
        const tickTime = now + i * 0.065;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        // Alternating mechanical tick/tock pitch
        osc.frequency.setValueAtTime(i % 2 === 0 ? 1600 : 2200, tickTime);
        osc.frequency.exponentialRampToValueAtTime(800, tickTime + 0.025);
        gain.gain.setValueAtTime(0.0001, tickTime);
        gain.gain.linearRampToValueAtTime(0.06, tickTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(tickTime);
        osc.stop(tickTime + 0.04);
      }

      // 2. Trickling Golden Sand Chimes & Harmonic Hourglass Shimmer
      const sandChimes = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0, 3135.96]; // C6, E6, G6, C7, E7, G7
      sandChimes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const chimeStart = now + 0.15 + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeStart);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.1, chimeStart + 0.3);
        gain.gain.setValueAtTime(0.0001, chimeStart);
        gain.gain.linearRampToValueAtTime(0.1, chimeStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(chimeStart);
        osc.stop(chimeStart + 0.5);
      });

      // 3. Temporal Warp Reverse Swell Whoosh
      const warpOsc = this.ctx.createOscillator();
      const warpGain = this.ctx.createGain();
      warpOsc.type = 'triangle';
      warpOsc.frequency.setValueAtTime(150, now + 0.2);
      warpOsc.frequency.exponentialRampToValueAtTime(900, now + 0.85);
      warpGain.gain.setValueAtTime(0.0001, now + 0.2);
      warpGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
      warpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
      warpOsc.connect(warpGain);
      warpGain.connect(this.ctx.destination);
      warpOsc.start(now + 0.2);
      warpOsc.stop(now + 1.0);
    } catch {}
  }

  public playWingardiumLeviosa(fullQuote = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Swish and Flick Spell Arc (Melodic ascending glissando + wand chime)
      const spellNotes = [659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98, 1760.0]; // E5, G5, B5, D6, E6, G6, A6
      spellNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.45);
      });

      // 2. Chiptune Formant Syllables ("Win-gar-dium Le-vi-o-sa") for authentic retro accompaniment
      const syllables = [
        { f: 580, dur: 0.16, start: 0.0 },   // Win-
        { f: 720, dur: 0.22, start: 0.17 },  // -gar- (accented long vowel)
        { f: 540, dur: 0.14, start: 0.40 },  // -dium
        { f: 640, dur: 0.13, start: 0.58 },  // Le-
        { f: 760, dur: 0.14, start: 0.72 },  // -vi-
        { f: 920, dur: 0.28, start: 0.88 },  // -O- (accented!)
        { f: 659, dur: 0.32, start: 1.18 },  // -sa
      ];

      syllables.forEach(s => {
        if (!this.ctx) return;
        const t = now + s.start;
        const vOsc = this.ctx.createOscillator();
        const vGain = this.ctx.createGain();
        vOsc.type = 'triangle';
        vOsc.frequency.setValueAtTime(s.f, t);
        vOsc.frequency.exponentialRampToValueAtTime(s.f * 1.05, t + s.dur);
        vGain.gain.setValueAtTime(0.0001, t);
        vGain.gain.linearRampToValueAtTime(0.09, t + 0.02);
        vGain.gain.exponentialRampToValueAtTime(0.0001, t + s.dur);
        vOsc.connect(vGain);
        vGain.connect(this.ctx.destination);
        vOsc.start(t);
        vOsc.stop(t + s.dur + 0.02);
      });

      // 3. Movie-authentic Speech Delivery (Emma Watson / Hermione style)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();

          // Get the best available British Female voice
          const allVoices = window.speechSynthesis.getVoices();
          const gbFemaleVoice = allVoices.find(v => 
            (v.lang.includes('en-GB') || v.lang.includes('en_GB') || v.name.toLowerCase().includes('uk') || v.name.toLowerCase().includes('british')) &&
            (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('serena') || v.name.toLowerCase().includes('victoria') || v.name.toLowerCase().includes('sonia') || v.name.toLowerCase().includes('kate') || v.name.toLowerCase().includes('libby'))
          ) || allVoices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB')) || allVoices.find(v => v.lang.startsWith('en'));

          if (fullQuote) {
            // Full iconic movie line: "Wing-gar-dium Levi-o-sa! It's Levi-O-sa, not Levio-SAR!"
            const quoteUtterance = new SpeechSynthesisUtterance("Wing-gar-dium Levi-oh-sa! It's Levi-O-sa, not Levio-SAR!");
            quoteUtterance.rate = 0.92;
            quoteUtterance.pitch = 1.32; // Youthful bright pitch matching Emma Watson in Year 1
            quoteUtterance.volume = 1.0;
            if (gbFemaleVoice) quoteUtterance.voice = gbFemaleVoice;
            window.speechSynthesis.speak(quoteUtterance);
          } else {
            // Spell cast: "Wing-gar-dium Levi-oh-sa!"
            const spellUtterance = new SpeechSynthesisUtterance("Wing-gar-dium Levi-oh-sa!");
            spellUtterance.rate = 0.90;
            spellUtterance.pitch = 1.35;
            spellUtterance.volume = 1.0;
            if (gbFemaleVoice) spellUtterance.voice = gbFemaleVoice;
            window.speechSynthesis.speak(spellUtterance);
          }
        } catch {}
      }
    } catch {}
  }

  public playHurt() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playSpellSpark() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  public playGameOver() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [392.00, 369.99, 349.23, 311.13, 293.66]; // G4, F#4, F4, D#4, D4
      const durations = [0.18, 0.18, 0.18, 0.22, 0.5];
      let t = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        const dur = durations[i];
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + dur + 0.02);
        t += dur;
      });
    } catch {}
  }

  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Magical celesta fanfare
      const melody = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.3 }, // C6
        { f: 880.00, d: 0.15 }, // A5
        { f: 1046.50, d: 0.5 }, // C6
      ];

      let t = this.ctx.currentTime;
      melody.forEach(item => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + item.d + 0.02);
        t += item.d;
      });
    } catch {}
  }

  public playLevelUp(level: number = 2) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Ascending celebratory fanfare notes
      const notes = level === 2
        ? [523.25, 659.25, 783.99, 1046.50, 1318.51] // C5, E5, G5, C6, E6
        : [587.33, 739.99, 880.00, 1174.66, 1479.98, 1760.00]; // D5, F#5, A5, D6, F#6, A6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = now + idx * 0.07;
        const dur = idx === notes.length - 1 ? 0.55 : 0.22;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.02);

        // Chime harmonic
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq * 2, noteStart);
        chimeGain.gain.setValueAtTime(0.0001, noteStart);
        chimeGain.gain.linearRampToValueAtTime(0.08, noteStart + 0.01);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + Math.min(0.35, dur));
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(noteStart);
        chime.stop(noteStart + dur + 0.02);
      });
    } catch {}
  }

  public playButtonClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public startBgm() {
    if (this.isBgmMuted || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    this.bgmStepIndex = 0;

    // Harry Potter "Hedwig's Theme" Note Definition (Frequencies in Hz)
    const B3 = 246.94;
    const D3 = 146.83;
    const Dsharp3 = 155.56;
    const E3 = 164.81;
    const Fsharp3 = 185.00;
    const G3 = 196.00;
    const A3 = 220.00;
    const Asharp3 = 233.08;
    const B2 = 123.47;
    const C3 = 130.81;
    const C4 = 261.63;
    const Csharp4 = 277.18;
    const D4 = 293.66;
    const Dsharp4 = 311.13;
    const E4 = 329.63;
    const F4 = 349.23;
    const Fsharp4 = 369.99;
    const G4 = 392.00;
    const Gsharp4 = 415.30;
    const A4 = 440.00;
    const Asharp4 = 466.16;
    const B4 = 493.88;
    const C5 = 523.25;
    const Csharp5 = 554.37;
    const D5 = 587.33;
    const Dsharp5 = 622.25;
    const E5 = 659.25;
    const F5 = 698.46;
    const Fsharp5 = 739.99;
    const G5 = 783.99;
    const Gsharp5 = 830.61;
    const A5 = 880.00;
    const Asharp5 = 932.33;
    const B5 = 987.77;
    const C6 = 1046.50;
    const Csharp6 = 1108.73;
    const D6 = 1174.66;

    // Hedwig's Theme Score: [leadFreq, unitDuration, optionalHarmonies]
    // 1 unit = 190ms (eighth-note tempo)
    const melody: Array<{ freq: number; dur: number; chords?: number[] }> = [
      // --- Phrase 1 ---
      { freq: B4, dur: 2, chords: [E3, G3, B3] },
      { freq: E5, dur: 3 },
      { freq: G5, dur: 1 },
      { freq: Fsharp5, dur: 2, chords: [E3, G3, B3] },
      { freq: E5, dur: 4 },
      { freq: B5, dur: 2, chords: [G3, B3, E4] },
      { freq: A5, dur: 6, chords: [A3, C4, E4] },
      { freq: Fsharp5, dur: 6, chords: [B2, Dsharp3, Fsharp3] },
      { freq: E5, dur: 3, chords: [E3, G3, B3] },
      { freq: G5, dur: 1 },
      { freq: Fsharp5, dur: 2 },
      { freq: Dsharp5, dur: 4, chords: [B2, Dsharp3, Fsharp3] },
      { freq: F5, dur: 2, chords: [C3, E3, G3] },
      { freq: B4, dur: 6, chords: [E3, G3, B3] },

      // --- Phrase 2 ---
      { freq: B4, dur: 2, chords: [E3, G3, B3] },
      { freq: E5, dur: 3 },
      { freq: G5, dur: 1 },
      { freq: Fsharp5, dur: 2 },
      { freq: E5, dur: 4, chords: [E3, G3, B3] },
      { freq: B5, dur: 2 },
      { freq: D6, dur: 4, chords: [D3, Fsharp3, A3] },
      { freq: Csharp6, dur: 2 },
      { freq: C6, dur: 4, chords: [C3, E3, G3] },
      { freq: Gsharp5, dur: 2 },
      { freq: C6, dur: 3, chords: [C3, E3, G3] },
      { freq: B5, dur: 1 },
      { freq: Asharp5, dur: 2 },
      { freq: Asharp4, dur: 4, chords: [Fsharp3, Asharp3, Csharp4] },
      { freq: G5, dur: 2 },
      { freq: E5, dur: 6, chords: [E3, G3, B3] },

      // --- Phrase 3 (Ascending Magical Motif) ---
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: B5, dur: 4, chords: [G3, D4] },
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: B5, dur: 4, chords: [G3, D4] },
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: C6, dur: 4, chords: [C3, G3, C4] },
      { freq: B5, dur: 2 },
      { freq: Asharp5, dur: 4, chords: [Fsharp3, Csharp4] },
      { freq: Fsharp5, dur: 2 },
      { freq: G5, dur: 3, chords: [E3, B3] },
      { freq: B5, dur: 1 },
      { freq: Asharp5, dur: 2 },
      { freq: Asharp4, dur: 4, chords: [Fsharp3, Asharp3] },
      { freq: B4, dur: 2 },
      { freq: B5, dur: 6, chords: [B2, Fsharp3, B3] },

      // --- Phrase 4 ---
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: B5, dur: 4, chords: [G3, D4] },
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: B5, dur: 4, chords: [G3, D4] },
      { freq: G5, dur: 2, chords: [E3, B3] },
      { freq: D6, dur: 4, chords: [D3, A3, D4] },
      { freq: Csharp6, dur: 2 },
      { freq: C6, dur: 4, chords: [C3, E3, G3] },
      { freq: Gsharp5, dur: 2 },
      { freq: C6, dur: 3, chords: [C3, E3, G3] },
      { freq: B5, dur: 1 },
      { freq: Asharp5, dur: 2 },
      { freq: Asharp4, dur: 4, chords: [Fsharp3, Asharp3, Csharp4] },
      { freq: G5, dur: 2 },
      { freq: E5, dur: 6, chords: [E3, G3, B3] },
      { freq: 0, dur: 3 }, // Brief breath rest before seamless loop
    ];

    const unitTime = 0.185; // ~185ms per unit

    const playNextNote = () => {
      if (!this.isBgmPlaying || this.isBgmMuted || !this.ctx || !this.bgmGain) return;

      const note = melody[this.bgmStepIndex];
      const now = this.ctx.currentTime;
      const noteDuration = note.dur * unitTime;

      // Play Pure Celesta Lead Melody
      if (note.freq > 0) {
        // Pure sinusoidal celesta bell
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now);

        // Smooth anti-crackling ADSR envelope
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration);

        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(now);
        osc.stop(now + noteDuration + 0.03);

        // Gentle sine overtone for crystal glockenspiel warmth
        const overtone = this.ctx.createOscillator();
        const overGain = this.ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(note.freq * 2, now);

        overGain.gain.setValueAtTime(0.0001, now);
        overGain.gain.linearRampToValueAtTime(0.012, now + 0.015);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(noteDuration, 0.4));

        overtone.connect(overGain);
        overGain.connect(this.bgmGain);
        overtone.start(now);
        overtone.stop(now + noteDuration + 0.03);
      }

      // Play Magical Castle Harmony Chords (Pure, gentle sine/triangle pads)
      if (note.chords && note.chords.length > 0) {
        note.chords.forEach((chordFreq, idx) => {
          if (!this.ctx || !this.bgmGain) return;
          const hOsc = this.ctx.createOscillator();
          const hGain = this.ctx.createGain();

          hOsc.type = 'sine';
          hOsc.frequency.setValueAtTime(chordFreq, now);

          const chordVol = idx === 0 ? 0.022 : 0.014;
          hGain.gain.setValueAtTime(0.0001, now);
          hGain.gain.linearRampToValueAtTime(chordVol, now + 0.025);
          hGain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration * 1.15);

          hOsc.connect(hGain);
          hGain.connect(this.bgmGain);
          hOsc.start(now);
          hOsc.stop(now + noteDuration * 1.15 + 0.03);
        });
      }

      this.bgmStepIndex = (this.bgmStepIndex + 1) % melody.length;
      this.bgmTimeout = window.setTimeout(playNextNote, noteDuration * 1000);
    };

    if (this.bgmTimeout) {
      window.clearTimeout(this.bgmTimeout);
    }
    playNextNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      window.clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public toggleBgmMute() {
    this.isBgmMuted = !this.isBgmMuted;
    if (this.isBgmMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isBgmMuted;
  }
}

export const soundManager = new SoundManager();

