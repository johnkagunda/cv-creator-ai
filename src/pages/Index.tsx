import { useState, useRef, useCallback } from 'react';
import { CVData, TemplateId, emptyCVData } from '@/types/cv';
import { CVForm } from '@/components/cv/CVForm';
import { CVPreview } from '@/components/cv/CVPreview';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, PenLine } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const Index = () => {
  const [cvData, setCvData] = useState<CVData>(emptyCVData);
  const [template, setTemplate] = useState<TemplateId>('minimal');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useCallback(async () => {
    if (!pdfPreviewRef.current) return;
    setDownloading(true);
    
    try {
      const canvas = await html2canvas(pdfPreviewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        letterRendering: true,
      });


      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.fullName || 'cv'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [cvData.fullName]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border no-print">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">ResumeForge</span>
          </div>
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Template Selector */}
        <section className="mb-6 no-print cv-section-enter">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Choose Template</h2>
          <TemplateSelector selected={template} onSelect={setTemplate} />
        </section>

        {/* Mobile Tab Toggle */}
        <div className="flex lg:hidden mb-4 bg-muted rounded-lg p-1 no-print">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'edit' ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground'}`}
          >
            <PenLine className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className={`${activeTab === 'preview' ? 'hidden lg:block' : ''} no-print`}>
            <div className="bg-card rounded-xl shadow-card p-5 sm:p-6">
              <CVForm data={cvData} onChange={setCvData} />
            </div>
          </div>

          {/* Preview */}
          <div className={`${activeTab === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-20">
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="overflow-auto max-h-[80vh]" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', width: '153.8%' }} data-preview-container>
                  <CVPreview ref={previewRef} data={cvData} template={template} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden full-scale preview for PDF generation */}
    <div style={{ position: 'absolute', left: 0, top: 0, width: '210mm', minHeight: '297mm', overflow: 'hidden', background: '#fff' }} aria-hidden="true">
        <CVPreview ref={pdfPreviewRef} data={cvData} template={template} />
      </div>

    </div>
  );
};

export default Index;
