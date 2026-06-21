import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ATSTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  // ATS-friendly: no colors, no columns, simple formatting, standard fonts
  return (
    <div className="resume-page" style={{ fontFamily: "'Times New Roman', 'Georgia', serif", padding: '25mm 20mm' }}>
      {/* Header - centered, simple */}
      <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '20pt', color: '#000', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div style={{ fontSize: '10pt', color: '#333' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
        </div>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div style={{ fontSize: '9pt', color: '#333', marginTop: '2px' }}>
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join(' | ')}
          </div>
        )}
      </div>

      {summary && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Summary</h2>
          <p style={{ fontSize: '10.5pt', color: '#333', lineHeight: 1.5 }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Professional Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '11pt' }}>{exp.position}</strong>
                <span style={{ fontSize: '10pt' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: '10.5pt', fontStyle: 'italic' }}>{exp.company}, {exp.location}</div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '10pt', color: '#333', marginBottom: '2px', lineHeight: 1.4 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '11pt' }}>{edu.degree} in {edu.field}</strong>
                <span style={{ fontSize: '10pt' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ fontSize: '10.5pt' }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '11pt' }}>{proj.name}</strong>
              {proj.technologies.length > 0 && <span style={{ fontSize: '10pt' }}> ({proj.technologies.join(', ')})</span>}
              <p style={{ fontSize: '10pt', color: '#333' }}>{proj.description}</p>
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '20px', marginTop: '2px' }}>
                  {proj.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '10pt', color: '#333', marginBottom: '1px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Skills</h2>
          {skills.map((cat, i) => (
            <p key={i} style={{ fontSize: '10.5pt', marginBottom: '3px' }}>
              <strong>{cat.category}:</strong> {cat.items.join(', ')}
            </p>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Certifications</h2>
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: '10.5pt', marginBottom: '2px' }}>{cert.name} – {cert.issuer} ({cert.date})</p>
          ))}
        </div>
      )}

      {achievements.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Achievements</h2>
          {achievements.map((ach, i) => (
            <p key={i} style={{ fontSize: '10.5pt', marginBottom: '2px' }}><strong>{ach.title}:</strong> {ach.description}</p>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', color: '#000' }}>Languages</h2>
          <p style={{ fontSize: '10.5pt' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ATSTemplate;
