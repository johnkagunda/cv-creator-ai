// NOTE: This service is currently called from the browser (client-side).
// That means any API key here would be exposed to users.
// Fix properly by moving calls to a server endpoint. For now, we require
// VITE_OPENROUTER_API_KEY to be set and the key to be valid.

import type { CVData, WorkExperience, Education } from '@/types/cv';

const API_KEY: string | undefined = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

function getApiKeyOrThrow(): string {
  if (!API_KEY) {
    throw new Error('Missing OpenRouter API key. Set VITE_OPENROUTER_API_KEY in your environment.');
  }
  return API_KEY;
}

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemma-4-31b-it:free';

// Rate limiting configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exponential backoff with jitter
function getRetryDelay(attempt: number): number {
  const exponentialDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
  // Add jitter (±20%)
  const jitter = exponentialDelay * 0.2 * (Math.random() * 2 - 1);
  return Math.max(0, exponentialDelay + jitter);
}

export interface AISuggestion {
  correctedText: string;
  suggestions: string[];
  grammarIssues: string[];
}

export async function getAISuggestions(text: string, context: string): Promise<AISuggestion> {
  if (!text || text.trim().length < 3) {
    return { correctedText: text, suggestions: [], grammarIssues: [] };
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getApiKeyOrThrow()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://openrouter.ai',
          'X-Title': 'CV Creator AI',
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

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(attempt);
        
        console.warn(`Rate limited (429). Attempt ${attempt + 1}/${MAX_RETRIES}. Waiting ${waitTime}ms`);
        
        if (attempt < MAX_RETRIES - 1) {
          await delay(waitTime);
          continue;
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Model "${MODEL}" not found. Please check if it's available on OpenRouter.`);
          throw new Error(`Model "${MODEL}" not available. Please check OpenRouter model list.`);
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

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

      return { correctedText: text, suggestions: [], grammarIssues: [] };
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = getRetryDelay(attempt);
        console.warn(`Request failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  }

  console.error('AI service error after all retries:', lastError);
  return { correctedText: text, suggestions: [], grammarIssues: [] };
}

export async function improveText(text: string, context: string): Promise<string> {
  const result = await getAISuggestions(text, context);
  return result.correctedText;
}

// ---- Helpers ----

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * Safe JSON extractor — tries to find and parse the FIRST complete top-level
 * JSON object in the response.
 */
function safeExtractJson(content: string): unknown {
  const stripped = content.replace(/```json|```/g, '').trim();

  let depth = 0;
  let start = -1;
  let end = -1;

  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (stripped[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        end = i;
        break;
      }
    }
  }

  if (start === -1 || end === -1) return null;

  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch (e) {
    console.error('JSON parse error:', e, '\nRaw:', stripped.slice(start, end + 1));
    return null;
  }
}

/**
 * Deep-merge: keep original non-blank values, fill in AI values only for blank fields.
 */
function mergeOnlyEmpty(original: CVData, suggested: CVData): CVData {
  const result: CVData = { ...original };

  const scalarFields: (keyof CVData)[] = [
    'fullName',
    'email',
    'phone',
    'summary',
    'skills',
    'certifications',
    'projects',
  ];

  for (const field of scalarFields) {
    const orig = original[field] as string;
    const sug = suggested[field] as string;
    if (isBlank(orig) && !isBlank(sug)) {
      (result as unknown as Record<string, unknown>)[field] = sug;
    }
  }

  if (Array.isArray(suggested.experience)) {
    result.experience = original.experience.map((origExp, i) => {
      const sugExp: Partial<WorkExperience> = suggested.experience[i] ?? {};
      return {
        ...origExp,
        jobTitle:
          isBlank(origExp.jobTitle) && !isBlank(sugExp.jobTitle) ? sugExp.jobTitle! : origExp.jobTitle,
        company:
          isBlank(origExp.company) && !isBlank(sugExp.company) ? sugExp.company! : origExp.company,
        start:
          isBlank(origExp.start) && !isBlank(sugExp.start) ? sugExp.start! : origExp.start,
        end: isBlank(origExp.end) && !isBlank(sugExp.end) ? sugExp.end! : origExp.end,
        description:
          isBlank(origExp.description) && !isBlank(sugExp.description) ? sugExp.description! : origExp.description,
      };
    });
  }

  if (Array.isArray(suggested.education)) {
    result.education = original.education.map((origEdu, i) => {
      const sugEdu: Partial<Education> = suggested.education[i] ?? {};
      return {
        ...origEdu,
        school:
          isBlank(origEdu.school) && !isBlank(sugEdu.school) ? sugEdu.school! : origEdu.school,
        course:
          isBlank(origEdu.course) && !isBlank(sugEdu.course) ? sugEdu.course! : origEdu.course,
        start:
          isBlank(origEdu.start) && !isBlank(sugEdu.start) ? sugEdu.start! : origEdu.start,
        end: isBlank(origEdu.end) && !isBlank(sugEdu.end) ? sugEdu.end! : origEdu.end,
      };
    });
  }

  return result;
}

// ---- CV Autofill from Job Description ----

export interface FillCVResult {
  cv: CVData;
}

export async function fillCVFromJobDescription(jobDescription: string, currentCV: CVData): Promise<CVData> {
  const jd = jobDescription?.trim();
  if (!jd || jd.length < 20) return currentCV;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getApiKeyOrThrow()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://openrouter.ai',
          'X-Title': 'CV Creator AI',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert resume writer. ' +
                'Given a job description and a CV (which may be partially filled), ' +
                'return the same CV with ONLY the blank/empty fields filled in based on the job description. ' +
                'Rules: ' +
                '1. NEVER change a field that already has content. ' +
                '2. Do NOT invent personal details like name, email, phone, or dates. Leave them blank if they are empty in the input. ' +
                '3. For "summary": write 2-3 sentences tailored to the job. ' +
                '4. For "skills": extract a comma-separated list of relevant skills from the job description. ' +
                '5. For experience "description": write 2-3 bullet points of relevant responsibilities/achievements. ' +
                '6. Keep the same array lengths and id values for experience and education. ' +
                '7. Return ONLY a raw JSON object — no markdown, no explanation. ' +
                'Output shape: { "cv": { ...complete CVData... } }',
            },
            {
              role: 'user',
              content:
                `JOB DESCRIPTION:\n${jd}\n\n` +
                `CURRENT CV:\n${JSON.stringify(currentCV, null, 2)}\n\n` +
                `Return the filled CV as: { "cv": { ...all fields... } }`,
            },
          ],
          temperature: 0.2,
          max_tokens: 1800,
        }),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(attempt);
        
        console.warn(`Rate limited (429) in fillCV. Attempt ${attempt + 1}/${MAX_RETRIES}. Waiting ${waitTime}ms`);
        
        if (attempt < MAX_RETRIES - 1) {
          await delay(waitTime);
          continue;
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Model "${MODEL}" not found. Please check if it's available on OpenRouter.`);
          throw new Error(`Model "${MODEL}" not available. Please check OpenRouter model list.`);
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        console.log('[fillCV] raw AI response:', data.choices?.[0]?.message?.content);
      }

      const content: string = data.choices?.[0]?.message?.content || '';
      const parsed = safeExtractJson(content) as FillCVResult | null;

      if (parsed?.cv) {
        return mergeOnlyEmpty(currentCV, parsed.cv);
      }

      console.warn('[fillCV] Could not parse AI response. Raw content:', content);
      return currentCV;
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = getRetryDelay(attempt);
        console.warn(`fillCV request failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  }

  console.error('AI service error (fill CV) after all retries:', lastError);
  return currentCV;
}

// ---- Utility to check available models (for debugging) ----

export async function listAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const data = await response.json();
    const gemmaModels = data.data
      .filter((m: any) => m.id.includes('gemma'))
      .map((m: any) => m.id);
    console.log('Available Gemma models:', gemmaModels);
    return gemmaModels;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

// ---- Rate limit status checker ----

export async function checkRateLimitStatus(): Promise<{ remaining: number; limit: number; reset: number } | null> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        Authorization: `Bearer ${getApiKeyOrThrow()}`,
      },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      remaining: data.credits || 0,
      limit: data.limit || 0,
      reset: data.next_reset || Date.now() + 3600000,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return null;
  }
}
