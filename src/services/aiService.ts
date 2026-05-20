const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b:free';

// Note: This app currently contains the API key client-side.
// For production, move this to a server-side endpoint.

import type { CVData } from '@/types/cv';

export interface AISuggestion {
  correctedText: string;
  suggestions: string[];
  grammarIssues: string[];
}

export async function getAISuggestions(text: string, context: string): Promise<AISuggestion> {
  if (!text || text.trim().length < 3) {
    return {
      correctedText: text,
      suggestions: [],
      grammarIssues: [],
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional CV/resume writing assistant. Provide grammar corrections, improve professional tone, and suggest better phrasing. Return your response in JSON format with: correctedText (the improved version), suggestions (array of alternative phrasings), and grammarIssues (array of grammar problems found).',
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nText to improve: "${text}"\n\nProvide corrections and suggestions in JSON format.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Try to parse JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          correctedText: parsed.correctedText || text,
          suggestions: parsed.suggestions || [],
          grammarIssues: parsed.grammarIssues || [],
        };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    // Fallback: return original text if parsing fails
    return {
      correctedText: text,
      suggestions: [],
      grammarIssues: [],
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      correctedText: text,
      suggestions: [],
      grammarIssues: [],
    };
  }
}

export async function improveText(text: string, context: string): Promise<string> {
  const result = await getAISuggestions(text, context);
  return result.correctedText;
}

// ---- CV Autofill from Job Description ----

export interface FillCVResult {
  cv: CVData;
}

function safeExtractJson(content: string): unknown {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  return JSON.parse(jsonMatch[0]);
}

export async function fillCVFromJobDescription(
  jobDescription: string,
  currentCV: CVData
): Promise<CVData> {
  const jd = jobDescription?.trim();
  if (!jd || jd.length < 20) return currentCV;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert resume writer. Fill the user CV using the provided job description. ' +
              'Return STRICT JSON only (no markdown, no commentary). ' +
              'Output format: { "cv": <CV_DATA> }. ' +
              'Rules: ' +
              '1) Keep any currentCV fields if the job description does not clearly support updating them. ' +
              '2) Prefer matching keywords and responsibilities from the job description. ' +
              '3) Keep date fields (start/end) as YYYY-MM-DD strings or "" for Present, but do not invent dates if missing in currentCV. ' +
              '4) Keep array lengths (experience/education) the same as currentCV unless you are very confident you can improve job fit by rewriting descriptions only. ' +
              '5) Ensure JSON is valid and all CV fields exist.',
          },
          {
            role: 'user',
            content: `Job description:\n${jd}\n\nCurrent CV (may be incomplete):\n${JSON.stringify(
              currentCV
            )}\n\nFill the CV for this job. Return only JSON.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    const parsed = safeExtractJson(content) as FillCVResult | null;
    if (parsed?.cv) return parsed.cv;

    return currentCV;
  } catch (error) {
    console.error('AI service error (fill CV):', error);
    return currentCV;
  }
}

