import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as geminiService from '../services/geminiService';
import Resume from '../models/Resume';
import User from '../models/User';
const { PDFParse } = require('pdf-parse') as any;

// Helper to check AI limits for demo user
const checkDemoLimit = async (
  req: AuthRequest,
  res: Response,
  type: 'generation' | 'analysis'
): Promise<boolean> => {
  if (req.user?.email === 'demo@herocv.com') {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return false;
    }
    if (type === 'generation') {
      const count = user.aiGenerationCount || 0;
      if (count >= 3) {
        res.status(403).json({
          message: 'Demo limit reached: You can perform only 3 AI generations on the demo account.'
        });
        return false;
      }
    } else {
      const count = user.aiAnalysisCount || 0;
      if (count >= 3) {
        res.status(403).json({
          message: 'Demo limit reached: You can perform only 3 AI analyses on the demo account.'
        });
        return false;
      }
    }
  }
  return true;
};


// Helper to increment AI limits for demo user
const incrementDemoLimit = async (
  req: AuthRequest,
  type: 'generation' | 'analysis'
): Promise<void> => {
  if (req.user?.email === 'demo@herocv.com') {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        [type === 'generation' ? 'aiGenerationCount' : 'aiAnalysisCount']: 1
      }
    });
  }
};


// @desc    Generate professional summary
// @route   POST /api/ai/generate-summary
export const generateSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role, skills, experience } = req.body;
    if (!role || !skills || !experience) {
      res.status(400).json({ message: 'Role, skills, and experience are required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'generation');
    if (!isAllowed) return;

    const summary = await geminiService.generateSummary(role, skills, experience);
    await incrementDemoLimit(req, 'generation');
    res.json({ success: true, summary });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Enhance bullet point
// @route   POST /api/ai/enhance-bullet
export const enhanceBullet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { bullet, role } = req.body;
    if (!bullet) {
      res.status(400).json({ message: 'Bullet point is required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'generation');
    if (!isAllowed) return;

    const enhanced = await geminiService.enhanceBulletPoint(bullet, role || '');
    await incrementDemoLimit(req, 'generation');
    res.json({ success: true, enhanced });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Suggest skills
// @route   POST /api/ai/suggest-skills
export const suggestSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role, existingSkills } = req.body;
    if (!role) {
      res.status(400).json({ message: 'Role is required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'generation');
    if (!isAllowed) return;

    const skills = await geminiService.suggestSkills(role, existingSkills || []);
    await incrementDemoLimit(req, 'generation');
    res.json({ success: true, skills });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Improve resume
// @route   POST /api/ai/improve-resume
export const improveResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      res.status(400).json({ message: 'Resume data is required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'generation');
    if (!isAllowed) return;

    const improvements = await geminiService.improveResume(resumeData);
    await incrementDemoLimit(req, 'generation');
    res.json({ success: true, ...improvements });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Analyze ATS compatibility
// @route   POST /api/ai/ats-analyze
export const atsAnalyze = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { resumeText, resumeId } = req.body;
    if (!resumeText) {
      res.status(400).json({ message: 'Resume text is required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'analysis');
    if (!isAllowed) return;

    const analysis = await geminiService.analyzeATS(resumeText);

    let savedResumeId = resumeId;

    if (resumeId) {
      await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.user?._id },
        {
          $set: {
            atsScore: analysis.score,
            lastAnalyzed: new Date(),
          },
          $inc: { analysisCount: 1 },
        }
      );
    } else {
      try {
        const parsedData = await geminiService.parseResumeText(resumeText);
        const newResume = new Resume({
          ...parsedData,
          userId: req.user?._id,
          title: parsedData.title || `Imported ${parsedData.personalInfo?.fullName || 'Resume'}`,
          atsScore: analysis.score,
          lastAnalyzed: new Date(),
          analysisCount: 1,
        });
        const saved = await newResume.save();
        savedResumeId = saved._id;
      } catch (parseErr) {
        console.error('Failed to parse resume text for auto-creation:', parseErr);
        const newResume = new Resume({
          userId: req.user?._id,
          title: 'Imported Resume',
          summary: resumeText.substring(0, 500),
          atsScore: analysis.score,
          lastAnalyzed: new Date(),
          analysisCount: 1,
        });
        const saved = await newResume.save();
        savedResumeId = saved._id;
      }
    }

    await incrementDemoLimit(req, 'analysis');
    res.json({ success: true, resumeId: savedResumeId, ...analysis });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Match job description
// @route   POST /api/ai/job-match
export const jobMatch = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { resumeText, jobDescription, resumeId } = req.body;
    if (!resumeText || !jobDescription) {
      res.status(400).json({ message: 'Resume text and job description are required' });
      return;
    }
    const isAllowed = await checkDemoLimit(req, res, 'analysis');
    if (!isAllowed) return;

    const match = await geminiService.matchJobDescription(resumeText, jobDescription);

    if (resumeId) {
      await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.user?._id },
        {
          $set: {
            lastAnalyzed: new Date(),
          },
          $inc: { analysisCount: 1 },
        }
      );
    }

    await incrementDemoLimit(req, 'analysis');
    res.json({ success: true, ...match });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'AI service error' });
  }
};

// @desc    Analyze ATS compatibility from uploaded PDF file
// @route   POST /api/ai/ats-analyze-file
export const atsAnalyzeFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { resumeId } = req.body;

    // Parse PDF buffer to text
    const uint8Array = new Uint8Array(
      req.file.buffer.buffer,
      req.file.buffer.byteOffset,
      req.file.buffer.byteLength
    );
    const pdf = new PDFParse(uint8Array);
    const parsed = await pdf.getText();
    const resumeText = parsed.text;

    if (!resumeText || !resumeText.trim()) {
      res.status(400).json({ message: 'Could not extract text from PDF file. Make sure it is not scanned or empty.' });
      return;
    }

    const isAllowed = await checkDemoLimit(req, res, 'analysis');
    if (!isAllowed) return;

    const analysis = await geminiService.analyzeATS(resumeText);

    let savedResumeId = resumeId;

    if (resumeId) {
      await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.user?._id },
        {
          $set: {
            atsScore: analysis.score,
            lastAnalyzed: new Date(),
          },
          $inc: { analysisCount: 1 },
        }
      );
    } else {
      try {
        const parsedData = await geminiService.parseResumeText(resumeText);
        const newResume = new Resume({
          ...parsedData,
          userId: req.user?._id,
          title: parsedData.title || `Imported ${parsedData.personalInfo?.fullName || 'Resume'}`,
          atsScore: analysis.score,
          lastAnalyzed: new Date(),
          analysisCount: 1,
        });
        const saved = await newResume.save();
        savedResumeId = saved._id;
      } catch (parseErr) {
        console.error('Failed to parse resume text for auto-creation:', parseErr);
        const newResume = new Resume({
          userId: req.user?._id,
          title: 'Imported Resume',
          summary: resumeText.substring(0, 500),
          atsScore: analysis.score,
          lastAnalyzed: new Date(),
          analysisCount: 1,
        });
        const saved = await newResume.save();
        savedResumeId = saved._id;
      }
    }

    await incrementDemoLimit(req, 'analysis');
    res.json({ success: true, resumeText, resumeId: savedResumeId, ...analysis });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'File analysis failed' });
  }
};

// @desc    Extract text from uploaded PDF file
// @route   POST /api/ai/extract-text
export const extractText = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const uint8Array = new Uint8Array(
      req.file.buffer.buffer,
      req.file.buffer.byteOffset,
      req.file.buffer.byteLength
    );
    const pdf = new PDFParse(uint8Array);
    const parsed = await pdf.getText();
    const text = parsed.text;

    if (!text || !text.trim()) {
      res.status(400).json({ message: 'Could not extract text from PDF file. Make sure it is not scanned or empty.' });
      return;
    }

    res.json({ success: true, text });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'File extraction failed' });
  }
};

// @desc    Parse resume from uploaded PDF file using Gemini
// @route   POST /api/ai/parse-resume
export const parseResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const uint8Array = new Uint8Array(
      req.file.buffer.buffer,
      req.file.buffer.byteOffset,
      req.file.buffer.byteLength
    );
    const pdf = new PDFParse(uint8Array);
    const parsed = await pdf.getText();
    const text = parsed.text;

    if (!text || !text.trim()) {
      res.status(400).json({ message: 'Could not extract text from PDF file. Make sure it is not scanned or empty.' });
      return;
    }

    const isAllowed = await checkDemoLimit(req, res, 'generation');
    if (!isAllowed) return;

    const parsedData = await geminiService.parseResumeText(text);
    await incrementDemoLimit(req, 'generation');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'File parsing failed' });
  }
};

