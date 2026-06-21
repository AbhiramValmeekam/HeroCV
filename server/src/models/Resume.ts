import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface IExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface ISkillCategory {
  category: string;
  items: string[];
}

export interface ICertification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface IAchievement {
  title: string;
  description: string;
  date?: string;
}

export interface ILanguage {
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
}

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface ICustomSection {
  title: string;
  items: Array<{
    heading: string;
    subheading?: string;
    description: string;
    date?: string;
  }>;
}

export interface IPersonalInfo {
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

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: 'modern' | 'ats' | 'minimal' | 'creative' | 'executive' | 'professional' | 'academic' | 'tech_minimal' | 'elegant_serif' | 'corporate_dark' | 'modern_bordered' | 'vibrant_tech' | 'simple_compact' | 'startup_modern' | 'visual_bold' | 'infographic';
  personalInfo: IPersonalInfo;
  summary: string;
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  skills: ISkillCategory[];
  certifications: ICertification[];
  achievements: IAchievement[];
  languages: ILanguage[];
  socialLinks: ISocialLink[];
  customSections: ICustomSection[];
  atsScore?: number;
  lastAnalyzed?: Date;
  analysisCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      enum: ['modern', 'ats', 'minimal', 'creative', 'executive', 'professional', 'academic', 'tech_minimal', 'elegant_serif', 'corporate_dark', 'modern_bordered', 'vibrant_tech', 'simple_compact', 'startup_modern', 'visual_bold', 'infographic'],
      default: 'modern',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: String,
        description: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        bullets: [String],
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String,
        bullets: [String],
      },
    ],
    skills: [
      {
        category: String,
        items: [String],
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        date: String,
      },
    ],
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ['native', 'fluent', 'advanced', 'intermediate', 'beginner'],
        },
      },
    ],
    socialLinks: [
      {
        platform: String,
        url: String,
      },
    ],
    customSections: [
      {
        title: String,
        items: [
          {
            heading: String,
            subheading: String,
            description: String,
            date: String,
          },
        ],
      },
    ],
    atsScore: { type: Number, min: 0, max: 100 },
    lastAnalyzed: Date,
    analysisCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResume>('Resume', resumeSchema);
