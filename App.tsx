import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import { MatchRequest, MatchAnalysis } from './types';
import { analyzeMatch } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (request: MatchRequest) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await analyzeMatch(request);
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during the Alpha Protocol execution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500 selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              α
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Alpha<span className="text-slate-500">Protocol</span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden md:block">
            V 2.5 STOCHASTIC ENGINE
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
             <InputForm onAnalyze={handleAnalyze} isLoading={loading} />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center max-w-3xl">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    <h3 className="text-emerald-400 font-bold mb-1">Bayesian Inference</h3>
                    <p className="text-xs text-slate-500">Refining probabilities using prior distributions and real-time likelihoods.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    <h3 className="text-blue-400 font-bold mb-1">Dixon-Coles</h3>
                    <p className="text-xs text-slate-500">Correcting for low-scoring match dependencies and draw probabilities.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    <h3 className="text-purple-400 font-bold mb-1">Kelly Criterion</h3>
                    <p className="text-xs text-slate-500">Optimized bankroll growth through calculated fractional staking.</p>
                </div>
             </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-800 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-emerald-500 animate-pulse">
                PROCESSING
              </div>
            </div>
            <div className="text-slate-400 font-mono text-sm">
                Fetching Data • Calculating xG • Simulating Outcomes
            </div>
          </div>
        )}

        {error && (
            <div className="max-w-2xl mx-auto bg-red-950/30 border border-red-900/50 rounded-lg p-6 text-center animate-fade-in">
                <h3 className="text-red-400 font-bold mb-2">Protocol Error</h3>
                <p className="text-red-200/70 mb-4">{error}</p>
                <button 
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-white transition-colors"
                >
                    Reset System
                </button>
            </div>
        )}

        {data && <Dashboard data={data} />}
      </main>
      
      <footer className="border-t border-slate-900 mt-auto py-8 text-center">
          <p className="text-xs text-slate-600">
              © 2024 Alpha Protocol Analytics. Institutional Grade Sports Modeling.
              <br/>
              <span className="opacity-50">Usage implies acceptance of risk. Past performance (xG) is not indicative of future results.</span>
          </p>
      </footer>
    </div>
  );
};

export default App;
