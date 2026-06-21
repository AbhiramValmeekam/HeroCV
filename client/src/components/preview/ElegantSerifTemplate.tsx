import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ElegantSerifTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  const brandColor = '#1b4332'; // Deep sage green
  const fontStyle = "'Playfair Display', 'Georgia', serif";

  return (
    <div className="resume-page" style={{ fontFamily: fontStyle, padding: '24mm', color: '#2b2d42', backgroundColor: '#faf9f6', lineHeight: 1.5 }}>
      {/* Centered Name and Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28pt', fontWeight: 300, color: brandColor, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p style={{ fontSize: '12pt', color: '#5c677d', fontStyle: 'italic', marginBottom: '14px', letterSpacing: '1px' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 20px', fontSize: '9pt', color: '#5c677d', borderTop: '1px solid #d8d8d8', borderBottom: '1px solid #d8d8d8', padding: '8px 0' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '22px', textAlign: 'center', maxWidth: '90%', margin: '0 auto 22px auto' }}>
          <p style={{ fontSize: '10.5pt', color: '#2b2d42', fontStyle: 'italic', lineHeight: 1.6 }}>"{summary}"</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: brandColor, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `1px solid ${brandColor}`, paddingBottom: '4px', marginBottom: '12px' }}>Professional Chronology</h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11pt', color: '#1d1d1d' }}>
                <span>{exp.position}</span>
                <span style={{ fontWeight: 500, fontStyle: 'italic' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: brandColor, fontStyle: 'italic', marginBottom: '4px' }}>
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '4px', listStyleType: 'circle' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: '9.5pt', color: '#3f3f3f', marginBottom: '3px', lineHeight: 1.45 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: brandColor, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `1px solid ${brandColor}`, paddingBottom: '4px', marginBottom: '12px' }}>Academic History</h2>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11pt' }}>
                <span>{edu.degree} in {edu.field}</span>
                <span style={{ fontWeight: 500, fontStyle: 'italic' }}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ fontSize: '9.5pt', fontStyle: 'italic', color: '#5c677d' }}>
                {edu.institution} {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: brandColor, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `1px solid ${brandColor}`, paddingBottom: '4px', marginBottom: '12px' }}>Core Capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 20px' }}>
            {skills.map((cat, i) => (
              <div key={i} style={{ fontSize: '9.5pt' }}>
                <strong style={{ color: brandColor }}>{cat.category}:</strong>{' '}
                <span style={{ color: '#3f3f3f' }}>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: brandColor, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `1px solid ${brandColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Credentials & Affiliations</h2>
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: '9.5pt', color: '#3f3f3f', marginBottom: '4px' }}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElegantSerifTemplate;
