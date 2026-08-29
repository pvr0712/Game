import React from 'react';
import { Smartphone, RotateCw } from 'lucide-react';

interface OrientationPromptProps {
  isPortrait: boolean;
}

export const OrientationPrompt: React.FC<OrientationPromptProps> = ({ isPortrait }) => {
  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center text-amber-200 font-pixel select-none backdrop-blur-md">
      <div className="relative mb-6">
        <div className="w-20 h-32 border-4 border-amber-500 rounded-2xl flex items-center justify-center bg-slate-900 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse">
          <Smartphone className="w-10 h-10 text-amber-400" />
        </div>
        <RotateCw className="w-8 h-8 text-yellow-300 absolute -top-2 -right-4 animate-spin text-amber-300" style={{ animationDuration: '3s' }} />
      </div>

      <h2 className="text-base sm:text-lg text-yellow-300 font-bold mb-2 tracking-wider">
        PLEASE ROTATE TO LANDSCAPE
      </h2>
      <p className="text-[10px] sm:text-xs text-slate-300 max-w-xs leading-relaxed mb-4">
        Hogwarts Pixel Escape is crafted for optimal widescreen & landscape mode on mobile devices.
      </p>

      <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-700/60 px-3 py-2 rounded-lg text-[9px] text-amber-400">
        <span>⚡ Rotate your phone horizontally for full arcade touch controls!</span>
      </div>
    </div>
  );
};
