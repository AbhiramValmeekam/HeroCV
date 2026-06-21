import React, { createContext, useContext, useState, useCallback } from 'react';
import { Resume, emptyResume } from '../types/resume.types';
import { resumeService } from '../services/resumeService';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume;
  loading: boolean;
  error: string | null;
  fetchResumes: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  setCurrentResume: React.Dispatch<React.SetStateAction<Resume>>;
  createResume: (resume?: Partial<Resume>) => Promise<Resume>;
  saveResume: () => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<void>;
  updateField: <K extends keyof Resume>(field: K, value: Resume[K]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume>({ ...emptyResume });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { resumes } = await resumeService.getAll();
      setResumes(resumes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadResume = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { resume } = await resumeService.getOne(id);
      setCurrentResume(resume);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  }, []);

  const createResume = async (resumeData?: Partial<Resume>): Promise<Resume> => {
    setLoading(true);
    try {
      const { resume } = await resumeService.create(resumeData || emptyResume);
      setResumes((prev) => [resume, ...prev]);
      setCurrentResume(resume);
      return resume;
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!currentResume._id) return;
    setLoading(true);
    setError(null);
    try {
      const { resume } = await resumeService.update(currentResume._id, currentResume);
      setCurrentResume(resume);
      setResumes((prev) =>
        prev.map((r) => (r._id === resume._id ? resume : r))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    try {
      await resumeService.remove(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (currentResume._id === id) {
        setCurrentResume({ ...emptyResume });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const duplicateResume = async (id: string) => {
    try {
      const { resume } = await resumeService.duplicate(id);
      setResumes((prev) => [resume, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to duplicate resume');
    }
  };

  const updateField = <K extends keyof Resume>(field: K, value: Resume[K]) => {
    setCurrentResume((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        loading,
        error,
        fetchResumes,
        loadResume,
        setCurrentResume,
        createResume,
        saveResume,
        deleteResume,
        duplicateResume,
        updateField,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
