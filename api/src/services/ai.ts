import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Simple safety check for medical questions
const MEDICAL_REGEX = /(diagnos|injur|fractur|ruptur|dosage|medicat|ibuprofen|antibiotic|tendon|sciatica|numbness|sharp pain|shooting pain|swollen|inflamm)/i;

export interface ChatRequest {
  message: string;
  goal?: 'strength' | 'fat-loss' | 'general';
}

export interface ChatResponse {
  type: 'refusal' | 'reply';
  text: string;
}

export async function generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
  // Safety check first
  if (MEDICAL_REGEX.test(request.message)) {
    return {
      type: 'refusal',
      text: "I can't help with diagnosis or treatment. For medical concerns, please consult a licensed professional. I can help with motivation and general training tips that aren't medical.",
    };
  }

  // If no API key, use fallback responses
  if (!OPENAI_API_KEY) {
    return generateFallbackResponse(request.goal || 'general');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a friendly fitness coach. Your role is to provide motivation and general training tips for a fitness app user with a ${request.goal || 'general'} goal. 
            Keep responses concise (2-3 sentences). Never give medical advice. If asked about injuries or medical concerns, refuse politely.`,
          },
          {
            role: 'user',
            content: request.message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0]?.message?.content || 'I couldn\'t generate a response. Try again!';

    return {
      type: 'reply',
      text: content,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to deterministic response if API fails
    return generateFallbackResponse(request.goal || 'general');
  }
}

function generateFallbackResponse(goal: string): ChatResponse {
  const responses: Record<string, string[]> = {
    strength: [
      "Today's focus: quality sets at RPE 7. Leave one good rep in the tank and keep rest to ~120s.",
      "Small jumps win. Add 2.5–5% when all sets felt like RPE ≤7 last week.",
      'Track your lifts consistently. Progressive overload is the key to building strength.',
    ],
    'fat-loss': [
      'Consistency beats intensity: hit your planned days and keep rests tight (60–90s).',
      'Log your session today—short sessions count and keep the habit alive.',
      'Stay in a moderate deficit and prioritize showing up. Adherence > perfection.',
    ],
    general: [
      'Show up for 30 minutes. You\'ll feel better after the first set - start with the warm-up.',
      'Missed a day? Continue where you left off. Progress isn\'t lost - just resume the plan.',
      'Mix strength work with mobility. Balance keeps you healthy long-term.',
    ],
  };

  const pool = responses[goal] || responses.general;
  return {
    type: 'reply',
    text: pool[Math.floor(Math.random() * pool.length)],
  };
}
