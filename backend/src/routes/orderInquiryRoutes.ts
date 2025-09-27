import express from 'express';
import { OrderInquiryController } from '../controllers/orderInquiryController';
import { validateBulkDelete, validateCreateInquiry, validateDeleteAll, validateIdParam, validateQueryParams } from '../validators/inquiry';
import socialInquiryTest from '../middleware/social';

const router = express.Router();

router.post('/create', validateCreateInquiry,socialInquiryTest, OrderInquiryController.createInquiry);
router.get('/', validateQueryParams, OrderInquiryController.getAllInquiries);
router.get('/stats', OrderInquiryController.getInquiriesStats);
router.get('/:id', validateIdParam, OrderInquiryController.getInquiryById);

router.delete('/bulk-delete', validateBulkDelete, OrderInquiryController.bulkDelete);
router.delete('/delete-all', validateDeleteAll, OrderInquiryController.deleteAllInquiries);
router.delete('/:id', validateIdParam, OrderInquiryController.deleteInquiry);

export default router;
