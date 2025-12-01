import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateAny } from '../middleware/auth.js';
import { uploadImage } from '../services/cloudinaryService.js';
import { formatResponse } from '../utils/helpers.js';

const router = express.Router();

router.post('/upload', authenticateAny, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatResponse(false, null, 'No image provided'));
    }

    const result = await uploadImage(req.file.buffer, 'uploads');

    res.json(formatResponse(true, {
      url: result.secure_url,
      publicId: result.public_id
    }, 'Image uploaded successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;
