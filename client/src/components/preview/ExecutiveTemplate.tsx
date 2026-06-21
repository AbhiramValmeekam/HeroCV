import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  const accentColor = '#701a24'; // Deep burgundy
  const textColor = '#2b2b2b';
  const mutedTextColor = '#555555';

  return (
    <div className="resume-page" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", padding: '24mm', color: textColor, backgroundColor: '#ffffff', lineHeight: 1.5 }}>
      {/* Centered Name and Contact */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h1 style={{ fontSize: '26pt', fontWeight: 400, color: '#111111', letterSpacing: '1px', marginBottom: '4px', textTransform: 'uppercase' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '12pt', color: accentColor, fontStyle: 'italic', fontWeight: 500, letterSpacing: '0.5px', marginBottom: '12px' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 16px', fontSize: '9pt', color: mutedTextColor, borderTop: `1px solid ${accentColor}`, borderBottom: `1px solid ${accentColor}`, padding: '6px 0', marginTop: '8px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '10pt', color: textColor, fontStyle: 'italic', lineHeight: 1.6, textAlign: 'justify' }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Professional Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10.5pt', color: '#111111' }}>
                <span>{exp.position}</span>
                <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: accentColor, fontStyle: 'italic', marginBottom: '4px' }}>
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '4px', listStyleType: 'square' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '9.5pt', color: textColor, marginBottom: '3px', lineHeight: 1.4, textAlign: 'justify' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10.5pt' }}>
                <span>{edu.degree} in {edu.field}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', fontStyle: 'italic', color: mutedTextColor }}>
                <span>{edu.institution}</span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Key Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '10.5pt', fontWeight: 'bold' }}>{proj.name}</h3>
              <p style={{ fontSize: '9.5pt', color: textColor, textAlign: 'justify', margin: '2px 0' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: '8.5pt', color: mutedTextColor, fontStyle: 'italic' }}>Technologies: {proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Expertise & Skills</h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ fontSize: '9.5pt', marginBottom: '3px' }}>
              <strong style={{ color: '#111111' }}>{cat.category}:</strong>{' '}
              <span style={{ color: textColor }}>{cat.items.join(', ')}</span>
            </p>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Certifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px' }}>
            {certifications.map((cert, i) => (
              <div key={i} style={{ fontSize: '9.5pt', color: textColor }}>
                <strong>{cert.name}</strong> — <span style={{ color: mutedTextColor }}>{cert.issuer} ({cert.date})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(achievements.length > 0 || languages.length > 0) && (
        <div style={{ display: 'flex', gap: '30px' }}>
          {achievements.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Achievements</h2>
              {achievements.map((ach, i) => (
                <p key={i} style={{ fontSize: '9.5pt', color: textColor, marginBottom: '3px' }}><strong>{ach.title}</strong>: {ach.description}</p>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, borderBottom: '1px solid #cccccc', paddingBottom: '3px', marginBottom: '10px' }}>Languages</h2>
              {languages.map((lang, i) => (
                <p key={i} style={{ fontSize: '9.5pt', color: textColor, marginBottom: '3px' }}><strong>{lang.language}</strong> — {lang.proficiency}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
