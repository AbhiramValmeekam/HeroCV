import { Response } from 'express';
import Resume from '../models/Resume';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all resumes for user
// @route   GET /api/resumes
export const getResumes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.user?._id }).sort({
      updatedAt: -1,
    });
    res.json({ success: true, resumes });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
export const getResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create resume
// @route   POST /api/resumes
export const createResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user?._id,
    };
    const resume = await Resume.create(resumeData);
    res.status(201).json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
export const updateResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Strip AI-managed fields so that resume saves never overwrite
    // scores and counters that are exclusively managed by the AI endpoints
    const { atsScore, lastAnalyzed, analysisCount, ...updateData } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
export const deleteResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
export const duplicateResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!original) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const duplicateData = original.toObject();
    delete (duplicateData as any)._id;
    delete (duplicateData as any).createdAt;
    delete (duplicateData as any).updatedAt;
    duplicateData.title = `${original.title} (Copy)`;

    const newResume = await Resume.create(duplicateData);
    res.status(201).json({ success: true, resume: newResume });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
