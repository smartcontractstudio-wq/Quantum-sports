import { GoogleGenAI, Type } from "@google/genai";
import { MatchAnalysis, MatchRequest } from "../types";

const ALPHA_PROTOCOL_TEXT = `
EL PROTOCOLO ALFA: Tratado Definitivo sobre Modelado Estocástico...
(Key Principles to Apply):
1. Use Dixon-Coles model with time decay (xi ~ 0.0065) and interaction (rho) for low scores.
2. Input xG (Expected Goals) instead of actual goals for strength calculation.
3. Use PPDA for tactical pressure analysis (cards/corners).
4. Account for "Rating Delta" on key player absence.
5. Use Negative Binomial distribution for corners/cards.
6. Apply Bayesian Hierarchical modeling for Referee strictness.
7. Use Fractional Kelly Criterion for bankroll management.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    matchInfo: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING },
        stadium: { type: Type.STRING },
        capacity: { type: Type.NUMBER },
        homeFanPercentage: { type: Type.NUMBER },
      },
    },
    weather: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        temperature: { type: Type.STRING },
        rainProb: { type: Type.NUMBER },
        impact: { type: Type.STRING },
      },
    },
    referee: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        cardsPerGame: { type: Type.NUMBER },
        strictnessLevel: { type: Type.STRING, enum: ['Lenient', 'Average', 'Strict'] },
      },
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        homeSupport: { type: Type.NUMBER },
        awaySupport: { type: Type.NUMBER },
        overallMood: { type: Type.STRING },
        trendingTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    homeStats: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        xG_last5: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        ppda_last5: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        ppda: { type: Type.NUMBER },
        formDecay: { type: Type.NUMBER },
      },
    },
    awayStats: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        xG_last5: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        ppda_last5: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        ppda: { type: Type.NUMBER },
        formDecay: { type: Type.NUMBER },
      },
    },
    probabilities: {
      type: Type.OBJECT,
      properties: {
        homeWin: { type: Type.NUMBER },
        draw: { type: Type.NUMBER },
        awayWin: { type: Type.NUMBER },
      },
    },
    predictedScore: {
      type: Type.OBJECT,
      properties: {
        home: { type: Type.NUMBER },
        away: { type: Type.NUMBER },
        confidence: { type: Type.NUMBER },
      },
    },
    statPredictions: {
      type: Type.OBJECT,
      properties: {
        corners: {
          type: Type.OBJECT,
          properties: {
             expectedTotal: { type: Type.NUMBER },
             home: { type: Type.NUMBER },
             away: { type: Type.NUMBER },
             reasoning: { type: Type.STRING }
          }
        },
        cards: {
           type: Type.OBJECT,
          properties: {
             expectedTotal: { type: Type.NUMBER },
             home: { type: Type.NUMBER },
             away: { type: Type.NUMBER },
             reasoning: { type: Type.STRING }
          }
        }
      }
    },
    keyPlayers: {
      type: Type.OBJECT,
      properties: {
        home: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              status: { type: Type.STRING },
              impactDelta: { type: Type.NUMBER },
            },
          },
        },
        away: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              status: { type: Type.STRING },
              impactDelta: { type: Type.NUMBER },
            },
          },
        },
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          market: { type: Type.STRING },
          selection: { type: Type.STRING },
          odds: { type: Type.NUMBER },
          probability: { type: Type.NUMBER },
          edge: { type: Type.NUMBER },
          kellyFraction: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
      },
    },
    protocolNotes: { type: Type.STRING },
  },
  required: ['matchInfo', 'weather', 'referee', 'sentiment', 'homeStats', 'awayStats', 'probabilities', 'recommendations', 'statPredictions'],
};

export const analyzeMatch = async (request: MatchRequest): Promise<MatchAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found in environment");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Conduct a deep analytical investigation and predictive modeling for the football match:
    League: ${request.league}
    Home Team: ${request.homeTeam}
    Away Team: ${request.awayTeam}

    PHASE 1: RESEARCH (Use Google Search)
    - Find the latest form (last 10-15 games), injuries, and predicted lineups.
    - Find real-time weather forecast for the match venue and time.
    - Analyze social media/fan sentiment (Twitter/Reddit) for both teams.
    - Identify the referee and their recent card statistics.
    - Find xG (Expected Goals) and PPDA (Passes Per Defensive Action) data for recent matches.
    - CRITICAL: If specific data points (like advanced xG or PPDA) are not publicly available for lower leagues, YOU MUST ESTIMATE them based on standings, recent goal differences, and relative team strength. DO NOT FAIL due to missing data.

    PHASE 2: ALPHA PROTOCOL EXECUTION
    - Apply the 'Alpha Protocol' methodology provided in the system instruction.
    - Use Dixon-Coles with interaction rho.
    - Calculate probabilities based on xG (or estimated strength), not just goals.
    - PREDICT Expected Corners and Cards (Yellow/Red) based on team playstyle (width, pressing intensity) and referee strictness.
    - Estimate PPDA trends (last 5 games). Lower PPDA = High Press. If exact match data unavailable, estimate based on opponent strength and average team PPDA.
    - Determine the 'edge' against standard market odds (estimate standard odds if not found).
    - Calculate Kelly Criterion staking suggestions.

    OUTPUT FORMAT:
    You must output ONLY valid JSON. 
    Do not use markdown code blocks. 
    The JSON must strictly match this schema structure:
    ${JSON.stringify(RESPONSE_SCHEMA, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are the Alpha Protocol Engine. You strictly adhere to the following methodology for sports prediction: ${ALPHA_PROTOCOL_TEXT}. You rely on data, math, and stochastic modeling, ignoring "gut feeling".`,
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema removed to avoid conflicts with googleSearch tool
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential markdown code blocks that Gemini might include
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Isolate the JSON object if there is extra text
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
    }

    return JSON.parse(text) as MatchAnalysis;

  } catch (error) {
    console.error("Analysis Failed:", error);
    throw error;
  }
};