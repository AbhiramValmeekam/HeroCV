import api from './api';
import { Resume } from '../types/resume.types';

export const resumeService = {
  async getAll(): Promise<{ success: boolean; resumes: Resume[] }> {
    const { data } = await api.get('/resumes');
    return data;
  },

  async getOne(id: string): Promise<{ success: boolean; resume: Resume }> {
    const { data } = await api.get(`/resumes/${id}`);
    return data;
  },

  async create(resume: Partial<Resume>): Promise<{ success: boolean; resume: Resume }> {
    const { data } = await api.post('/resumes', resume);
    return data;
  },

  async update(id: string, resume: Partial<Resume>): Promise<{ success: boolean; resume: Resume }> {
    const { data } = await api.put(`/resumes/${id}`, resume);
    return data;
  },

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete(`/resumes/${id}`);
    return data;
  },

  async duplicate(id: string): Promise<{ success: boolean; resume: Resume }> {
    const { data } = await api.post(`/resumes/${id}/duplicate`);
    return data;
  },
};
