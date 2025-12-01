import express from 'express';
import { body } from 'express-validator';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  updateWorkerStatus,
  getWorkerComplaints
} from '../controllers/workerController.js';

const router = express.Router();

router.get('/', authenticateAdmin, getAllWorkers);

router.get('/:id', authenticateAdmin, getWorkerById);

router.get('/:id/complaints', authenticateAdmin, getWorkerComplaints);

router.post(
  '/',
  authenticateAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9+\-\s()]+$/).withMessage('Valid phone number is required')
  ],
  createWorker
);

router.put('/:id', authenticateAdmin, updateWorker);

router.put(
  '/:id/status',
  authenticateAdmin,
  [body('status').notEmpty().withMessage('Status is required')],
  updateWorkerStatus
);

export default router;
