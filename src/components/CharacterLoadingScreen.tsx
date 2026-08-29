import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterId } from '../types';
import { soundManager } from '../audio/soundManager';
import { Sparkles, Play, Volume2, Hourglass } from 'lucide-react';

interface CharacterLoadingScreenProps {
  character: CharacterId;
  onComplete: () => void;
}

const LORE_DATA: Record<CharacterId, {
  name: string;
  title: string;
  spell: string;
  subtitles: string[];
  tag: string;
}> = {
  harry: {
    name: 'Harry Potter',
    title: 'GRYFFINDOR SEEKER',
    spell: 'Pursuing the Golden Snitch above the Quidditch Pitch...',
    subtitles: [
      'Polishing Nimbus 2000 broomstick...',
      'Spotting the golden glint in the clouds...',
      'The Golden Snitch darts at breakneck speed!',
      'Diving through the Quidditch goal hoops...',
      'Closing in for the 150-point catch!',
      'Entering Hogwarts Castle grounds...',
    ],
    tag: '⚡ SEEKER ON BROOM',
  },
  ron: {
    name: 'Ron Weasley',
    title: 'FLYING FORD ANGLIA',
    spell: 'Flying the enchanted turquoise car to Hogwarts...',
    subtitles: [
      'Starting the enchanted Ford Anglia engine...',
      'Engaging invisibility booster (glitched!)...',
      'Soaring above the Hogwarts Express tracks...',
      'Dodging cloud banks in the starry night...',
      'Hogwarts castle spires spotted on horizon!',
      'Preparing for a bumpy castle courtyard landing...',
    ],
    tag: '🚗 FLYING CAR DRIVER',
  },
  hermione: {
    name: 'Hermione Granger',
    title: 'THE TIME-TURNER',
    spell: 'Turning back the sands of time with the Time-Turner...',
    subtitles: [
      'Looping the long golden chain around neck...',
      'Aligning the enchanted golden hourglass...',
      'The outer and inner golden rings spin...',
      'Golden hourglass sands trickling backwards in time...',
      'Temporal warp expanding — rewinding castle events!',
      'Entering Hogwarts Castle corridors...',
    ],
    tag: '⌛ TIME-TURNER',
  },
};

export const CharacterLoadingScreen: React.FC<CharacterLoadingScreenProps> = ({
  character,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const percentTextRef = useRef<HTMLSpanElement | null>(null);
  const subtitleTextRef = useRef<HTMLSpanElement | null>(null);

  const [currentSubtitle, setCurrentSubtitle] = useState<string>(
    (LORE_DATA[character] || LORE_DATA.harry).subtitles[0]
  );

  const reqIdRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentLore = LORE_DATA[character] || LORE_DATA.harry;

  // Sound trigger
  const playCharacterSound = useCallback(() => {
    if (character === 'harry') {
      soundManager.playSnitchFlutter();
    } else if (character === 'ron') {
      soundManager.playFlyingCarEngine();
    } else if (character === 'hermione') {
      soundManager.playTimeTurner();
    }
  }, [character]);

  useEffect(() => {
    // Play character audio upon screen entrance
    playCharacterSound();

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, [playCharacterSound]);

  // Main Canvas Animation Loop (Isolated from React state re-render loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const totalDuration = 3400; // 3.4s total loading time
    const startTime = performance.now();
    let isFinished = false;
    let lastSubtitleIndex = -1;

    // Particle pool for magic sparkles, smoke, or Time-Turner stardust
    const sparkParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }[] = [];

    // Helper pixel drawing
    const pRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    };

    const render = (now: number) => {
      if (isFinished) return;

      const elapsed = now - startTime;
      const t = elapsed / 1000;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

      // Direct DOM update for 60fps smoothness without causing React component re-mounts
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (percentTextRef.current) {
        percentTextRef.current.textContent = `${pct}%`;
      }

      // Update subtitle at stepped milestones
      const subIdx = Math.min(
        currentLore.subtitles.length - 1,
        Math.floor((pct / 100) * currentLore.subtitles.length)
      );
      if (subIdx !== lastSubtitleIndex) {
        lastSubtitleIndex = subIdx;
        setCurrentSubtitle(currentLore.subtitles[subIdx]);
      }

      const w = canvas.width;
      const h = canvas.height;

      // 1. Background Sky & Deep Night Canvas
      ctx.fillStyle = '#040714';
      ctx.fillRect(0, 0, w, h);

      // Star field
      for (let i = 0; i < 40; i++) {
        const starX = (i * 29 + t * 4) % w;
        const starY = (i * 19) % (h - 40);
        const starTwinkle = Math.sin(t * 4 + i) * 0.4 + 0.6;
        pRect(starX, starY, (i % 5 === 0) ? 2 : 1, (i % 5 === 0) ? 2 : 1, `rgba(254, 240, 138, ${starTwinkle})`);
      }

      // Crescent Moon in corner
      pRect(w - 60, 20, 24, 24, '#fef08a');
      pRect(w - 56, 16, 16, 32, '#fef08a');
      pRect(w - 64, 24, 32, 16, '#fef08a');
      pRect(w - 54, 24, 6, 6, '#fef9c3');

      // Distant Parallax Hogwarts Silhouettes
      const sillColor = '#0b0f19';
      for (let s = 0; s < 5; s++) {
        const spireX = (s * 95 - (t * 8)) % (w + 100) - 20;
        pRect(spireX, h - 70, 36, 70, sillColor);
        pRect(spireX + 6, h - 100, 24, 30, sillColor);
        pRect(spireX + 12, h - 120, 12, 20, sillColor);
        pRect(spireX + 16, h - 130, 4, 10, sillColor);
        // Spire glowing window
        pRect(spireX + 14, h - 60, 8, 12, '#fbbf24');
      }

      // ----------------------------------------------------
      // CHARACTER-SPECIFIC PIXEL ANIMATION
      // ----------------------------------------------------
      if (character === 'harry') {
        // ====================================================
        // HARRY & THE FLYING GOLDEN SNITCH
        // ====================================================

        // Quidditch Goal Hoops in background
        const hoopX = (w * 0.85) - Math.sin(t * 1.5) * 15;
        pRect(hoopX, h - 140, 4, 100, '#78350f');
        pRect(hoopX - 10, h - 160, 24, 4, '#fbbf24');
        pRect(hoopX - 14, h - 156, 4, 16, '#fbbf24');
        pRect(hoopX + 14, h - 156, 4, 16, '#fbbf24');
        pRect(hoopX - 10, h - 140, 24, 4, '#fbbf24');

        // Harry flying on Nimbus 2000
        const harryX = 70 + Math.sin(t * 2) * 12;
        const harryY = h * 0.55 + Math.cos(t * 3) * 10;
        const broomTilt = Math.sin(t * 3) * 0.08;

        ctx.save();
        ctx.translate(harryX, harryY);
        ctx.rotate(broomTilt);

        // Nimbus 2000 Broomstick Handle
        pRect(-30, 10, 60, 4, '#78350f');
        pRect(28, 11, 4, 2, '#fbbf24');
        // Broom Bristles
        pRect(-46, 6, 18, 12, '#92400e');
        pRect(-48, 8, 4, 8, '#78350f');
        pRect(-36, 8, 4, 8, '#b45309');

        // Harry Body (Gryffindor Quidditch Robes)
        pRect(-8, -12, 18, 22, '#991b1b');
        pRect(-6, -8, 14, 16, '#b91c1c');

        // Billowing Gryffindor Cape
        pRect(-18 - Math.sin(t * 8) * 4, -8, 12, 16, '#7f1d1d');
        pRect(-20 - Math.sin(t * 8) * 4, -4, 6, 8, '#f59e0b');

        // Scarf waving
        const scarfWave = Math.sin(t * 10) * 3;
        pRect(-14, -14 + scarfWave, 10, 4, '#dc2626');
        pRect(-16, -12 + scarfWave, 8, 4, '#f59e0b');

        // Reaching Arm
        pRect(8, -6, 18, 5, '#991b1b');
        pRect(24, -7, 6, 6, '#fed7aa');

        // Harry Head & Windswept Hair
        pRect(-2, -26, 16, 14, '#fed7aa');
        pRect(-4, -30, 20, 8, '#0f172a');
        pRect(12, -28, 6, 6, '#0f172a');
        // Round Glasses
        pRect(6, -23, 6, 6, '#1e293b');
        pRect(7, -22, 4, 4, '#60a5fa');
        // Lightning Scar
        pRect(4, -26, 3, 2, '#dc2626');
        pRect(3, -24, 3, 2, '#dc2626');

        ctx.restore();

        // THE GOLDEN SNITCH (Darting, bobbing & flapping fast)
        const snitchX = w * 0.7 + Math.sin(t * 4.5) * 50 + Math.cos(t * 2.5) * 20;
        const snitchY = h * 0.42 + Math.cos(t * 5) * 35 + Math.sin(t * 3) * 15;
        const wingFlap = Math.sin(t * 40);

        // Spawn golden sparkle particles
        if (Math.random() < 0.6) {
          sparkParticles.push({
            x: snitchX,
            y: snitchY,
            vx: (Math.random() - 0.5) * 20 - 15,
            vy: (Math.random() - 0.5) * 20,
            life: 0,
            maxLife: 0.6,
            color: Math.random() < 0.5 ? '#fef08a' : '#fbbf24',
            size: Math.random() < 0.5 ? 2 : 3,
          });
        }

        // Snitch Glow Aura
        const snitchGlow = ctx.createRadialGradient(snitchX, snitchY, 2, snitchX, snitchY, 18);
        snitchGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        snitchGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
        snitchGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = snitchGlow;
        ctx.beginPath();
        ctx.arc(snitchX, snitchY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Snitch Wings (Pixel art wings flapping)
        const wingH = Math.round(wingFlap * 10);
        pRect(snitchX - 14, snitchY - wingH - 2, 12, 3, '#ffffff');
        pRect(snitchX - 16, snitchY - wingH, 14, 2, '#fef08a');
        pRect(snitchX - 10, snitchY - wingH + 2, 8, 2, '#fbbf24');

        pRect(snitchX + 2, snitchY - wingH - 2, 12, 3, '#ffffff');
        pRect(snitchX + 2, snitchY - wingH, 14, 2, '#fef08a');
        pRect(snitchX + 2, snitchY - wingH + 2, 8, 2, '#fbbf24');

        // Snitch Golden Ball Body
        pRect(snitchX - 4, snitchY - 4, 8, 8, '#f59e0b');
        pRect(snitchX - 3, snitchY - 3, 6, 6, '#fbbf24');
        pRect(snitchX - 2, snitchY - 2, 3, 3, '#fef9c3');

      } else if (character === 'ron') {
        // ====================================================
        // RON & THE ENCHANTED FLYING FORD ANGLIA
        // ====================================================

        // Floating fluffy night clouds below the car
        for (let c = 0; c < 4; c++) {
          const cX = (c * 110 - t * 25) % (w + 140) - 40;
          const cY = h * 0.72 + (c % 2) * 12;
          pRect(cX, cY, 80, 20, '#1e293b');
          pRect(cX + 10, cY - 8, 60, 16, '#334155');
          pRect(cX + 20, cY - 14, 40, 12, '#475569');
        }

        const carX = w * 0.5 + Math.sin(t * 1.5) * 30;
        const carY = h * 0.48 + Math.sin(t * 3) * 12;
        const carRoll = Math.sin(t * 2) * 0.05;

        ctx.save();
        ctx.translate(carX, carY);
        ctx.rotate(carRoll);

        // Headlight Beams (Glowing yellow light cones in the night sky)
        const beamGrad = ctx.createLinearGradient(50, 6, 180, 20);
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
        beamGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.35)');
        beamGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(52, 6);
        ctx.lineTo(200, -20);
        ctx.lineTo(200, 50);
        ctx.lineTo(52, 14);
        ctx.closePath();
        ctx.fill();

        // 1. Ford Anglia Turquoise Body
        pRect(-50, 0, 102, 22, '#0284c7');
        pRect(-48, 2, 98, 18, '#38bdf8');
        pRect(-50, 14, 102, 3, '#0369a1');

        // 2. Off-white Cabin Roof & Windshield
        pRect(-32, -18, 66, 18, '#f8fafc');
        pRect(-28, -16, 58, 16, '#e2e8f0');

        pRect(14, -14, 18, 14, '#93c5fd');
        pRect(-10, -14, 20, 14, '#bfdbfe');
        pRect(-26, -14, 14, 14, '#93c5fd');

        // Ron Weasley inside steering!
        pRect(-4, -12, 12, 10, '#fed7aa');
        pRect(-6, -18, 16, 8, '#ea580c');
        pRect(2, -16, 6, 6, '#f97316');
        pRect(-4, -4, 14, 6, '#1d4ed8');
        pRect(10, -8, 4, 8, '#0f172a');
        pRect(8, -6, 8, 3, '#0f172a');

        // Front Grille & Headlights
        pRect(52, 2, 6, 16, '#cbd5e1');
        pRect(48, 4, 4, 6, '#fef08a');
        pRect(48, 12, 4, 6, '#fef08a');

        // Rear Fins & Taillights
        pRect(-54, -4, 6, 14, '#0284c7');
        pRect(-54, 4, 4, 6, '#dc2626');

        // Wheels
        const wheelSpin = (t * 20) % (Math.PI * 2);
        pRect(26, 18, 18, 10, '#0f172a');
        pRect(31, 20, 8, 6, '#94a3b8');
        pRect(33 + Math.cos(wheelSpin) * 2, 21 + Math.sin(wheelSpin) * 2, 4, 4, '#ffffff');

        pRect(-36, 18, 18, 10, '#0f172a');
        pRect(-31, 20, 8, 6, '#94a3b8');
        pRect(-29 + Math.cos(wheelSpin) * 2, 21 + Math.sin(wheelSpin) * 2, 4, 4, '#ffffff');

        // Exhaust Pipe
        pRect(-54, 16, 6, 4, '#64748b');
        ctx.restore();

        // Smoke puffs from exhaust
        if (Math.random() < 0.5) {
          sparkParticles.push({
            x: carX - 56,
            y: carY + 16,
            vx: -40 - Math.random() * 20,
            vy: (Math.random() - 0.5) * 10,
            life: 0,
            maxLife: 0.8,
            color: Math.random() < 0.5 ? '#cbd5e1' : '#94a3b8',
            size: Math.floor(Math.random() * 4) + 4,
          });
        }

      } else if (character === 'hermione') {
        // ====================================================
        // HERMIONE & THE BIG TIME-TURNER (PIXEL ART)
        // ====================================================

        // Background Celestial Clock Gears & Temporal Constellations
        const ttCenterX = w * 0.64;
        const ttCenterY = h * 0.48;

        // Faint rotating background clock gear
        const gearAngle = t * 0.8;
        ctx.save();
        ctx.translate(ttCenterX, ttCenterY);
        ctx.rotate(gearAngle);
        for (let g = 0; g < 8; g++) {
          const gRad = (g * Math.PI) / 4;
          const gx = Math.cos(gRad) * 62;
          const gy = Math.sin(gRad) * 62;
          pRect(gx - 4, gy - 4, 8, 8, 'rgba(251, 191, 36, 0.12)');
        }
        ctx.restore();

        // Pulsing Temporal Distortion Waves (expanding concentric rings)
        for (let ring = 0; ring < 3; ring++) {
          const ringProgress = (t * 0.8 + ring * 0.33) % 1.0;
          const ringRad = 20 + ringProgress * 75;
          const ringAlpha = (1.0 - ringProgress) * 0.35;
          ctx.strokeStyle = `rgba(254, 240, 138, ${ringAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(ttCenterX, ttCenterY, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Floating Roman Numerals (XII, III, VI, IX) slowly orbiting
        const numerals = ['XII', 'III', 'VI', 'IX'];
        numerals.forEach((num, nIdx) => {
          const nAngle = -t * 0.6 + (nIdx * Math.PI) / 2;
          const nX = ttCenterX + Math.cos(nAngle) * 68;
          const nY = ttCenterY + Math.sin(nAngle) * 68 + 4;
          ctx.fillStyle = 'rgba(253, 224, 71, 0.7)';
          ctx.font = '7px monospace';
          ctx.fillText(num, nX - 6, nY);
        });

        // ----------------------------------------------------
        // HERMIONE GRANGER (Pixel Art Character on Left)
        // ----------------------------------------------------
        const hermX = w * 0.24;
        const hermY = h * 0.58;

        // Bushy brown wavy hair
        pRect(hermX - 14, hermY - 36, 28, 38, '#78350f');
        pRect(hermX - 16, hermY - 30, 32, 28, '#92400e');
        pRect(hermX - 18, hermY - 20, 36, 22, '#b45309');
        pRect(hermX - 10, hermY - 40, 20, 8, '#78350f');

        // Face & Features
        pRect(hermX - 4, hermY - 30, 18, 18, '#fed7aa');
        pRect(hermX + 6, hermY - 26, 4, 4, '#78350f'); // Eye
        pRect(hermX + 7, hermY - 25, 2, 2, '#451a03');
        pRect(hermX + 8, hermY - 20, 3, 2, '#dc2626'); // Smile
        pRect(hermX - 1, hermY - 23, 4, 3, '#fca5a5'); // Cheerful blush

        // Outfit (Iconic Pink Hoodie / Cardigan over Gryffindor attire)
        pRect(hermX - 8, hermY - 12, 24, 28, '#db2777'); // Pink jacket
        pRect(hermX - 4, hermY - 10, 16, 20, '#f472b6');
        pRect(hermX - 2, hermY - 10, 8, 12, '#f8fafc');  // Collar
        pRect(hermX + 1, hermY - 8, 3, 10, '#b91c1c');  // Gryffindor tie
        pRect(hermX + 1, hermY - 5, 3, 3, '#f59e0b');

        // Skirt / Pants & Shoes
        pRect(hermX - 6, hermY + 16, 20, 12, '#334155');
        pRect(hermX - 5, hermY + 28, 7, 8, '#0f172a');
        pRect(hermX + 4, hermY + 28, 7, 8, '#0f172a');

        // Hands reaching out and holding the Golden Time-Turner Chain & Turning Knob
        pRect(hermX + 12, hermY - 8, 16, 5, '#db2777'); // Arm
        pRect(hermX + 26, hermY - 9, 6, 6, '#fed7aa');  // Hand turning knob
        pRect(hermX + 10, hermY - 4, 12, 5, '#db2777'); // Second arm
        pRect(hermX + 20, hermY - 5, 5, 5, '#fed7aa');

        // Golden Chain draped from Hermione's neck to the Big Time-Turner
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hermX + 6, hermY - 12);
        ctx.quadraticCurveTo(hermX + 28, hermY - 18, ttCenterX - 45, ttCenterY - 35);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(hermX + 28, hermY - 6);
        ctx.quadraticCurveTo(hermX + 40, hermY + 6, ttCenterX - 40, ttCenterY);
        ctx.stroke();

        // ----------------------------------------------------
        // THE BIG TIME-TURNER (Center Stage Feature)
        // ----------------------------------------------------
        const ttBob = Math.sin(t * 2.5) * 6;
        const ttX = ttCenterX;
        const ttY = ttCenterY + ttBob;

        // 1. Golden Hanging Chain loop at top of Time Turner
        pRect(ttX - 2, ttY - 54, 4, 12, '#fbbf24');
        pRect(ttX - 4, ttY - 48, 8, 3, '#f59e0b');
        pRect(ttX - 1, ttY - 62, 2, 10, '#fef08a');

        // 2. Central Magical Time Glow
        const ttGlow = ctx.createRadialGradient(ttX, ttY, 4, ttX, ttY, 48);
        ttGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        ttGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.45)');
        ttGlow.addColorStop(0.8, 'rgba(192, 132, 252, 0.2)');
        ttGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = ttGlow;
        ctx.beginPath();
        ctx.arc(ttX, ttY, 48, 0, Math.PI * 2);
        ctx.fill();

        // 3. Outer Golden Gimbal Ring (Rotates in 3D perspective)
        const outerCos = Math.cos(t * 2.2);
        const outerScaleX = Math.abs(outerCos) * 0.85 + 0.15;
        const outerRadius = 40;

        ctx.save();
        ctx.translate(ttX, ttY);

        // Side turning knobs (Spindles)
        pRect(-outerRadius - 6, -3, 6, 6, '#d97706');
        pRect(-outerRadius - 4, -2, 4, 4, '#fef08a');
        pRect(outerRadius, -3, 6, 6, '#d97706');
        pRect(outerRadius, -2, 4, 4, '#fef08a');
        // Top and bottom hinge pins
        pRect(-3, -outerRadius - 4, 6, 4, '#fbbf24');
        pRect(-3, outerRadius, 6, 4, '#fbbf24');

        // Outer Ring Body
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, outerRadius * outerScaleX, outerRadius, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, (outerRadius - 1) * outerScaleX, outerRadius - 1, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Engraved Star runes on outer ring
        for (let star = 0; star < 6; star++) {
          const sAng = (star * Math.PI) / 3 + t * 0.5;
          const sX = Math.cos(sAng) * outerRadius * outerScaleX;
          const sY = Math.sin(sAng) * outerRadius;
          pRect(sX - 1.5, sY - 1.5, 3, 3, '#fef9c3');
        }

        // 4. Inner Concentric Ring (Perpendicular Rotation Axis)
        const innerSin = Math.sin(t * 3.2);
        const innerScaleY = Math.abs(innerSin) * 0.8 + 0.2;
        const innerRadius = 28;

        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, innerRadius, innerRadius * innerScaleY, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, innerRadius - 0.5, (innerRadius - 0.5) * innerScaleY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner star perforations
        for (let is = 0; is < 4; is++) {
          const isAng = (is * Math.PI) / 2 + t * 0.9;
          const isX = Math.cos(isAng) * (innerRadius - 1);
          const isY = Math.sin(isAng) * (innerRadius - 1) * innerScaleY;
          pRect(isX - 1, isY - 1, 2, 2, '#ffffff');
        }

        // 5. Central Hourglass (Spinning / Flipping in center)
        const glassRot = Math.sin(t * 1.5) * 0.35;
        ctx.rotate(glassRot);

        // Glass Bracket & Endcaps
        pRect(-14, -20, 28, 4, '#fbbf24');
        pRect(-12, -19, 24, 2, '#fef9c3');
        pRect(-14, 16, 28, 4, '#fbbf24');
        pRect(-12, 17, 24, 2, '#fef9c3');
        // Side gold struts
        pRect(-14, -16, 2, 32, '#d97706');
        pRect(12, -16, 2, 32, '#d97706');

        // Glass Hourglass Bulbs (Top and Bottom teardrops with crystal glass shimmer)
        // Top bulb outline
        pRect(-9, -16, 18, 5, 'rgba(186, 230, 253, 0.45)');
        pRect(-7, -11, 14, 5, 'rgba(186, 230, 253, 0.45)');
        pRect(-4, -6, 8, 4, 'rgba(186, 230, 253, 0.5)');
        // Center waist neck
        pRect(-2, -2, 4, 4, 'rgba(224, 242, 254, 0.8)');
        // Bottom bulb outline
        pRect(-4, 2, 8, 4, 'rgba(186, 230, 253, 0.5)');
        pRect(-7, 6, 14, 5, 'rgba(186, 230, 253, 0.45)');
        pRect(-9, 11, 18, 5, 'rgba(186, 230, 253, 0.45)');

        // Glass reflection highlights
        pRect(-8, -15, 2, 8, '#ffffff');
        pRect(-8, 7, 2, 8, '#ffffff');
        pRect(6, -14, 2, 6, 'rgba(255, 255, 255, 0.7)');

        // Glowing Golden Sands:
        // Top Bulb: Sand Level emptying
        pRect(-8, -15, 16, 3, '#f59e0b');
        pRect(-6, -12, 12, 3, '#fbbf24');
        pRect(-4, -9, 8, 3, '#fef08a');
        pRect(-2, -6, 4, 2, '#fef9c3');

        // Trickling Sand Stream falling through neck
        const sandPulse = Math.sin(t * 30);
        pRect(-1, -4, 2, 8, sandPulse > 0 ? '#fef08a' : '#fbbf24');
        pRect(0, -1, 1, 6, '#ffffff');

        // Bottom Bulb: Sand Mound piling up in glowing pyramid
        pRect(-2, 4, 4, 2, '#fef9c3');
        pRect(-4, 6, 8, 3, '#fef08a');
        pRect(-6, 9, 12, 3, '#fbbf24');
        pRect(-8, 12, 16, 4, '#f59e0b');

        ctx.restore();

        // Spawn Swirling Golden Stardust Particles
        if (Math.random() < 0.7) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 20 + Math.random() * 45;
          sparkParticles.push({
            x: ttX + Math.cos(spawnAngle) * spawnDist,
            y: ttY + Math.sin(spawnAngle) * spawnDist,
            vx: -Math.sin(spawnAngle) * 35 + (Math.random() - 0.5) * 10,
            vy: Math.cos(spawnAngle) * 35 + (Math.random() - 0.5) * 10,
            life: 0,
            maxLife: 0.75,
            color: Math.random() < 0.5 ? '#fef08a' : '#fbbf24',
            size: Math.random() < 0.4 ? 3 : 2,
          });
        }

        // Speech Bubble: "Turning back time at Hogwarts"
        const bubbleX = hermX + 16;
        const bubbleY = hermY - 68;
        pRect(bubbleX, bubbleY, 144, 24, '#0f172a');
        pRect(bubbleX + 2, bubbleY + 2, 140, 20, '#1e293b');
        pRect(bubbleX + 8, bubbleY + 24, 6, 4, '#1e293b');
        pRect(bubbleX + 10, bubbleY + 28, 3, 3, '#1e293b');

        ctx.fillStyle = '#fef08a';
        ctx.font = '8px monospace';
        ctx.fillText('⌛ Rewinding Time...', bubbleX + 8, bubbleY + 11);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '7px monospace';
        ctx.fillText('Hogwarts Temporal Magic', bubbleX + 8, bubbleY + 19);
      }

      // ----------------------------------------------------
      // UPDATE & DRAW MAGIC PARTICLES
      // ----------------------------------------------------
      for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const p = sparkParticles[i];
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
        p.life += 0.016;
        if (p.life >= p.maxLife) {
          sparkParticles.splice(i, 1);
        } else {
          const alpha = 1 - p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          pRect(p.x, p.y, p.size, p.size, p.color);
          ctx.globalAlpha = 1.0;
        }
      }

      // Check for completion
      if (elapsed >= totalDuration) {
        isFinished = true;
        onCompleteRef.current();
      } else {
        reqIdRef.current = requestAnimationFrame(render);
      }
    };

    reqIdRef.current = requestAnimationFrame(render);

    return () => {
      isFinished = true;
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [character, currentLore]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/95 font-pixel text-center select-none backdrop-blur-xs">
      {/* Container Card */}
      <div className="relative z-10 max-w-lg w-full bg-slate-900/95 border-3 border-amber-500/80 rounded-xl p-4 sm:p-5 shadow-[0_0_50px_rgba(217,119,6,0.35)] flex flex-col items-center gap-3.5">
        
        {/* Top Header & Tag */}
        <div className="w-full flex items-center justify-between border-b border-amber-500/30 pb-2">
          <div className="flex items-center gap-1.5">
            {character === 'hermione' ? (
              <Hourglass className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
            )}
            <span className="text-[10px] text-amber-400 font-bold tracking-wider">
              {currentLore.tag}
            </span>
          </div>

          {character === 'hermione' ? (
            <button
              onClick={() => soundManager.playTimeTurner()}
              title="Play Time-Turner Clockwork FX"
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] rounded border border-amber-600/50 cursor-pointer active:scale-95 transition"
            >
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>TIME-TURNER FX</span>
            </button>
          ) : (
            <button
              onClick={playCharacterSound}
              title="Replay character sound"
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] rounded border border-amber-600/50 cursor-pointer active:scale-95 transition"
            >
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>SOUND FX</span>
            </button>
          )}
        </div>

        {/* Character Title */}
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-sm sm:text-base text-yellow-300 font-bold tracking-wide drop-shadow-md">
            {currentLore.name.toUpperCase()}
          </h2>
          <span className="text-[9px] sm:text-[10px] text-amber-400/90 font-semibold">
            {currentLore.title}
          </span>
        </div>

        {/* Animated Pixel Canvas Showcase */}
        <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg border-2 border-amber-600/60 overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={420}
            height={260}
            className="w-full h-full object-contain pixelated"
          />
        </div>

        {/* Subtitle / Spell lore description */}
        <div className="w-full flex flex-col items-center gap-1">
          <div className="h-6 flex items-center justify-center text-[9px] sm:text-[10px] text-amber-200 bg-slate-950/80 px-3 py-1 rounded border border-amber-900/40 w-full text-center">
            <span ref={subtitleTextRef} className="animate-pulse font-medium">{currentSubtitle}</span>
          </div>
        </div>

        {/* Progress Bar & Skip Button */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-4 bg-slate-950 rounded border border-amber-600 p-0.5 overflow-hidden shadow-inner flex items-center">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-yellow-300 transition-all duration-75 ease-out rounded-xs w-0"
            />
          </div>

          <div className="w-full flex items-center justify-between text-[9px]">
            <span className="text-slate-400">REWINDING HOGWARTS TIMELINE...</span>
            <span ref={percentTextRef} className="text-yellow-400 font-bold">0%</span>
          </div>

          {/* Instant Skip / Start Button */}
          <button
            onClick={() => onCompleteRef.current()}
            className="w-full mt-1 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-[10px] sm:text-xs rounded border border-yellow-200 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START GAME AS {currentLore.name.split(' ')[0].toUpperCase()} NOW</span>
          </button>
        </div>

      </div>
    </div>
  );
};
