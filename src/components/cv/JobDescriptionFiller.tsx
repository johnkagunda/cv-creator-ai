import { useCallback, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { CVData } from '@/types/cv';
import { fillCVFromJobDescription } from '@/services/aiService';

interface JobDescriptionFillerProps {
  currentCV: CVData;
  onFilled: (nextCV: CVData) => void;
}

export const JobDescriptionFiller = ({ currentCV, onFilled }: JobDescriptionFillerProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isFilling, setIsFilling] = useState(false);

  const handleFill = useCallback(async () => {
    const jd = jobDescription.trim();
    if (jd.length < 20) {
      toast.error('Paste the job description first (at least a few sentences).');
      return;
    }

    setIsFilling(true);
    try {
      const next = await fillCVFromJobDescription(jd, currentCV);
      onFilled(next);
      toast.success('CV filled from job description');
    } catch (e) {
      console.error(e);
      toast.error('Failed to fill CV from job description');
    } finally {
      setIsFilling(false);
    }
  }, [currentCV, jobDescription, onFilled]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Job Description → Fill CV</h3>
        <Button onClick={handleFill} disabled={isFilling} className="gap-1.5">
          {isFilling ? 'Matching...' : 'Match & Fill CV'}
        </Button>
      </div>

      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="bg-card min-h-[160px] resize-none"
      />
    </section>
  );
};

