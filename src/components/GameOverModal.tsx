import React from 'react';
import { RotateCcw, Trophy, Skull, Play, Award, Flame, ArrowUpRight, ArrowDownRight, History, Users, LogOut, Home } from 'lucide-react';
import { GameState, ScoreComparison, LeaderboardEntry, CharacterId } from '../types';

interface GameOverModalProps {
  gameState: GameState;
  score: number;
  maxScore: number;
  highScore: number;
  character: CharacterId;
  lastComparison: ScoreComparison | null;
  leaderboard: LeaderboardEntry[];
  onRestart: () => void;
  onResume: () => void;
  onExitGame?: () => void;
  onOpenLeaderboard: () => void;
  onOpenCharacterSelect?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  score,
  maxScore,
  highScore,
  character,
  lastComparison,
  leaderboard,
  onRestart,
  onResume,
  onExitGame,
  onOpenLeaderboard,
  onOpenCharacterSelect,
}) => {
  if (gameState !== 'GAMEOVER' && gameState !== 'VICTORY' && gameState !== 'PAUSED') {
    return null;
  }

  const isVictory = gameState === 'VICTORY';
  const isPause = gameState === 'PAUSED';

  const charNames: Record<CharacterId, string> = {
    harry: 'Harry',
    ron: 'Ron',
    hermione: 'Hermione',
  };
  const heroName = charNames[character] || 'Harry';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-pixel text-center animate-fade-in overflow-y-auto">
      <div
        className={`max-w-md w-full rounded-xl p-5 sm:p-7 shadow-2xl flex flex-col items-center gap-3.5 my-auto ${
          isVictory
            ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-4 border-yellow-400'
            : isPause
            ? 'bg-slate-900 border-4 border-slate-700'
            : 'bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 border-4 border-red-700'
        }`}
      >
        {/* Icon & Title */}
        {isVictory ? (
          <>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce">
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold uppercase tracking-widest">
                🏆 HOGWARTS HOUSE CUP CHAMPION!
              </span>
              <h2 className="text-base sm:text-lg text-yellow-300 font-bold">
                100 POINTS REACHED!
              </h2>
              <p className="text-[9px] sm:text-[10px] text-amber-200/90">
                {heroName} escaped Lord Voldemort, evaded all flying owls, and collected every single Galleon!
              </p>
            </div>
          </>
        ) : isPause ? (
          <>
            <h2 className="text-sm sm:text-base text-amber-300 font-bold">
              GAME PAUSED
            </h2>
            <p className="text-[9px] sm:text-[10px] text-slate-400">
              Take a breath before resuming your Hogwarts run as {heroName}.
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-900/30 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-lg">
              <Skull className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-base sm:text-lg text-red-400 font-bold">
                GAME OVER
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-300">
                Caught by Lord Voldemort or hit by an owl! Remember to time your leaps and dodge obstacles!
              </p>
            </div>
          </>
        )}

        {/* Score & Comparison Summary Box */}
        <div className="w-full bg-slate-950/90 p-3 sm:p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2.5 text-left">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">SCORE COLLECTED:</span>
            <span className="text-amber-300 font-bold text-xs sm:text-sm">{score} / {maxScore} PTS</span>
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">ALL-TIME HIGH SCORE:</span>
            <span className="text-yellow-400 font-bold text-xs sm:text-sm">{highScore} PTS</span>
          </div>

          {/* Comparison with Previous Games */}
          {!isPause && lastComparison && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-400 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  PREVIOUS HIGHEST:
                </span>
                <span className="text-slate-200 font-bold">{lastComparison.previousHighestScore} PTS</span>
              </div>

              {/* Status Comparison Badge */}
              {lastComparison.isNewBest ? (
                <div className="px-2.5 py-1.5 bg-yellow-500/20 border border-yellow-400/70 rounded text-center text-[9px] sm:text-[10px] text-yellow-300 font-bold flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                  <Award className="w-3.5 h-3.5 text-yellow-300" />
                  <span>NEW HIGH SCORE! (+{lastComparison.difference} PTS HIGHER) 🏆</span>
                </div>
              ) : lastComparison.currentScore === lastComparison.previousHighestScore && lastComparison.previousHighestScore > 0 ? (
                <div className="px-2.5 py-1.5 bg-amber-500/15 border border-amber-400/50 rounded text-center text-[9px] text-amber-300 flex items-center justify-center gap-1 font-bold">
                  <span>TIED ALL-TIME HIGH SCORE ({score} PTS)! 🌟</span>
                </div>
              ) : lastComparison.previousHighestScore > 0 ? (
                <div className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded text-center text-[9px] text-slate-300 flex items-center justify-center gap-1">
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                  <span>
                    {Math.abs(lastComparison.difference)} pts below your highest score ({lastComparison.previousHighestScore} pts)
                  </span>
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-center text-[9px] text-amber-300">
                  First run recorded on your self leaderboard!
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                <span>LEADERBOARD RANK:</span>
                <span className="text-yellow-400 font-bold">#{lastComparison.rank} of {lastComparison.totalGames} runs</span>
              </div>
            </div>
          )}
        </div>

        {/* View Full Leaderboard & Change Character Buttons */}
        {!isPause && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-yellow-200 text-[10px] sm:text-xs rounded-lg border border-amber-500/50 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>LEADERBOARD ({leaderboard.length})</span>
            </button>

            {onOpenCharacterSelect && (
              <button
                onClick={onOpenCharacterSelect}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-yellow-200 text-[10px] sm:text-xs rounded-lg border border-slate-600 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>CHANGE HERO</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          {isPause ? (
            <>
              <button
                onClick={onResume}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg border border-yellow-200 cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME RUN</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onRestart}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-600 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTART</span>
                </button>

                {onExitGame && (
                  <button
                    onClick={onExitGame}
                    className="py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 text-xs rounded-lg border border-red-700/60 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>EXIT GAME</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onRestart}
                className={`w-full py-3 text-xs sm:text-sm font-bold rounded-lg border-2 shadow-xl cursor-pointer active:scale-95 transition flex items-center justify-center gap-2 ${
                  isVictory
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 border-amber-300'
                    : 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-yellow-100 border-red-400'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isVictory ? 'PLAY AGAIN' : 'TRY AGAIN'}</span>
              </button>

              {onExitGame && (
                <button
                  onClick={onExitGame}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-yellow-200 text-xs rounded-lg border border-slate-600 cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXIT TO MAIN MENU</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

