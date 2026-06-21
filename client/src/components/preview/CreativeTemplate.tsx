import React from 'react';
import { Resume } from '../../types/resume.types';

interface TemplateProps {
  resume: Resume;
}

const CreativeTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', sans-serif", padding: 0, display: 'flex', minHeight: '297mm' }}>
      {/* Left Sidebar */}
      <div style={{ width: '75mm', backgroundColor: '#1e1b4b', color: '#e0e0ff', padding: '20mm 12mm', flexShrink: 0 }}>
        {/* Name */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '18pt', color: '#ffffff', fontWeight: 700, lineHeight: 1.2, marginBottom: '4px' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '10pt', color: '#a5b4fc', fontWeight: 500 }}>{personalInfo.jobTitle}</p>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#a5b4fc', marginBottom: '8px' }}>Contact</h3>
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).map((item, i) => (
            <p key={i} style={{ fontSize: '8.5pt', color: '#c7d2fe', marginBottom: '4px', wordBreak: 'break-word' }}>{item}</p>
          ))}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#a5b4fc', marginBottom: '8px' }}>Skills</h3>
            {skills.map((cat, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '8.5pt', fontWeight: 600, color: '#e0e7ff', marginBottom: '3px' }}>{cat.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.items.map((skill, si) => (
                    <span key={si} style={{ fontSize: '7.5pt', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(165, 180, 252, 0.15)', color: '#c7d2fe' }}>
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
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#a5b4fc', marginBottom: '8px' }}>Languages</h3>
            {languages.map((lang, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', marginBottom: '3px' }}>
                  <span style={{ color: '#e0e7ff' }}>{lang.language}</span>
                  <span style={{ color: '#a5b4fc', fontSize: '7.5pt' }}>{lang.proficiency}</span>
                </div>
                <div style={{ height: '3px', backgroundColor: 'rgba(165, 180, 252, 0.2)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '2px',
                    backgroundColor: '#a5b4fc',
                    width: lang.proficiency === 'native' ? '100%' : lang.proficiency === 'fluent' ? '90%' : lang.proficiency === 'advanced' ? '75%' : lang.proficiency === 'intermediate' ? '55%' : '30%',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#a5b4fc', marginBottom: '8px' }}>Certifications</h3>
            {certifications.map((cert, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <p style={{ fontSize: '8.5pt', fontWeight: 600, color: '#e0e7ff' }}>{cert.name}</p>
                <p style={{ fontSize: '7.5pt', color: '#a5b4fc' }}>{cert.issuer} · {cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ flex: 1, padding: '20mm 16mm' }}>
        {/* Summary */}
        {summary && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#6366F1', marginBottom: '8px', borderBottom: '2px solid #6366F1', paddingBottom: '4px' }}>About Me</h2>
            <p style={{ fontSize: '9.5pt', color: '#374151', lineHeight: 1.7 }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#6366F1', marginBottom: '8px', borderBottom: '2px solid #6366F1', paddingBottom: '4px' }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '12px', position: 'relative', paddingLeft: '12px' }}>
                <div style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '11pt', fontWeight: 600, color: '#1a1a1a' }}>{exp.position}</h3>
                  <span style={{ fontSize: '8pt', color: '#9ca3af', whiteSpace: 'nowrap' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p style={{ fontSize: '9.5pt', color: '#6366F1', fontWeight: 500 }}>{exp.company} · {exp.location}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                    {exp.bullets.filter(Boolean).map((b, bi) => (
                      <li key={bi} style={{ fontSize: '9pt', color: '#4b5563', marginBottom: '2px', lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#6366F1', marginBottom: '8px', borderBottom: '2px solid #6366F1', paddingBottom: '4px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px', paddingLeft: '12px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                <h3 style={{ fontSize: '11pt', fontWeight: 600 }}>{edu.degree} in {edu.field}</h3>
                <p style={{ fontSize: '9.5pt', color: '#6b7280' }}>{edu.institution} · {edu.startDate} – {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#6366F1', marginBottom: '8px', borderBottom: '2px solid #6366F1', paddingBottom: '4px' }}>Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '10px', paddingLeft: '12px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                <h3 style={{ fontSize: '11pt', fontWeight: 600 }}>{proj.name}</h3>
                <p style={{ fontSize: '9pt', color: '#4b5563' }}>{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {proj.technologies.map((tech, ti) => (
                      <span key={ti} style={{ fontSize: '7.5pt', padding: '1px 8px', borderRadius: '8px', backgroundColor: '#eef2ff', color: '#6366F1', fontWeight: 500 }}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#6366F1', marginBottom: '8px', borderBottom: '2px solid #6366F1', paddingBottom: '4px' }}>Achievements</h2>
            {achievements.map((ach, i) => (
              <p key={i} style={{ fontSize: '9.5pt', color: '#4b5563', marginBottom: '4px', paddingLeft: '12px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                <strong>{ach.title}</strong> — {ach.description}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
