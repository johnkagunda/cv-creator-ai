import { CVData } from '@/types/cv';

const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const CreativeTemplate = ({ data }: { data: CVData }) => (
  <div style={{ display: 'flex', fontSize: '11px', lineHeight: '1.6', color: '#1a1a1a', minHeight: '100%' }}>
    {/* Sidebar */}
    <div style={{ width: '35%', background: '#2d6a5a', color: 'white', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.15 }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '28px' }}>
        {data.email && <div>{data.email}</div>}
        {data.phone && <div>{data.phone}</div>}
      </div>

      {data.skills && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', opacity: 0.7 }}>Skills</h3>
          {data.skills.split(',').map((s, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '10.5px' }}>{s.trim()}</span>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginTop: '3px' }}>
                <div style={{ height: '100%', width: `${70 + Math.random() * 30}%`, background: 'rgba(255,255,255,0.6)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.education.some(e => e.school) && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', opacity: 0.7 }}>Education</h3>
          {data.education.filter(e => e.school).map(edu => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
              <strong style={{ fontSize: '10.5px' }}>{edu.course}</strong>
              <div style={{ fontSize: '9.5px', opacity: 0.75 }}>{edu.school}</div>
              <div style={{ fontSize: '9px', opacity: 0.6 }}>{edu.year}</div>
            </div>
          ))}
        </div>
      )}

      {data.certifications && (
        <div>
          <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', opacity: 0.7 }}>Certifications</h3>
          {lines(data.certifications).map((c, i) => <div key={i} style={{ fontSize: '10px', marginBottom: '4px' }}>{c}</div>)}
        </div>
      )}
    </div>

    {/* Main */}
    <div style={{ width: '65%', padding: '40px 36px' }}>
      {data.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#2d6a5a', marginBottom: '8px' }}>About Me</h2>
          <p style={{ margin: 0, color: '#444' }}>{data.summary}</p>
        </section>
      )}

      {data.experience.some(e => e.jobTitle) && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#2d6a5a', marginBottom: '12px' }}>Experience</h2>
          {data.experience.filter(e => e.jobTitle).map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '14px', borderLeft: '3px solid #2d6a5a' }}>
              <strong style={{ fontSize: '12px' }}>{exp.jobTitle}</strong>
              <div style={{ fontSize: '10.5px', color: '#2d6a5a', fontWeight: 500 }}>{exp.company} · {exp.duration}</div>
              {exp.description && <p style={{ margin: '4px 0 0', color: '#555' }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {data.projects && (
        <section>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#2d6a5a', marginBottom: '8px' }}>Projects</h2>
          {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0', color: '#444' }}>{p}</p>)}
        </section>
      )}
    </div>
  </div>
);
