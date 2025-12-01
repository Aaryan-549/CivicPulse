import express from 'express';
import { authenticateAdmin, authenticateUser } from '../middleware/auth.js';
import {
  getUserProfile,
  getAllUsers,
  getUserById,
  getUserComplaintsById
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticateUser, getUserProfile);

router.get('/', authenticateAdmin, getAllUsers);

router.get('/:id', authenticateAdmin, getUserById);

router.get('/:id/complaints', authenticateAdmin, getUserComplaintsById);

export default router;
