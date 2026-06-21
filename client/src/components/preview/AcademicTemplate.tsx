import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const AcademicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Times New Roman', Times, serif", padding: '24mm', color: '#111111', backgroundColor: '#ffffff', fontSize: '10.5pt', lineHeight: 1.5 }}>
      {/* Centered Academic Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '11pt', fontStyle: 'italic', marginBottom: '10px', color: '#333333' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ fontSize: '9.5pt', color: '#444444', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 12px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Research Interests</h2>
          <p style={{ textAlign: 'justify', color: '#222222' }}>{summary}</p>
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{edu.institution}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#333333' }}>
                {edu.degree} in {edu.field} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}
              </div>
              {edu.description && <p style={{ marginTop: '3px', color: '#444444' }}>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Academic & Professional Appointments</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{exp.position}</span>
                <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#333333' }}>
                {exp.company} — {exp.location}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '20px', marginTop: '4px', listStyleType: 'disc' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ marginBottom: '3px', textAlign: 'justify', color: '#222222' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Research Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <strong style={{ fontSize: '11pt' }}>{proj.name}</strong>
              <p style={{ margin: '2px 0', textAlign: 'justify', color: '#333333' }}>{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: '9pt', color: '#555555', fontStyle: 'italic' }}>Focus: {proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Areas of Expertise</h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ marginBottom: '4px' }}>
              <strong>{cat.category}:</strong> {cat.items.join(', ')}
            </p>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Certifications & Training</h2>
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
            </div>
          ))}
        </div>
      )}

      {achievements.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Honors & Awards</h2>
          {achievements.map((ach, i) => (
            <p key={i} style={{ marginBottom: '4px' }}>
              <strong>{ach.title}</strong> — {ach.description}
            </p>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #111111', paddingBottom: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Languages</h2>
          <p>{languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default AcademicTemplate;
