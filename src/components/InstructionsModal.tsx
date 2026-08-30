import React from 'react';
import { X, ShieldAlert, Award, ArrowUp, ArrowDown, Compass, Heart } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Old Marauder's Map Parchment Container */}
      <div className="bg-[#f4e4bc] border-[6px] border-[#5c3717] rounded-lg max-w-lg w-full p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.9),inset_0_0_50px_rgba(139,69,19,0.3)] relative font-pixel text-[#3e2410] flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Parchment background texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8b4513_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">┌───</div>
        <div className="absolute top-2 right-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">───┐</div>
        <div className="absolute bottom-2 left-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">└───</div>
        <div className="absolute bottom-2 right-2 text-xs text-[#8b4513] font-mono pointer-events-none font-bold">───┘</div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8b4513]/40 pb-2 relative z-10">
          <div className="flex flex-col">
            <span className="text-[7.5px] text-[#783e15] uppercase tracking-widest font-bold">
              ✧ MARAUDER'S ESCAPE GUIDE ✧
            </span>
            <h2 className="text-xs sm:text-sm text-[#3a1b06] font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#8b4513]" />
              <span>THE HOGWARTS PARCHMENT MAP</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#5c3717] hover:text-[#2c1810] p-1 hover:bg-[#e7d1a1] rounded cursor-pointer border border-[#8b4513]/40 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-[9px] sm:text-[10px] leading-relaxed relative z-10">
          
          {/* Goal */}
          <div className="bg-[#eedab0] p-2.5 rounded border border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#3a1b06] font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>THE GOAL: 100 GALLEON COINS</span>
            </div>
            <p className="text-[#4a280e]">
              Collect golden Galleons (+1 point each) scattered across castle battlements. Reach 100 points to escape and win the Hogwarts House Cup!
            </p>
          </div>

          {/* Controls */}
          <div className="bg-[#eedab0] p-2.5 rounded border border-[#8b4513]/60 shadow-xs">
            <div className="text-[#3a1b06] font-bold mb-1.5 flex items-center gap-1">
              <span>🕹️</span>
              <span>SPELL & MOVEMENT CONTROLS</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-[8px] sm:text-[8.5px]">
              <div><span className="font-bold text-[#2d1606]">A / D / ← →</span></div>
              <div className="text-[#4a280e]">Move / Run</div>

              <div><span className="font-bold text-[#2d1606]">W / ↑ / SPACE</span></div>
              <div className="text-[#4a280e]">Jump High</div>

              <div><span className="font-bold text-[#2d1606]">S + Jump</span></div>
              <div className="text-[#4a280e]">Drop Through Floor</div>

              <div><span className="font-bold text-[#2d1606]">F / X</span></div>
              <div className="text-[#4a280e]">Cast Wand Spark</div>
            </div>
          </div>

          {/* Escaping Lord Voldemort */}
          <div className="bg-[#eedab0] p-2.5 rounded border border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#1e3a1e] font-bold mb-0.5">
              <span>💀</span>
              <span>LORD VOLDEMORT & SINISTER LAUGH</span>
            </div>
            <p className="text-[#4a280e]">
              Voldemort prowls on platforms casting dark magic with his mocking laugh. Evade him by leaping over him to higher castle balconies or dropping down!
            </p>
          </div>

          {/* Professor Dumbledore Bonus */}
          <div className="bg-[#eedab0] p-2.5 rounded border border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#5b21b6] font-bold mb-0.5">
              <Heart className="w-3 h-3 text-red-600 fill-current" />
              <span>PROFESSOR DUMBLEDORE (+1 HP BONUS)</span>
            </div>
            <p className="text-[#4a280e]">
              Dumbledore rests surrounded by his glowing phoenix aura. Touch his aura to restore <strong className="text-[#8b4513]">+1 Extra HP</strong> (up to 5 max lives)!
            </p>
          </div>

          {/* Dodging Owls */}
          <div className="bg-[#eedab0] p-2.5 rounded border border-[#8b4513]/60 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#8b4513] font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
              <span>🦉 DODGING DELIVERY OWLS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-[#e2cc9b] p-1.5 rounded border border-[#8b4513]/40 text-[7.5px]">
                <div className="font-bold text-[#2d1606] flex items-center gap-0.5">
                  <ArrowUp className="w-2.5 h-2.5 text-red-700" /> JUMP LOW OWLS
                </div>
                <p className="text-[#4a280e] mt-0.5">Leap over low flying owls!</p>
              </div>
              <div className="bg-[#e2cc9b] p-1.5 rounded border border-[#8b4513]/40 text-[7.5px]">
                <div className="font-bold text-[#2d1606] flex items-center gap-0.5">
                  <ArrowDown className="w-2.5 h-2.5 text-emerald-800" /> RUN UNDER HIGH
                </div>
                <p className="text-[#4a280e] mt-0.5">Run safely beneath high owls!</p>
              </div>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-gradient-to-r from-[#8b2500] via-[#a0360a] to-[#8b2500] hover:from-[#a0360a] hover:via-[#b8420e] hover:to-[#a0360a] text-yellow-100 font-extrabold text-[10px] sm:text-xs rounded border border-[#5c1800] shadow-md cursor-pointer active:scale-98 transition relative z-10"
        >
          "MISCHIEF MANAGED" — RETURN TO GAME
        </button>
      </div>
    </div>
  );
};
