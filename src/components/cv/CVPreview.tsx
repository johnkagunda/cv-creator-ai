import { CVData, TemplateId } from '@/types/cv';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { CardTemplate } from './templates/CardTemplate';
import { ATSTemplate } from './templates/ATSTemplate';
import { forwardRef } from 'react';

interface CVPreviewProps {
  data: CVData;
  template: TemplateId;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data, template }, ref) => {
  const templates: Record<TemplateId, React.FC<{ data: CVData }>> = {
    minimal: MinimalTemplate,
    corporate: CorporateTemplate,
    creative: CreativeTemplate,
    card: CardTemplate,
    ats: ATSTemplate,
  };

  const Template = templates[template];

  return (
    <div ref={ref} className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Template data={data} />
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
