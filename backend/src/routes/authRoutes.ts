import express from 'express';
import { register, login, getMe, validateToken } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/validate', protect, validateToken);
export default router;