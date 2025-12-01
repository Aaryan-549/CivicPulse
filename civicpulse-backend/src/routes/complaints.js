import express from 'express';
import { body } from 'express-validator';
import { upload } from '../middleware/upload.js';
import { authenticateUser, authenticateAdmin, authenticateAny } from '../middleware/auth.js';
import {
  createCivicComplaint,
  createTrafficComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  assignWorker,
  updateComplaintStatus,
  rejectComplaint,
  getComplaintsByCategory,
  getComplaintStats,
  deleteComplaint
} from '../controllers/complaintController.js';

const router = express.Router();

router.post(
  '/civic',
  authenticateUser,
  upload.single('image'),
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('subcategory').notEmpty().withMessage('Subcategory is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').isFloat().withMessage('Valid latitude is required'),
    body('longitude').isFloat().withMessage('Valid longitude is required')
  ],
  createCivicComplaint
);

router.post(
  '/traffic',
  authenticateUser,
  upload.single('image'),
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('subcategory').notEmpty().withMessage('Subcategory is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').isFloat().withMessage('Valid latitude is required'),
    body('longitude').isFloat().withMessage('Valid longitude is required')
  ],
  createTrafficComplaint
);

router.get('/', authenticateAdmin, getAllComplaints);

router.get('/stats', authenticateAdmin, getComplaintStats);

router.get('/user', authenticateUser, getUserComplaints);

router.get('/category/:category', authenticateAdmin, getComplaintsByCategory);

router.get('/:id', authenticateAny, getComplaintById);

router.put(
  '/:id/assign',
  authenticateAdmin,
  [body('workerId').notEmpty().withMessage('Worker ID is required')],
  assignWorker
);

router.put(
  '/:id/status',
  authenticateAdmin,
  [body('status').notEmpty().withMessage('Status is required')],
  updateComplaintStatus
);

router.post('/:id/reject', authenticateAdmin, rejectComplaint);

router.delete('/:id', authenticateAdmin, deleteComplaint);

export default router;
