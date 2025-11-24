export interface MatchRequest {
  league: string;
  homeTeam: string;
  awayTeam: string;
}

export interface WeatherCondition {
  summary: string;
  temperature: string;
  rainProb: number;
  impact: string; // "High Friction", "Heat Fatigue", etc.
}

export interface SentimentAnalysis {
  homeSupport: number; // 0-100
  awaySupport: number; // 0-100
  overallMood: string;
  trendingTopics: string[];
}

export interface PlayerStatus {
  name: string;
  status: 'Starter' | 'Bench' | 'Injured' | 'Suspended';
  impactDelta: number; // The alpha/beta impact of their presence/absence
}

export interface TeamStats {
  name: string;
  xG_last5: number[];
  ppda_last5: number[]; // Added for trend analysis
  ppda: number; // Pressure metric
  formDecay: number; // The calculated Xi factor
}

export interface BettingRecommendation {
  market: string;
  selection: string;
  odds: number;
  probability: number;
  edge: number; // EV
  kellyFraction: number; // Suggested stake %
  reasoning: string;
}

export interface RefereeInfo {
  name: string;
  cardsPerGame: number;
  strictnessLevel: 'Lenient' | 'Average' | 'Strict';
}

export interface StatPrediction {
  expectedTotal: number;
  home: number;
  away: number;
  reasoning: string;
}

export interface MatchAnalysis {
  matchInfo: {
    date: string;
    stadium: string;
    capacity: number;
    homeFanPercentage: number;
  };
  weather: WeatherCondition;
  referee: RefereeInfo;
  sentiment: SentimentAnalysis;
  homeStats: TeamStats;
  awayStats: TeamStats;
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  predictedScore: {
    home: number;
    away: number;
    confidence: number;
  };
  statPredictions: {
    corners: StatPrediction;
    cards: StatPrediction;
  };
  keyPlayers: {
    home: PlayerStatus[];
    away: PlayerStatus[];
  };
  recommendations: BettingRecommendation[];
  protocolNotes: string; // Explanation of the mathematical model applied
}