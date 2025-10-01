import { Request, Response } from 'express';
import { body } from 'express-validator';
import Product, { IProduct, WILAYAS } from '../models/Product';
import { AuthRequest } from '../types';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';
import { PREDEFINED_CATEGORIES } from '../constants';
import { productValidationRules, validateUniqueColors, validateQuantityConfiguration } from '../validators/product';
import mongoose from 'mongoose';
import Offer from '../models/Offer';
import Pixel from '../models/pixel';

// Helper function to initialize predefined fields
const initializePredefinedFields = () => {
  return Object.keys(PREDEFINED_CATEGORIES).map(category => ({
    category,
    options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
    selectedOptions: [],
    isActive: false
  }));
};

// @desc    Get all products with advanced filtering and offer support
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  // Build filter query
  let filter: any = {};
  
  // Category filter
  if (req.query.category) {
    filter['predefinedFields.category'] = req.query.category;
    filter['predefinedFields.isActive'] = true;
  }
  
  // Color filter (search by color name or hex code)
  if (req.query.color) {
    const colorQuery = req.query.color as string;
    filter.$or = [
      { 'colors.name': { $regex: colorQuery, $options: 'i' } },
      { 'colors.hexCode': { $regex: colorQuery, $options: 'i' } }
    ];
  }
  
  // Available colors only filter
  if (req.query.availableColorsOnly === 'true') {
    filter['colors.isAvailable'] = true;
  }
  
  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
  }
  
  // Sale items filter
  if (req.query.onSale === 'true') {
    filter.discountPrice = { $exists: true, $lt: filter.price?.$gte || 0 };
  }
  // Active offers filter
  if (req.query.hasOffers === 'true') {
    filter['offers.isActive'] = true;
  }

  // ✅ Enhanced quantity filters
  if (req.query.allowsQuantity === 'true') {
    filter.allowQuantity = true;
  } else if (req.query.allowsQuantity === 'false') {
    filter.$or = [
      { allowQuantity: false },
      { allowQuantity: { $exists: false } }
    ];
  }

  if (req.query.allowsMultipleQuantities === 'true') {
    filter.allowQuantity = true;
    filter.allowMultipleQuantities = true;
  }

  if (req.query.singleItemOnly === 'true') {
    filter.$or = [
      { allowQuantity: false },
      { allowQuantity: { $exists: false } },
      { allowMultipleQuantities: false },
      { allowMultipleQuantities: { $exists: false } }
    ];
  }

const products = await Product.find(filter)
  .populate('createdBy', 'username email')
  .populate({
    path: 'offers'  })
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });
  const nonFilteredProducts = await Product.find();

  const total = await Product.countDocuments(filter);

  ResponseHandler.paginated(
    res,
    products,
    total,
    page,
    limit,
    'Products retrieved successfully'
  );
});

// @desc    Get single product with order inquiry configuration
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const fetchIdProduct = await Product.findOne({ reference: req.params.id });
  if (!fetchIdProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  
  const product = await Product.findById(fetchIdProduct._id)  
    .populate('createdBy', 'username email')
    .populate({
      path: 'offers',
      match: { 
        isActive: true, 
      }
    });

  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  // ✅ Determine quantity mode
  const determineQuantityMode = () => {
    if (!product.allowQuantity) return 'disabled';
    if (!product.allowMultipleQuantities) return 'single';
    return 'multiple';
  };
  const pixelData=await Pixel.findOne({});
  const orderInquiryConfig = {
    quantityMode: determineQuantityMode(),
    allowQuantity: product.allowQuantity || false,
    allowMultipleQuantities: product.allowMultipleQuantities || false,
    maxQuantityPerInquiry: product.maxQuantityPerInquiry || 1,
    quantityRules: {
      disabled: !product.allowQuantity,
      singleOnly: product.allowQuantity && !product.allowMultipleQuantities,
      multipleAllowed: product.allowQuantity && product.allowMultipleQuantities,
      maxAllowed: product.maxQuantityPerInquiry || 1
    },
    hasActiveOffers: (product.offers?.length ?? 0) > 0,
    activeOffers: product.offers ?? []
  };
  let pixel = null;

if (pixelData) {
  pixel = {
    facebookPixel: pixelData.facebookPixel,
    apiConversion: pixelData.apiConversion,
    pixelId: pixelData.pixelId,
    accessToken: pixelData.accessToken,
    eventTypes: {
      PageView: pixelData.eventTypes.PageView,
      Purchase: pixelData.eventTypes.Purchase,
      Lead: pixelData.eventTypes.Lead,
    },
  };
}

ResponseHandler.success(
  res,
  { product, orderInquiryConfig, pixel },
  'Product retrieved successfully'
);

});



// @desc    Create product with enhanced order inquiry support
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = [
  ...productValidationRules.create,
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Validate unique colors
    if (req.body.colors && !validateUniqueColors(req.body.colors)) {
      return ResponseHandler.error(
        res,
        'Colors must have unique names and hex codes',
        400,
        [{
          field: 'colors',
          message: 'Duplicate color names or hex codes are not allowed',
          value: req.body.colors,
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }
    // Validate quantity configuration
    const quantityValidation = validateQuantityConfiguration(
      req.body.allowQuantity ?? true,
      req.body.allowMultipleQuantities ?? false,
      req.body.maxQuantityPerInquiry
    );

    if (!quantityValidation.isValid) {
      return ResponseHandler.error(
        res,
        quantityValidation.error!,
        400,
        [{
          field: 'quantityConfiguration',
          message: quantityValidation.error!,
          value: {
            allowQuantity: req.body.allowQuantity,
            allowMultipleQuantities: req.body.allowMultipleQuantities,
            maxQuantityPerInquiry: req.body.maxQuantityPerInquiry
          },
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }

    // Initialize predefined fields
    const predefinedFields = req.body.predefinedFields || initializePredefinedFields();

    // Auto-detect reference
    let reference = req.body.reference;
    if (!reference && req.query.ref) reference = req.query.ref as string;
    else if (!reference && req.query.utm_source) reference = req.query.utm_source as string;

    // Quantity config
    const quantityConfig = {
      allowQuantity: req.body.allowQuantity ?? true,
      allowMultipleQuantities: req.body.allowMultipleQuantities ?? false,
      maxQuantityPerInquiry: (() => {
        if (!req.body.allowQuantity) return undefined;
        if (!req.body.allowMultipleQuantities) return 1;
        return req.body.maxQuantityPerInquiry || 10;
      })()
    };

    // ✅ Create Offer documents separately if provided
    let offerIds: mongoose.Types.ObjectId[] = [];
    if (req.body.offers?.length) {
      const offersToCreate = req.body.offers.map((offer: any) => ({
        ...offer,
        isActive: offer.isActive ?? true
      }));
      const createdOffers = await Offer.insertMany(offersToCreate);
      offerIds = createdOffers.map((o) => o._id);
    }

    const productData = {
      ...req.body,
      ...quantityConfig,
      predefinedFields,
      createdBy: req.user?.id,
      reference,
      offers: offerIds
    };

    const product = await Product.create(productData);
    await product.populate('createdBy', 'username email');

    ResponseHandler.success(
      res,
      { product },
      'Product created successfully',
      201
    );
  })
];


// @desc    Update product with quantity validation
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = [
  ...productValidationRules.update,
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Validate unique colors if colors are being updated
    if (req.body.colors && !validateUniqueColors(req.body.colors)) {
      return ResponseHandler.error(
        res,
        'Colors must have unique names and hex codes',
        400,
        [{
          field: 'colors',
          message: 'Duplicate color names or hex codes are not allowed',
          value: req.body.colors,
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return ResponseHandler.notFound(res, 'Product');
    }

    // Check if user owns the product or is admin
    if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return ResponseHandler.forbidden(res, 'Not authorized to update this product');
    }

    // Validate quantity configuration if any fields are being updated
    const quantityFieldsBeingUpdated = ['allowQuantity', 'allowMultipleQuantities', 'maxQuantityPerInquiry']
      .some(field => req.body.hasOwnProperty(field));
    if (quantityFieldsBeingUpdated) {
      const finalQuantityConfig = {
        allowQuantity: req.body.hasOwnProperty('allowQuantity') ? req.body.allowQuantity : product.allowQuantity,
        allowMultipleQuantities: req.body.hasOwnProperty('allowMultipleQuantities') ? req.body.allowMultipleQuantities : product.allowMultipleQuantities,
        maxQuantityPerInquiry: req.body.hasOwnProperty('maxQuantityPerInquiry') ? req.body.maxQuantityPerInquiry : product.maxQuantityPerInquiry
      };

      const quantityValidation = validateQuantityConfiguration(
        finalQuantityConfig.allowQuantity,
        finalQuantityConfig.allowMultipleQuantities,
        finalQuantityConfig.maxQuantityPerInquiry
      );

      if (!quantityValidation.isValid) {
        return ResponseHandler.error(
          res,
          quantityValidation.error!,
          400,
          [{
            field: 'quantityConfiguration',
            message: quantityValidation.error!,
            value: finalQuantityConfig,
            location: 'body'
          }],
          'VALIDATION_ERROR'
        );
      }
    }

    // Auto-adjust quantity-related fields
    const updateData = { ...req.body };
    if (updateData.allowQuantity === false) {
      updateData.allowMultipleQuantities = false;
      updateData.maxQuantityPerInquiry = undefined;
    } else if (updateData.allowMultipleQuantities === false) {
      updateData.maxQuantityPerInquiry = 1;
    } else if (updateData.allowMultipleQuantities === true && !updateData.maxQuantityPerInquiry && !product.maxQuantityPerInquiry) {
      updateData.maxQuantityPerInquiry = 10;
    }


    // FIXED: Proper offer handling - check if offers field exists in request
    if (req.body.offers !== undefined) {
      // If offers is an empty array, clear all offers
      if (req.body.offers.length === 0) {
        updateData.offers = [];
      } else {
        // Process offers when array is not empty
        const offerIds: mongoose.Types.ObjectId[] = [];
        const existingOfferIds = new Set();

        // Process each offer in the request
        for (const offer of req.body.offers) {
          if (offer._id) {
            // Update existing offer
            const offerId = typeof offer._id === 'string'
              ? new mongoose.Types.ObjectId(offer._id)
              : offer._id as mongoose.Types.ObjectId;

            const updatedOffer = await Offer.findByIdAndUpdate(
              offerId,
              { 
                title: offer.title,
                description: offer.description,
                originalPrice: offer.originalPrice,
                discountedPrice: offer.discountedPrice,
                reference: offer.reference,
                titleFontFamily: offer.titleFontFamily,
                titleFontSize: offer.titleFontSize,
                titleFontBold: offer.titleFontBold,
                titleColor: offer.titleColor,
                descriptionFontFamily: offer.descriptionFontFamily,
                descriptionFontSize: offer.descriptionFontSize,
                descriptionFontBold: offer.descriptionFontBold,
                descriptionColor: offer.descriptionColor,
                originalPriceFontFamily: offer.originalPriceFontFamily,
                originalPriceFontSize: offer.originalPriceFontSize,
                originalPriceFontBold: offer.originalPriceFontBold,
                originalPriceColor: offer.originalPriceColor,
                discountedPriceFontFamily: offer.discountedPriceFontFamily,
                discountedPriceFontSize: offer.discountedPriceFontSize,
                discountedPriceFontBold: offer.discountedPriceFontBold,
                discountedPriceColor: offer.discountedPriceColor,
                image: offer.image,
                isActive: offer.isActive !== false // Default to true if not specified
              },
              { new: true, runValidators: true }
            );
          
            if (updatedOffer) {
              offerIds.push(updatedOffer._id as mongoose.Types.ObjectId);
              existingOfferIds.add(offerId.toString());
            }
          } else {
            // Create new offer
            const newOffer = await Offer.create({ 
              ...offer, 
              isActive: offer.isActive !== false 
            });
            offerIds.push(newOffer._id as mongoose.Types.ObjectId);
          }
        }

        // Preserve existing offers that weren't included in the request
        const currentOffers = product.offers || [];
        for (const existingOffer of currentOffers) {
          const existingOfferId = existingOffer._id.toString();
          if (!existingOfferIds.has(existingOfferId)) {
            offerIds.push(existingOffer._id as mongoose.Types.ObjectId);
          }
        }

        updateData.offers = offerIds;
      }
    } else {
      // If offers field is not provided in request, preserve existing offers
      updateData.offers = product.offers;
    }


    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('createdBy', 'username email');

    ResponseHandler.success(
      res,
      { product },
      'Product updated successfully'
    );
  })
];


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  // Check if user owns the product or is admin
  if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
    return ResponseHandler.forbidden(res, 'Not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);

  ResponseHandler.success(
    res,
    {},
    'Product deleted successfully'
  );
});



// @desc    Get product statistics with enhanced order inquiry metrics
// @route   GET /api/products/stats
// @access  Public
export const getProductStats = asyncHandler(async (req: Request, res: Response) => {
  // Count total products
  const totalProducts = await Product.countDocuments();

  // Products on sale - simplified approach
  const onSaleCount = await Product.countDocuments({
    $or: [
      // Direct product discount
      {
        discountPrice: { $exists: true, $ne: null },
        price: { $exists: true, $ne: null },
        $expr: { $lt: ["$discountPrice", "$price"] }
      },
      // Has active offers with discounted price
      {
        "offers": {
          $elemMatch: {
            isActive: true,
            discountedPrice: { $exists: true, $ne: null },
            originalPrice: { $exists: true, $ne: null }
          }
        }
      }
    ]
  });

  // Products with at least one active offer
  const withActiveOffers = await Product.countDocuments({
    "offers": {
      $elemMatch: {
        isActive: true,
      }
    }
  });

  // Products with active offers that have discounted prices (actual discounts)
  const withActualDiscountOffers = await Product.aggregate([
    {
      $match: {
        "offers": {
          $elemMatch: {
            isActive: true,
            discountedPrice: { $exists: true, $ne: null },
            originalPrice: { $exists: true, $ne: null }
          }
        }
      }
    },
    {
      $addFields: {
        discountedOffers: {
          $filter: {
            input: "$offers",
            as: "offer",
            cond: {
              $and: [
                { $eq: ["$$offer.isActive", true] },
                { $ne: ["$$offer.discountedPrice", null] },
                { $ne: ["$$offer.originalPrice", null] },
                { $lt: ["$$offer.discountedPrice", "$$offer.originalPrice"] }
              ]
            }
          }
        }
      }
    },
    {
      $match: {
        discountedOffers: { $ne: [], $not: { $size: 0 } }
      }
    },
    {
      $count: "count"
    }
  ]);

  // ✅ Enhanced quantity statistics
  const quantityDisabled = await Product.countDocuments({
    $or: [
      { allowQuantity: false },
      { allowQuantity: { $exists: false } }
    ]
  });

  const quantitySingleOnly = await Product.countDocuments({
    allowQuantity: true,
    $or: [
      { allowMultipleQuantities: false },
      { allowMultipleQuantities: { $exists: false } }
    ]
  });

  const quantityMultipleAllowed = await Product.countDocuments({
    allowQuantity: true,
    allowMultipleQuantities: true
  });

  // Products with colors
  const withColorsCount = await Product.countDocuments({
    colors: { $exists: true, $ne: [], $not: { $size: 0 } }
  });

  // Most popular colors
  const popularColors = await Product.aggregate([
    { $unwind: "$colors" },
    {
      $group: {
        _id: {
          name: "$colors.name",
          hexCode: "$colors.hexCode"
        },
        count: { $sum: 1 },
        availableCount: {
          $sum: {
            $cond: [
              { $ifNull: ["$colors.isAvailable", true] },
              1,
              0
            ]
          }
        }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        hexCode: "$_id.hexCode",
        totalProducts: "$count",
        availableProducts: "$availableCount"
      }
    }
  ]);

  // Stats by predefined category
  const categoryStats = await Product.aggregate([
    { $unwind: "$predefinedFields" },
    { $match: { "predefinedFields.isActive": true } },
    {
      $group: {
        _id: "$predefinedFields.category",
        totalProducts: { $sum: 1 }
      }
    },
    { $sort: { totalProducts: -1 } }
  ]);

  // Offer statistics
  const offerStats = await Product.aggregate([
    { $unwind: "$offers" },
    {
      $match: {
        "offers.isActive": true,
        "offers.originalPrice": { $exists: true, $ne: null },
        "offers.discountedPrice": { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: null,
        totalActiveOffers: { $sum: 1 },
        avgOriginalPrice: { $avg: "$offers.originalPrice" },
        avgDiscountedPrice: { $avg: "$offers.discountedPrice" },
        maxOriginalPrice: { $max: "$offers.originalPrice" },
        minDiscountedPrice: { $min: "$offers.discountedPrice" },
        totalSavings: {
          $sum: {
            $subtract: ["$offers.originalPrice", "$offers.discountedPrice"]
          }
        }
      }
    }
  ]);

  // ✅ Enhanced quantity configuration distribution
  const quantityConfigStats = await Product.aggregate([
    {
      $addFields: {
        quantityMode: {
          $switch: {
            branches: [
              {
                case: {
                  $or: [
                    { $eq: ["$allowQuantity", false] },
                    { $eq: ["$allowQuantity", null] }
                  ]
                },
                then: "disabled"
              },
              {
                case: { $eq: ["$allowMultipleQuantities", true] },
                then: "multiple"
              }
            ],
            default: "single"
          }
        }
      }
    },
    {
      $group: {
        _id: "$quantityMode",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Recently created products
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name price discountPrice images colors allowQuantity allowMultipleQuantities maxQuantityPerInquiry createdAt");
  
  // Additional stats
  const productsWithDynamicFields = await Product.countDocuments({
    dynamicFields: { $exists: true, $ne: [], $not: { $size: 0 } }
  });

  const productsWithHiddenFields = await Product.countDocuments({
    hiddenFields: { $exists: true, $ne: [], $not: { $size: 0 } }
  });

  ResponseHandler.success(
    res,
    {
      totalProducts,
      onSaleCount,
      withActiveOffers,
      withActualDiscountOffers: withActualDiscountOffers[0]?.count || 0,
      quantityStats: {
        disabled: quantityDisabled,
        singleOnly: quantitySingleOnly,
        multipleAllowed: quantityMultipleAllowed
      },
      withColorsCount,
      popularColors,
      categoryStats,
      offerStats: offerStats[0] || {
        totalActiveOffers: 0,
        avgOriginalPrice: 0,
        avgDiscountedPrice: 0,
        maxOriginalPrice: 0,
        minDiscountedPrice: 0,
        totalSavings: 0
      },
      quantityConfigStats,
      recentProducts,
      additionalStats: {
        withDynamicFields: productsWithDynamicFields,
        withHiddenFields: productsWithHiddenFields
      }
    },
    'Product statistics retrieved successfully'
  );
});

// @desc    Clone an existing product with enhanced quantity configuration
// @route   POST /api/products/:id/clone
// @access  Private/Admin
export const cloneProduct = [
  body('reference')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reference cannot exceed 200 characters'),
  body('allowQuantity')
    .optional()
    .isBoolean()
    .withMessage('allowQuantity must be a boolean value'),
  body('allowMultipleQuantities')
    .optional()
    .isBoolean()
    .withMessage('allowMultipleQuantities must be a boolean value'),
  body('maxQuantityPerInquiry')
    .optional()
    .isInt({ min: 1, })
    .withMessage('1 Maximum quantity per inquiry must be between 1 and 100'),
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const productId = req.params.id;
    
    // Find the original product
    const originalProduct = await Product.findById(productId);
    
    if (!originalProduct) {
      return ResponseHandler.notFound(res, 'Product');
    }
    
    // ✅ Handle quantity configuration overrides with validation
    const quantityConfig = {
      allowQuantity: req.body.allowQuantity ?? originalProduct.allowQuantity,
      allowMultipleQuantities: req.body.allowMultipleQuantities ?? originalProduct.allowMultipleQuantities,
      maxQuantityPerInquiry: req.body.maxQuantityPerInquiry ?? originalProduct.maxQuantityPerInquiry
    };

    // Validate the quantity configuration
    const quantityValidation = validateQuantityConfiguration(
      quantityConfig.allowQuantity,
      quantityConfig.allowMultipleQuantities,
      quantityConfig.maxQuantityPerInquiry
    );

    if (!quantityValidation.isValid) {
      return ResponseHandler.error(
        res,
        quantityValidation.error!,
        400,
        [{
          field: 'quantityConfiguration',
          message: quantityValidation.error!,
          value: quantityConfig,
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }

    // Auto-adjust quantity settings for consistency
    if (quantityConfig.allowQuantity === false) {
      quantityConfig.allowMultipleQuantities = false;
      quantityConfig.maxQuantityPerInquiry = undefined;
    } else if (quantityConfig.allowMultipleQuantities === false) {
      quantityConfig.maxQuantityPerInquiry = 1;
    }
    
    // ✅ Clone offers if they exist
    const clonedOfferIds: any[] = [];
    
    if (originalProduct.offers && originalProduct.offers.length > 0) {
      for (const offerRef of originalProduct.offers) {
        // Extract the actual ID from the offer reference
        const offerId = offerRef ;
        
        // Find the original offer
        const originalOffer = await Offer.findById(offerId);
        
        if (originalOffer) {
          // Clone the offer
          const offerData = {
            ...originalOffer.toObject(),
            _id: undefined, // Remove original ID
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Create the cloned offer
          const clonedOffer = await Offer.create(offerData);
          
          // Store the new offer ID
          clonedOfferIds.push(clonedOffer._id);
        }
      }
    }
    
    // Create a copy of the product data
    const productData = {
      ...originalProduct.toObject(),
      _id: undefined, // Remove the original ID
      name: `${originalProduct.name} (Copy)`, // Append "Copy" to the name
      ...quantityConfig, // Apply validated quantity configuration
      offers: clonedOfferIds, // ✅ Use the cloned offer IDs
      createdBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      reference: req.body.reference || originalProduct.reference // Allow reference override
    };
    
    // Create the cloned product
    const clonedProduct = await Product.create(productData);
    await clonedProduct.populate('createdBy', 'username email');
    
    ResponseHandler.success(
      res,
      { product: clonedProduct },
      'Product cloned successfully',
      201
    );
  })
];