export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobTitle?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Achievement {
  title: string;
  description: string;
  date?: string;
}

export interface Language {
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CustomSectionItem {
  heading: string;
  subheading?: string;
  description: string;
  date?: string;
}

export interface CustomSection {
  title: string;
  items: CustomSectionItem[];
}

export type TemplateType = 'modern' | 'ats' | 'minimal' | 'creative' | 'executive' | 'professional' | 'academic' | 'tech_minimal' | 'elegant_serif' | 'corporate_dark' | 'modern_bordered' | 'vibrant_tech' | 'simple_compact' | 'startup_modern' | 'visual_bold' | 'infographic';

export interface Resume {
  _id?: string;
  userId?: string;
  title: string;
  template: TemplateType;
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  socialLinks: SocialLink[];
  customSections: CustomSection[];
  atsScore?: number;
  lastAnalyzed?: string;
  analysisCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const emptyResume: Resume = {
  title: 'Untitled Resume',
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    jobTitle: '',
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  languages: [],
  socialLinks: [],
  customSections: [],
};
