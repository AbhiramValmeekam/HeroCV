import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { aiService } from '../services/aiService';
import { JobMatchResult } from '../types/ai.types';
import { resumeToPlainText } from '../utils/pdfExport';
import {
  Target,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Upload,
  UploadCloud,
} from 'lucide-react';

const JobMatcherPage: React.FC = () => {
  const { resumes, fetchResumes } = useResume();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleSelectResume = (id: string) => {
    setSelectedResumeId(id);
    const resume = resumes.find((r) => r._id === id);
    if (resume) {
      setResumeText(resumeToPlainText(resume));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await aiService.extractText(file);
      setResumeText(res.text);
      setSelectedResumeId(''); // Clear selection if file uploaded
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract text from file.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Both resume and job description are required');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await aiService.matchJob(resumeText, jobDescription, selectedResumeId);
      setResult(data);
      if (selectedResumeId) {
        fetchResumes();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Matching failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Job Description Matcher</span>
        </h1>
        <p className="text-text-secondary">Compare your resume against a job posting to optimize your application</p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resume Input */}
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText size={16} className="text-accent-primary" />
            Your Resume
          </h3>
          <select
            value={selectedResumeId}
            onChange={(e) => handleSelectResume(e.target.value)}
            className="input mb-3"
            id="match-resume-select"
          >
            <option value="">— Select a saved resume —</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>{r.title}</option>
            ))}
          </select>

          {/* File Upload Zone */}
          <div className="mb-4">
            <label className="input-label flex items-center gap-2">
              <Upload size={14} />
              Or upload your PDF Resume
            </label>
            <div 
              className="border-2 border-dashed border-border hover:border-accent-primary rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-bg-primary/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('match-file-upload')?.click()}
            >
              <input 
                type="file" 
                id="match-file-upload" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <UploadCloud size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-primary">Drag & Drop your resume PDF here</p>
              <p className="text-xs text-text-muted mt-1">Only PDF format supported (Max 50MB)</p>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="textarea"
            rows={10}
            placeholder="Select a resume or paste text..."
            id="match-resume-text"
          />
        </div>

        {/* Job Description Input */}
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target size={16} className="text-accent-secondary" />
            Job Description
          </h3>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="textarea"
            rows={13}
            placeholder="Paste the job description here..."
            id="match-job-description"
          />
        </div>
      </div>

      <button
        onClick={handleMatch}
        className="btn-primary w-full justify-center py-3 text-base mb-6"
        disabled={loading || !resumeText.trim() || !jobDescription.trim()}
        id="match-analyze-btn"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Matching with AI...
          </>
        ) : (
          <>
            <Target size={18} />
            Analyze Match
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 bg-accent-danger/10 border border-accent-danger/20 text-accent-danger rounded-xl px-4 py-3 text-sm mb-6">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="card text-center py-16">
          <Loader2 size={48} className="text-accent-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Match</h3>
          <p className="text-text-secondary text-sm">AI is comparing your resume to the job description...</p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Match Score */}
          <div className="card text-center lg:col-span-1">
            <div className="inline-block relative mb-4">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="80" cy="80" r="68" fill="none"
                  stroke={getScoreColor(result.matchScore)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.matchScore / 100) * 427} 427`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold" style={{ color: getScoreColor(result.matchScore) }}>{result.matchScore}%</span>
                <span className="text-xs text-text-muted">Match</span>
              </div>
            </div>
            <p className="text-lg font-semibold" style={{ color: getScoreColor(result.matchScore) }}>
              {result.matchScore >= 80 ? 'Strong Match' : result.matchScore >= 60 ? 'Moderate Match' : 'Weak Match'}
            </p>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Matched Keywords */}
            {result.matchedKeywords.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-accent-success" />
                  Matched Keywords ({result.matchedKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((kw, i) => (
                    <span key={i} className="badge badge-success">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.missingSkills.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <XCircle size={16} className="text-accent-danger" />
                  Missing Skills ({result.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <span key={i} className="badge badge-danger">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Keywords */}
            {result.recommendedKeywords.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-accent-primary" />
                  Recommended Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedKeywords.map((kw, i) => (
                    <span key={i} className="badge badge-primary">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-accent-warning" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <ArrowRight size={14} className="text-accent-warning mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcherPage;
