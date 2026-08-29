import React from 'react';
import { X, ShieldAlert, Award, ArrowUp, Sparkles } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-amber-600 rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-2xl relative font-pixel text-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-700/60 pb-3">
          <h2 className="text-sm sm:text-base text-amber-400 font-bold flex items-center gap-2">
            ⚡ HOGWARTS ESCAPE GUIDE
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-[10px] sm:text-xs leading-relaxed">
          
          {/* Goal */}
          <div className="bg-slate-950 p-3 rounded border border-amber-800/80">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>THE GOAL: 100 POINTS</span>
            </div>
            <p className="text-slate-300">
              Guide Harry Potter across the castle battlements. Collect golden Galleon coins (+1 point each) to reach the maximum 100 points for the Hogwarts House Cup!
            </p>
          </div>

          {/* Escaping Lord Voldemort */}
          <div className="bg-slate-950 p-3 rounded border border-emerald-900">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <span>💀 LORD VOLDEMORT & SINISTER LAUGH</span>
            </div>
            <p className="text-slate-300">
              Lord Voldemort prowls platforms wielding his bone wand. Whenever Harry encounters him, Voldemort unleashes his iconic mocking laugh! You must escape him by:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
              <li>Jumping high over him to reach safety</li>
              <li>Climbing up to higher castle balconies</li>
              <li>Dropping down to lower tiers (<kbd className="text-amber-300">S + Jump</kbd> on wood platforms)</li>
            </ul>
          </div>

          {/* Professor Dumbledore Extra HP Bonus */}
          <div className="bg-slate-950 p-3 rounded border border-purple-900">
            <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
              <span>🧙‍♂️ PROFESSOR DUMBLEDORE (+1 HP BONUS)</span>
            </div>
            <p className="text-slate-300">
              Professor Dumbledore appears floating in the air and resting on high castle balconies, surrounded by a golden phoenix aura. Reach him to receive his blessing and restore <strong className="text-amber-300">+1 Extra HP</strong> (up to 5 max lives)!
            </p>
          </div>

          {/* Dodging Owls */}
          <div className="bg-slate-950 p-3 rounded border border-red-950">
            <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>🦉 DODGING FLYING OWLS</span>
            </div>
            <p className="text-slate-300">
              Hogwarts delivery owls swoop rapidly across the sky. Watch for the red edge warning indicators:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <div className="text-yellow-400 font-bold flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5" /> JUMP OVER LOW OWLS
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  Press <kbd className="text-amber-300">W / ↑ / SPACE</kbd> to leap cleanly over low flying owls!
                </p>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <div className="text-yellow-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> PASS UNDER HIGH OWLS
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  High owls soar above your head safely. Run beneath them without jumping!
                </p>
              </div>
            </div>
          </div>

          {/* Key Controls Table */}
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-amber-400 font-bold mb-2">⌨️ CONTROLS</div>
            <div className="grid grid-cols-2 gap-y-1.5 text-[9px]">
              <div><span className="text-amber-300">A / D</span> or <span className="text-amber-300">← / →</span></div>
              <div className="text-slate-300">Move Left / Right</div>

              <div><span className="text-amber-300">W / ↑ / SPACE</span></div>
              <div className="text-slate-300">Jump</div>

              <div><span className="text-amber-300">S + Jump</span></div>
              <div className="text-slate-300">Drop Down Platform</div>

              <div><span className="text-amber-300">F / X</span></div>
              <div className="text-slate-300">Cast Wand Spark</div>

              <div><span className="text-amber-300">P / ESC</span></div>
              <div className="text-slate-300">Pause Game</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-98 text-slate-950 font-bold rounded cursor-pointer transition text-xs"
        >
          RETURN TO GAME
        </button>
      </div>
    </div>
  );
};
