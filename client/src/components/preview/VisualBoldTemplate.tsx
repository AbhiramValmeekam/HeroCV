import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const VisualBoldTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: 0, color: '#1e293b', backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Bold Banner */}
      <div style={{ backgroundColor: '#1e1b4b', color: '#ffffff', padding: '20mm 16mm', textAlign: 'left' }}>
        <h1 style={{ fontSize: '26pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '12pt', color: '#a5b4fc', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', marginBottom: '14px' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', fontSize: '9pt', color: '#c7d2fe' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      <div style={{ padding: '16mm 16mm', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {summary && (
          <div>
            <p style={{ fontSize: '10pt', lineHeight: 1.6, color: '#334155' }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3px solid #1e1b4b', paddingBottom: '3px', marginBottom: '12px' }}>Professional Background</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '45mm', flexShrink: 0, fontSize: '9pt', color: '#64748b', fontWeight: 600 }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', margin: 0 }}>{exp.position}</h3>
                    <p style={{ fontSize: '9pt', color: '#6366f1', fontWeight: 600, margin: '2px 0 4px 0' }}>{exp.company} · {exp.location}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        {exp.bullets.filter(Boolean).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '9pt', color: '#475569', marginBottom: '2.5px' }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3px solid #1e1b4b', paddingBottom: '3px', marginBottom: '10px' }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '45mm', flexShrink: 0, fontSize: '9pt', color: '#64748b', fontWeight: 600 }}>
                    {edu.startDate} – {edu.endDate}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a', margin: 0 }}>{edu.degree} in {edu.field}</h3>
                    <p style={{ fontSize: '9pt', color: '#64748b', margin: '2px 0' }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '3px solid #1e1b4b', paddingBottom: '3px', marginBottom: '10px' }}>Capabilities</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.flatMap(s => s.items).map((skill, index) => (
                <span key={index} style={{ fontSize: '8.5pt', padding: '3px 10px', backgroundColor: '#f1f5f9', color: '#1e1b4b', borderRadius: '4px', fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualBoldTemplate;
