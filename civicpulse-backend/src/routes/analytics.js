import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getHeatmapData,
  getDashboardStats,
  getTrendsData,
  getCategories
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/heatmap', authenticateAdmin, getHeatmapData);

router.get('/dashboard', authenticateAdmin, getDashboardStats);

router.get('/trends', authenticateAdmin, getTrendsData);

router.get('/categories', authenticateAdmin, getCategories);

export default router;
