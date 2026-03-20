export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  course: string;
  year: string;
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  experience: WorkExperience[];
  education: Education[];
  certifications: string;
  projects: string;
}

export type TemplateId = 'minimal' | 'corporate' | 'creative' | 'card' | 'ats';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}

export const TEMPLATES: TemplateInfo[] = [
  { id: 'minimal', name: 'Minimal', description: 'Clean black & white design', color: '#1a1a1a' },
  { id: 'corporate', name: 'Corporate', description: 'Professional blue accents', color: '#1e5f8a' },
  { id: 'creative', name: 'Creative', description: 'Colorful sidebar layout', color: '#2d6a5a' },
  { id: 'card', name: 'Modern Card', description: 'Card-based sections', color: '#8a5a1e' },
  { id: 'ats', name: 'ATS-Friendly', description: 'Simple, no graphics', color: '#4a4a4a' },
];

export const emptyCVData: CVData = {
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: '',
  experience: [{ id: '1', jobTitle: '', company: '', duration: '', description: '' }],
  education: [{ id: '1', school: '', course: '', year: '' }],
  certifications: '',
  projects: '',
};
