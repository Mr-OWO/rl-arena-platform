import React, { useState } from 'react';
import { SplitArena } from './components/SplitArena';
import { LeaderboardTable, LeaderboardEntry } from './components/LeaderboardTable';
import { InterAnnotatorCard } from './components/InterAnnotatorCard';

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'OmniReason-70B', version: 'v2.1', elo: 1240, matches: 84, winRate: '64.3%' },
  { rank: 2, name: 'AetherCode-14B', version: 'v3.0', elo: 1215, matches: 65, winRate: '63.1%' },
  { rank: 3, name: 'NexusInstruct-33B', version: 'v1.4', elo: 1185, matches: 78, winRate: '48.7%' },
];

export const App: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  const handleEvaluationComplete = (res: { winner: string; newEloA: number; newEloB: number }) => {
    setLeaderboard(prev => {
      const updated = prev.map(entry => {
        if (entry.name === 'OmniReason-70B') {
          return { ...entry, elo: res.newEloA, matches: entry.matches + 1 };
        }
        if (entry.name === 'NexusInstruct-33B') {
          return { ...entry, elo: res.newEloB, matches: entry.matches + 1 };
        }
        return entry;
      });
      return updated.sort((a, b) => b.elo - a.elo).map((item, idx) => ({ ...item, rank: idx + 1 }));
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">Live RLHF Evaluation Environment</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">RL-Arena Platform</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            High-throughput Human & AI Preference Arena with dynamic Elo calculation, Fleiss'/Cohen's Kappa agreement tracking, and real-time leaderboard aggregation.
          </p>
        </div>
        <div className="bg-[#1e293b] text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
          Engineered by Wisdom Ogechi Owabor
        </div>
      </div>

      {/* Split Comparison Arena */}
      <SplitArena onEvaluationComplete={handleEvaluationComplete} />

      {/* Grid of Leaderboard & Kappa Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LeaderboardTable entries={leaderboard} />
        </div>
        <div>
          <InterAnnotatorCard />
        </div>
      </div>
    </div>
  );
};

export default App;
