import { useState } from 'react';
import { CVData, WorkExperience, Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, User, Briefcase, GraduationCap, Award, FolderOpen } from 'lucide-react';
import { AITextarea } from './AITextarea';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const SectionHeader = ({ icon: Icon, title, delay }: { icon: React.ElementType; title: string; delay: number }) => (
  <div className="flex items-center gap-2 mb-4 cv-section-enter" style={{ animationDelay: `${delay}ms` }}>
    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
  </div>
);

export const CVForm = ({ data, onChange }: CVFormProps) => {
  const update = <K extends keyof CVData>(key: K, value: CVData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const addExperience = () => {
    update('experience', [...data.experience, { id: crypto.randomUUID(), jobTitle: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (id: string) => {
    if (data.experience.length > 1) {
      update('experience', data.experience.filter(e => e.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    update('experience', data.experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEducation = () => {
    update('education', [...data.education, { id: crypto.randomUUID(), school: '', course: '', year: '' }]);
  };

  const removeEducation = (id: string) => {
    if (data.education.length > 1) {
      update('education', data.education.filter(e => e.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    update('education', data.education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-8">
      {/* Personal Info */}
      <section>
        <SectionHeader icon={User} title="Personal Information" delay={0} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Full Name" value={data.fullName} onChange={e => update('fullName', e.target.value)} className="bg-card" />
          <Input placeholder="Email" type="email" value={data.email} onChange={e => update('email', e.target.value)} className="bg-card" />
          <Input placeholder="Phone Number" value={data.phone} onChange={e => update('phone', e.target.value)} className="bg-card md:col-span-2" />
        </div>
      </section>

      {/* Summary */}
      <section>
        <SectionHeader icon={User} title="Professional Summary" delay={80} />
        <AITextarea
          value={data.summary}
          onChange={(value) => update('summary', value)}
          placeholder="Write a brief professional summary..."
          context="Professional summary for a CV/resume"
          rows={4}
        />
      </section>

      {/* Skills */}
      <section>
        <SectionHeader icon={Award} title="Skills" delay={160} />
        <Input
          placeholder="e.g. JavaScript, React, Project Management"
          value={data.skills}
          onChange={e => update('skills', e.target.value)}
          className="bg-card"
        />
      </section>

      {/* Experience */}
      <section>
        <SectionHeader icon={Briefcase} title="Work Experience" delay={240} />
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="relative p-4 rounded-lg border border-border bg-card/50 space-y-3">
              {data.experience.length > 1 && (
                <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input placeholder="Job Title" value={exp.jobTitle} onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)} className="bg-card" />
                <Input placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="bg-card" />
                <Input placeholder="Duration (e.g. 2020–2023)" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} className="bg-card md:col-span-2" />
              </div>
              <AITextarea
                value={exp.description}
                onChange={(value) => updateExperience(exp.id, 'description', value)}
                placeholder="Describe your responsibilities and achievements..."
                context={`Job description for ${exp.jobTitle || 'this position'} at ${exp.company || 'the company'}`}
                rows={3}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExperience} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </Button>
        </div>
      </section>

      {/* Education */}
      <section>
        <SectionHeader icon={GraduationCap} title="Education" delay={320} />
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={edu.id} className="relative p-4 rounded-lg border border-border bg-card/50 space-y-3">
              {data.education.length > 1 && (
                <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                <Input placeholder="School/University" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="bg-card" />
                <Input placeholder="Course/Degree" value={edu.course} onChange={e => updateEducation(edu.id, 'course', e.target.value)} className="bg-card" />
                <Input placeholder="Year" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} className="bg-card" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEducation} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Education
          </Button>
        </div>
      </section>

      {/* Optional */}
      <section>
        <SectionHeader icon={FolderOpen} title="Additional (Optional)" delay={400} />
        <div className="space-y-3">
          <Textarea placeholder="Certifications (one per line)" value={data.certifications} onChange={e => update('certifications', e.target.value)} className="bg-card min-h-[80px] resize-none" />
          <Textarea placeholder="Projects (one per line)" value={data.projects} onChange={e => update('projects', e.target.value)} className="bg-card min-h-[80px] resize-none" />
        </div>
      </section>
    </div>
  );
};
