import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const SimpleCompactTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "Arial, sans-serif", padding: '15mm', color: '#111', backgroundColor: '#ffffff', fontSize: '8.5pt', lineHeight: 1.3 }}>
      {/* Header - super compact */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #000000', paddingBottom: '4px', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '9pt', fontWeight: 'bold', margin: '2px 0 0 0' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '8pt', display: 'flex', flexWrap: 'wrap', gap: '4px 10px', maxWidth: '60%', justifyContent: 'flex-end' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '8px' }}>
          <p style={{ margin: 0, textAlign: 'justify' }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '9.5pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 4px 0', paddingBottom: '1px' }}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{exp.position} — {exp.company}</span>
                <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '8pt', color: '#555' }}>{exp.location}</div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '12px', margin: '2px 0 0 0' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ marginBottom: '1px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '9.5pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 4px 0', paddingBottom: '1px' }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <div>
                <strong>{edu.institution}</strong> — <i>{edu.degree} in {edu.field}</i>
              </div>
              <span>{edu.startDate} – {edu.endDate} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '9.5pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', margin: '0 0 4px 0', paddingBottom: '1px' }}>Skills</h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ margin: '0 0 2px 0' }}>
              <strong>{cat.category}:</strong> {cat.items.join(', ')}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleCompactTemplate;
