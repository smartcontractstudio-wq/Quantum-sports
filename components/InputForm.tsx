import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MatchRequest } from '../types';

interface InputFormProps {
  onAnalyze: (data: MatchRequest) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [league, setLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (league && homeTeam && awayTeam) {
      onAnalyze({ league, homeTeam, awayTeam });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Alpha Protocol <span className="text-emerald-400">Initialize</span></h2>
        <p className="text-slate-400">Enter match parameters to begin stochastic modeling and deep web inference.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-emerald-500 uppercase tracking-wider">Target League</label>
          <input
            type="text"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            placeholder="e.g. Premier League"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-blue-400 uppercase tracking-wider">Home Squad</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="e.g. Arsenal"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-red-400 uppercase tracking-wider">Away Squad</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder="e.g. Liverpool"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            required
          />
        </div>
        
        <div className="md:col-span-3 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-900/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Running Alpha Protocol...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Execute Deep Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
