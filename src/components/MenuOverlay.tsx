import React from 'react';
import { Play, Sparkles, HelpCircle, Trophy, Users } from 'lucide-react';
import { CharacterId } from '../types';

interface MenuOverlayProps {
  onStartGame: () => void;
  onOpenCharacterSelect: () => void;
  onOpenHelp: () => void;
  onOpenLeaderboard: () => void;
  character: CharacterId;
  highScore: number;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  onStartGame,
  onOpenCharacterSelect,
  onOpenHelp,
  onOpenLeaderboard,
  character,
  highScore,
}) => {
  const charDisplay: Record<CharacterId, { name: string; icon: string }> = {
    harry: { name: 'Harry Potter', icon: '⚡' },
    ron: { name: 'Ron Weasley', icon: '♟️' },
    hermione: { name: 'Hermione Granger', icon: '📚' },
  };

  const currentChar = charDisplay[character] || charDisplay.harry;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-pixel text-center">
      
      {/* Title Crest Card */}
      <div className="max-w-md w-full bg-slate-900/90 border-4 border-amber-600 rounded-lg p-5 sm:p-7 shadow-2xl flex flex-col items-center gap-4">
        
        {/* Hogwarts Seal / Badge */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 p-1 flex items-center justify-center shadow-lg border-2 border-yellow-200">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xl">
            {currentChar.icon}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] sm:text-[10px] text-amber-400 tracking-widest uppercase">
            HOGWARTS 2D PLATFORMER
          </span>
          <h1 className="text-base sm:text-xl text-yellow-300 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            HOGWARTS PIXEL ESCAPE
          </h1>
          <span className="text-xs text-amber-500 font-semibold tracking-wider">
            COLLECT 100 GALLEONS
          </span>
        </div>

        {/* Active Selected Character Pill */}
        <button
          onClick={onOpenCharacterSelect}
          className="w-full flex items-center justify-between bg-slate-950/90 hover:bg-slate-950 border-2 border-amber-500/70 hover:border-yellow-400 px-3 py-2 rounded text-left transition active:scale-98 cursor-pointer shadow-md group"
          title="Click to Switch Character"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentChar.icon}</span>
            <div className="flex flex-col">
              <span className="text-[8px] text-amber-400/80 uppercase">Selected Hero</span>
              <span className="text-xs font-bold text-yellow-300 group-hover:text-yellow-200">
                {currentChar.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-700/60 group-hover:bg-amber-900/80">
            <Users className="w-3 h-3" />
            <span>CHANGE</span>
          </div>
        </button>

        {/* Story / Mission Pitch */}
        <div className="bg-slate-950/80 p-3 rounded border border-amber-800/60 text-[9px] text-slate-300 leading-relaxed text-left flex flex-col gap-1.5 w-full">
          <p>
            ✨ <strong className="text-amber-300">Mission:</strong> Leap across castle platforms to collect <span className="text-amber-400 font-bold">100 Galleon Coins</span>!
          </p>
          <p>
            💀 <strong className="text-emerald-400">Lord Voldemort:</strong> Escape his laugh by jumping over him!
          </p>
          <p>
            🧙‍♂️ <strong className="text-purple-400">Dumbledore:</strong> Find him floating to get <span className="text-amber-300 font-bold">+1 Extra HP</span>!
          </p>
          <p>
            🦉 <strong className="text-red-400">Flying Owls:</strong> Leap over low owls or dodge beneath high ones!
          </p>
        </div>

        {/* Best High Score */}
        {highScore > 0 && (
          <div className="flex items-center gap-2 text-[9px] text-amber-300 bg-amber-950/40 px-3 py-1 rounded border border-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>BEST RECORD: {highScore} / 100 POINTS</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={onStartGame}
            className="w-full py-3 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:via-amber-500 hover:to-red-600 text-yellow-100 font-bold text-xs sm:text-sm rounded border-2 border-amber-400 shadow-xl cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 tracking-wide"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START AS {currentChar.name.toUpperCase()}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] rounded border border-amber-600/50 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>LEADERBOARD</span>
            </button>

            <button
              onClick={onOpenHelp}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-600 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>CONTROLS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

