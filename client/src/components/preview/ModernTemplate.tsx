import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '3px solid #6366F1', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28pt', color: '#1a1a1a', marginBottom: '4px', letterSpacing: '-0.5px', marginTop: 0 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '14pt', color: '#6366F1', fontWeight: 500, marginBottom: 0 }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '9.5pt', color: '#64748b', textAlign: 'right', marginTop: '6px' }}>
          {personalInfo.email && <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.6, fontSize: '10pt' }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '11pt', fontWeight: 600, color: '#1a1a1a' }}>{exp.position}</h3>
                <span style={{ fontSize: '9pt', color: '#64748b' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p style={{ fontSize: '10pt', color: '#6366F1', fontWeight: 500 }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '9.5pt', color: '#374151', marginBottom: '2px', lineHeight: 1.5 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '11pt', fontWeight: 600 }}>{edu.degree} in {edu.field}</h3>
                <span style={{ fontSize: '9pt', color: '#64748b' }}>{edu.startDate} - {edu.endDate}</span>
              </div>
              <p style={{ fontSize: '10pt', color: '#6366F1' }}>{edu.institution}</p>
              {edu.gpa && <p style={{ fontSize: '9pt', color: '#64748b' }}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Projects
          </h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 600 }}>
                {proj.name}
                {proj.link && <span style={{ fontSize: '9pt', fontWeight: 400, color: '#6366F1' }}> — {proj.link}</span>}
              </h3>
              <p style={{ fontSize: '9.5pt', color: '#374151' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: '9pt', color: '#64748b', marginTop: '2px' }}>
                  <strong>Tech:</strong> {proj.technologies.join(', ')}
                </p>
              )}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '3px' }}>
                  {proj.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '9.5pt', color: '#374151', marginBottom: '2px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Skills
          </h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ fontSize: '9.5pt', marginBottom: '4px' }}>
              <strong style={{ color: '#1a1a1a' }}>{cat.category}:</strong>{' '}
              <span style={{ color: '#374151' }}>{cat.items.join(', ')}</span>
            </p>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Certifications
          </h2>
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: '9.5pt', color: '#374151', marginBottom: '3px' }}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
            </p>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Achievements
          </h2>
          {achievements.map((ach, i) => (
            <p key={i} style={{ fontSize: '9.5pt', color: '#374151', marginBottom: '3px' }}>
              <strong>{ach.title}</strong> — {ach.description}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h2 style={{ color: '#6366F1', fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #6366F1', paddingBottom: '3px', marginBottom: '8px' }}>
            Languages
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {languages.map((lang, i) => (
              <span key={i} style={{ fontSize: '9.5pt', color: '#374151' }}>
                {lang.language} <span style={{ color: '#64748b' }}>({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
