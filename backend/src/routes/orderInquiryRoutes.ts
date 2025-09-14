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
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Valid phone number is required'),
  body('customerData.reference')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Reference is required and must not exceed 200 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
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
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Valid phone number is required'),
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