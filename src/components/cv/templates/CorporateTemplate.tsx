import { CVData } from '@/types/cv';

const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const CorporateTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '0', fontSize: '11px', lineHeight: '1.6', color: '#1a1a1a' }}>
    <div style={{ background: '#1e5f8a', color: 'white', padding: '40px 56px 32px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.85, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {data.email && <span>✉ {data.email}</span>}
        {data.phone && <span>☎ {data.phone}</span>}
      </div>
    </div>

    <div style={{ padding: '32px 56px' }}>
      {data.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>PROFESSIONAL SUMMARY</h2>
          <p style={{ margin: 0 }}>{data.summary}</p>
        </section>
      )}

      {data.skills && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>SKILLS</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.skills.split(',').map((s, i) => (
              <span key={i} style={{ background: '#e8f1f7', color: '#1e5f8a', padding: '2px 10px', borderRadius: '3px', fontSize: '10px', fontWeight: 500 }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.experience.some(e => e.jobTitle) && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>WORK EXPERIENCE</h2>
          {data.experience.filter(e => e.jobTitle).map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px' }}>{exp.jobTitle}</strong>
                <span style={{ fontSize: '10px', color: '#1e5f8a', fontWeight: 500 }}>{exp.duration}</span>
              </div>
              <div style={{ color: '#555', fontStyle: 'italic', fontSize: '10.5px' }}>{exp.company}</div>
              {exp.description && <p style={{ margin: '4px 0 0' }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {data.education.some(e => e.school) && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>EDUCATION</h2>
          {data.education.filter(e => e.school).map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{edu.course}</strong>
                <div style={{ color: '#555', fontSize: '10.5px' }}>{edu.school}</div>
              </div>
              <span style={{ fontSize: '10px', color: '#1e5f8a', fontWeight: 500 }}>{edu.year}</span>
            </div>
          ))}
        </section>
      )}

      {data.certifications && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>CERTIFICATIONS</h2>
          {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0' }}>{c}</p>)}
        </section>
      )}

      {data.projects && (
        <section>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1e5f8a', borderBottom: '2px solid #1e5f8a', paddingBottom: '4px', marginBottom: '10px' }}>PROJECTS</h2>
          {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0' }}>{p}</p>)}
        </section>
      )}
    </div>
  </div>
);
