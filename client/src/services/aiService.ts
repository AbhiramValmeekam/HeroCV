import api from './api';
import {
  AISummaryRequest,
  AIBulletRequest,
  AISkillsRequest,
  AISkillsSuggestion,
  AIImproveResponse,
  ATSAnalysis,
  JobMatchResult,
} from '../types/ai.types';

export const aiService = {
  async generateSummary(request: AISummaryRequest): Promise<{ success: boolean; summary: string }> {
    const { data } = await api.post('/ai/generate-summary', request);
    return data;
  },

  async enhanceBullet(request: AIBulletRequest): Promise<{ success: boolean; enhanced: string }> {
    const { data } = await api.post('/ai/enhance-bullet', request);
    return data;
  },

  async suggestSkills(request: AISkillsRequest): Promise<{ success: boolean; skills: AISkillsSuggestion }> {
    const { data } = await api.post('/ai/suggest-skills', request);
    return data;
  },

  async improveResume(resumeData: any): Promise<{ success: boolean } & AIImproveResponse> {
    const { data } = await api.post('/ai/improve-resume', { resumeData });
    return data;
  },

  async analyzeATS(resumeText: string, resumeId?: string): Promise<{ success: boolean } & ATSAnalysis> {
    const { data } = await api.post('/ai/ats-analyze', { resumeText, resumeId });
    return data;
  },

  async analyzeATSFile(file: File, resumeId?: string): Promise<{ success: boolean; resumeText: string } & ATSAnalysis> {
    const formData = new FormData();
    formData.append('file', file);
    if (resumeId) {
      formData.append('resumeId', resumeId);
    }
    const { data } = await api.post('/ai/ats-analyze-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async matchJob(resumeText: string, jobDescription: string, resumeId?: string): Promise<{ success: boolean } & JobMatchResult> {
    const { data } = await api.post('/ai/job-match', { resumeText, jobDescription, resumeId });
    return data;
  },

  async extractText(file: File): Promise<{ success: boolean; text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/ai/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async parseResume(file: File): Promise<{ success: boolean; data: any }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/ai/parse-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
