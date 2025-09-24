import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  cloneProduct // Add the clone function
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/stats', protect, authorize('admin'), getProductStats);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.post('/:id/clone', protect, authorize('admin'), cloneProduct); // Add clone route
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;