import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  const primaryColor = '#1e3a8a'; // Deep Navy Blue
  const secondaryColor = '#475569'; // Slate Grey
  const textColor = '#1e293b';

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: 0, display: 'flex', minHeight: '297mm', color: textColor, backgroundColor: '#ffffff' }}>
      {/* Sidebar with background color */}
      <div style={{ width: '80mm', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24mm 12mm', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Name and Job Title */}
        <div>
          <h1 style={{ fontSize: '20pt', fontWeight: 800, color: primaryColor, lineHeight: 1.2, marginBottom: '6px' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '10pt', color: secondaryColor, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Contact details */}
        <div>
          <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8.5pt', color: '#334155', wordBreak: 'break-word' }}>
            {personalInfo.email && (
              <div>
                <strong style={{ color: primaryColor }}>Email:</strong><br />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <strong style={{ color: primaryColor }}>Phone:</strong><br />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div>
                <strong style={{ color: primaryColor }}>Location:</strong><br />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <strong style={{ color: primaryColor }}>LinkedIn:</strong><br />
                {personalInfo.linkedin}
              </div>
            )}
            {personalInfo.github && (
              <div>
                <strong style={{ color: primaryColor }}>GitHub:</strong><br />
                {personalInfo.github}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Skills</h3>
            {skills.map((cat, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '8.5pt', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>{cat.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.items.map((skill, si) => (
                    <span key={si} style={{ fontSize: '8pt', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: 500 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Languages</h3>
            {languages.map((lang, i) => (
              <div key={i} style={{ fontSize: '8.5pt', display: 'flex', justifyContent: 'space-between', color: '#334155', marginBottom: '4px' }}>
                <span>{lang.language}</span>
                <span style={{ fontWeight: 600, color: secondaryColor }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '24mm 16mm', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Summary */}
        {summary && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '8px' }}>Professional Summary</h2>
            <p style={{ fontSize: '9.5pt', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Work Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a' }}>{exp.position}</h3>
                  <span style={{ fontSize: '8.5pt', color: secondaryColor, fontWeight: 600 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p style={{ fontSize: '9pt', color: primaryColor, fontWeight: 600, margin: '2px 0' }}>{exp.company} · {exp.location}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {exp.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2.5px', lineHeight: 1.4, textAlign: 'justify' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a' }}>{edu.degree} in {edu.field}</h3>
                  <span style={{ fontSize: '8.5pt', color: secondaryColor, fontWeight: 600 }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <p style={{ fontSize: '9pt', color: '#475569', margin: '2px 0' }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a' }}>{proj.name}</h3>
                <p style={{ fontSize: '9pt', color: '#334155', margin: '2px 0', textAlign: 'justify' }}>{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p style={{ fontSize: '8pt', color: secondaryColor, fontWeight: 500 }}>Technologies: {proj.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '8px' }}>Certifications</h2>
            <ul style={{ paddingLeft: '16px', margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 12px' }}>
              {certifications.map((cert, i) => (
                <li key={i} style={{ fontSize: '9pt', color: '#334155' }}>
                  <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: '4px', marginBottom: '8px' }}>Achievements</h2>
            <ul style={{ paddingLeft: '16px', margin: 0 }}>
              {achievements.map((ach, i) => (
                <li key={i} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2px' }}>
                  <strong>{ach.title}</strong> — {ach.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
