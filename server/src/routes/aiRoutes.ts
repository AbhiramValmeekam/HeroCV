import { Router } from 'express';
import multer from 'multer';
import {
  generateSummary,
  enhanceBullet,
  suggestSkills,
  improveResume,
  atsAnalyze,
  atsAnalyzeFile,
  jobMatch,
  extractText,
  parseResume,
} from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB size limit
});

router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/enhance-bullet', enhanceBullet);
router.post('/suggest-skills', suggestSkills);
router.post('/improve-resume', improveResume);
router.post('/ats-analyze', atsAnalyze);
router.post('/ats-analyze-file', upload.single('file'), atsAnalyzeFile);
router.post('/extract-text', upload.single('file'), extractText);
router.post('/parse-resume', upload.single('file'), parseResume);
router.post('/job-match', jobMatch);

export default router;
