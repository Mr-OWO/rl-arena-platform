import React from 'react';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  version: string;
  elo: number;
  matches: number;
  winRate: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400">Competitive Leaderboard</span>
          <h3 className="text-lg font-bold text-white">Dynamic Elo Model Standings</h3>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
          K-Factor: 32 · Bradley-Terry Formulation
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-[#1e293b] text-slate-400 font-mono">
            <tr>
              <th className="py-3 px-4 rounded-l">Rank</th>
              <th className="py-3 px-4">Model Architecture</th>
              <th className="py-3 px-4 text-center">Elo Rating</th>
              <th className="py-3 px-4 text-center">Evaluations</th>
              <th className="py-3 px-4 text-right rounded-r">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {entries.map((entry) => (
              <tr key={entry.name} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">#{entry.rank}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{entry.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{entry.version}</div>
                </td>
                <td className="py-3 px-4 text-center font-bold text-emerald-400 font-mono text-base">
                  {entry.elo}
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-400">{entry.matches}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-300">{entry.winRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
