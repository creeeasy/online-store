import express from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import orderInquiryRoutes from './orderInquiryRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use("/order-inquiries",orderInquiryRoutes)
export default router;