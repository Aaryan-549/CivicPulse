import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, loginAdmin, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/user/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9+\-\s()]+$/).withMessage('Valid phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

router.post(
  '/user/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginUser
);

router.post(
  '/admin/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginAdmin
);

router.post('/refresh', refreshToken);

export default router;
