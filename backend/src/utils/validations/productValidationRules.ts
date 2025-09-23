import { body } from 'express-validator';
import mongoose from 'mongoose';

export const productValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required and cannot be empty')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),

    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric()
      .withMessage('Price must be a valid number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0')
      .toFloat(),

    body('discountPrice')
      .optional()
      .isNumeric()
      .withMessage('Discount price must be a valid number')
      .isFloat({ min: 0 })
      .withMessage('Discount price cannot be negative')
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price && value >= req.body.price) {
          throw new Error('Discount price must be less than the original price');
        }
        return true;
      }),

    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),

    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),

    // Colors validation
    body('colors')
      .optional()
      .isArray({ max: 3 })
      .withMessage('Maximum 3 colors allowed'),

    body('colors.*.name')
      .if(body('colors').exists())
      .trim()
      .notEmpty()
      .withMessage('Color name is required')
      .isLength({ min: 1, max: 30 })
      .withMessage('Color name must be between 1 and 30 characters'),

    body('colors.*.hexCode')
      .if(body('colors').exists())
      .trim()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('Hex code must be a valid format (e.g., #FF0000 or #fff)'),

    body('colors.*.isAvailable')
      .if(body('colors').exists())
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean value'),

    // Dynamic fields
    body('dynamicFields')
      .optional()
      .isArray()
      .withMessage('Dynamic fields must be an array'),

    body('dynamicFields.*.key')
      .if(body('dynamicFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Dynamic field key cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Dynamic field key cannot exceed 50 characters'),

    body('dynamicFields.*.placeholder')
      .if(body('dynamicFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Dynamic field placeholder cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Dynamic field placeholder cannot exceed 100 characters'),

    body('dynamicFields.*.isRequired')
      .if(body('dynamicFields').exists())
      .optional()
      .isBoolean()
      .withMessage('isRequired must be a boolean value'),

    body('dynamicFields.*.isDefault')
      .if(body('dynamicFields').exists())
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean value'),

    // ✅ Offers are just ObjectIds now
  /*  body('offers')
      .optional()
      .isArray()
      .withMessage('Offers must be an array of IDs'),

    body('offers.*')
      .if(body('offers').exists())
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('Each offer must be a valid MongoDB ObjectId'),
      */

    // Hidden fields
    body('hiddenFields')
      .optional()
      .isArray()
      .withMessage('Hidden fields must be an array'),

    body('hiddenFields.*.key')
      .if(body('hiddenFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Hidden field key cannot be empty'),

    body('hiddenFields.*.value')
      .if(body('hiddenFields').exists())
      .trim()
      .notEmpty()
      .withMessage('Hidden field value cannot be empty'),

    body('reference')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Reference cannot exceed 200 characters')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Product name cannot be empty if provided')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),

    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a valid number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0'),

    body('discountPrice')
      .optional()
      .isNumeric()
      .withMessage('Discount price must be a valid number')
      .isFloat({ min: 0 })
      .withMessage('Discount price cannot be negative')
      .toFloat(),

    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters if provided'),

    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),

    // Colors validation for updates
    body('colors')
      .optional()
      .isArray({ max: 3 })
      .withMessage('Maximum 3 colors allowed'),

    body('colors.*.name')
      .if(body('colors').exists())
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Color name cannot be empty if provided')
      .isLength({ min: 1, max: 30 })
      .withMessage('Color name must be between 1 and 30 characters'),

    body('colors.*.hexCode')
      .if(body('colors').exists())
      .optional()
      .trim()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('Hex code must be a valid format (e.g., #FF0000 or #fff)'),

    body('colors.*.isAvailable')
      .if(body('colors').exists())
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean value'),

    // Dynamic fields for updates
    body('dynamicFields.*.key')
      .if(body('dynamicFields').exists())
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Dynamic field key cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Dynamic field key cannot exceed 50 characters'),

    body('dynamicFields.*.placeholder')
      .if(body('dynamicFields').exists())
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Dynamic field placeholder cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Dynamic field placeholder cannot exceed 100 characters'),

    body('dynamicFields.*.isRequired')
      .if(body('dynamicFields').exists())
      .optional()
      .isBoolean()
      .withMessage('isRequired must be a boolean value'),

    body('dynamicFields.*.isDefault')
      .if(body('dynamicFields').exists())
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean value'),

    // ✅ Offers update = array of ObjectIds
  /*  body('offers')
      .optional()
      .isArray()
      .withMessage('Offers must be an array of IDs'),

    body('offers.*')
      .if(body('offers').exists())
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('Each offer must be a valid MongoDB ObjectId') */
  ]
};
