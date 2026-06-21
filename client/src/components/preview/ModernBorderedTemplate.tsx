import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ModernBorderedTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ padding: '4mm', backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Outer border frame */}
      <div style={{ border: '1px solid #cbd5e1', padding: '16mm', minHeight: '289mm', display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: "'Outfit', 'Inter', sans-serif", color: '#1e293b' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div>
            <h1 style={{ fontSize: '22pt', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '10pt', color: '#6366f1', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {summary && (
          <div>
            <h2 style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '1px', marginBottom: '6px' }}>Summary</h2>
            <p style={{ fontSize: '9.5pt', lineHeight: 1.5 }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '1px', marginBottom: '8px' }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '9.5pt' }}>
                  <span style={{ color: '#0f172a' }}>{exp.position}</span>
                  <span style={{ color: '#64748b' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: '9pt', color: '#6366f1', fontWeight: 500 }}>{exp.company} · {exp.location}</div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '14px', marginTop: '3px' }}>
                    {exp.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} style={{ fontSize: '9pt', color: '#475569', marginBottom: '2px' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '1px', marginBottom: '6px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '4px' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{edu.degree} in {edu.field}</strong>
                  <span style={{ color: '#64748b' }}> · {edu.institution}</span>
                </div>
                <span style={{ color: '#64748b' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '1px', marginBottom: '6px' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.flatMap(s => s.items).map((skill, index) => (
                <span key={index} style={{ fontSize: '8pt', padding: '2px 8px', border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#f8fafc' }}>
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

export default ModernBorderedTemplate;
