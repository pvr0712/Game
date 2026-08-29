import React from 'react';
import { Volume2, VolumeX, Music, Pause, Play, Sparkles, Trophy, Maximize, Minimize } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { CharacterId } from '../types';

interface ScoreBoardProps {
  score: number;
  maxScore: number;
  highScore: number;
  lives: number;
  maxLives: number;
  character: CharacterId;
  onChangeCharacter: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  soundMuted: boolean;
  bgmMuted: boolean;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  onOpenHelp: () => void;
  onOpenLeaderboard: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  maxScore,
  highScore,
  lives,
  maxLives,
  character,
  onChangeCharacter,
  isPaused,
  onTogglePause,
  soundMuted,
  bgmMuted,
  onToggleSound,
  onToggleBgm,
  onOpenHelp,
  onOpenLeaderboard,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const percentage = Math.min(100, Math.round((score / maxScore) * 100));

  const charNames: Record<CharacterId, { name: string; icon: string; color: string }> = {
    harry: { name: 'Harry', icon: '⚡', color: 'text-amber-400 border-amber-600' },
    ron: { name: 'Ron', icon: '♟️', color: 'text-orange-400 border-orange-600' },
    hermione: { name: 'Hermione', icon: '📚', color: 'text-purple-400 border-purple-600' },
  };

  const currentChar = charNames[character] || charNames.harry;

  return (
    <header className="w-full bg-slate-900/90 border-b-2 sm:border-b-4 border-amber-600/80 px-2 py-1.5 sm:px-6 sm:py-3 shadow-2xl backdrop-blur-md z-20 flex flex-col gap-1 sm:gap-2">
      {/* Top row: Stats, Progress, and Controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Left: Character Badge, Score & High Score */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Character Switcher Pill */}
          <button
            onClick={onChangeCharacter}
            className={`flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 border-2 ${currentChar.color} px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer`}
            title="Click to Switch Character"
          >
            <span className="text-xs sm:text-sm">{currentChar.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[6px] sm:text-[7px] text-slate-400 font-pixel uppercase leading-none">Hero</span>
              <span className="text-[8px] sm:text-[10px] font-pixel text-yellow-300 font-bold leading-none mt-0.5">
                {currentChar.name}
              </span>
            </div>
          </button>

          {/* Main Score Display */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/80 border sm:border-2 border-amber-500/80 px-2 py-1 sm:px-3 sm:py-1.5 rounded shadow-inner">
            <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 border border-yellow-200 shadow-sm animate-pulse text-amber-950 text-[8px] sm:text-[9px] font-bold text-center leading-3.5 sm:leading-4">
              G
            </span>
            <div className="flex flex-col">
              <span className="text-[7px] sm:text-[9px] text-amber-300/80 font-pixel uppercase leading-none">Points</span>
              <span className="text-xs sm:text-base font-pixel text-amber-300 font-bold tracking-wider leading-tight">
                {score}<span className="text-amber-500/70 text-[9px] sm:text-xs">/{maxScore}</span>
              </span>
            </div>
          </div>

          {/* High Score (Clickable to open Leaderboard) */}
          <button
            onClick={onOpenLeaderboard}
            className="hidden sm:flex items-center gap-2 bg-slate-950/60 hover:bg-slate-900 border border-amber-500/50 hover:border-amber-400 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded cursor-pointer transition active:scale-95"
            title="View Self Leaderboard"
          >
            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <div className="flex flex-col text-left">
              <span className="text-[7px] sm:text-[8px] text-amber-400/90 font-pixel uppercase leading-none">Best</span>
              <span className="text-[9px] sm:text-xs font-pixel text-yellow-300 font-bold leading-none mt-0.5">
                {highScore} PTS
              </span>
            </div>
          </button>

          {/* Lives (Lightning Bolts) */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950/80 border sm:border-2 border-red-900/80 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded">
            <span className="text-[7px] sm:text-[9px] text-red-400 font-pixel uppercase mr-0.5 hidden md:inline">HP</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs sm:text-base transition-transform duration-200 ${
                    i < lives
                      ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] scale-100'
                      : 'text-slate-700 opacity-40 scale-75'
                  }`}
                  title={`Life ${i + 1}`}
                >
                  ⚡
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center Progress Bar: Road to 100 Points */}
        <div className="flex-1 max-w-xs sm:max-w-md hidden lg:flex flex-col gap-1">
          <div className="flex justify-between items-center text-[8px] text-amber-200 font-pixel">
            <span>HOGWARTS HOUSE CUP</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-2.5 sm:h-3 bg-slate-950 border border-amber-700 rounded-sm overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 rounded-sm transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Right: Audio, Leaderboard & Pause Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Leaderboard button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-1 sm:p-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/60 text-amber-300 text-[8px] sm:text-[9px] font-pixel rounded cursor-pointer transition active:scale-95 flex items-center gap-1"
            title="Self Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="hidden md:inline text-[8px]">RANKS</span>
          </button>

          {/* How to Play button */}
          <button
            onClick={onOpenHelp}
            className="px-1.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 text-[8px] sm:text-[9px] font-pixel rounded cursor-pointer transition active:scale-95"
            title="How to Play"
          >
            ?
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1 sm:p-2 border rounded cursor-pointer transition active:scale-95 ${
              soundMuted
                ? 'bg-red-950/60 border-red-800 text-red-400 hover:bg-red-900/60'
                : 'bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700'
            }`}
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-1 sm:p-2 border rounded cursor-pointer transition active:scale-95 ${
              bgmMuted
                ? 'bg-slate-950/80 border-slate-800 text-slate-500 hover:bg-slate-800'
                : 'bg-indigo-950/80 border-indigo-700 text-indigo-300 hover:bg-indigo-900/80'
            }`}
            title={bgmMuted ? 'Play Hedwig Theme Music' : 'Mute Music'}
          >
            <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1 sm:p-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/70 text-amber-300 rounded cursor-pointer transition active:scale-95 flex items-center justify-center"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullscreen ? (
                <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              ) : (
                <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              )}
            </button>
          )}

          {/* Pause Button */}
          <button
            onClick={onTogglePause}
            className="p-1 sm:p-2 bg-amber-700 hover:bg-amber-600 border border-amber-400 text-amber-100 rounded cursor-pointer transition active:scale-95"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Action Hint Pill */}
      <div className="w-full hidden sm:flex items-center justify-between text-[8px] sm:text-[9px] text-slate-300 font-pixel bg-slate-950/50 px-2 py-0.5 sm:py-1 rounded border border-slate-800">
        <span className="text-amber-400">
          🦉 <strong className="text-yellow-200">OWLS FLYING:</strong> Leap over low owls or pass under high owls with <kbd className="bg-slate-800 px-1 py-0.5 border border-slate-600 text-amber-300 rounded">SPACE</kbd>!
        </span>
        <span className="hidden md:inline text-emerald-400">
          💀 <strong className="text-emerald-300">LORD VOLDEMORT:</strong> Escape his laugh by jumping over or leaping across platforms!
        </span>
      </div>
    </header>
  );
};

