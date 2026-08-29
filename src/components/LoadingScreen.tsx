import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [flavorIndex, setFlavorIndex] = useState(0);

  const flavorTexts = [
    'Polishing Nimbus 2000 brooms...',
    'Lighting the floating candles in the Great Hall...',
    'Dispensing Galleons across castle platforms...',
    'Waking the owls in the Owlery...',
    'Brewing Felix Felicis potion...',
    'Consulting the Marauder\'s Map...',
    'Entering the castle corridors...',
  ];

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2400; // 2.4s cinematic loading

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      const fIndex = Math.min(
        flavorTexts.length - 1,
        Math.floor((pct / 100) * flavorTexts.length)
      );
      setFlavorIndex(fIndex);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/95 font-pixel text-center select-none">
      {/* Background ambient castle mist / stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/90 to-slate-950 pointer-events-none" />

      {/* Center Crest / Box */}
      <div className="relative z-10 max-w-sm sm:max-w-md w-full bg-slate-900/90 border-4 border-amber-600 rounded-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(217,119,6,0.3)] flex flex-col items-center gap-5">
        
        {/* Animated Hogwarts Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 via-amber-600 to-amber-900 p-1 flex items-center justify-center shadow-xl border-2 border-yellow-200 animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-3xl">
              ⚡
            </div>
          </div>
          {/* Floating magical sparkles */}
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>

        {/* Title Header */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] sm:text-[10px] text-amber-400 tracking-widest uppercase">
            WELCOME TO HOGWARTS
          </span>
          <h1 className="text-sm sm:text-lg text-yellow-300 font-bold tracking-wider drop-shadow-md">
            HOGWARTS PIXEL ESCAPE
          </h1>
          <span className="text-[10px] text-amber-500 font-semibold">
            2D RETRO PLATFORMER
          </span>
        </div>

        {/* Custom Pixel Progress Bar */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="w-full h-5 bg-slate-950 rounded border-2 border-amber-600 p-0.5 overflow-hidden shadow-inner flex items-center">
            <div
              className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-yellow-300 transition-all duration-75 ease-out rounded-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] text-amber-400/90 px-0.5">
            <span>LOADING...</span>
            <span className="font-bold">{progress}%</span>
          </div>
        </div>

        {/* Dynamic Flavor Text */}
        <div className="h-7 flex items-center justify-center text-[8px] sm:text-[9px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded border border-amber-900/40 w-full text-center">
          <span className="animate-pulse text-amber-200/90">{flavorTexts[flavorIndex]}</span>
        </div>

      </div>
    </div>
  );
};
