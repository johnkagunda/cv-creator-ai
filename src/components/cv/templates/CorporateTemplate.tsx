import { CVData } from '@/types/cv';
import { formatDateRange } from '@/lib/dateRange';



const lines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean);

export const CorporateTemplate = ({ data }: { data: CVData }) => (
  <div style={{ 
    padding: '0', 
    fontSize: '11px', 
    lineHeight: '1.6', 
    color: '#1a1a1a', 
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    WebkitFontSmoothing: 'antialiased'
  }}>
    <div style={{ 
      background: '#1e5f8a', 
      backgroundColor: '#1e5f8a',
      color: 'white', 
      padding: '40px 56px 32px', 
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <h1 style={{ 
        fontSize: '30px', 
        fontWeight: 700, 
        margin: '0', 
        marginTop: '0',
        marginBottom: '0',
        lineHeight: '1.3', 
        letterSpacing: '0px', 
        display: 'block',
        color: 'white',
        padding: '0'
      }}>
        {data.fullName || 'Your Name'}
      </h1>
      <div style={{ 
        marginTop: '12px', 
        fontSize: '11px', 
        opacity: 0.9, 
        display: 'block',
        lineHeight: '1.8',
        color: 'white'
      }}>
        {data.email && <span style={{ display: 'inline', marginRight: '16px' }}>✉ {data.email}</span>}
        {data.phone && <span style={{ display: 'inline' }}>☎ {data.phone}</span>}
      </div>
    </div>

    <div style={{ padding: '32px 56px', boxSizing: 'border-box', width: '100%' }}>
      {data.summary && (
        <section style={{ marginBottom: '24px', display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>PROFESSIONAL SUMMARY</h2>
          <p style={{ 
            margin: '0', 
            marginTop: '0',
            marginBottom: '0',
            lineHeight: '1.7', 
            display: 'block',
            fontSize: '11px'
          }}>{data.summary}</p>
        </section>
      )}

      {data.skills && (
        <section style={{ marginBottom: '24px', display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>SKILLS</h2>
          <div style={{ display: 'block', lineHeight: '1.8' }}>
            {data.skills.split(',').map((s, i) => (
              <span key={i} style={{ 
                background: '#e8f1f7', 
                backgroundColor: '#e8f1f7',
                color: '#1e5f8a', 
                padding: '4px 12px', 
                borderRadius: '3px', 
                fontSize: '10px', 
                fontWeight: 500, 
                display: 'inline-block', 
                lineHeight: '1.5',
                marginRight: '6px',
                marginBottom: '6px'
              }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.experience.some(e => e.jobTitle) && (
        <section style={{ marginBottom: '24px', display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>WORK EXPERIENCE</h2>
          {data.experience.filter(e => e.jobTitle).map(exp => (
            <div key={exp.id} style={{ marginBottom: '18px', display: 'block', clear: 'both' }}>
              <div style={{ display: 'block', marginBottom: '4px' }}>
                <strong style={{ fontSize: '12px', display: 'block', lineHeight: '1.5', marginBottom: '2px' }}>{exp.jobTitle}</strong>
                <div style={{ fontSize: '10px', color: '#1e5f8a', fontWeight: 500, display: 'block', lineHeight: '1.5' }}>
                {formatDateRange(exp.start, exp.end)}
                </div>
              </div>
              <div style={{ color: '#555', fontStyle: 'italic', fontSize: '10.5px', lineHeight: '1.6', marginBottom: '6px', display: 'block' }}>{exp.company}</div>
              {exp.description && <p style={{ margin: '0', marginTop: '6px', lineHeight: '1.7', display: 'block', fontSize: '11px' }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {data.education.some(e => e.school) && (
        <section style={{ marginBottom: '24px', display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>EDUCATION</h2>
          {data.education.filter(e => e.school).map(edu => (
            <div key={edu.id} style={{ marginBottom: '12px', display: 'block', clear: 'both' }}>
              <div style={{ display: 'block' }}>
                <strong style={{ display: 'block', marginBottom: '4px', lineHeight: '1.5', fontSize: '11px' }}>{edu.course}</strong>
                <div style={{ color: '#555', fontSize: '10.5px', lineHeight: '1.6', display: 'block', marginBottom: '2px' }}>{edu.school}</div>
                <div style={{ fontSize: '10px', color: '#1e5f8a', fontWeight: 500, display: 'block', lineHeight: '1.5' }}>
                  {formatDateRange(edu.start, edu.end)}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {data.certifications && (
        <section style={{ marginBottom: '24px', display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>CERTIFICATIONS</h2>
          {lines(data.certifications).map((c, i) => <p key={i} style={{ margin: '0', marginBottom: '4px', lineHeight: '1.7', display: 'block', fontSize: '11px' }}>{c}</p>)}
        </section>
      )}

      {data.projects && (
        <section style={{ display: 'block', clear: 'both' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: 700, 
            color: '#1e5f8a', 
            borderBottom: '2px solid #1e5f8a', 
            paddingBottom: '6px', 
            marginBottom: '12px', 
            marginTop: '0', 
            lineHeight: '1.5', 
            letterSpacing: '0.5px', 
            display: 'block',
            textTransform: 'uppercase'
          }}>PROJECTS</h2>
          {lines(data.projects).map((p, i) => <p key={i} style={{ margin: '0', marginBottom: '4px', lineHeight: '1.7', display: 'block', fontSize: '11px' }}>{p}</p>)}
        </section>
      )}
    </div>
  </div>
);
