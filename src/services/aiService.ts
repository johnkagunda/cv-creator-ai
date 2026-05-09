const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b:free';

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
      grammarIssues: []
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional CV/resume writing assistant. Provide grammar corrections, improve professional tone, and suggest better phrasing. Return your response in JSON format with: correctedText (the improved version), suggestions (array of alternative phrasings), and grammarIssues (array of grammar problems found).'
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nText to improve: "${text}"\n\nProvide corrections and suggestions in JSON format.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
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
          grammarIssues: parsed.grammarIssues || []
        };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    // Fallback: return original text if parsing fails
    return {
      correctedText: text,
      suggestions: [],
      grammarIssues: []
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      correctedText: text,
      suggestions: [],
      grammarIssues: []
    };
  }
}

export async function improveText(text: string, context: string): Promise<string> {
  const result = await getAISuggestions(text, context);
  return result.correctedText;
}
