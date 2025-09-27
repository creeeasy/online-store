import express from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import orderInquiryRoutes from './orderInquiryRoutes';
import sheet from "./sheet"
import pixel from "./pixel"
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use("/order-inquiries",orderInquiryRoutes)
router.use("/sheets", sheet);
router.use("/pixel-parameters", pixel);
export default router;