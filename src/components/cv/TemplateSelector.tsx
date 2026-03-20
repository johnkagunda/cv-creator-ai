import { TEMPLATES, TemplateId, TemplateInfo } from '@/types/cv';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {TEMPLATES.map((t, i) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`relative p-3 rounded-lg border-2 text-left transition-all duration-200 template-card-enter active:scale-[0.97] ${
            selected === t.id
              ? 'border-primary shadow-card-hover bg-primary/5'
              : 'border-border hover:border-primary/30 hover:shadow-card bg-card'
          }`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {selected === t.id && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
          <div className="w-full h-16 rounded-sm mb-2 opacity-80" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }} />
          <p className="text-xs font-semibold text-foreground">{t.name}</p>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{t.description}</p>
        </button>
      ))}
    </div>
  );
};
