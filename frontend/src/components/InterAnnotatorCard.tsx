import React from 'react';

export const InterAnnotatorCard: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="mb-4">
        <span className="text-xs font-mono uppercase text-indigo-400">Statistical Reliability</span>
        <h3 className="text-lg font-bold text-white">Inter-Annotator Agreement Telemetry</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Cohen's Kappa (Pairwise)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">0.824</div>
          <div className="text-xs text-slate-500 mt-1">Substantial Agreement (0.80 - 1.00)</div>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Fleiss' Kappa (Multi-Rater)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">0.789</div>
          <div className="text-xs text-slate-500 mt-1">Good Multi-Annotator Consensus</div>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Total Validated Judgments</div>
          <div className="text-2xl font-bold font-mono text-indigo-300 mt-1">1,482</div>
          <div className="text-xs text-slate-500 mt-1">Across 18 Benchmark Prompts</div>
        </div>
      </div>
    </div>
  );
};
