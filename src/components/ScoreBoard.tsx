import React from 'react';
import { Volume2, VolumeX, Music, Pause, Play, Sparkles, Trophy, Maximize, Minimize, Shield, Award } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { CharacterId, GameLevel, LEVEL_CONFIGS, CHARACTER_LEVEL_TITLES } from '../types';

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

  // Determine current level: 1 (0-25), 2 (25-50), 3 (50-100)
  const currentLevel: GameLevel = score < 25 ? 1 : score < 50 ? 2 : 3;
  const levelConfig = LEVEL_CONFIGS[currentLevel];
  const charTitleObj = CHARACTER_LEVEL_TITLES[character]?.[currentLevel] || { title: 'Champion', badge: '🏆' };

  const charNames: Record<CharacterId, { name: string; icon: string; color: string }> = {
    harry: { name: 'Harry', icon: '⚡', color: 'text-amber-400 border-amber-600' },
    ron: { name: 'Ron', icon: '♟️', color: 'text-orange-400 border-orange-600' },
    hermione: { name: 'Hermione', icon: '📚', color: 'text-purple-400 border-purple-600' },
  };

  const currentChar = charNames[character] || charNames.harry;

  // Level Badge Styling
  const levelStyles: Record<GameLevel, { badgeBg: string; textCol: string; borderCol: string; label: string; target: string }> = {
    1: {
      badgeBg: 'bg-gradient-to-r from-blue-950 to-cyan-950',
      textCol: 'text-cyan-300',
      borderCol: 'border-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.4)]',
      label: 'LV 1',
      target: 'GOAL: 25 PTS',
    },
    2: {
      badgeBg: 'bg-gradient-to-r from-purple-950 to-indigo-950',
      textCol: 'text-purple-300',
      borderCol: 'border-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
      label: 'LV 2',
      target: 'GOAL: 50 PTS',
    },
    3: {
      badgeBg: 'bg-gradient-to-r from-amber-950 to-yellow-950',
      textCol: 'text-yellow-300',
      borderCol: 'border-yellow-500/90 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
      label: 'LV 3',
      target: 'FINAL CUP: 100 PTS',
    },
  };

  const currentLevelStyle = levelStyles[currentLevel];

  return (
    <header className="w-full bg-slate-900/85 border-b border-amber-600/60 px-2 py-1 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md z-20 flex flex-col gap-1 sm:gap-1.5">
      {/* Top row: Stats, Level Indicators, and Controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Left: Character Badge, Level Badge, Score & Lives */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          
          {/* Character Switcher Pill */}
          <button
            onClick={onChangeCharacter}
            className={`flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 border-2 ${currentChar.color} px-1.5 py-1 sm:px-2 sm:py-1 rounded shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer`}
            title="Click to Switch Character"
          >
            <span className="text-xs sm:text-sm">{currentChar.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[6px] sm:text-[7px] text-slate-400 font-pixel uppercase leading-none">Hero</span>
              <span className="text-[8px] sm:text-[9.5px] font-pixel text-yellow-300 font-bold leading-none mt-0.5">
                {currentChar.name}
              </span>
            </div>
          </button>

          {/* 3-Level Badge */}
          <div className={`flex items-center gap-1 sm:gap-1.5 ${currentLevelStyle.badgeBg} border-2 ${currentLevelStyle.borderCol} px-1.5 py-1 sm:px-2.5 sm:py-1 rounded`}>
            <Award className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${currentLevelStyle.textCol} animate-pulse`} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className={`text-[8px] sm:text-[10px] font-pixel font-extrabold ${currentLevelStyle.textCol} tracking-wide leading-none`}>
                  {currentLevelStyle.label}
                </span>
                <span className="text-[6.5px] sm:text-[7.5px] text-slate-400 font-pixel leading-none">
                  (1/2/3)
                </span>
              </div>
              <span className="text-[6.5px] sm:text-[7.5px] text-amber-200/90 font-pixel uppercase leading-none mt-0.5 hidden xs:inline">
                {currentLevelStyle.target}
              </span>
            </div>
          </div>

          {/* Main Score Display */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/85 border sm:border-2 border-amber-500/80 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded shadow-inner">
            <span className="inline-block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 border border-yellow-200 shadow-sm animate-pulse text-amber-950 text-[8px] sm:text-[9px] font-bold text-center leading-3.5 sm:leading-4">
              G
            </span>
            <div className="flex flex-col">
              <span className="text-[6.5px] sm:text-[7.5px] text-amber-300/80 font-pixel uppercase leading-none">Points</span>
              <span className="text-xs sm:text-sm font-pixel text-amber-300 font-bold tracking-wider leading-tight">
                {score}<span className="text-amber-500/70 text-[9px] sm:text-[10px]">/{maxScore}</span>
              </span>
            </div>
          </div>

          {/* High Score (Clickable) */}
          <button
            onClick={onOpenLeaderboard}
            className="hidden md:flex items-center gap-1.5 bg-slate-950/60 hover:bg-slate-900 border border-amber-500/50 hover:border-amber-400 px-2 py-1 rounded cursor-pointer transition active:scale-95"
            title="View Self Leaderboard"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <div className="flex flex-col text-left">
              <span className="text-[6.5px] sm:text-[7.5px] text-amber-400/90 font-pixel uppercase leading-none">Best</span>
              <span className="text-[8.5px] sm:text-[10px] font-pixel text-yellow-300 font-bold leading-none mt-0.5">
                {highScore} PTS
              </span>
            </div>
          </button>

          {/* Lives (Lightning Bolts) */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-950/80 border sm:border-2 border-red-900/80 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded">
            <span className="text-[6.5px] sm:text-[7.5px] text-red-400 font-pixel uppercase mr-0.5 hidden lg:inline">HP</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs sm:text-sm transition-transform duration-200 ${
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

        {/* Center: Segmented 3-Level Progress Bars */}
        <div className="flex-1 max-w-xs sm:max-w-md hidden lg:flex flex-col gap-1">
          <div className="flex justify-between items-center text-[7.5px] sm:text-[8px] font-pixel text-amber-200">
            <span className="text-yellow-300 font-bold flex items-center gap-1">
              <span>{charTitleObj.badge}</span>
              <span>{charTitleObj.title}</span>
            </span>
            <span>{percentage}% TOTAL</span>
          </div>

          {/* 3 Segmented Level Bars (0-25, 25-50, 50-100) */}
          <div className="grid grid-cols-3 gap-1 w-full">
            {/* Level 1 Segment: 0 - 25 */}
            <div className="flex flex-col gap-0.5">
              <div className="h-2 bg-slate-950 border border-cyan-700/70 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xs transition-all duration-300"
                  style={{ width: `${Math.min(100, (Math.min(score, 25) / 25) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[6.5px] font-pixel text-cyan-300/80">
                <span>LV 1</span>
                <span>25P</span>
              </div>
            </div>

            {/* Level 2 Segment: 25 - 50 */}
            <div className="flex flex-col gap-0.5">
              <div className="h-2 bg-slate-950 border border-purple-700/70 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-xs transition-all duration-300"
                  style={{
                    width: `${
                      score <= 25 ? 0 : Math.min(100, ((Math.min(score, 50) - 25) / 25) * 100)
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[6.5px] font-pixel text-purple-300/80">
                <span>LV 2</span>
                <span>50P</span>
              </div>
            </div>

            {/* Level 3 Segment: 50 - 100 */}
            <div className="flex flex-col gap-0.5">
              <div className="h-2 bg-slate-950 border border-yellow-700/70 rounded-xs overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-xs transition-all duration-300"
                  style={{
                    width: `${
                      score <= 50 ? 0 : Math.min(100, ((score - 50) / 50) * 100)
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[6.5px] font-pixel text-yellow-300/80">
                <span>LV 3</span>
                <span>100P 🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Audio, Leaderboard & Pause Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Leaderboard button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/60 text-amber-300 text-[8px] font-pixel rounded cursor-pointer transition active:scale-95 flex items-center gap-1"
            title="Self Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden xl:inline text-[7.5px]">RANKS</span>
          </button>

          {/* How to Play button */}
          <button
            onClick={onOpenHelp}
            className="px-1.5 sm:px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 text-[8px] font-pixel rounded cursor-pointer transition active:scale-95"
            title="How to Play & Levels Guide"
          >
            ?
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1 sm:p-1.5 border rounded cursor-pointer transition active:scale-95 ${
              soundMuted
                ? 'bg-red-950/60 border-red-800 text-red-400 hover:bg-red-900/60'
                : 'bg-slate-800 border-slate-600 text-amber-300 hover:bg-slate-700'
            }`}
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-1 sm:p-1.5 border rounded cursor-pointer transition active:scale-95 ${
              bgmMuted
                ? 'bg-slate-950/80 border-slate-800 text-slate-500 hover:bg-slate-800'
                : 'bg-indigo-950/80 border-indigo-700 text-indigo-300 hover:bg-indigo-900/80'
            }`}
            title={bgmMuted ? 'Play Hedwig Theme Music' : 'Mute Music'}
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/70 text-amber-300 rounded cursor-pointer transition active:scale-95 flex items-center justify-center"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullscreen ? (
                <Minimize className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Maximize className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>
          )}

          {/* Pause Button */}
          <button
            onClick={onTogglePause}
            className="p-1 sm:p-1.5 bg-amber-700 hover:bg-amber-600 border border-amber-400 text-amber-100 rounded cursor-pointer transition active:scale-95"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Level & Action Hint Banner */}
      <div className="w-full hidden lg:flex items-center justify-between text-[7.5px] sm:text-[8px] text-slate-300 font-pixel bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/80">
        <span className={currentLevelStyle.textCol}>
          🎯 <strong className="text-yellow-200">LEVEL {currentLevel}:</strong> {levelConfig.name} — {levelConfig.subtitle}
        </span>
        <span className="text-amber-400">
          🪙 <strong className="text-yellow-100">PROGRESSION:</strong> Lv 1 (25 Pts) → Lv 2 (50 Pts) → Lv 3 (100 Pts 🏆)
        </span>
      </div>
    </header>
  );
};


