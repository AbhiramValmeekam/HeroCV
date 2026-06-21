import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const CorporateDarkTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  const headerBg = '#0f172a'; // Deep slate dark
  const brandColor = '#3b82f6'; // Bright corporate blue
  const textColor = '#334155';

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: 0, color: textColor, backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Dark Header Banner */}
      <div style={{ backgroundColor: headerBg, color: '#f8fafc', padding: '16mm 20mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24pt', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '11pt', color: brandColor, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span style={{ color: brandColor }}>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '16mm 20mm', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {summary && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: `2px solid ${brandColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Executive Summary</h2>
            <p style={{ fontSize: '9.5pt', lineHeight: 1.5, textAlign: 'justify' }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: `2px solid ${brandColor}`, paddingBottom: '3px', marginBottom: '10px' }}>Professional Record</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10pt', color: '#0f172a' }}>
                  <span>{exp.position}</span>
                  <span style={{ color: brandColor }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p style={{ fontSize: '9pt', color: '#64748b', fontWeight: 600, margin: '2px 0' }}>{exp.company} · {exp.location}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {exp.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} style={{ fontSize: '9pt', color: textColor, marginBottom: '2.5px', lineHeight: 1.4 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: `2px solid ${brandColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Academic Background</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10pt', color: '#0f172a' }}>
                  <span>{edu.degree} in {edu.field}</span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                <p style={{ fontSize: '9pt', color: '#64748b', margin: '2px 0' }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: `2px solid ${brandColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Core competencies</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.flatMap(s => s.items).map((skill, index) => (
                <span key={index} style={{ fontSize: '8.5pt', padding: '3px 10px', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '4px', borderLeft: `3px solid ${brandColor}`, fontWeight: 500 }}>
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

export default CorporateDarkTemplate;
