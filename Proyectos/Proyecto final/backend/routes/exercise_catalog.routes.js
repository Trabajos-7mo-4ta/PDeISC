import { Router } from 'express';
import {
  getAllExercises,
  createExercise,
  deleteExercise
} from '../controllers/exercise_catalog.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getAllExercises);
router.post('/', verifyToken, createExercise);
router.delete('/:id', verifyToken, deleteExercise);

export default router;