import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const VibrantTechTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: 0, color: '#1e293b', backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Dynamic Gradient Bar at Top */}
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }}></div>

      <div style={{ padding: '20mm 16mm', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26pt', fontWeight: 800, letterSpacing: '-1px', background: 'linear-gradient(135deg, #4f46e5, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '11pt', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '9pt', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {summary && (
          <div>
            <p style={{ fontSize: '10pt', color: '#374151', lineHeight: 1.6 }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Professional Journey</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ paddingLeft: '14px', borderLeft: '2px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10.5pt', color: '#0f172a' }}>
                    <span>{exp.position}</span>
                    <span style={{ fontSize: '8.5pt', color: '#9333ea', fontWeight: 600 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p style={{ fontSize: '9pt', color: '#4f46e5', fontWeight: 600, margin: '2px 0' }}>{exp.company} · {exp.location}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ paddingLeft: '14px', marginTop: '4px', listStyleType: 'square' }}>
                      {exp.bullets.filter(Boolean).map((b, bi) => (
                        <li key={bi} style={{ fontSize: '9pt', color: '#4b5563', marginBottom: '2.5px' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills - Pill badges */}
        {skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Skills Inventory</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.flatMap(s => s.items).map((skill, index) => (
                <span key={index} style={{ fontSize: '8.5pt', padding: '3px 10px', backgroundColor: '#f3e8ff', color: '#6b21a8', borderRadius: '20px', fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12pt', fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '4px', paddingLeft: '14px', borderLeft: '2px solid #fae8ff' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{edu.degree} in {edu.field}</strong>
                  <span style={{ color: '#6b7280' }}> · {edu.institution}</span>
                </div>
                <span style={{ fontSize: '8.5pt', color: '#9333ea', fontWeight: 600 }}>{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VibrantTechTemplate;
