import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif", padding: '25mm', color: '#2d2d2d' }}>
      {/* Header - minimal */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 300, color: '#1a1a1a', letterSpacing: '2px', marginBottom: '6px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '11pt', color: '#888', fontWeight: 400, letterSpacing: '1px', marginBottom: '10px' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', gap: '16px', fontSize: '8.5pt', color: '#999', borderTop: '1px solid #e5e5e5', paddingTop: '8px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '10pt', color: '#555', lineHeight: 1.7, fontWeight: 300 }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: '2px solid #e5e5e5' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 500, color: '#1a1a1a' }}>{exp.position}</h3>
              <p style={{ fontSize: '9.5pt', color: '#888' }}>{exp.company} · {exp.location} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '14px', marginTop: '6px' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '9.5pt', color: '#555', marginBottom: '3px', lineHeight: 1.5 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid #e5e5e5' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 500 }}>{edu.degree} in {edu.field}</h3>
              <p style={{ fontSize: '9.5pt', color: '#888' }}>{edu.institution} · {edu.startDate} – {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #e5e5e5' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 500 }}>{proj.name}</h3>
              <p style={{ fontSize: '9.5pt', color: '#555' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: '8.5pt', color: '#888', marginTop: '2px' }}>{proj.technologies.join(' · ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Skills</h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ fontSize: '9.5pt', marginBottom: '4px' }}>
              <span style={{ color: '#888' }}>{cat.category}:</span>{' '}
              <span style={{ color: '#555' }}>{cat.items.join(' · ')}</span>
            </p>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Certifications</h2>
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: '9.5pt', color: '#555', marginBottom: '3px' }}>{cert.name} — {cert.issuer} · {cert.date}</p>
          ))}
        </div>
      )}

      {(achievements.length > 0 || languages.length > 0) && (
        <div style={{ display: 'flex', gap: '40px' }}>
          {achievements.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Achievements</h2>
              {achievements.map((ach, i) => (
                <p key={i} style={{ fontSize: '9.5pt', color: '#555', marginBottom: '3px' }}>{ach.title}</p>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: '#aaa', marginBottom: '12px' }}>Languages</h2>
              {languages.map((lang, i) => (
                <p key={i} style={{ fontSize: '9.5pt', color: '#555', marginBottom: '3px' }}>{lang.language} — {lang.proficiency}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
