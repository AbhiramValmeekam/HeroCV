import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const InfographicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: '20mm', color: '#2d3748', backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Nice clean infographic top header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #059669', paddingBottom: '14px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24pt', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <div style={{ display: 'inline-block', fontSize: '9pt', padding: '3px 10px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {personalInfo.jobTitle}
            </div>
          )}
        </div>
        <div style={{ fontSize: '8.5pt', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'right' }}>
          {personalInfo.email && <span>email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
          {personalInfo.location && <span>loc: {personalInfo.location}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Left side column */}
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {summary && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Profile Summary</h2>
              <p style={{ fontSize: '9.5pt', lineHeight: 1.5, color: '#4a5568' }}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Career Highlights</h2>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingLeft: '14px', borderLeft: '2px solid #34d399' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10pt', color: '#1a202c' }}>
                    <span>{exp.position}</span>
                    <span style={{ fontSize: '8.5pt', color: '#059669' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '9pt', color: '#718096', fontWeight: 600, margin: '2px 0' }}>{exp.company}</div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ paddingLeft: '14px', marginTop: '4px', listStyleType: 'circle' }}>
                      {exp.bullets.filter(Boolean).map((b, bi) => (
                        <li key={bi} style={{ fontSize: '9pt', color: '#4a5568', marginBottom: '2px' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {skills.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Skill Matrix</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map((cat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '8.5pt', fontWeight: 700, color: '#4a5568', marginBottom: '2px' }}>{cat.category}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {cat.items.map((skill, si) => (
                        <span key={si} style={{ fontSize: '8pt', padding: '2px 8px', backgroundColor: '#f0fdf4', color: '#047857', borderRadius: '4px', border: '1px solid #d1fae5', fontWeight: 500 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '8px', fontSize: '9pt' }}>
                  <strong style={{ color: '#1a202c' }}>{edu.degree}</strong>
                  <div style={{ color: '#718096' }}>{edu.institution}</div>
                  <div style={{ fontSize: '8pt', color: '#a0aec0' }}>{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfographicTemplate;
