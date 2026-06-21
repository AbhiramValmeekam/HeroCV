import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const StartupModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: '20mm', color: '#1e293b', backgroundColor: '#ffffff', minHeight: '297mm' }}>
      {/* Sleek top startup profile header */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16pt' }}>
          {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'R'}
        </div>
        <div>
          <h1 style={{ fontSize: '22pt', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '10.5pt', color: '#3b82f6', fontWeight: 600, margin: '2px 0 0 0' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Left main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {summary && (
            <div>
              <p style={{ fontSize: '9.5pt', lineHeight: 1.5, color: '#334155', margin: 0 }}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '4px', marginBottom: '10px' }}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10pt' }}>
                    <span style={{ color: '#0f172a' }}>{exp.position} · <span style={{ color: '#3b82f6' }}>{exp.company}</span></span>
                    <span style={{ fontSize: '8.5pt', color: '#64748b' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ paddingLeft: '14px', marginTop: '4px', listStyleType: 'disc' }}>
                      {exp.bullets.filter(Boolean).map((b, bi) => (
                        <li key={bi} style={{ fontSize: '9pt', color: '#475569', marginBottom: '2px' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '4px', marginBottom: '10px' }}>Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <strong style={{ fontSize: '10pt', color: '#0f172a' }}>{proj.name}</strong>
                  <p style={{ fontSize: '9pt', color: '#475569', margin: '2px 0' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: '65mm', display: 'flex', flexDirection: 'column', gap: '18px', flexShrink: 0 }}>
          {/* Info */}
          <div>
            <h3 style={{ fontSize: '9pt', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Details</h3>
            <div style={{ fontSize: '8.5pt', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: '9pt', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skills.flatMap(s => s.items).map((skill, index) => (
                  <span key={index} style={{ fontSize: '8pt', padding: '2px 6px', backgroundColor: '#f1f5f9', color: '#1e293b', borderRadius: '4px', fontWeight: 500 }}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 style={{ fontSize: '9pt', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Education</h3>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '6px', fontSize: '8.5pt' }}>
                  <strong style={{ color: '#0f172a' }}>{edu.degree}</strong>
                  <div style={{ color: '#64748b' }}>{edu.institution}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupModernTemplate;
