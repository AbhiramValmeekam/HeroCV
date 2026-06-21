import { Router } from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../controllers/resumeController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/').get(getResumes).post(createResume);
router.route('/:id').get(getResume).put(updateResume).delete(deleteResume);
router.post('/:id/duplicate', duplicateResume);

export default router;
