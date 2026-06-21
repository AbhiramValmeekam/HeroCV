import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { aiService } from '../services/aiService';
import { ATSAnalysis } from '../types/ai.types';
import { resumeToPlainText } from '../utils/pdfExport';
import {
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Upload,
  UploadCloud,
} from 'lucide-react';

const ATSAnalyzerPage: React.FC = () => {
  const { resumes, fetchResumes } = useResume();
  const [searchParams] = useSearchParams();
  const queryResumeId = searchParams.get('resumeId');
  const [resumeText, setResumeText] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  useEffect(() => {
    if (queryResumeId && resumes.length > 0) {
      setSelectedResumeId(queryResumeId);
      const resume = resumes.find((r) => r._id === queryResumeId);
      if (resume) {
        setResumeText(resumeToPlainText(resume));
      }
    }
  }, [queryResumeId, resumes]);

  const handleSelectResume = async (id: string) => {
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
    setAnalysis(null);
    try {
      const result = await aiService.analyzeATSFile(file, selectedResumeId);
      setResumeText(result.resumeText);
      setAnalysis(result);
      await fetchResumes();
      if (result.resumeId) {
        setSelectedResumeId(result.resumeId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload and analyze file.');
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

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter or select a resume to analyze');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await aiService.analyzeATS(resumeText, selectedResumeId);
      setAnalysis(result);
      await fetchResumes();
      if (result.resumeId) {
        setSelectedResumeId(result.resumeId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">ATS Resume Analyzer</span>
        </h1>
        <p className="text-text-secondary">Analyze your resume for ATS compatibility and get actionable improvement suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Resume Selector */}
          <div className="card">
            <label className="input-label flex items-center gap-2">
              <FileText size={14} />
              Select an existing resume or paste text
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => handleSelectResume(e.target.value)}
              className="input mb-4"
              id="ats-resume-select"
            >
              <option value="">— Select a saved resume —</option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title} {r.personalInfo?.fullName ? `(${r.personalInfo.fullName})` : ''}
                </option>
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
                onClick={() => document.getElementById('ats-file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="ats-file-upload" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <UploadCloud size={32} className="text-text-muted mx-auto mb-2" />
                <p className="text-sm font-medium text-text-primary">Drag & Drop your resume PDF here</p>
                <p className="text-xs text-text-muted mt-1">Only PDF format supported (Max 50MB)</p>
              </div>
            </div>

            <label className="input-label">Resume Content</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="textarea"
              rows={16}
              placeholder="Paste your resume text here or select a saved resume above..."
              id="ats-resume-text"
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="btn-primary w-full justify-center py-3 text-base"
            disabled={loading || !resumeText.trim()}
            id="ats-analyze-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <ScanSearch size={18} />
                Analyze Resume
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-2 bg-accent-danger/10 border border-accent-danger/20 text-accent-danger rounded-xl px-4 py-3 text-sm">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {!analysis && !loading && (
            <div className="card text-center py-16">
              <ScanSearch size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
              <p className="text-text-secondary text-sm">Select a resume or paste text, then click Analyze</p>
            </div>
          )}

          {loading && (
            <div className="card text-center py-16">
              <Loader2 size={48} className="text-accent-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Resume</h3>
              <p className="text-text-secondary text-sm">AI is evaluating ATS compatibility...</p>
            </div>
          )}

          {analysis && (
            <>
              {/* Score Card */}
              <div className="card text-center">
                <div className="inline-block relative mb-4">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="70" cy="70" r="60" fill="none"
                      stroke={getScoreColor(analysis.score)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(analysis.score / 100) * 377} 377`}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: getScoreColor(analysis.score) }}>{analysis.score}</span>
                    <span className="text-xs text-text-muted">/ 100</span>
                  </div>
                </div>
                <p className="text-lg font-semibold" style={{ color: getScoreColor(analysis.score) }}>{getScoreLabel(analysis.score)}</p>
                <p className="text-sm text-text-secondary mt-1">ATS Compatibility Score</p>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-accent-danger" />
                    Missing Keywords ({analysis.missingKeywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="badge badge-danger">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatting Issues */}
              {analysis.formattingIssues.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-accent-warning" />
                    Formatting Issues ({analysis.formattingIssues.length})
                  </h3>
                  <ul className="space-y-2">
                    {analysis.formattingIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent-warning mt-1">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weak Bullets */}
              {analysis.weakBulletPoints.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-accent-primary" />
                    Weak Bullet Points ({analysis.weakBulletPoints.length})
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weakBulletPoints.map((bp, i) => (
                      <li key={i} className="text-sm text-text-secondary bg-bg-primary/50 rounded-lg p-3">{bp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Sections */}
              {analysis.missingSections.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-accent-danger" />
                    Missing Sections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSections.map((sec, i) => (
                      <span key={i} className="badge badge-warning">{sec}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-accent-success" />
                    Recommended Improvements
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Sparkles size={14} className="text-accent-success mt-0.5 flex-shrink-0" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzerPage;
