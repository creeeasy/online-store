import { body } from "express-validator";

export const productValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required and cannot be empty')
      .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),

    body('price')
      .optional()
      .isNumeric().withMessage('Price must be a valid number')
      .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0')
      .toFloat(),

    body('discountPrice')
      .optional()
      .isNumeric().withMessage('Discount price must be a valid number')
      .isFloat({ min: 0 }).withMessage('Discount price cannot be negative')
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price && value >= req.body.price) {
          throw new Error('Discount price must be less than the original price');
        }
        return true;
      }),

    body('description')
      .trim(),

    body('images')
      .optional()
      .isArray({ min: 0 }).withMessage('Images must be an array'),

    // Quantity configuration
    body('allowQuantity').optional().isBoolean().withMessage('allowQuantity must be boolean').toBoolean(),
    body('allowMultipleQuantities').optional().isBoolean().withMessage('allowMultipleQuantities must be boolean').toBoolean(),
body('maxQuantityPerInquiry')
  .if((value, { req }) => req.body.allowMultipleQuantities === true)
  .optional()
  .isInt({ min: 2, max: 100 })
  .withMessage('Max quantity must be between 2 and 100')
  .toInt(),
    // Colors
    body('colors').optional().isArray({ max: 3 }).withMessage('Max 3 colors allowed'),
    body('colors.*.name').if(body('colors').exists()).trim().notEmpty().withMessage('Color name is required').isLength({ min: 1, max: 30 }),
    body('colors.*.hexCode').if(body('colors').exists()).trim(),
    body('colors.*.isAvailable').if(body('colors').exists()).optional().isBoolean().withMessage('isAvailable must be boolean'),

    // Dynamic fields
    body('dynamicFields').optional().isArray().withMessage('Dynamic fields must be array'),
    body('dynamicFields.*.key').if(body('dynamicFields').exists()).trim().notEmpty().isLength({ max: 50 }),
    body('dynamicFields.*.placeholder').if(body('dynamicFields').exists()).trim().notEmpty().isLength({ max: 100 }),
    body('dynamicFields.*.isRequired').if(body('dynamicFields').exists()).optional().isBoolean(),
    body('dynamicFields.*.isDefault').if(body('dynamicFields').exists()).optional().isBoolean(),

    // ✅ Offers validation
    body('offers').optional().isArray().withMessage('Offers must be an array'),
    body('offers.*.title').if(body('offers').exists()).trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('offers.*.description').if(body('offers').exists()).optional().trim().isLength({ max: 500 }),
    body('offers.*.originalPrice').if(body('offers').exists()).optional().isFloat({ min: 0 }),
    body('offers.*.discountedPrice').if(body('offers').exists()).optional().isFloat({ min: 0 }).custom((value, { req }) => {
      const offer = req.body.offers?.find((o: any) => o.discountedPrice === value);
      if (offer && offer.originalPrice != null && value >= offer.originalPrice) {
        throw new Error('Discounted price must be less than original price');
      }
      return true;
    }),
    body('offers.*.isActive').if(body('offers').exists()).optional().isBoolean(),
    
    // Hidden fields
    body('hiddenFields').optional().isArray(),
    body('hiddenFields.*.key').if(body('hiddenFields').exists()).trim().notEmpty(),
    body('hiddenFields.*.value').if(body('hiddenFields').exists()).trim().notEmpty(),

    // Reference
    body('reference').optional().trim().isLength({ max: 200 }).withMessage('Reference max 200 chars')
  ]
,
  
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
      .optional(),
    
    body('images')
      .optional()
      .isArray({ min: 0 })
      .withMessage('At least one image is required if images are provided'),
    
    body('allowQuantity').optional().isBoolean().withMessage('allowQuantity must be boolean').toBoolean(),
    body('allowMultipleQuantities').optional().isBoolean().withMessage('allowMultipleQuantities must be boolean').toBoolean(),
body('maxQuantityPerInquiry')
  .if((value, { req }) => req.body.allowMultipleQuantities === true)
  .optional()
  .isInt({ min: 2, max: 100 })
  .withMessage('Max quantity must be between 2 and 100')
  .toInt(),    // Colors validation for updates
    body('colors').optional().isArray({ max: 3 }).withMessage('Max 3 colors allowed'),
    body('colors.*.name').if(body('colors').exists()).trim().notEmpty().withMessage('Color name is required').isLength({ min: 1, max: 30 }),
    body('colors.*.hexCode').if(body('colors').exists()).trim(),
    body('colors.*.isAvailable').if(body('colors').exists()).optional().isBoolean().withMessage('isAvailable must be boolean'),
    
    body('dynamicFields').optional().isArray().withMessage('Dynamic fields must be array'),
    body('dynamicFields.*.key').if(body('dynamicFields').exists()).trim().notEmpty().isLength({ max: 50 }),
    body('dynamicFields.*.placeholder').if(body('dynamicFields').exists()).trim().notEmpty().isLength({ max: 100 }),
    body('dynamicFields.*.isRequired').if(body('dynamicFields').exists()).optional().isBoolean(),
    body('dynamicFields.*.isDefault').if(body('dynamicFields').exists()).optional().isBoolean(),

     
    // ✅ Enhanced offers validation for updates
    body('offers.*.title')
      .if(body('offers').exists())
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Offer title cannot be empty if provided')
      .isLength({ min: 2, max: 100 })
      .withMessage('Offer title must be between 2 and 100 characters'),
    
    body('offers.*.description')
      .if(body('offers').exists())
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Offer description cannot exceed 500 characters'),
    
    body('offers.*.originalPrice')
      .if(body('offers').exists())
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Original price must be a positive number'),
    
    body('offers.*.discountedPrice')
      .if(body('offers').exists())
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Discounted price must be a positive number')
      .custom((value, { req }) => {
        const offerIndex = req.body.offers?.findIndex((offer: any) => offer.discountedPrice === value);
        if (offerIndex !== -1) {
          const offer = req.body.offers[offerIndex];
          if (offer.originalPrice && value >= offer.originalPrice) {
            throw new Error('Discounted price must be less than original price');
          }
        }
        return true;
      }),
    
    
    body('offers.*.isActive')
      .if(body('offers').exists())
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
    
    body('reference')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Reference cannot exceed 200 characters')
  ]
};

// ✅ Enhanced quantity validation helper
export const validateQuantityConfiguration = (allowQuantity: boolean, allowMultipleQuantities: boolean, maxQuantityPerInquiry?: number) => {
  // If quantity is disabled, multiple quantities should also be disabled
  if (!allowQuantity && allowMultipleQuantities) {
    return { isValid: false, error: 'Cannot allow multiple quantities when quantity is disabled' };
  }
  
  // If multiple quantities are allowed, maxQuantityPerInquiry is required
  if (allowMultipleQuantities && (!maxQuantityPerInquiry || maxQuantityPerInquiry < 2)) {
    return { isValid: false, error: 'maxQuantityPerInquiry must be at least 2 when multiple quantities are allowed' };
  }
    
  return { isValid: true };
};

// ✅ Inquiry quantity validation helper
export const validateInquiryQuantity = (
  productConfig: { allowQuantity: boolean; allowMultipleQuantities: boolean; maxQuantityPerInquiry?: number }, 
  requestedQuantity: number
) => {
  // If quantity is disabled, ignore quantity in inquiry
  if (!productConfig.allowQuantity) {
    return { isValid: true, finalQuantity: null }; // No quantity stored
  }
  
  // If single quantity mode, always set quantity to 1
  if (!productConfig.allowMultipleQuantities) {
    return { isValid: true, finalQuantity: 1 };
  }
  
  // Multiple quantities mode - validate against maxQuantityPerInquiry
  if (requestedQuantity < 2) {
    return { isValid: false, error: 'Quantity must be at least 2 in multiple quantities mode' };
  }
  
  if (productConfig.maxQuantityPerInquiry && requestedQuantity > productConfig.maxQuantityPerInquiry) {
    return { 
      isValid: false, 
      error: `Quantity cannot exceed ${productConfig.maxQuantityPerInquiry}` 
    };
  }
  
  return { isValid: true, finalQuantity: requestedQuantity };
};

export const validateUniqueColors = (colors: any[]) => {
  if (!colors || colors.length === 0) return true;
  
  const names = colors.map(color => color.name?.toLowerCase()).filter(Boolean);
  const hexCodes = colors.map(color => color.hexCode?.toLowerCase()).filter(Boolean);
  
  const uniqueNames = new Set(names);
  const uniqueHexCodes = new Set(hexCodes);
  
  return names.length === uniqueNames.size && hexCodes.length === uniqueHexCodes.size;
};