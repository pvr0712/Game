import React, { useState, useEffect } from 'react';
import { CharacterId, BackgroundThemeId } from '../types';
import { Play, ArrowLeft, Sparkles, Compass, Shield, Heart, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MapInstructionsScreenProps {
  character: CharacterId;
  backgroundTheme: BackgroundThemeId;
  onStartGame: () => void;
  onBackToBackgroundSelect: () => void;
  onBackToCharacterSelect: () => void;
}

const charNames: Record<CharacterId, string> = {
  harry: 'Harry Potter ⚡',
  ron: 'Ron Weasley ♟️',
  hermione: 'Hermione Granger 📚',
};

const bgThemeNames: Record<BackgroundThemeId, { name: string; icon: string; accent: string }> = {
  dark_clouds: { name: 'Stormy Night & Spires', icon: '☁️', accent: 'text-blue-900' },
  dark_dungeon: { name: 'Dungeon Catacombs', icon: '🏰', accent: 'text-emerald-950' },
  creepy_forest: { name: 'Forbidden Forest', icon: '🌲', accent: 'text-purple-950' },
};

export const MapInstructionsScreen: React.FC<MapInstructionsScreenProps> = ({
  character,
  backgroundTheme,
  onStartGame,
  onBackToBackgroundSelect,
  onBackToCharacterSelect,
}) => {
  const [footstepStep, setFootstepStep] = useState(0);

  // Animated wandering footprints across the parchment map
  useEffect(() => {
    const interval = setInterval(() => {
      setFootstepStep((prev) => (prev + 1) % 6);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    soundManager.playButtonClick();
    onStartGame();
  };

  const handleBackBg = () => {
    soundManager.playButtonClick();
    onBackToBackgroundSelect();
  };

  const themeInfo = bgThemeNames[backgroundTheme] || bgThemeNames.dark_clouds;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-xs font-pixel select-none overflow-y-auto">
      {/* Ancient Parchment Map Container */}
      <div className="relative z-10 max-w-3xl w-full bg-[#f4e4bc] text-[#3e2410] border-[6px] border-[#5c3717] rounded-lg p-3.5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_60px_rgba(139,69,19,0.35)] flex flex-col gap-3 sm:gap-4 my-auto relative overflow-hidden">
        
        {/* Parchment Background Grid Lines & Fold Creases (Vintage Cartography Style) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8b4513_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Fold crease lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-[#8b4513]/25 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-[#8b4513]/25 pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#8b4513]/25 pointer-events-none" />

        {/* Ornate Corner Accents in pixel art */}
        <div className="absolute top-2 left-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">╔═══</div>
        <div className="absolute top-2 right-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">═══╗</div>
        <div className="absolute bottom-2 left-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">╚═══</div>
        <div className="absolute bottom-2 right-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">═══╝</div>

        {/* Top Header & Navigation Bar */}
        <div className="flex flex-col items-center text-center gap-1 border-b-2 border-[#8b4513]/40 pb-2.5 relative">
          
          {/* Top Bar Quick Controls */}
          <div className="flex items-center justify-between w-full px-1 mb-1">
            <button
              onClick={handleBackBg}
              className="text-[8px] sm:text-[9px] text-[#5c3717] hover:text-[#2c1810] flex items-center gap-1 bg-[#e7d1a1] hover:bg-[#dec48f] px-2 py-0.5 sm:py-1 rounded border border-[#8b4513]/60 cursor-pointer active:scale-95 transition shadow-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>THEMES</span>
            </button>

            {/* Current Quest Badges */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="bg-[#e7d1a1] border border-[#8b4513]/60 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold text-[#4a280e] flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#8b4513]" />
                <span>{charNames[character]}</span>
              </span>
              <span className="bg-[#e7d1a1] border border-[#8b4513]/60 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold text-[#4a280e] flex items-center gap-1">
                <span>{themeInfo.icon}</span>
                <span className="hidden sm:inline">{themeInfo.name}</span>
              </span>
            </div>
          </div>

          <div className="text-[7.5px] sm:text-[9px] tracking-widest text-[#783e15] uppercase font-bold flex items-center justify-center gap-1.5">
            <span>✧ MESSRS. MOONY, WORMTAIL, PADFOOT & PRONGS PRESENT ✧</span>
          </div>

          <h1 className="text-sm sm:text-lg md:text-xl font-extrabold tracking-wide text-[#3a1b06] drop-shadow-xs flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b4513] animate-pulse" />
            <span>THE HOGWARTS ESCAPE MAP & FIELD GUIDE</span>
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b4513] animate-pulse" />
          </h1>
          <p className="text-[8px] sm:text-[9.5px] text-[#5e3819] italic">
            "I solemnly swear that I am up to no good — Instructions for a successful escape!"
          </p>
        </div>

        {/* Map Body Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 text-left">
          
          {/* Section 1: Objective & Galleons */}
          <div className="bg-[#eedab0] p-2.5 sm:p-3 rounded border-2 border-[#8b4513]/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[#3a1b06] font-bold text-[9.5px] sm:text-[11px] border-b border-[#8b4513]/30 pb-1 mb-1.5">
                <span className="text-amber-700 text-xs">🪙</span>
                <span>1. 3 ESCAPE LEVELS</span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-[#4a280e] leading-snug">
                Collect <strong>Golden Galleons</strong> (+1 Pt) to advance through 3 magical tiers:
              </p>
              
              {/* 3 Tier level steps */}
              <div className="mt-1.5 space-y-1 text-[7px] sm:text-[8px]">
                <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/40 text-[#2d1606]">
                  <span className="font-bold text-blue-900">LEVEL 1 (0-25 PTS):</span>
                  <span className="font-semibold text-[#5c3717]">Castle Corridors</span>
                </div>
                <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/40 text-[#2d1606]">
                  <span className="font-bold text-purple-900">LEVEL 2 (25-50 PTS):</span>
                  <span className="font-semibold text-[#5c3717]">High Castle Spires</span>
                </div>
                <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/40 text-[#2d1606]">
                  <span className="font-bold text-amber-900">LEVEL 3 (50-100 PTS):</span>
                  <span className="font-semibold text-[#8b4513] font-bold">House Cup 🏆</span>
                </div>
              </div>

              <div className="mt-1.5 bg-[#e2cc9b] p-1 rounded border border-[#8b4513]/40 text-[7px] sm:text-[8px] text-[#3e220c] text-center">
                <span className="font-bold text-[#8b4513]">★ Level Up grants +1 Extra Life HP! ★</span>
              </div>
            </div>

            {/* Wandering Footsteps Indicator */}
            <div className="mt-2 pt-1 border-t border-[#8b4513]/20 flex items-center justify-between text-[7px] text-[#783e15]">
              <span>Footprints:</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`transition-opacity duration-300 ${
                      i === footstepStep ? 'opacity-100 font-bold scale-125 text-[#3a1b06]' : 'opacity-25'
                    }`}
                  >
                    🐾
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Controls & Movement Guide */}
          <div className="bg-[#eedab0] p-2.5 sm:p-3 rounded border-2 border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#3a1b06] font-bold text-[9.5px] sm:text-[11px] border-b border-[#8b4513]/30 pb-1 mb-1.5">
              <span className="text-xs">🕹️</span>
              <span>2. SPELLBOOK CONTROLS</span>
            </div>
            
            <div className="space-y-1 text-[7.5px] sm:text-[8.5px] text-[#4a280e]">
              <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/30">
                <span className="font-bold text-[#2d1606]">RUN / MOVE:</span>
                <span className="font-mono font-bold bg-[#f4e4bc] px-1 border border-[#8b4513]/40 rounded text-[#3a1b06]">A / D / ← →</span>
              </div>
              <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/30">
                <span className="font-bold text-[#2d1606]">HIGH JUMP:</span>
                <span className="font-mono font-bold bg-[#f4e4bc] px-1 border border-[#8b4513]/40 rounded text-[#3a1b06]">W / ↑ / SPACE</span>
              </div>
              <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/30">
                <span className="font-bold text-[#2d1606]">DROP DOWN:</span>
                <span className="font-mono font-bold bg-[#f4e4bc] px-1 border border-[#8b4513]/40 rounded text-[#3a1b06]">S + JUMP</span>
              </div>
              <div className="flex items-center justify-between bg-[#e2cc9b] px-1.5 py-0.5 rounded border border-[#8b4513]/30">
                <span className="font-bold text-[#2d1606]">WAND SPARK:</span>
                <span className="font-mono font-bold bg-[#f4e4bc] px-1 border border-[#8b4513]/40 rounded text-[#3a1b06]">F / X</span>
              </div>
            </div>

            <p className="text-[7px] sm:text-[7.5px] text-[#6b3e18] mt-1.5 italic">
              📱 Mobile / Tablet: Use on-screen virtual d-pad & jump buttons.
            </p>
          </div>

          {/* Section 3: Castle Hazards & Bosses */}
          <div className="bg-[#eedab0] p-2.5 sm:p-3 rounded border-2 border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#3a1b06] font-bold text-[9.5px] sm:text-[11px] border-b border-[#8b4513]/30 pb-1 mb-1.5">
              <span className="text-xs">⚔️</span>
              <span>3. CASTLE HAZARDS</span>
            </div>

            <div className="space-y-1.5 text-[7.5px] sm:text-[8.5px] text-[#4a280e]">
              {/* Flying Owls */}
              <div className="bg-[#e2cc9b] p-1 rounded border border-[#8b4513]/30">
                <div className="flex items-center gap-1 font-bold text-[#8b4513]">
                  <span>🦉 DELIVERY OWLS:</span>
                </div>
                <div className="flex items-center justify-between text-[7px] text-[#4a280e] mt-0.5">
                  <span className="flex items-center gap-0.5"><ArrowUp className="w-2.5 h-2.5" /> Jump over low owls</span>
                  <span className="flex items-center gap-0.5"><ArrowDown className="w-2.5 h-2.5" /> Pass under high owls</span>
                </div>
              </div>

              {/* Lord Voldemort */}
              <div className="bg-[#e2cc9b] p-1 rounded border border-[#8b4513]/30">
                <div className="flex items-center gap-1 font-bold text-[#1e3a1e]">
                  <span>💀 LORD VOLDEMORT:</span>
                </div>
                <p className="text-[7px] text-[#3e220c]">
                  Evade his bone wand and chilling laugh by leaping across high balconies!
                </p>
              </div>

              {/* Dumbledore Bonus */}
              <div className="bg-[#e2cc9b] p-1 rounded border border-[#8b4513]/30">
                <div className="flex items-center gap-1 font-bold text-[#5b21b6]">
                  <Heart className="w-2.5 h-2.5 text-red-600 fill-current" />
                  <span>DUMBLEDORE (+1 HP):</span>
                </div>
                <p className="text-[7px] text-[#3e220c]">
                  Touch the golden aura to restore hearts (up to 5 max lives)!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t-2 border-[#8b4513]/40">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBackBg}
              className="flex-1 sm:flex-initial py-2 px-3 bg-[#dec48f] hover:bg-[#d4b57a] text-[#3a1b06] text-[8.5px] sm:text-[10px] font-bold rounded border border-[#8b4513]/60 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>CHANGE THEME</span>
            </button>
            <button
              onClick={onBackToCharacterSelect}
              className="flex-1 sm:flex-initial py-2 px-3 bg-[#dec48f] hover:bg-[#d4b57a] text-[#3a1b06] text-[8.5px] sm:text-[10px] font-bold rounded border border-[#8b4513]/60 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1"
            >
              <span>CHANGE HERO</span>
            </button>
          </div>

          {/* Big Start Escape / Mischief Managed Button */}
          <button
            onClick={handleStart}
            className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-[#8b2500] via-[#a0360a] to-[#8b2500] hover:from-[#a0360a] hover:via-[#b8420e] hover:to-[#a0360a] text-yellow-100 font-extrabold text-[10px] sm:text-xs rounded border-2 border-[#5c1800] shadow-md cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 tracking-wider"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>"MISCHIEF MANAGED" — BEGIN ESCAPE!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
