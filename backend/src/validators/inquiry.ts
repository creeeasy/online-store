import { body, param, query } from 'express-validator';

// ✅ Bulk delete validation
const validateBulkDelete = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('ids must be a non-empty array of inquiry IDs'),
  body('ids.*')
    .isMongoId()
    .withMessage('Each id must be a valid Mongo ID')
];

// ✅ Create inquiry validation
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

];

// ✅ Update inquiry validation
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

];

// ✅ Status update validation
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

// ✅ Single ID param validation
const validateIdParam = [
  param('id').isMongoId().withMessage('Valid inquiry ID is required')
];

// ✅ Query params validation (for list/search filters)
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

// ✅ Delete all validation
const validateDeleteAll = [
  body('confirmationCode')
    .notEmpty()
    .withMessage('Confirmation code is required')
];

export {
  validateBulkDelete,
  validateCreateInquiry,
  validateUpdateInquiry,
  validateStatusUpdate,
  validateIdParam,
  validateQueryParams,
  validateDeleteAll
};
