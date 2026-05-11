import { CVData } from '@/types/cv';
import { formatDateRange } from '@/lib/dateRange';



const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: '#fafafa', borderRadius: '8px', padding: '18px 20px', marginBottom: '12px' }}>
    <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#8a5a1e', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{title}</h2>
    {children}
  </div>
);

export const CardTemplate = ({ data }: { data: CVData }) => (
  <div style={{ padding: '40px 48px', fontSize: '11px', lineHeight: '1.6', color: '#1a1a1a' }}>
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #8a5a1e, #c9923e)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 700 }}>
        {(data.fullName || 'U')[0].toUpperCase()}
      </div>
      <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>{data.fullName || 'Your Name'}</h1>
      <div style={{ color: '#888', fontSize: '11px', marginTop: '6px' }}>
        {[data.email, data.phone].filter(Boolean).join(' · ')}
      </div>
    </div>

    {data.summary && <Card title="Summary"><p style={{ margin: 0 }}>{data.summary}</p></Card>}

    {data.skills && (
      <Card title="Skills">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {data.skills.split(',').map((s, i) => (
            <span key={i} style={{ background: '#f0e6d6', color: '#8a5a1e', padding: '3px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: 500 }}>
              {s.trim()}
            </span>
          ))}
        </div>
      </Card>
    )}

    {data.experience.some(e => e.jobTitle) && (
      <Card title="Experience">
        {data.experience.filter(e => e.jobTitle).map(exp => (
          <div key={exp.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{exp.jobTitle}</strong>
              <span style={{ fontSize: '10px', color: '#8a5a1e' }}>
                {formatDateRange(exp.start, exp.end)}
              </span>
            </div>
            <div style={{ color: '#777', fontSize: '10.5px' }}>{exp.company}</div>
            {exp.description && <p style={{ margin: '4px 0 0', fontSize: '10.5px' }}>{exp.description}</p>}
          </div>
        ))}
      </Card>
    )}

    {data.education.some(e => e.school) && (
      <Card title="Education">
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <div><strong>{edu.course}</strong> <span style={{ color: '#777' }}>— {edu.school}</span></div>
            <span style={{ fontSize: '10px', color: '#8a5a1e' }}>
              {formatDateRange(edu.start, edu.end)}
            </span>
          </div>
        ))}
      </Card>
    )}

    {data.certifications && <Card title="Certifications">{lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '2px 0' }}>{c}</p>)}</Card>}
    {data.projects && <Card title="Projects">{lines(data.projects).map((p, i) => <p key={i} style={{ margin: '2px 0' }}>{p}</p>)}</Card>}
  </div>
);
