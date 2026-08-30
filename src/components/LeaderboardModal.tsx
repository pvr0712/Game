import React, { useState } from 'react';
import { Trophy, History, BarChart3, Trash2, X, Award, Flame, CheckCircle, XCircle } from 'lucide-react';
import { LeaderboardEntry, ScoreComparison } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: LeaderboardEntry[];
  lastComparison: ScoreComparison | null;
  onClear: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  leaderboard,
  lastComparison,
  onClear,
}) => {
  const [tab, setTab] = useState<'TOP' | 'RECENT' | 'STATS'>('TOP');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  // Compute stats
  const totalRuns = leaderboard.length;
  const highestScore = totalRuns > 0 ? Math.max(...leaderboard.map(e => e.score)) : 0;
  const victories = leaderboard.filter(e => e.result === 'VICTORY').length;
  const totalScore = leaderboard.reduce((acc, e) => acc + e.score, 0);
  const avgScore = totalRuns > 0 ? Math.round(totalScore / totalRuns) : 0;
  const totalTime = leaderboard.reduce((acc, e) => acc + e.timeSpent, 0);

  // Top runs sorted by score desc, timeSpent asc
  const topRuns = [...leaderboard].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpent - b.timeSpent;
  });

  // Recent runs (reversed or chronologically by timestamp if id has Date.now())
  const recentRuns = [...leaderboard].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-pixel animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-amber-500/80 rounded-xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded border border-slate-700 cursor-pointer transition"
          title="Close Leaderboard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-amber-500/30">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-300 tracking-wider">
              HOGWARTS SELF LEADERBOARD
            </h2>
            <p className="text-[10px] text-slate-400">
              Personal Run Records & Score History
            </p>
          </div>
        </div>

        {/* Last Game Comparison Banner (if available) */}
        {lastComparison && (
          <div className="my-3 p-3 rounded-lg bg-gradient-to-r from-amber-950/60 via-slate-950 to-slate-900 border border-amber-400/50 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                LATEST GAME COMPARISON
              </span>
              <span className="text-[10px] font-bold text-yellow-300">
                Rank #{lastComparison.rank} of {lastComparison.totalGames}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="text-slate-300 text-[10px]">CURRENT RUN: </span>
                <span className="text-amber-300 font-bold">{lastComparison.currentScore} PTS</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">PREVIOUS BEST: </span>
                <span className="text-slate-200 font-bold">{lastComparison.previousHighestScore} PTS</span>
              </div>
            </div>

            {/* Difference callout */}
            <div className="mt-1">
              {lastComparison.isNewBest ? (
                <div className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/60 rounded text-center text-[10px] text-yellow-300 font-bold flex items-center justify-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                  <span>NEW PERSONAL BEST! (+{lastComparison.difference} PTS HIGHER)</span>
                </div>
              ) : lastComparison.difference === 0 ? (
                <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/40 rounded text-center text-[10px] text-amber-300">
                  TIED YOUR HIGHEST SCORE! ({lastComparison.currentScore} PTS)
                </div>
              ) : (
                <div className="px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-center text-[9px] text-slate-300">
                  {Math.abs(lastComparison.difference)} pts below your highest score of {lastComparison.previousHighestScore} pts
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
          <button
            onClick={() => setTab('TOP')}
            className={`py-1.5 px-2 rounded cursor-pointer transition flex items-center justify-center gap-1.5 ${
              tab === 'TOP'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>TOP RUNS</span>
          </button>
          <button
            onClick={() => setTab('RECENT')}
            className={`py-1.5 px-2 rounded cursor-pointer transition flex items-center justify-center gap-1.5 ${
              tab === 'RECENT'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>HISTORY</span>
          </button>
          <button
            onClick={() => setTab('STATS')}
            className={`py-1.5 px-2 rounded cursor-pointer transition flex items-center justify-center gap-1.5 ${
              tab === 'STATS'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>STATS</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="my-3 flex-1 overflow-y-auto pr-1 min-h-[160px] max-h-[260px] custom-scrollbar">
          {totalRuns === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-8 text-center text-slate-500">
              <Trophy className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs text-slate-400">NO GAMES RECORDED YET</p>
              <p className="text-[9px] mt-1 text-slate-500">
                Play your first Hogwarts platform run to start building your self leaderboard!
              </p>
            </div>
          ) : tab === 'TOP' ? (
            <div className="flex flex-col gap-1.5">
              {topRuns.slice(0, 10).map((entry, idx) => {
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-2 rounded border text-[10px] ${
                      isGold
                        ? 'bg-amber-500/15 border-amber-400/60 text-amber-200 shadow-xs'
                        : isSilver
                        ? 'bg-slate-400/10 border-slate-400/40 text-slate-200'
                        : isBronze
                        ? 'bg-amber-800/15 border-amber-700/40 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold">
                        {isGold ? '🥇' : isSilver ? '🥈' : isBronze ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold flex items-center gap-1.5">
                          <span>{entry.score} / {entry.maxScore} PTS</span>
                          {/* Level Badge */}
                          <span
                            className={`text-[7.5px] px-1 py-0.2 rounded font-bold border ${
                              (entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)) === 3
                                ? 'bg-amber-400/20 text-yellow-300 border-yellow-400/60'
                                : (entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)) === 2
                                ? 'bg-purple-500/20 text-purple-300 border-purple-400/60'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
                            }`}
                          >
                            LV {entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)}
                          </span>
                          {entry.score === 100 && (
                            <span className="text-[8px] bg-yellow-400 text-slate-950 px-1 rounded font-bold">
                              MAX
                            </span>
                          )}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {entry.date} • {entry.timeSpent}s
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {entry.result === 'VICTORY' ? (
                        <span className="flex items-center gap-1 text-[8px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
                          <CheckCircle className="w-3 h-3" /> VICTORY
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900">
                          <XCircle className="w-3 h-3" /> CAUGHT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : tab === 'RECENT' ? (
            <div className="flex flex-col gap-1.5">
              {recentRuns.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 rounded border bg-slate-950/60 border-slate-800 text-[10px] text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[9px] w-5">#{totalRuns - idx}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>{entry.score} / {entry.maxScore} PTS</span>
                        <span
                          className={`text-[7.5px] px-1 py-0.2 rounded font-bold border ${
                            (entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)) === 3
                              ? 'bg-amber-400/20 text-yellow-300 border-yellow-400/60'
                              : (entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)) === 2
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/60'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60'
                          }`}
                        >
                          LV {entry.level || (entry.score < 25 ? 1 : entry.score < 50 ? 2 : 3)}
                        </span>
                      </span>
                      <span className="text-[8px] text-slate-400">
                        {entry.date} • {entry.timeSpent}s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {entry.result === 'VICTORY' ? (
                      <span className="text-[8px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                        VICTORY
                      </span>
                    ) : (
                      <span className="text-[8px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900">
                        DEFEAT
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[8px]">TOTAL GAMES</span>
                <span className="text-sm font-bold text-amber-300">{totalRuns}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[8px]">HIGHEST SCORE</span>
                <span className="text-sm font-bold text-yellow-400">{highestScore} PTS</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[8px]">AVERAGE SCORE</span>
                <span className="text-sm font-bold text-slate-200">{avgScore} PTS</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-slate-400 text-[8px]">HOUSE CUP WINS</span>
                <span className="text-sm font-bold text-emerald-400">{victories}</span>
              </div>
              <div className="col-span-2 p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[8px]">TOTAL TIME PLAYED</span>
                <span className="text-xs font-bold text-slate-200">{totalTime} SECONDS</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {totalRuns > 0 && !showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[9px] text-slate-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR HISTORY</span>
            </button>
          ) : showClearConfirm ? (
            <div className="flex items-center gap-2 text-[9px]">
              <span className="text-red-400 font-bold">RESET ALL?</span>
              <button
                onClick={() => {
                  onClear();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer"
              >
                YES
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] rounded border border-amber-300 cursor-pointer active:scale-95 transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
