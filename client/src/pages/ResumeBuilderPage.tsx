import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { Resume, emptyResume } from '../types/resume.types';
import { exportToPDF, resumeToPlainText } from '../utils/pdfExport';
import { aiService } from '../services/aiService';
import { resumeService } from '../services/resumeService';
import ModernTemplate from '../components/preview/ModernTemplate';
import ATSTemplate from '../components/preview/ATSTemplate';
import MinimalTemplate from '../components/preview/MinimalTemplate';
import CreativeTemplate from '../components/preview/CreativeTemplate';
import ExecutiveTemplate from '../components/preview/ExecutiveTemplate';
import ProfessionalTemplate from '../components/preview/ProfessionalTemplate';
import AcademicTemplate from '../components/preview/AcademicTemplate';
import TechMinimalTemplate from '../components/preview/TechMinimalTemplate';
import ElegantSerifTemplate from '../components/preview/ElegantSerifTemplate';
import CorporateDarkTemplate from '../components/preview/CorporateDarkTemplate';
import ModernBorderedTemplate from '../components/preview/ModernBorderedTemplate';
import VibrantTechTemplate from '../components/preview/VibrantTechTemplate';
import SimpleCompactTemplate from '../components/preview/SimpleCompactTemplate';
import StartupModernTemplate from '../components/preview/StartupModernTemplate';
import VisualBoldTemplate from '../components/preview/VisualBoldTemplate';
import InfographicTemplate from '../components/preview/InfographicTemplate';
import {
  Save,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  Wand2,
  X,
  ArrowLeft,
  Loader2,
  Upload,
} from 'lucide-react';

const ResumeBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResume, setCurrentResume, loadResume, saveResume, createResume, loading } = useResume();
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const isDirtyRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save logic
  useEffect(() => {
    if (!currentResume._id || !isDirtyRef.current) return;

    const delayDebounceFn = setTimeout(async () => {
      setSaving(true);
      setSaveMsg('Saving...');
      try {
        await saveResume();
        isDirtyRef.current = false;
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(''), 2000);
      } catch {
        setSaveMsg('Save failed');
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [currentResume, saveResume]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      loadResume(id);
    } else if (id === 'new' || !id) {
      setCurrentResume({ ...emptyResume });
    }
  }, [id, loadResume, setCurrentResume]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      if (!currentResume._id) {
        const created = await createResume(currentResume);
        isDirtyRef.current = false;
        navigate(`/builder/${created._id}`, { replace: true });
      } else {
        await saveResume();
        isDirtyRef.current = false;
      }
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch {
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF('resume-preview-content', `${currentResume.title || 'resume'}.pdf`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file.', 'error');
      return;
    }

    setParsing(true);
    try {
      const response = await aiService.parseResume(file);
      if (response.success && response.data) {
        setParsedData(response.data);
        setShowImportModal(true);
      } else {
        throw new Error('Parsing failed');
      }
    } catch (err: any) {
      console.error('Resume parsing failed:', err);
      const errMsg = err.response?.data?.message || 'Failed to parse resume. Make sure it is a valid text-based PDF and your Gemini API key is configured.';
      showToast(errMsg, 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleOverwrite = async () => {
    if (!parsedData) return;
    isDirtyRef.current = true;
    const updatedResume = {
      ...currentResume,
      ...parsedData,
      _id: currentResume._id,
      userId: currentResume.userId,
      createdAt: currentResume.createdAt,
      updatedAt: currentResume.updatedAt,
    };
    setCurrentResume(updatedResume);
    setShowImportModal(false);
    setParsedData(null);

    setSaving(true);
    setSaveMsg('Saving...');
    try {
      await resumeService.update(currentResume._id!, updatedResume);
      isDirtyRef.current = false;
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
      showToast('Resume overwritten and saved successfully!', 'success');
    } catch (err) {
      setSaveMsg('Save failed');
      showToast('Failed to save imported data.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMerge = async () => {
    if (!parsedData) return;
    isDirtyRef.current = true;
    
    const mergedPersonalInfo = { ...currentResume.personalInfo };
    Object.keys(parsedData.personalInfo || {}).forEach((key) => {
      const k = key as keyof typeof currentResume.personalInfo;
      if (!mergedPersonalInfo[k]) {
        (mergedPersonalInfo as any)[k] = parsedData.personalInfo[k];
      }
    });

    const updatedResume = {
      ...currentResume,
      title: currentResume.title || parsedData.title,
      summary: currentResume.summary || parsedData.summary,
      personalInfo: mergedPersonalInfo,
      education: [...currentResume.education, ...(parsedData.education || [])],
      experience: [...currentResume.experience, ...(parsedData.experience || [])],
      projects: [...currentResume.projects, ...(parsedData.projects || [])],
      skills: [...currentResume.skills, ...(parsedData.skills || [])],
      certifications: [...currentResume.certifications, ...(parsedData.certifications || [])],
      achievements: [...currentResume.achievements, ...(parsedData.achievements || [])],
      languages: [...currentResume.languages, ...(parsedData.languages || [])],
      socialLinks: [...currentResume.socialLinks, ...(parsedData.socialLinks || [])],
    };

    setCurrentResume(updatedResume);
    setShowImportModal(false);
    setParsedData(null);

    setSaving(true);
    setSaveMsg('Saving...');
    try {
      await resumeService.update(currentResume._id!, updatedResume);
      isDirtyRef.current = false;
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
      showToast('Resume merged and saved successfully!', 'success');
    } catch (err) {
      setSaveMsg('Save failed');
      showToast('Failed to save merged data.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    isDirtyRef.current = true;
    setCurrentResume((prev: Resume) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addArrayItem = (field: keyof Resume, defaultItem: any) => {
    isDirtyRef.current = true;
    setCurrentResume((prev: Resume) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultItem],
    }));
  };

  const updateArrayItem = (field: keyof Resume, index: number, data: any) => {
    isDirtyRef.current = true;
    setCurrentResume((prev: Resume) => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item: any, i: number) =>
        i === index ? { ...item, ...data } : item
      ),
    }));
  };

  const removeArrayItem = (field: keyof Resume, index: number) => {
    isDirtyRef.current = true;
    setCurrentResume((prev: Resume) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleAISummary = async () => {
    if (!currentResume.personalInfo.jobTitle) {
      showToast('Please enter a job title first', 'error');
      return;
    }
    setAiLoading('summary');
    try {
      const skills = currentResume.skills.flatMap((s) => s.items);
      const expYears = currentResume.experience.length > 0 ? `${currentResume.experience.length} roles` : 'entry level';
      const { summary } = await aiService.generateSummary({
        role: currentResume.personalInfo.jobTitle,
        skills,
        experience: expYears,
      });
      setCurrentResume((prev: Resume) => ({ ...prev, summary }));
      isDirtyRef.current = true;
      showToast('Summary generated successfully!', 'success');
    } catch (err: any) {
      console.error('AI summary failed:', err);
      const errMsg = err.response?.data?.message || 'AI summary generation failed. Please check your Gemini API key and quota.';
      showToast(errMsg, 'error');
    } finally {
      setAiLoading(null);
    }
  };

  const handleEnhanceBullet = async (field: 'experience' | 'projects', itemIndex: number, bulletIndex: number) => {
    const items = currentResume[field] as any[];
    const bullet = items[itemIndex]?.bullets?.[bulletIndex];
    if (!bullet) return;
    setAiLoading(`bullet-${field}-${itemIndex}-${bulletIndex}`);
    try {
      const { enhanced } = await aiService.enhanceBullet({
        bullet,
        role: currentResume.personalInfo.jobTitle || '',
      });
      setCurrentResume((prev: Resume) => {
        const updated = [...(prev[field] as any[])];
        const updatedBullets = [...updated[itemIndex].bullets];
        updatedBullets[bulletIndex] = enhanced;
        updated[itemIndex] = { ...updated[itemIndex], bullets: updatedBullets };
        return { ...prev, [field]: updated };
      });
      isDirtyRef.current = true;
      showToast('Bullet point enhanced successfully!', 'success');
    } catch (err: any) {
      console.error('AI enhance failed:', err);
      const errMsg = err.response?.data?.message || 'AI bullet enhancement failed. Please check your Gemini API key and quota.';
      showToast(errMsg, 'error');
    } finally {
      setAiLoading(null);
    }
  };

  const renderTemplate = useCallback(() => {
    const props = { resume: currentResume };
    switch (currentResume.template) {
      case 'ats': return <ATSTemplate {...props} />;
      case 'minimal': return <MinimalTemplate {...props} />;
      case 'creative': return <CreativeTemplate {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      case 'professional': return <ProfessionalTemplate {...props} />;
      case 'academic': return <AcademicTemplate {...props} />;
      case 'tech_minimal': return <TechMinimalTemplate {...props} />;
      case 'elegant_serif': return <ElegantSerifTemplate {...props} />;
      case 'corporate_dark': return <CorporateDarkTemplate {...props} />;
      case 'modern_bordered': return <ModernBorderedTemplate {...props} />;
      case 'vibrant_tech': return <VibrantTechTemplate {...props} />;
      case 'simple_compact': return <SimpleCompactTemplate {...props} />;
      case 'startup_modern': return <StartupModernTemplate {...props} />;
      case 'visual_bold': return <VisualBoldTemplate {...props} />;
      case 'infographic': return <InfographicTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  }, [currentResume]);

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'languages', label: 'Languages' },
    { id: 'social', label: 'Social Links' },
  ];

  const SectionHeader: React.FC<{ id: string; label: string }> = ({ id: sectionId, label }) => (
    <button
      className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 hover:bg-bg-tertiary/30 transition-colors"
      onClick={() => setActiveSection(activeSection === sectionId ? '' : sectionId)}
      id={`section-${sectionId}`}
    >
      <span className="font-semibold text-sm">{label}</span>
      {activeSection === sectionId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  if (loading && !currentResume.title) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ marginLeft: '-32px', marginTop: '-32px', marginRight: '-32px', marginBottom: '-32px' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-bg-secondary border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2" id="back-to-dashboard">
            <ArrowLeft size={18} />
          </button>
          <input
            type="text"
            value={currentResume.title}
            onChange={(e) => {
              isDirtyRef.current = true;
              setCurrentResume((prev: Resume) => ({ ...prev, title: e.target.value }));
            }}
            className="bg-transparent text-lg font-semibold outline-none border-b border-transparent hover:border-border focus:border-accent-primary transition-colors"
            placeholder="Resume Title"
            id="resume-title-input"
          />
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-sm text-accent-success">{saveMsg}</span>}
          <select
            value={currentResume.template}
            onChange={(e) => {
              isDirtyRef.current = true;
              setCurrentResume((prev: Resume) => ({ ...prev, template: e.target.value as any }));
            }}
            className="input w-auto text-sm py-2"
            id="template-selector"
          >
            <option value="modern">Modern</option>
            <option value="ats">ATS-Friendly</option>
            <option value="minimal">Minimal</option>
            <option value="creative">Creative</option>
            <option value="executive">Executive</option>
            <option value="professional">Professional</option>
            <option value="academic">Academic</option>
            <option value="tech_minimal">Tech Minimal</option>
            <option value="elegant_serif">Elegant Serif</option>
            <option value="corporate_dark">Corporate Dark</option>
            <option value="modern_bordered">Modern Bordered</option>
            <option value="vibrant_tech">Vibrant Tech</option>
            <option value="simple_compact">Simple Compact</option>
            <option value="startup_modern">Startup Modern</option>
            <option value="visual_bold">Visual Bold</option>
            <option value="infographic">Infographic</option>
          </select>
          <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary py-2 lg:hidden" id="toggle-preview">
            <Eye size={16} /> {showPreview ? 'Editor' : 'Preview'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
            id="builder-file-upload-input"
          />
          <button onClick={handleUploadClick} className="btn-secondary py-2" disabled={parsing} id="import-resume-btn">
            {parsing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Import PDF
          </button>
          <button onClick={handleSave} className="btn-secondary py-2" disabled={saving} id="save-resume">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save
          </button>
          <button onClick={handleExport} className="btn-primary py-2" disabled={exporting} id="export-pdf">
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            PDF
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="builder-layout flex-1">
        {/* Editor */}
        <div className={`builder-editor ${showPreview ? 'hidden lg:block' : ''}`}>
          <div className="space-y-3 max-w-2xl">
            {sections.map(({ id: sId, label }) => (
              <div key={sId}>
                <SectionHeader id={sId} label={label} />
                {activeSection === sId && (
                  <div className="p-4 space-y-4 animate-fade-in">
                    {/* Personal Info */}
                    {sId === 'personal' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                          { key: 'jobTitle', label: 'Job Title', placeholder: 'Software Engineer' },
                          { key: 'email', label: 'Email', placeholder: 'john@example.com' },
                          { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
                          { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
                          { key: 'website', label: 'Website', placeholder: 'https://johndoe.com' },
                          { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
                          { key: 'github', label: 'GitHub', placeholder: 'github.com/johndoe' },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="input-label">{f.label}</label>
                            <input
                              type="text"
                              value={(currentResume.personalInfo as any)[f.key] || ''}
                              onChange={(e) => updatePersonalInfo(f.key, e.target.value)}
                              className="input"
                              placeholder={f.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Summary */}
                    {sId === 'summary' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="input-label mb-0">Professional Summary</label>
                          <button
                            onClick={handleAISummary}
                            className="btn-ai text-xs"
                            disabled={aiLoading === 'summary'}
                            id="ai-generate-summary"
                          >
                            {aiLoading === 'summary' ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            AI Generate
                          </button>
                        </div>
                        <textarea
                          value={currentResume.summary}
                          onChange={(e) => {
                            isDirtyRef.current = true;
                            setCurrentResume((prev: Resume) => ({ ...prev, summary: e.target.value }));
                          }}
                          className="textarea"
                          rows={4}
                          placeholder="Write a professional summary or let AI generate one..."
                        />
                      </div>
                    )}

                    {/* Experience */}
                    {sId === 'experience' && (
                      <div className="space-y-4">
                        {currentResume.experience.map((exp, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Experience #{i + 1}</span>
                              <button onClick={() => removeArrayItem('experience', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="input-label">Company</label>
                                <input className="input" value={exp.company} onChange={(e) => updateArrayItem('experience', i, { company: e.target.value })} placeholder="Google" />
                              </div>
                              <div>
                                <label className="input-label">Position</label>
                                <input className="input" value={exp.position} onChange={(e) => updateArrayItem('experience', i, { position: e.target.value })} placeholder="Software Engineer" />
                              </div>
                              <div>
                                <label className="input-label">Location</label>
                                <input className="input" value={exp.location} onChange={(e) => updateArrayItem('experience', i, { location: e.target.value })} placeholder="Mountain View, CA" />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="input-label">Start</label>
                                  <input className="input" value={exp.startDate} onChange={(e) => updateArrayItem('experience', i, { startDate: e.target.value })} placeholder="Jan 2022" />
                                </div>
                                <div className="flex-1">
                                  <label className="input-label">End</label>
                                  <input className="input" value={exp.endDate} onChange={(e) => updateArrayItem('experience', i, { endDate: e.target.value })} placeholder="Present" disabled={exp.current} />
                                </div>
                              </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                              <input type="checkbox" checked={exp.current} onChange={(e) => updateArrayItem('experience', i, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })} className="rounded" />
                              Currently working here
                            </label>
                            {/* Bullets */}
                            <div>
                              <label className="input-label">Bullet Points</label>
                              {exp.bullets.map((bullet, bi) => (
                                <div key={bi} className="flex gap-2 mb-2">
                                  <input
                                    className="input flex-1"
                                    value={bullet}
                                    onChange={(e) => {
                                      const newBullets = [...exp.bullets];
                                      newBullets[bi] = e.target.value;
                                      updateArrayItem('experience', i, { bullets: newBullets });
                                    }}
                                    placeholder="Describe your achievement..."
                                  />
                                  <button
                                    onClick={() => handleEnhanceBullet('experience', i, bi)}
                                    className="btn-ai px-2"
                                    disabled={aiLoading === `bullet-experience-${i}-${bi}`}
                                    title="AI Enhance"
                                  >
                                    {aiLoading === `bullet-experience-${i}-${bi}` ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                  </button>
                                  <button
                                    onClick={() => {
                                      const newBullets = exp.bullets.filter((_, idx) => idx !== bi);
                                      updateArrayItem('experience', i, { bullets: newBullets });
                                    }}
                                    className="text-accent-danger hover:bg-accent-danger/10 p-2 rounded"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => updateArrayItem('experience', i, { bullets: [...exp.bullets, ''] })}
                                className="btn-ghost text-xs"
                              >
                                <Plus size={14} /> Add Bullet
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addArrayItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] })}
                          className="btn-secondary w-full justify-center"
                          id="add-experience"
                        >
                          <Plus size={16} /> Add Experience
                        </button>
                      </div>
                    )}

                    {/* Education */}
                    {sId === 'education' && (
                      <div className="space-y-4">
                        {currentResume.education.map((edu, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Education #{i + 1}</span>
                              <button onClick={() => removeArrayItem('education', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <label className="input-label">Institution</label>
                                <input className="input" value={edu.institution} onChange={(e) => updateArrayItem('education', i, { institution: e.target.value })} placeholder="MIT" />
                              </div>
                              <div>
                                <label className="input-label">Degree</label>
                                <input className="input" value={edu.degree} onChange={(e) => updateArrayItem('education', i, { degree: e.target.value })} placeholder="Bachelor of Science" />
                              </div>
                              <div>
                                <label className="input-label">Field of Study</label>
                                <input className="input" value={edu.field} onChange={(e) => updateArrayItem('education', i, { field: e.target.value })} placeholder="Computer Science" />
                              </div>
                              <div>
                                <label className="input-label">Start Date</label>
                                <input className="input" value={edu.startDate} onChange={(e) => updateArrayItem('education', i, { startDate: e.target.value })} placeholder="Sep 2018" />
                              </div>
                              <div>
                                <label className="input-label">End Date</label>
                                <input className="input" value={edu.endDate} onChange={(e) => updateArrayItem('education', i, { endDate: e.target.value })} placeholder="Jun 2022" />
                              </div>
                              <div>
                                <label className="input-label">GPA (optional)</label>
                                <input className="input" value={edu.gpa || ''} onChange={(e) => updateArrayItem('education', i, { gpa: e.target.value })} placeholder="3.8/4.0" />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })} className="btn-secondary w-full justify-center" id="add-education">
                          <Plus size={16} /> Add Education
                        </button>
                      </div>
                    )}

                    {/* Projects */}
                    {sId === 'projects' && (
                      <div className="space-y-4">
                        {currentResume.projects.map((proj, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Project #{i + 1}</span>
                              <button onClick={() => removeArrayItem('projects', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="input-label">Project Name</label>
                                <input className="input" value={proj.name} onChange={(e) => updateArrayItem('projects', i, { name: e.target.value })} placeholder="E-Commerce Platform" />
                              </div>
                              <div>
                                <label className="input-label">Link</label>
                                <input className="input" value={proj.link || ''} onChange={(e) => updateArrayItem('projects', i, { link: e.target.value })} placeholder="https://github.com/..." />
                              </div>
                              <div className="col-span-2">
                                <label className="input-label">Description</label>
                                <textarea className="textarea" value={proj.description} onChange={(e) => updateArrayItem('projects', i, { description: e.target.value })} placeholder="Brief description..." rows={2} />
                              </div>
                              <div className="col-span-2">
                                <label className="input-label">Technologies (comma-separated)</label>
                                <input className="input" value={proj.technologies.join(', ')} onChange={(e) => updateArrayItem('projects', i, { technologies: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} placeholder="React, Node.js, MongoDB" />
                              </div>
                            </div>
                            {/* Project bullets */}
                            <div>
                              <label className="input-label">Bullet Points</label>
                              {proj.bullets.map((bullet, bi) => (
                                <div key={bi} className="flex gap-2 mb-2">
                                  <input className="input flex-1" value={bullet} onChange={(e) => {
                                    const newBullets = [...proj.bullets];
                                    newBullets[bi] = e.target.value;
                                    updateArrayItem('projects', i, { bullets: newBullets });
                                  }} placeholder="Describe what you built..." />
                                  <button onClick={() => handleEnhanceBullet('projects', i, bi)} className="btn-ai px-2" disabled={aiLoading === `bullet-projects-${i}-${bi}`}>
                                    {aiLoading === `bullet-projects-${i}-${bi}` ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                  </button>
                                  <button onClick={() => {
                                    const newBullets = proj.bullets.filter((_, idx) => idx !== bi);
                                    updateArrayItem('projects', i, { bullets: newBullets });
                                  }} className="text-accent-danger hover:bg-accent-danger/10 p-2 rounded">
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => updateArrayItem('projects', i, { bullets: [...proj.bullets, ''] })} className="btn-ghost text-xs">
                                <Plus size={14} /> Add Bullet
                              </button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], link: '', bullets: [''] })} className="btn-secondary w-full justify-center" id="add-project">
                          <Plus size={16} /> Add Project
                        </button>
                      </div>
                    )}

                    {/* Skills */}
                    {sId === 'skills' && (
                      <div className="space-y-4">
                        {currentResume.skills.map((cat, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Category #{i + 1}</span>
                              <button onClick={() => removeArrayItem('skills', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div>
                              <label className="input-label">Category Name</label>
                              <input className="input" value={cat.category} onChange={(e) => updateArrayItem('skills', i, { category: e.target.value })} placeholder="Programming Languages" />
                            </div>
                            <div>
                              <label className="input-label">Skills (comma-separated)</label>
                              <input className="input" value={cat.items.join(', ')} onChange={(e) => updateArrayItem('skills', i, { items: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} placeholder="JavaScript, Python, TypeScript" />
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('skills', { category: '', items: [] })} className="btn-secondary w-full justify-center" id="add-skills">
                          <Plus size={16} /> Add Skill Category
                        </button>
                      </div>
                    )}

                    {/* Certifications */}
                    {sId === 'certifications' && (
                      <div className="space-y-4">
                        {currentResume.certifications.map((cert, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Certification #{i + 1}</span>
                              <button onClick={() => removeArrayItem('certifications', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded"><Trash2 size={14} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className="input-label">Name</label><input className="input" value={cert.name} onChange={(e) => updateArrayItem('certifications', i, { name: e.target.value })} placeholder="AWS Certified" /></div>
                              <div><label className="input-label">Issuer</label><input className="input" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', i, { issuer: e.target.value })} placeholder="Amazon" /></div>
                              <div><label className="input-label">Date</label><input className="input" value={cert.date} onChange={(e) => updateArrayItem('certifications', i, { date: e.target.value })} placeholder="Mar 2023" /></div>
                              <div><label className="input-label">Link</label><input className="input" value={cert.link || ''} onChange={(e) => updateArrayItem('certifications', i, { link: e.target.value })} placeholder="https://..." /></div>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', link: '' })} className="btn-secondary w-full justify-center" id="add-certification">
                          <Plus size={16} /> Add Certification
                        </button>
                      </div>
                    )}

                    {/* Achievements */}
                    {sId === 'achievements' && (
                      <div className="space-y-4">
                        {currentResume.achievements.map((ach, i) => (
                          <div key={i} className="card p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-secondary">Achievement #{i + 1}</span>
                              <button onClick={() => removeArrayItem('achievements', i)} className="text-accent-danger hover:bg-accent-danger/10 p-1 rounded"><Trash2 size={14} /></button>
                            </div>
                            <div><label className="input-label">Title</label><input className="input" value={ach.title} onChange={(e) => updateArrayItem('achievements', i, { title: e.target.value })} placeholder="Best Paper Award" /></div>
                            <div><label className="input-label">Description</label><textarea className="textarea" value={ach.description} onChange={(e) => updateArrayItem('achievements', i, { description: e.target.value })} placeholder="Describe..." rows={2} /></div>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('achievements', { title: '', description: '', date: '' })} className="btn-secondary w-full justify-center" id="add-achievement">
                          <Plus size={16} /> Add Achievement
                        </button>
                      </div>
                    )}

                    {/* Languages */}
                    {sId === 'languages' && (
                      <div className="space-y-4">
                        {currentResume.languages.map((lang, i) => (
                          <div key={i} className="card p-4 flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="input-label">Language</label>
                              <input className="input" value={lang.language} onChange={(e) => updateArrayItem('languages', i, { language: e.target.value })} placeholder="English" />
                            </div>
                            <div className="flex-1">
                              <label className="input-label">Proficiency</label>
                              <select className="input" value={lang.proficiency} onChange={(e) => updateArrayItem('languages', i, { proficiency: e.target.value })}>
                                <option value="native">Native</option>
                                <option value="fluent">Fluent</option>
                                <option value="advanced">Advanced</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="beginner">Beginner</option>
                              </select>
                            </div>
                            <button onClick={() => removeArrayItem('languages', i)} className="text-accent-danger hover:bg-accent-danger/10 p-2 rounded mb-0.5"><Trash2 size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('languages', { language: '', proficiency: 'intermediate' })} className="btn-secondary w-full justify-center" id="add-language">
                          <Plus size={16} /> Add Language
                        </button>
                      </div>
                    )}

                    {/* Social Links */}
                    {sId === 'social' && (
                      <div className="space-y-4">
                        {currentResume.socialLinks.map((link, i) => (
                          <div key={i} className="card p-4 flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="input-label">Platform</label>
                              <input className="input" value={link.platform} onChange={(e) => updateArrayItem('socialLinks', i, { platform: e.target.value })} placeholder="Twitter" />
                            </div>
                            <div className="flex-1">
                              <label className="input-label">URL</label>
                              <input className="input" value={link.url} onChange={(e) => updateArrayItem('socialLinks', i, { url: e.target.value })} placeholder="https://twitter.com/..." />
                            </div>
                            <button onClick={() => removeArrayItem('socialLinks', i)} className="text-accent-danger hover:bg-accent-danger/10 p-2 rounded mb-0.5"><Trash2 size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('socialLinks', { platform: '', url: '' })} className="btn-secondary w-full justify-center" id="add-social">
                          <Plus size={16} /> Add Social Link
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className={`builder-preview ${showPreview ? '' : 'hidden lg:flex'}`}>
          <div id="resume-preview-content" className="transform scale-[0.65] origin-top">
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type} fixed bottom-6 right-6 z-50`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Import Choice Modal */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-xl font-bold mb-3">Import Resume Data</h3>
            <p className="text-text-secondary text-sm mb-6">
              How would you like to apply the parsed information to your current resume?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleOverwrite}
                className="btn-danger justify-center w-full py-3"
                id="import-overwrite"
              >
                Overwrite (Replace Existing)
              </button>
              <button
                onClick={handleMerge}
                className="btn-primary justify-center w-full py-3"
                id="import-merge"
              >
                Merge (Add to Existing)
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setParsedData(null);
                }}
                className="btn-secondary justify-center w-full py-3"
                id="import-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {parsing && (
        <div className="modal-overlay">
          <div className="modal-content text-center py-10 flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-accent-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Extracting & Parsing Resume</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Our AI is extracting experience, education, skills, and personal details to fill your fields. This can take up to a minute...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
