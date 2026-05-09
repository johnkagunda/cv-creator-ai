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
    <div 
      ref={ref} 
      className="bg-white text-black" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        fontFamily: 'Inter, Arial, sans-serif',
        letterSpacing: 'normal',
        wordSpacing: 'normal',
        lineHeight: 'normal',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
    >
      <style>{`
        .bg-white * {
          box-sizing: border-box;
        }
        .bg-white h1, .bg-white h2, .bg-white h3, .bg-white h4, .bg-white h5, .bg-white h6 {
          font-weight: inherit;
          line-height: inherit;
          margin: 0;
          padding: 0;
        }
        .bg-white p {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <Template data={data} />
    </div>
  );
});

CVPreview.displayName = 'CVPreview';
