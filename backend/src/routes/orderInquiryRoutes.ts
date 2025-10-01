import express from 'express';
import { OrderInquiryController } from '../controllers/orderInquiryController';
import { validateBulkDelete, validateCreateInquiry, validateDeleteAll, validateIdParam, validateQueryParams } from '../validators/inquiry';
import facebookCapiMiddleware from '../middleware/facebookCapiMiddleware';
import socialMediaDetection from '../middleware/socialMediaDetection';
import botScoreCheck from '../middleware/botScoreCheck';

const router = express.Router();

router.post('/create', validateCreateInquiry,socialMediaDetection,botScoreCheck,facebookCapiMiddleware(), OrderInquiryController.createInquiry);
router.post('/save-to-sheet', validateCreateInquiry, OrderInquiryController.saveInquiryToSheet);
router.get('/fakeOrders', validateQueryParams, OrderInquiryController.getAllFakeOrdersInquiries);
router.get('/', validateQueryParams, OrderInquiryController.getAllInquiries);
router.get('/stats', OrderInquiryController.getInquiriesStats);
router.get('/:id', validateIdParam, OrderInquiryController.getInquiryById);

router.delete('/bulk-delete', validateBulkDelete, OrderInquiryController.bulkDelete);
router.delete('/delete-all', validateDeleteAll, OrderInquiryController.deleteAllInquiries);
router.delete('/:id', validateIdParam, OrderInquiryController.deleteInquiry);

export default router;
