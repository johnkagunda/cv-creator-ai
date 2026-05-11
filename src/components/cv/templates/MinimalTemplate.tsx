import { CVData } from '@/types/cv';
import { formatDateRange } from '@/lib/dateRange';



const skills = (s: string) => s.split(',').map(sk => sk.trim()).filter(Boolean);
const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const MinimalTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '48px 56px', fontSize: '11px', lineHeight: '1.6', color: '#1a1a1a', boxSizing: 'border-box' }}>
    <div style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', marginBottom: '24px', display: 'block' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0, lineHeight: '1.2', display: 'block' }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ marginTop: '8px', fontSize: '11px', color: '#555', display: 'flex', gap: '16px', flexWrap: 'wrap', lineHeight: '1.5' }}>
        {data.email && <span style={{ display: 'inline-block' }}>{data.email}</span>}
        {data.phone && <span style={{ display: 'inline-block' }}>{data.phone}</span>}
      </div>
    </div>

    {data.summary && (
      <section style={{ marginBottom: '20px', display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Summary</h2>
        <p style={{ margin: 0, lineHeight: '1.6', display: 'block' }}>{data.summary}</p>
      </section>
    )}

    {data.skills && (
      <section style={{ marginBottom: '20px', display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Skills</h2>
        <p style={{ margin: 0, lineHeight: '1.6', display: 'block' }}>{data.skills}</p>
      </section>
    )}

    {data.experience.some(e => e.jobTitle) && (
      <section style={{ marginBottom: '20px', display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Experience</h2>
        {data.experience.filter(e => e.jobTitle).map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', lineHeight: '1.5', marginBottom: '2px' }}>
              <strong style={{ display: 'inline-block' }}>{exp.jobTitle}</strong>
              <span style={{ fontSize: '10px', color: '#777', display: 'inline-block', whiteSpace: 'nowrap' }}>
                {formatDateRange(exp.start, exp.end)}
              </span>
            </div>
            <div style={{ color: '#555', fontSize: '10px', lineHeight: '1.5', marginBottom: '4px', display: 'block' }}>{exp.company}</div>
            {exp.description && <p style={{ margin: '4px 0 0', fontSize: '10.5px', lineHeight: '1.6', display: 'block' }}>{exp.description}</p>}
          </div>
        ))}
      </section>
    )}

    {data.education.some(e => e.school) && (
      <section style={{ marginBottom: '20px', display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Education</h2>
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '8px', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', lineHeight: '1.5', marginBottom: '2px' }}>
              <strong style={{ display: 'inline-block' }}>{edu.course}</strong>
              <span style={{ fontSize: '10px', color: '#777', display: 'inline-block', whiteSpace: 'nowrap' }}>
                {formatDateRange(edu.start, edu.end)}
              </span>
            </div>
            <div style={{ color: '#555', fontSize: '10px', lineHeight: '1.5', display: 'block' }}>{edu.school}</div>
          </div>
        ))}
      </section>
    )}

    {data.certifications && (
      <section style={{ marginBottom: '20px', display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Certifications</h2>
        {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0', lineHeight: '1.6', display: 'block' }}>{c}</p>)}
      </section>
    )}

    {data.projects && (
      <section style={{ display: 'block' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', marginTop: 0, lineHeight: '1.4', display: 'block' }}>Projects</h2>
        {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0', lineHeight: '1.6', display: 'block' }}>{p}</p>)}
      </section>
    )}
  </div>
);
