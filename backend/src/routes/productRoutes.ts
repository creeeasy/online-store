import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats,
  bulkUpdateProducts,
  cloneProduct // Add the clone function
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/stats', protect, authorize('admin'), getProductStats);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.post('/:id/clone', protect, authorize('admin'), cloneProduct); // Add clone route
router.put('/:id', protect, authorize('admin'), updateProduct);
router.patch('/bulk', protect, authorize('admin'), bulkUpdateProducts);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;