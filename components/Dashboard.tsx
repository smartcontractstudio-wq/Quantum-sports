import React from 'react';
import { MatchAnalysis } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Line, Legend, ComposedChart 
} from 'recharts';
import { CloudRain, Wind, Thermometer, Users, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Flag, Copy, CornerUpRight } from 'lucide-react';

interface DashboardProps {
  data: MatchAnalysis;
}

const COLORS = ['#10b981', '#64748b', '#ef4444']; // Win, Draw, Loss (Emerald, Slate, Red)

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  const probData = [
    { name: 'Home Win', value: data.probabilities.homeWin },
    { name: 'Draw', value: data.probabilities.draw },
    { name: 'Away Win', value: data.probabilities.awayWin },
  ];

  const chartData = data.homeStats.xG_last5.map((_, i) => ({
    match: `Match ${i + 1}`,
    [`${data.homeStats.name} (xG)`]: data.homeStats.xG_last5[i],
    [`${data.awayStats.name} (xG)`]: data.awayStats.xG_last5[i],
    [`${data.homeStats.name} (PPDA)`]: data.homeStats.ppda_last5?.[i] || data.homeStats.ppda, // Fallback if trend missing
    [`${data.awayStats.name} (PPDA)`]: data.awayStats.ppda_last5?.[i] || data.awayStats.ppda,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <h1 className="text-9xl font-black text-white">VS</h1>
        </div>
        
        <div className="z-10 text-center md:text-left">
          <div className="text-xs font-mono text-emerald-500 mb-1">STOCHASTIC MODEL OUTPUT</div>
          <h2 className="text-3xl font-bold text-white">{data.homeStats.name} <span className="text-slate-500 text-xl mx-2">vs</span> {data.awayStats.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
            <span>📅 {data.matchInfo.date}</span>
            <span>🏟️ {data.matchInfo.stadium}</span>
            <span>👥 Cap: {data.matchInfo.capacity.toLocaleString()}</span>
          </div>
        </div>

        <div className="z-10 mt-4 md:mt-0 flex gap-4">
            <div className="text-center bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 uppercase">Predicted Score</div>
                <div className="text-4xl font-mono font-bold text-white tracking-widest">
                    {data.predictedScore.home} - {data.predictedScore.away}
                </div>
                <div className="text-xs text-emerald-400 mt-1">Conf: {(data.predictedScore.confidence * 100).toFixed(0)}%</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Environmental & Context */}
        <div className="space-y-6">
            {/* Weather Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-400" /> Environmental Factors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <div className="text-xs text-slate-500">Temperature</div>
                        <div className="text-white font-mono flex items-center gap-2">
                            <Thermometer className="w-4 h-4" /> {data.weather.temperature}
                        </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <div className="text-xs text-slate-500">Precipitation</div>
                        <div className="text-white font-mono flex items-center gap-2">
                            <CloudRain className="w-4 h-4" /> {data.weather.rainProb}%
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded text-sm text-blue-200">
                    <span className="font-bold text-blue-400">Impact:</span> {data.weather.impact}
                </div>
            </div>

             {/* Referee Card */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-yellow-400" /> Officiating
                </h3>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">{data.referee.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                        data.referee.strictnessLevel === 'Strict' ? 'bg-red-900 text-red-200' : 
                        data.referee.strictnessLevel === 'Lenient' ? 'bg-green-900 text-green-200' : 'bg-slate-700 text-slate-200'
                    }`}>
                        {data.referee.strictnessLevel}
                    </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${Math.min(data.referee.cardsPerGame * 20, 100)}%` }}></div>
                </div>
                <div className="text-right text-xs text-slate-500">{data.referee.cardsPerGame} Cards/Game Avg</div>
            </div>

            {/* Set Piece & Discipline Predictions (New) */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Copy className="w-5 h-5 text-purple-400" /> Game Flow & Discipline
                </h3>
                {data.statPredictions && (
                    <div className="space-y-4">
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                             <div className="flex justify-between items-center mb-1">
                                <div className="text-xs text-slate-500 uppercase flex items-center gap-1">
                                    <CornerUpRight className="w-3 h-3" /> Corners
                                </div>
                                <div className="text-emerald-400 font-mono font-bold">{data.statPredictions.corners.expectedTotal}</div>
                             </div>
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>{data.homeStats.name}: {data.statPredictions.corners.home}</span>
                                <span>{data.awayStats.name}: {data.statPredictions.corners.away}</span>
                             </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                             <div className="flex justify-between items-center mb-1">
                                <div className="text-xs text-slate-500 uppercase flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Cards
                                </div>
                                <div className="text-yellow-400 font-mono font-bold">{data.statPredictions.cards.expectedTotal}</div>
                             </div>
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>{data.homeStats.name}: {data.statPredictions.cards.home}</span>
                                <span>{data.awayStats.name}: {data.statPredictions.cards.away}</span>
                             </div>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-2">
                             "{data.statPredictions.corners.reasoning}"
                        </p>
                    </div>
                )}
            </div>

            {/* Sentiment Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" /> Crowd Sentiment
                </h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Home Support</span>
                            <span>{data.sentiment.homeSupport}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${data.sentiment.homeSupport}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Away Support</span>
                            <span>{data.sentiment.awaySupport}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${data.sentiment.awaySupport}%` }}></div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                         <div className="text-xs text-slate-500 uppercase">Trending</div>
                         <div className="flex flex-wrap gap-2 mt-1">
                             {data.sentiment.trendingTopics.slice(0, 3).map((tag, i) => (
                                 <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">#{tag}</span>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Center Column: Core Probabilities & xG */}
        <div className="lg:col-span-2 space-y-6">
            {/* Probability Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[300px]">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Poisson Model Probabilities</h3>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={probData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {probData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        {probData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                    <span className="text-white font-medium">{item.name}</span>
                                </div>
                                <span className="font-mono font-bold text-lg text-white">{(item.value * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* xG & PPDA Trends */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Tactical Trends (Last 5)</h3>
                    <div className="text-xs text-slate-500 space-x-2">
                        <span>Solid: xG (Quality)</span>
                        <span>•</span>
                        <span>Dashed: PPDA (Pressing)</span>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="match" stroke="#64748b" />
                            {/* Left Axis for xG */}
                            <YAxis 
                                yAxisId="left" 
                                stroke="#64748b" 
                                label={{ value: 'xG', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                            />
                            {/* Right Axis for PPDA */}
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#64748b" 
                                label={{ value: 'PPDA', angle: 90, position: 'insideRight', fill: '#94a3b8' }} 
                            />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                            <Legend />
                            
                            {/* Home Team Lines */}
                            <Line 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey={`${data.homeStats.name} (xG)`} 
                                stroke="#3b82f6" 
                                strokeWidth={2} 
                                dot={{ r: 4 }} 
                            />
                            <Line 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey={`${data.homeStats.name} (PPDA)`} 
                                stroke="#60a5fa" 
                                strokeDasharray="4 4" 
                                dot={false}
                            />

                            {/* Away Team Lines */}
                            <Line 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey={`${data.awayStats.name} (xG)`} 
                                stroke="#ef4444" 
                                strokeWidth={2} 
                                dot={{ r: 4 }} 
                            />
                            <Line 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey={`${data.awayStats.name} (PPDA)`} 
                                stroke="#f87171" 
                                strokeDasharray="4 4" 
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>

      {/* Recommendations & Alpha Protocol Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-900/50 rounded-xl p-6">
             <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6" /> Alpha Protocol Bets
             </h3>
             <div className="space-y-4">
                 {data.recommendations.map((rec, i) => (
                     <div key={i} className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                 <div className="text-xs text-slate-400 uppercase tracking-wider">{rec.market}</div>
                                 <div className="text-lg font-bold text-white">{rec.selection}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-emerald-400 font-mono font-bold text-xl">{rec.odds.toFixed(2)}</div>
                                 <div className="text-xs text-slate-500">Implied: {(100/rec.odds).toFixed(1)}%</div>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 text-sm border-t border-slate-800 pt-3 mt-2">
                             <div className="flex items-center gap-1 text-blue-400">
                                 <TrendingUp className="w-4 h-4" />
                                 <span>Edge: +{rec.edge}%</span>
                             </div>
                             <div className="flex items-center gap-1 text-purple-400">
                                 <AlertTriangle className="w-4 h-4" />
                                 <span>Kelly: {rec.kellyFraction}%</span>
                             </div>
                         </div>
                         <p className="text-xs text-slate-400 mt-2 italic">"{rec.reasoning}"</p>
                     </div>
                 ))}
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Protocol Analysis Notes</h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  <p className="whitespace-pre-line leading-relaxed">{data.protocolNotes}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3">Key Player Impact (Delta)</h4>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <div className="text-xs text-blue-400 mb-2">{data.homeStats.name}</div>
                          <ul className="space-y-1">
                              {data.keyPlayers.home.map((p, i) => (
                                  <li key={i} className="flex justify-between text-xs">
                                      <span className={p.status === 'Injured' ? 'text-red-400 line-through' : 'text-slate-300'}>{p.name}</span>
                                      <span className="font-mono text-slate-500">{p.impactDelta > 0 ? '+' : ''}{p.impactDelta}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                          <div className="text-xs text-red-400 mb-2">{data.awayStats.name}</div>
                          <ul className="space-y-1">
                              {data.keyPlayers.away.map((p, i) => (
                                  <li key={i} className="flex justify-between text-xs">
                                      <span className={p.status === 'Injured' ? 'text-red-400 line-through' : 'text-slate-300'}>{p.name}</span>
                                      <span className="font-mono text-slate-500">{p.impactDelta > 0 ? '+' : ''}{p.impactDelta}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;