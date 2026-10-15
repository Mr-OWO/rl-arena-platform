import React, { useState } from 'react';

interface SplitArenaProps {
  onEvaluationComplete: (result: { winner: string; newEloA: number; newEloB: number }) => void;
}

export const SplitArena: React.FC<SplitArenaProps> = ({ onEvaluationComplete }) => {
  const [modelARating, setModelARating] = useState({ helpfulness: 4, correctness: 5, verbosity: 3 });
  const [modelBRating, setModelBRating] = useState({ helpfulness: 3, correctness: 3, verbosity: 4 });
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const promptText = "Implement an async rate-limited worker pool in Python using asyncio.Semaphore.";

  const codeA = `import asyncio

class WorkerPool:
    def __init__(self, limit: int = 10):
        self.sem = asyncio.Semaphore(limit)

    async def run(self, fn, *args):
        async with self.sem:
            return await fn(*args)`;

  const codeB = `import asyncio, time

# Simple worker without semaphore
async def run_worker(tasks):
    results = []
    for t in tasks:
        results.append(await t())
    return results`;

  const handleSubmit = (choice: 'model_a' | 'model_b' | 'tie') => {
    setIsSubmitting(true);
    // Dynamic client calculation
    const rA = 1240;
    const rB = 1185;
    const scoreA = choice === 'model_a' ? 1.0 : choice === 'model_b' ? 0.0 : 0.5;
    const expA = 1.0 / (1.0 + Math.pow(10, (rB - rA) / 400));
    const k = 32;
    const newA = Math.round(rA + k * (scoreA - expA));
    const newB = Math.round(rB + k * ((1 - scoreA) - (1 - expA)));

    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback(`Evaluation recorded! Elo updated: Model Alpha (${rA} -> ${newA}) | Model Beta (${rB} -> ${newB})`);
      onEvaluationComplete({ winner: choice, newEloA: newA, newEloB: newB });
    }, 400);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="mb-4">
        <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">Current Evaluation Prompt</span>
        <h3 className="text-base font-semibold text-white mt-1 bg-[#1e293b] p-3 rounded-lg border border-slate-700">
          "{promptText}"
        </h3>
      </div>

      {/* Split Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Model A Pane */}
        <div className="bg-[#0f172a] border border-cyan-900/40 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-cyan-300">Model Alpha (OmniReason-70B)</span>
              <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">Current Elo: 1240</span>
            </div>
            <pre className="bg-[#030712] p-4 rounded text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 mb-4">
              <code>{codeA}</code>
            </pre>
          </div>

          <div className="space-y-3 bg-[#1e293b]/60 p-3 rounded border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Rubric Sliders (Model Alpha):</span>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Correctness: {modelARating.correctness}/5</span>
              <input type="range" min="1" max="5" value={modelARating.correctness}
                onChange={e => setModelARating({...modelARating, correctness: +e.target.value})} className="accent-cyan-500 w-32" />
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Helpfulness: {modelARating.helpfulness}/5</span>
              <input type="range" min="1" max="5" value={modelARating.helpfulness}
                onChange={e => setModelARating({...modelARating, helpfulness: +e.target.value})} className="accent-cyan-500 w-32" />
            </div>
          </div>
        </div>

        {/* Model B Pane */}
        <div className="bg-[#0f172a] border border-indigo-900/40 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-indigo-300">Model Beta (NexusInstruct-33B)</span>
              <span className="text-xs bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded">Current Elo: 1185</span>
            </div>
            <pre className="bg-[#030712] p-4 rounded text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-800 mb-4">
              <code>{codeB}</code>
            </pre>
          </div>

          <div className="space-y-3 bg-[#1e293b]/60 p-3 rounded border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Rubric Sliders (Model Beta):</span>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Correctness: {modelBRating.correctness}/5</span>
              <input type="range" min="1" max="5" value={modelBRating.correctness}
                onChange={e => setModelBRating({...modelBRating, correctness: +e.target.value})} className="accent-indigo-500 w-32" />
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Helpfulness: {modelBRating.helpfulness}/5</span>
              <input type="range" min="1" max="5" value={modelBRating.helpfulness}
                onChange={e => setModelBRating({...modelBRating, helpfulness: +e.target.value})} className="accent-indigo-500 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Rationale & Action Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Expert Technical Rationale (Chain of Thought)</label>
          <textarea
            value={rationale}
            onChange={e => setRationale(e.target.value)}
            placeholder="Explain why one model was preferred (e.g. strict semaphore bounds, absence of race conditions, clean typing)..."
            className="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 h-20"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('model_a')}
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition shadow-lg shadow-cyan-900/30"
            >
              👈 Model A is Better
            </button>
            <button
              onClick={() => handleSubmit('tie')}
              disabled={isSubmitting}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition"
            >
              🤝 Tie / Equal Quality
            </button>
            <button
              onClick={() => handleSubmit('model_b')}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition shadow-lg shadow-indigo-900/30"
            >
              Model B is Better 👉
            </button>
          </div>
          {feedback && <span className="text-xs text-emerald-400 font-mono animate-fade-in">{feedback}</span>}
        </div>
      </div>
    </div>
  );
};
