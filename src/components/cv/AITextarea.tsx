import { useState, useCallback, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { getAISuggestions, AISuggestion } from '@/services/aiService';
import { toast } from 'sonner';

interface AITextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  context: string;
  rows?: number;
}

export const AITextarea = ({ value, onChange, placeholder, context, rows = 3 }: AITextareaProps) => {
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    setSuggestion(null);
    setShowSuggestion(false);
  }, [value]);

  const handleImprove = useCallback(async () => {
    if (!value || value.trim().length < 3) {
      toast.error('Please enter some text first');
      return;
    }

    setIsImproving(true);
    try {
      const result = await getAISuggestions(value, context);
      setSuggestion(result);
      setShowSuggestion(true);
      
      if (result.grammarIssues.length > 0) {
        toast.info(`Found ${result.grammarIssues.length} grammar issue(s)`);
      }
    } catch (error) {
      toast.error('Failed to get AI suggestions');
      console.error(error);
    } finally {
      setIsImproving(false);
    }
  }, [value, context]);

  const applySuggestion = useCallback(() => {
    if (suggestion?.correctedText) {
      onChange(suggestion.correctedText);
      toast.success('Applied AI suggestion');
      setShowSuggestion(false);
    }
  }, [suggestion, onChange]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="resize-none"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleImprove}
          disabled={isImproving || !value}
          className="absolute top-2 right-2 h-7 px-2 gap-1"
        >
          {isImproving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          <span className="text-xs">AI Improve</span>
        </Button>
      </div>

      {showSuggestion && suggestion && (
        <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">AI Suggestion:</p>
              <p className="text-sm">{suggestion.correctedText}</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={applySuggestion}
              className="h-7 px-2 gap-1 shrink-0"
            >
              <Check className="w-3 h-3" />
              Apply
            </Button>
          </div>

          {suggestion.grammarIssues.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Grammar Issues:</p>
              <ul className="text-xs space-y-1">
                {suggestion.grammarIssues.map((issue, i) => (
                  <li key={i} className="text-muted-foreground">• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {suggestion.suggestions.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Alternative Suggestions:</p>
              <div className="space-y-1">
                {suggestion.suggestions.map((alt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onChange(alt);
                      toast.success('Applied alternative suggestion');
                      setShowSuggestion(false);
                    }}
                    className="block w-full text-left text-xs p-2 rounded hover:bg-muted transition-colors"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
