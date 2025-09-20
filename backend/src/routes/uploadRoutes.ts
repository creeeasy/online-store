// routes/uploadRoutes.ts (Updated)
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth';
import { ResponseHandler, asyncHandler } from '../utils/responseHandler';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return ResponseHandler.error(
        res,
        'File too large. Maximum size is 5MB.',
        413,
        [],
        'FILE_TOO_LARGE'
      );
    }
    return ResponseHandler.error(
      res,
      'File upload error',
      400,
      [],
      'UPLOAD_ERROR'
    );
  } else if (error) {
    return ResponseHandler.error(
      res,
      error.message,
      400,
      [],
      'UPLOAD_ERROR'
    );
  }
  next();
};

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', 
  protect,
  upload.single('image'),
  handleMulterError,
  asyncHandler(async (req: any, res: any) => {
    if (!req.file) {
      return ResponseHandler.error(
        res,
        'No image file provided',
        400,
        [],
        'NO_IMAGE_PROVIDED'
      );
    }

    // In production, you might want to upload to cloud storage (S3, Cloudinary, etc.)
    const imageUrl = `/uploads/${req.file.filename}`;

    return ResponseHandler.success(
      res,
      { imageUrl },
      'Image uploaded successfully'
    );
  })
);

// Serve uploaded files statically
router.use('/uploads', express.static(uploadDir));

export default router;