import { CVData } from '@/types/cv';

const skills = (s: string) => s.split(',').map(sk => sk.trim()).filter(Boolean);
const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const MinimalTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '48px 56px', fontSize: '11px', lineHeight: '1.6', color: '#1a1a1a' }}>
    <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', marginBottom: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0, lineHeight: 1.1 }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#555', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
      </div>
    </div>

    {data.summary && (
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Summary</h2>
        <p style={{ margin: 0 }}>{data.summary}</p>
      </section>
    )}

    {data.skills && (
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Skills</h2>
        <p style={{ margin: 0 }}>{data.skills}</p>
      </section>
    )}

    {data.experience.some(e => e.jobTitle) && (
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Experience</h2>
        {data.experience.filter(e => e.jobTitle).map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>{exp.jobTitle}</strong>
              <span style={{ fontSize: '10px', color: '#777' }}>{exp.duration}</span>
            </div>
            <div style={{ color: '#555', fontSize: '10px' }}>{exp.company}</div>
            {exp.description && <p style={{ margin: '4px 0 0', fontSize: '10.5px' }}>{exp.description}</p>}
          </div>
        ))}
      </section>
    )}

    {data.education.some(e => e.school) && (
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Education</h2>
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{edu.course}</strong>
              <span style={{ fontSize: '10px', color: '#777' }}>{edu.year}</span>
            </div>
            <div style={{ color: '#555', fontSize: '10px' }}>{edu.school}</div>
          </div>
        ))}
      </section>
    )}

    {data.certifications && (
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Certifications</h2>
        {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0' }}>{c}</p>)}
      </section>
    )}

    {data.projects && (
      <section>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Projects</h2>
        {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0' }}>{p}</p>)}
      </section>
    )}
  </div>
);
