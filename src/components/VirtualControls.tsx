import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles } from 'lucide-react';
import { GameInputState } from '../game/GameEngine';

interface VirtualControlsProps {
  onInputStateChange: (state: Partial<GameInputState>) => void;
  isLandscapeMobile?: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onInputStateChange,
  isLandscapeMobile = false,
}) => {
  return (
    <div
      className={`w-full flex items-end justify-between select-none pointer-events-none ${
        isLandscapeMobile
          ? 'px-4 sm:px-8 pb-3 pt-1'
          : 'px-4 sm:px-6 pb-3 pt-1'
      }`}
    >
      {/* Left / Right D-Pad */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <button
          type="button"
          aria-label="Move Left"
          onPointerDown={(e) => {
            e.preventDefault();
            onInputStateChange({ left: true });
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            onInputStateChange({ left: false });
          }}
          onPointerLeave={() => onInputStateChange({ left: false })}
          onPointerCancel={() => onInputStateChange({ left: false })}
          className="w-13 h-13 sm:w-15 sm:h-15 bg-slate-900/95 active:bg-amber-700/90 border-2 border-slate-700 active:border-amber-400 rounded-xl shadow-lg flex items-center justify-center text-slate-200 active:scale-95 transition cursor-pointer touch-none select-none backdrop-blur-xs"
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>

        <button
          type="button"
          aria-label="Move Right"
          onPointerDown={(e) => {
            e.preventDefault();
            onInputStateChange({ right: true });
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            onInputStateChange({ right: false });
          }}
          onPointerLeave={() => onInputStateChange({ right: false })}
          onPointerCancel={() => onInputStateChange({ right: false })}
          className="w-13 h-13 sm:w-15 sm:h-15 bg-slate-900/95 active:bg-amber-700/90 border-2 border-slate-700 active:border-amber-400 rounded-xl shadow-lg flex items-center justify-center text-slate-200 active:scale-95 transition cursor-pointer touch-none select-none backdrop-blur-xs"
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Action Buttons: Jump, Wand Spark */}
      <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
        {/* Wand Spark Button */}
        <button
          type="button"
          aria-label="Cast Wand Spark"
          onPointerDown={(e) => {
            e.preventDefault();
            onInputStateChange({ spark: true });
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            onInputStateChange({ spark: false });
          }}
          onPointerLeave={() => onInputStateChange({ spark: false })}
          onPointerCancel={() => onInputStateChange({ spark: false })}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-950/95 active:bg-indigo-800 border-2 border-indigo-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-indigo-200 font-pixel text-[8px] sm:text-[9px] active:scale-95 transition cursor-pointer touch-none select-none backdrop-blur-xs"
          title="Cast Wand Spark"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
          <span>SPARK</span>
        </button>

        {/* Jump Button */}
        <button
          type="button"
          aria-label="Jump"
          onPointerDown={(e) => {
            e.preventDefault();
            onInputStateChange({ jump: true, up: true });
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            onInputStateChange({ jump: false, up: false });
          }}
          onPointerLeave={() => onInputStateChange({ jump: false, up: false })}
          onPointerCancel={() => onInputStateChange({ jump: false, up: false })}
          className="w-15 h-15 sm:w-17 sm:h-17 bg-gradient-to-t from-red-900 to-amber-600 active:from-red-800 active:to-amber-500 border-2 border-amber-300 rounded-2xl shadow-xl flex flex-col items-center justify-center text-yellow-100 font-pixel text-[10px] sm:text-[11px] active:scale-95 transition cursor-pointer touch-none select-none backdrop-blur-xs"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-200" />
          <span>JUMP</span>
        </button>
      </div>
    </div>
  );
};

