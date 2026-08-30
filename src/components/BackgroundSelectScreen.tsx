import React, { useState } from 'react';
import { BackgroundThemeId, CharacterId } from '../types';
import { BackgroundPreviewCanvas } from './BackgroundPreviewCanvas';
import { Sparkles, Check, ArrowLeft, ArrowRight, Layers, Shield, Map } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface BackgroundSelectScreenProps {
  initialTheme?: BackgroundThemeId;
  character: CharacterId;
  onSelectBackground: (theme: BackgroundThemeId) => void;
  onBackToCharacterSelect: () => void;
}

interface ThemeMeta {
  id: BackgroundThemeId;
  name: string;
  tagline: string;
  location: string;
  description: string;
  accentBorder: string;
  accentBg: string;
  badgeColor: string;
  icon: string;
  isDefault?: boolean;
}

const THEMES: ThemeMeta[] = [
  {
    id: 'dark_clouds',
    name: 'Dark Night & Stormy Clouds',
    tagline: 'Hogwarts Castle Spires',
    location: 'Astronomy Tower Rooftops',
    description: 'Midnight star-filled sky, luminous glowing full moon, floating castle spires, and drifting stormy clouds.',
    accentBorder: 'border-blue-500 hover:border-amber-400',
    accentBg: 'from-slate-900 via-blue-950/60 to-slate-950',
    badgeColor: 'bg-blue-900/80 text-blue-300 border-blue-600',
    icon: '☁️',
    isDefault: true,
  },
  {
    id: 'dark_dungeon',
    name: 'Dark Dungeon & Vaults',
    tagline: 'Slytherin Depths & Arches',
    location: 'Subterranean Catacombs',
    description: 'Ancient masonry brick vaults, flickering iron wall torches, swinging chains, and glowing emerald runes.',
    accentBorder: 'border-emerald-500 hover:border-emerald-300',
    accentBg: 'from-slate-900 via-emerald-950/60 to-slate-950',
    badgeColor: 'bg-emerald-900/80 text-emerald-300 border-emerald-600',
    icon: '🏰',
  },
  {
    id: 'creepy_forest',
    name: 'Creepy Forbidden Forest',
    tagline: 'Twisted Trees & Glowing Eyes',
    location: 'The Dark Forest Hollows',
    description: 'Spooky purple twilight, blood crescent moon, twisted gnarled trees, rolling fog, and blinking creature eyes.',
    accentBorder: 'border-purple-500 hover:border-pink-400',
    accentBg: 'from-slate-900 via-purple-950/60 to-slate-950',
    badgeColor: 'bg-purple-900/80 text-purple-300 border-purple-600',
    icon: '🌲',
  },
];

const charNames: Record<CharacterId, string> = {
  harry: 'Harry Potter ⚡',
  ron: 'Ron Weasley ♟️',
  hermione: 'Hermione Granger 📚',
};

export const BackgroundSelectScreen: React.FC<BackgroundSelectScreenProps> = ({
  initialTheme = 'dark_clouds',
  character,
  onSelectBackground,
  onBackToCharacterSelect,
}) => {
  const [selected, setSelected] = useState<BackgroundThemeId>(initialTheme);

  const handleChoose = (id: BackgroundThemeId) => {
    setSelected(id);
    soundManager.playButtonClick();
  };

  const handleDirectStart = (id: BackgroundThemeId) => {
    soundManager.playButtonClick();
    onSelectBackground(id);
  };

  const handleConfirm = () => {
    soundManager.playButtonClick();
    onSelectBackground(selected);
  };

  const handleBack = () => {
    soundManager.playButtonClick();
    onBackToCharacterSelect();
  };

  const activeTheme = THEMES.find((t) => t.id === selected) || THEMES[0];

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs font-pixel text-center select-none overflow-y-auto">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/15 via-slate-950/90 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full bg-slate-900/95 border-4 border-amber-600 rounded-lg p-4 sm:p-6 shadow-2xl flex flex-col items-center gap-4 sm:gap-5 my-auto">
        
        {/* Top Header & Character Confirmation Pill */}
        <div className="flex flex-col gap-1 w-full items-center">
          <div className="flex items-center justify-between w-full max-w-md px-1">
            <button
              onClick={handleBack}
              className="text-[9px] text-amber-400 hover:text-yellow-200 flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-amber-600/50 cursor-pointer active:scale-95 transition"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>HERO SELECT</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/60 text-[9px] text-yellow-300">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Playing as: <strong className="text-white">{charNames[character]}</strong></span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-amber-400 text-[10px] sm:text-xs tracking-widest uppercase mt-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 2: CHOOSE ENVIRONMENT</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-base sm:text-xl text-yellow-300 font-bold drop-shadow-md">
            BACKGROUND SELECTION
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-300 max-w-md">
            Select a retro pixel theme for your escape adventure. Visible for all heroes!
          </p>
        </div>

        {/* 3 Background Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {THEMES.map((theme) => {
            const isChosen = selected === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => handleChoose(theme.id)}
                onDoubleClick={() => handleDirectStart(theme.id)}
                className={`group relative flex flex-col items-center p-3 rounded-lg border-2 bg-gradient-to-b ${theme.accentBg} cursor-pointer transition-all duration-200 ${
                  isChosen
                    ? 'border-yellow-400 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]'
                    : 'border-slate-700 hover:border-amber-500/70 opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                {/* Selected Checkmark Badge */}
                {isChosen && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-md flex items-center justify-center z-10">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Default Tag */}
                {theme.isDefault && (
                  <span className="absolute top-2 left-2 text-[7px] bg-slate-950/80 border border-slate-700 text-amber-300 px-1.5 py-0.5 rounded">
                    DEFAULT
                  </span>
                )}

                {/* Animated Pixel Canvas Background Preview */}
                <div className="w-full mt-3 mb-2">
                  <BackgroundPreviewCanvas theme={theme.id} width={160} height={96} />
                </div>

                {/* Theme Name */}
                <h3 className={`text-xs sm:text-sm font-bold mt-1 ${isChosen ? 'text-yellow-300' : 'text-slate-200'}`}>
                  {theme.name}
                </h3>
                <span className="text-[8px] text-amber-400/90 font-medium">
                  {theme.icon} {theme.tagline}
                </span>

                {/* Description Box */}
                <div className="w-full bg-slate-950/80 p-2 rounded mt-2 border border-slate-800 text-[8px] text-left flex flex-col gap-1 text-slate-300">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Layers className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{theme.location}</span>
                  </div>
                  <p className="text-slate-400 text-[7.5px] leading-tight">
                    {theme.description}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectStart(theme.id);
                  }}
                  className={`w-full mt-3 py-1.5 text-[9px] font-bold rounded transition cursor-pointer flex items-center justify-center gap-1 ${
                    isChosen
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-200 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                  <span>{isChosen ? 'CONTINUE WITH THIS THEME' : 'SELECT THEME'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue to Map Instructions Button & Navigation */}
        <div className="w-full max-w-md flex flex-col gap-2 mt-1">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:via-amber-500 hover:to-red-600 text-yellow-100 font-bold text-xs sm:text-sm rounded border-2 border-amber-400 shadow-xl cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 tracking-wide"
          >
            <Map className="w-4 h-4 text-yellow-200" />
            <span>STEP 3: VIEW MARAUDER'S ESCAPE MAP</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={handleBack}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-yellow-200 text-[10px] sm:text-xs rounded border border-amber-600/50 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3 h-3 text-amber-400" />
            <span>BACK TO CHARACTER SELECTION</span>
          </button>

          <span className="text-[8px] text-slate-400">
            Dodge swooping owls, leap across magic platforms, and collect Galleons!
          </span>
        </div>

      </div>
    </div>
  );
};
