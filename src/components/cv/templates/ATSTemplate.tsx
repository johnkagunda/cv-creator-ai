import { CVData } from '@/types/cv';

const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const ATSTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '48px 56px', fontSize: '11px', lineHeight: '1.7', color: '#222', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }}>
    <div style={{ textAlign: 'center', marginBottom: '20px', display: 'block' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '3px', lineHeight: '1.3', display: 'block' }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.5', display: 'block' }}>
        {[data.email, data.phone].filter(Boolean).join(' | ')}
      </div>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '16px 0', display: 'block' }} />

    {data.summary && (
      <section style={{ marginBottom: '16px', display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Professional Summary</h2>
        <p style={{ margin: 0, lineHeight: '1.7', display: 'block' }}>{data.summary}</p>
      </section>
    )}

    {data.skills && (
      <section style={{ marginBottom: '16px', display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Skills</h2>
        <p style={{ margin: 0, lineHeight: '1.7', display: 'block' }}>{data.skills}</p>
      </section>
    )}

    {data.experience.some(e => e.jobTitle) && (
      <section style={{ marginBottom: '16px', display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Work Experience</h2>
        {data.experience.filter(e => e.jobTitle).map(exp => (
          <div key={exp.id} style={{ marginBottom: '12px', display: 'block' }}>
            <strong style={{ display: 'inline' }}>{exp.jobTitle}</strong> — {exp.company}
            <div style={{ fontSize: '10px', color: '#777', marginBottom: '2px', lineHeight: '1.5', display: 'block' }}>{exp.duration}</div>
            {exp.description && <p style={{ margin: '2px 0 0', lineHeight: '1.7', display: 'block' }}>{exp.description}</p>}
          </div>
        ))}
      </section>
    )}

    {data.education.some(e => e.school) && (
      <section style={{ marginBottom: '16px', display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Education</h2>
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '6px', lineHeight: '1.7', display: 'block' }}>
            <strong style={{ display: 'inline' }}>{edu.course}</strong> — {edu.school}, {edu.year}
          </div>
        ))}
      </section>
    )}

    {data.certifications && (
      <section style={{ marginBottom: '16px', display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Certifications</h2>
        {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0', lineHeight: '1.7', display: 'block' }}>{c}</p>)}
      </section>
    )}

    {data.projects && (
      <section style={{ display: 'block' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Projects</h2>
        {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0', lineHeight: '1.7', display: 'block' }}>{p}</p>)}
      </section>
    )}
  </div>
);
