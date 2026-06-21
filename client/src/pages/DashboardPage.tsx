import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { aiService } from '../services/aiService';
import {
  Plus,
  FileText,
  ScanSearch,
  Target,
  Clock,
  MoreVertical,
  Copy,
  Trash2,
  Edit3,
  Sparkles,
  TrendingUp,
  Award,
  Upload,
  Loader2,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { resumes, fetchResumes, createResume, deleteResume, duplicateResume, loading } = useResume();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scoredResumes = resumes.filter((r) => r.atsScore !== undefined && r.atsScore !== null);
  const analyzedResumes = resumes.filter((r) => r.lastAnalyzed !== undefined && r.lastAnalyzed !== null);

  useEffect(() => {
    fetchResumes();

    const handleFocus = () => {
      fetchResumes();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchResumes();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchResumes]);

  const handleCreateResume = async () => {
    const resume = await createResume();
    if (resume._id) navigate(`/builder/${resume._id}`);
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
    setErrorMsg(null);

    try {
      const response = await aiService.parseResume(file);
      if (response.success && response.data) {
        const created = await createResume(response.data);
        if (created._id) {
          navigate(`/builder/${created._id}`);
        }
      } else {
        throw new Error('Parsing failed');
      }
    } catch (err: any) {
      console.error('Resume parsing failed:', err);
      const errMsg = err.response?.data?.message || 'Failed to parse resume. Make sure it is a valid text-based PDF and your Gemini API key is configured.';
      setErrorMsg(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateResume(id);
    setMenuOpen(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
    setMenuOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteResume(deleteConfirmId);
        showToast('Resume deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete resume', 'error');
      } finally {
        setDeleteConfirmId(null);
      }
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = [
    {
      label: 'Total Resumes',
      value: resumes.length,
      icon: FileText,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.12)',
    },
    {
      label: 'Avg ATS Score',
      value: scoredResumes.length > 0
        ? Math.round(
            scoredResumes.reduce((a, r) => a + (r.atsScore || 0), 0) /
            scoredResumes.length
          )
        : '--',
      icon: TrendingUp,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      label: 'Best Score',
      value: scoredResumes.length > 0
        ? Math.max(...scoredResumes.map((r) => r.atsScore || 0))
        : '--',
      icon: Award,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      label: 'AI Analyses',
      value: resumes.reduce((acc, r) => acc + (r.analysisCount || 0), 0),
      icon: Sparkles,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.12)',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-text-secondary">Manage your resumes and track your progress</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
            id="dashboard-file-upload-input"
          />
          <button onClick={handleUploadClick} className="btn-secondary" id="upload-resume-btn" disabled={parsing}>
            <Upload size={18} />
            Upload PDF
          </button>
          <button onClick={handleCreateResume} className="btn-primary" id="create-resume-btn" disabled={parsing}>
            <Plus size={18} />
            New Resume
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={handleCreateResume}
          className="glass-card p-5 text-left flex items-center gap-4 cursor-pointer"
          id="quick-create"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-primary/15 flex items-center justify-center">
            <Plus size={20} className="text-accent-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Create Resume</p>
            <p className="text-xs text-text-muted">Start from scratch</p>
          </div>
        </button>
        <button
          onClick={handleUploadClick}
          className="glass-card p-5 text-left flex items-center gap-4 cursor-pointer"
          id="quick-upload"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-secondary/15 flex items-center justify-center">
            <Upload size={20} className="text-accent-secondary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Upload & Parse</p>
            <p className="text-xs text-text-muted">Extract from existing PDF</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/ats-analyzer')}
          className="glass-card p-5 text-left flex items-center gap-4 cursor-pointer"
          id="quick-ats"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <ScanSearch size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">ATS Analyzer</p>
            <p className="text-xs text-text-muted">Check your score</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/job-matcher')}
          className="glass-card p-5 text-left flex items-center gap-4 cursor-pointer"
          id="quick-match"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Target size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Job Matcher</p>
            <p className="text-xs text-text-muted">Match to a job</p>
          </div>
        </button>
      </div>

      {/* Resumes Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
      </div>

      {loading && resumes.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner spinner-lg"></div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20 card">
          <FileText size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
          <p className="text-text-secondary mb-6">Create your first resume to get started</p>
          <button onClick={handleCreateResume} className="btn-primary mx-auto" id="empty-state-create">
            <Plus size={18} />
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resumes.map((resume, index) => (
            <div
              key={resume._id}
              className="card card-hover cursor-pointer animate-fade-in relative"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleEdit(resume._id!)}
            >
              {/* Template badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-primary capitalize">{resume.template}</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === resume._id ? null : resume._id!);
                    }}
                    className="p-1 rounded-lg hover:bg-bg-tertiary transition-colors"
                    id={`menu-${resume._id}`}
                  >
                    <MoreVertical size={16} className="text-text-muted" />
                  </button>
                  {menuOpen === resume._id && (
                    <div className="absolute right-0 top-8 bg-bg-secondary border border-border rounded-xl shadow-xl z-10 min-w-[150px] py-1 animate-scale-in">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(resume._id!); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/ats-analyzer?resumeId=${resume._id}`); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                      >
                        <ScanSearch size={14} /> Analyze ATS
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(resume._id!); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                      >
                        <Copy size={14} /> Duplicate
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(resume._id!); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-danger hover:bg-accent-danger/10"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume info */}
              <h3 className="font-semibold text-lg mb-1 truncate">{resume.title}</h3>
              <p className="text-sm text-text-muted mb-3 truncate">
                {resume.personalInfo?.fullName || 'No name set'} {resume.personalInfo?.jobTitle ? `• ${resume.personalInfo.jobTitle}` : ''}
              </p>

              {/* Sections filled */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {resume.experience?.length > 0 && <span className="badge badge-success text-[10px]">Experience</span>}
                {resume.education?.length > 0 && <span className="badge badge-success text-[10px]">Education</span>}
                {resume.skills?.length > 0 && <span className="badge badge-success text-[10px]">Skills</span>}
                {resume.projects?.length > 0 && <span className="badge badge-success text-[10px]">Projects</span>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(resume.updatedAt)}
                </div>
                {resume.atsScore !== undefined && resume.atsScore !== null && (
                  <div className={`font-semibold ${resume.atsScore >= 70 ? 'text-accent-success' : resume.atsScore >= 50 ? 'text-accent-warning' : 'text-accent-danger'}`}>
                    ATS: {resume.atsScore}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {parsing && (
        <div className="modal-overlay">
          <div className="modal-content text-center py-10 flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-accent-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Analyzing & Parsing Resume</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Our AI is extracting experience, education, skills, and personal details to build your resume. This can take up to a minute...
            </p>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-accent-danger">
              <Trash2 size={22} className="text-accent-danger" />
              Confirm Delete
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to delete this resume? This action cannot be undone and all data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-danger bg-accent-danger text-white px-4 py-2 rounded-xl hover:bg-accent-danger/90 transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type} fixed bottom-6 right-6 z-50`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
