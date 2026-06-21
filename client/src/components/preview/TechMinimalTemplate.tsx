import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const TechMinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Courier New', Courier, monospace", padding: '24mm', color: '#0f172a', backgroundColor: '#ffffff', fontSize: '9.5pt', lineHeight: 1.4 }}>
      {/* Programmer-style header */}
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22pt', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
          ./{personalInfo.fullName?.toLowerCase().replace(/\s+/g, '_') || 'name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '10pt', color: '#0ea5e9', fontWeight: 'bold', margin: '4px 0' }}>
            [ {personalInfo.jobTitle.toUpperCase()} ]
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: '8.5pt', color: '#64748b', marginTop: '8px' }}>
          {personalInfo.email && <span>email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
          {personalInfo.location && <span>loc: {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>lnk: {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>web: {personalInfo.website}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#334155', lineHeight: 1.5 }}>// SUMMARY: {summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}># SKILLS_INVENTORY</h2>
          {skills.map((cat, i) => (
            <div key={i} style={{ marginBottom: '4px', display: 'flex' }}>
              <span style={{ fontWeight: 'bold', minWidth: '150px' }}>{cat.category.toLowerCase()}:</span>
              <span style={{ color: '#334155' }}>[ {cat.items.join(', ')} ]</span>
            </div>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '10px' }}># EXPERIENCE_LOG</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>&gt; {exp.position} @ {exp.company}</span>
                <span>{exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate.toUpperCase()}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '8.5pt', marginBottom: '4px' }}>
                Location: {exp.location}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ listStyleType: 'none', paddingLeft: '12px', margin: '4px 0' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ marginBottom: '3px', color: '#334155' }}>* {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '10px' }}># PROJECT_REPOSITORIES</h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold' }}>&gt; {proj.name}</div>
              <p style={{ margin: '2px 0 4px 0', color: '#334155' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <div style={{ fontSize: '8.5pt', color: '#64748b' }}>stack: {proj.technologies.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}># EDUCATION_HISTORY</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{edu.degree} - {edu.field}</span>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              <div style={{ color: '#64748b' }}>{edu.institution} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}># CERTIFICATIONS</h2>
          {certifications.map((cert, i) => (
            <div key={i} style={{ color: '#334155' }}>
              * {cert.name} / {cert.issuer} ({cert.date})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechMinimalTemplate;
