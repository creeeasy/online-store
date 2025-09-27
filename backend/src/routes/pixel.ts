import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { getPixelParameters, savePixelParameters, updatePixelParameters } from '../controllers/pixel';
const router = express.Router();


router.post("/",protect, authorize('admin'),savePixelParameters)
// Get existing pixel parameters
router.get('/', getPixelParameters);

// Update existing pixel parameters
router.put('/', protect, authorize('admin'), updatePixelParameters);
export default router;
