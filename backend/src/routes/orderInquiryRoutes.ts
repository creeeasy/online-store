import express from 'express';
import { body, param, query } from 'express-validator';
import { OrderInquiryController } from '../controllers/orderInquiryController';

const router = express.Router();

// Validation middleware
const validateCreateInquiry = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),

  body('customerData.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('customerData.phone')
    .trim()
    .matches(/^0[567]\d{8}$/) // Algerian phone validation
    .withMessage('Phone must be 10 digits starting with 05, 06, or 07'),

  body('customerData.reference')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reference must not exceed 200 characters'),

  body('selectedOffers')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Selected offers must be an array of offer IDs')
    .bail()
    .custom((offers) => offers.every((id: string) => /^[0-9a-fA-F]{24}$/.test(id)))
    .withMessage('Each selected offer must be a valid MongoDB ObjectId'),

  body('selectedVariants')
    .optional()
    .isObject()
    .withMessage('Selected variants must be an object'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const validateUpdateInquiry = [
  param('id').isMongoId().withMessage('Valid inquiry ID is required'),

  body('customerData.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('customerData.phone')
    .optional()
    .trim()
    .matches(/^0[567]\d{8}$/)
    .withMessage('Phone must be 10 digits starting with 05, 06, or 07'),

  body('selectedOffers')
    .optional()
    .isArray()
    .withMessage('Selected offers must be an array of offer IDs')
    .bail()
    .custom((offers) => offers.every((id: string) => /^[0-9a-fA-F]{24}$/.test(id)))
    .withMessage('Each selected offer must be a valid MongoDB ObjectId'),

  body('status')
    .optional()
    .isIn(['pending', 'contacted', 'converted', 'cancelled'])
    .withMessage('Status must be one of: pending, contacted, converted, cancelled'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const validateStatusUpdate = [
  param('id').isMongoId().withMessage('Valid inquiry ID is required'),

  body('status')
    .isIn(['pending', 'contacted', 'converted', 'cancelled'])
    .withMessage('Status must be one of: pending, contacted, converted, cancelled'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const validateIdParam = [
  param('id').isMongoId().withMessage('Valid inquiry ID is required')
];

const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['pending', 'contacted', 'converted', 'cancelled'])
    .withMessage('Status must be one of: pending, contacted, converted, cancelled'),

  query('productId')
    .optional()
    .isMongoId()
    .withMessage('Valid product ID is required'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

// Routes
router.post('/create', validateCreateInquiry, OrderInquiryController.createInquiry);
router.get('/', validateQueryParams, OrderInquiryController.getAllInquiries);
router.get('/stats', OrderInquiryController.getInquiriesStats);
router.get('/:id', validateIdParam, OrderInquiryController.getInquiryById);
router.put('/:id', validateUpdateInquiry, OrderInquiryController.updateInquiry);
router.patch('/:id/status', validateStatusUpdate, OrderInquiryController.updateInquiryStatus);
router.delete('/:id', validateIdParam, OrderInquiryController.deleteInquiry);

export default router;
