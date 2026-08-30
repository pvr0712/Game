import React, { useState } from 'react';
import { CharacterId } from '../types';
import { CharacterPreviewCanvas } from './CharacterPreviewCanvas';
import { Sparkles, Check, Wand2, Home, ArrowRight } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CharacterSelectScreenProps {
  onSelectCharacter: (char: CharacterId) => void;
  onGoToMenu?: (char: CharacterId) => void;
  initialCharacter?: CharacterId;
}

interface CharMeta {
  id: CharacterId;
  name: string;
  tagline: string;
  house: string;
  wand: string;
  trait: string;
  accentBorder: string;
  accentBg: string;
  icon: string;
}

const CHARACTERS: CharMeta[] = [
  {
    id: 'harry',
    name: 'Harry Potter',
    tagline: 'The Chosen One',
    house: 'Gryffindor',
    wand: '11" Holly & Phoenix Feather',
    trait: 'Balanced Speed & Courage',
    accentBorder: 'border-red-600 hover:border-amber-400',
    accentBg: 'from-red-950/70 via-slate-900 to-amber-950/40',
    icon: '⚡',
  },
  {
    id: 'ron',
    name: 'Ron Weasley',
    tagline: 'Loyal Knight',
    house: 'Gryffindor',
    wand: '14" Willow & Unicorn Hair',
    trait: 'Steadfast Heart & Big Leaps',
    accentBorder: 'border-orange-600 hover:border-amber-400',
    accentBg: 'from-orange-950/70 via-slate-900 to-amber-950/40',
    icon: '♟️',
  },
  {
    id: 'hermione',
    name: 'Hermione Granger',
    tagline: 'Brightest Witch',
    house: 'Gryffindor',
    wand: '10¾" Vine Wood & Dragon Heartstring',
    trait: 'Sharp Spellcraft & Agility',
    accentBorder: 'border-purple-600 hover:border-amber-400',
    accentBg: 'from-purple-950/70 via-slate-900 to-amber-950/40',
    icon: '📚',
  },
];

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  onSelectCharacter,
  onGoToMenu,
  initialCharacter = 'harry',
}) => {
  const [selected, setSelected] = useState<CharacterId>(initialCharacter);

  const handleChoose = (id: CharacterId) => {
    setSelected(id);
    soundManager.playButtonClick();
  };

  const handleDirectPlay = (id: CharacterId) => {
    soundManager.playButtonClick();
    onSelectCharacter(id);
  };

  const handleConfirm = () => {
    soundManager.playButtonClick();
    onSelectCharacter(selected);
  };

  const handleMenuClick = () => {
    soundManager.playButtonClick();
    if (onGoToMenu) {
      onGoToMenu(selected);
    } else {
      onSelectCharacter(selected);
    }
  };

  const activeChar = CHARACTERS.find((c) => c.id === selected) || CHARACTERS[0];

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs font-pixel text-center select-none overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/15 via-slate-950/90 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full bg-slate-900/95 border-4 border-amber-600 rounded-lg p-4 sm:p-6 shadow-2xl flex flex-col items-center gap-4 sm:gap-5 my-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-[10px] sm:text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 1: CHOOSE YOUR HERO</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-base sm:text-xl text-yellow-300 font-bold drop-shadow-md">
            CHARACTER SELECTION
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-300 max-w-md">
            Select a student to enter the castle, dodge owls, and escape Lord Voldemort!
          </p>
        </div>

        {/* 3 Character Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {CHARACTERS.map((char) => {
            const isChosen = selected === char.id;
            return (
              <div
                key={char.id}
                onClick={() => handleChoose(char.id)}
                onDoubleClick={() => handleDirectPlay(char.id)}
                className={`group relative flex flex-col items-center p-3 rounded-lg border-2 bg-gradient-to-b ${char.accentBg} cursor-pointer transition-all duration-200 ${
                  isChosen
                    ? 'border-yellow-400 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]'
                    : 'border-slate-700 hover:border-amber-500/70 opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                {/* Selected Checkmark Badge */}
                {isChosen && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-md flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Character Icon / Symbol */}
                <div className="text-lg mb-1">{char.icon}</div>

                {/* Animated Pixel Sprite Canvas Preview */}
                <div className="my-1">
                  <CharacterPreviewCanvas character={char.id} />
                </div>

                {/* Character Name & House */}
                <h3 className={`text-xs sm:text-sm font-bold mt-2 ${isChosen ? 'text-yellow-300' : 'text-slate-200'}`}>
                  {char.name}
                </h3>
                <span className="text-[8px] text-amber-400/90 font-medium">
                  {char.tagline}
                </span>

                {/* Stats / Trait */}
                <div className="w-full bg-slate-950/80 p-2 rounded mt-2.5 border border-slate-800 text-[8px] text-left flex flex-col gap-1 text-slate-300">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Wand2 className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{char.wand}</span>
                  </div>
                  <div className="text-slate-400">
                    ✨ {char.trait}
                  </div>
                </div>

                {/* Select & Continue button inside card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectPlay(char.id);
                  }}
                  className={`w-full mt-3 py-1.5 text-[9px] font-bold rounded transition cursor-pointer flex items-center justify-center gap-1 ${
                    isChosen
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 text-slate-200 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <span>{isChosen ? `SELECT ${char.name.split(' ')[0].toUpperCase()}` : 'CHOOSE'}</span>
                  <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Next Step Button & Menu Option */}
        <div className="w-full max-w-md flex flex-col gap-2 mt-1">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:via-amber-500 hover:to-red-600 text-yellow-100 font-bold text-xs sm:text-sm rounded border-2 border-amber-400 shadow-xl cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 tracking-wide"
          >
            <span>NEXT: CHOOSE BACKGROUND THEME</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {onGoToMenu && (
            <button
              onClick={handleMenuClick}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-yellow-200 text-[10px] sm:text-xs rounded border border-amber-600/50 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <Home className="w-3 h-3 text-amber-400" />
              <span>GO TO MAIN MENU</span>
            </button>
          )}
          
          <span className="text-[8px] text-slate-400">
            Press Arrow Keys / WASD or Touch Controls to Run, Jump & Cast Lumos Spark!
          </span>
        </div>

      </div>
    </div>
  );
};
