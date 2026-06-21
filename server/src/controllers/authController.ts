import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
  } as any);
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Auto-create/seed demo user if logging in with demo credentials
    if (email === 'demo@herocv.com') {
      const demoExists = await User.findOne({ email });
      if (!demoExists) {
        const demoUser = await User.create({
          name: 'Demo User',
          email: 'demo@herocv.com',
          password: 'demopass123',
        });

        // Seed a demo resume
        const Resume = require('../models/Resume').default;
        await Resume.create({
          userId: demoUser._id,
          title: 'Software Engineer Resume (Demo)',
          template: 'modern',
          personalInfo: {
            fullName: 'Alex Carter',
            jobTitle: 'Senior Full Stack Engineer',
            email: 'alex.carter@example.com',
            phone: '+1 (555) 019-2834',
            location: 'San Francisco, CA',
            website: 'https://alexcarter.dev',
            linkedin: 'linkedin.com/in/alexcarter',
            github: 'github.com/alexcarter',
          },
          summary: 'Experienced Software Engineer with over 5 years of experience building scalable web applications. Specialized in React, Node.js, and cloud architectures. Passionate about writing clean code and improving system performance.',
          experience: [
            {
              company: 'TechCorp Solutions',
              position: 'Senior Software Engineer',
              location: 'San Francisco, CA',
              startDate: 'Jan 2021',
              endDate: 'Present',
              current: true,
              bullets: [
                'Architected and implemented a high-throughput microservices pipeline, reducing latency by 40%',
                'Led a team of 4 junior developers to rebuild the legacy admin dashboard using React and TypeScript',
                'Optimized MongoDB query performance, decreasing database load during peak hours by 25%',
              ],
            },
          ],
          skills: [
            { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'] },
            { category: 'Frameworks', items: ['React', 'Node.js', 'Express', 'Next.js', 'Django'] },
          ],
          education: [
            {
              institution: 'Stanford University',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: 'Sep 2014',
              endDate: 'Jun 2018',
              gpa: '3.8/4.0',
            },
          ],
        });
      }
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken((user._id as any).toString());
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google login
// @route   POST /api/auth/google
export const googleLogin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ message: 'Google credential token is required' });
      return;
    }

    // Verify Google ID token
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ message: 'Invalid Google token payload' });
      return;
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    if (!email) {
      res.status(400).json({ message: 'Google account must provide an email' });
      return;
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      let isModified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isModified = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        isModified = true;
      }
      if (isModified) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        avatar: avatar || '',
      });
    }

    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Google login failed' });
  }
};
