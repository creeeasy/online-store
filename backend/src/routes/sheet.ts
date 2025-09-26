import express from 'express';
import { handleAddSheet, handleGetSheet } from '../controllers/sheet';
import { authorize, protect } from '../middleware/auth';
const router = express.Router();


router.get("/",protect, authorize('admin'),handleGetSheet)
router.put("/",protect, authorize('admin'),handleAddSheet)

export default router;
