import { CVData } from '@/types/cv';

const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const ATSTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '48px 56px', fontSize: '11px', lineHeight: '1.7', color: '#222', fontFamily: 'Georgia, serif' }}>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '3px' }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ fontSize: '11px', color: '#555' }}>
        {[data.email, data.phone].filter(Boolean).join(' | ')}
      </div>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '16px 0' }} />

    {data.summary && (
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Professional Summary</h2>
        <p style={{ margin: 0 }}>{data.summary}</p>
      </section>
    )}

    {data.skills && (
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Skills</h2>
        <p style={{ margin: 0 }}>{data.skills}</p>
      </section>
    )}

    {data.experience.some(e => e.jobTitle) && (
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Work Experience</h2>
        {data.experience.filter(e => e.jobTitle).map(exp => (
          <div key={exp.id} style={{ marginBottom: '12px' }}>
            <strong>{exp.jobTitle}</strong> — {exp.company}
            <div style={{ fontSize: '10px', color: '#777', marginBottom: '2px' }}>{exp.duration}</div>
            {exp.description && <p style={{ margin: '2px 0 0' }}>{exp.description}</p>}
          </div>
        ))}
      </section>
    )}

    {data.education.some(e => e.school) && (
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Education</h2>
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '6px' }}>
            <strong>{edu.course}</strong> — {edu.school}, {edu.year}
          </div>
        ))}
      </section>
    )}

    {data.certifications && (
      <section style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Certifications</h2>
        {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0' }}>{c}</p>)}
      </section>
    )}

    {data.projects && (
      <section>
        <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Projects</h2>
        {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0' }}>{p}</p>)}
      </section>
    )}
  </div>
);
