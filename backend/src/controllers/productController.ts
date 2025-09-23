import { Request, Response } from 'express';
import { body } from 'express-validator';
import Product, { IProduct, WILAYAS } from '../models/Product';
import Offer from '../models/Offer';
import { AuthRequest } from '../types';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';
import { PREDEFINED_CATEGORIES } from '../constant/consts';
import { productValidationRules } from '../utils/validations/productValidationRules';

// Helper function to initialize predefined fields
const initializePredefinedFields = () => {
  return Object.keys(PREDEFINED_CATEGORIES).map(category => ({
    category,
    options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
    selectedOptions: [],
    isActive: false
  }));
};

// Helper function to validate unique colors
const validateUniqueColors = (colors: any[]) => {
  if (!colors || colors.length === 0) return true;
  
  const names = colors.map(color => color.name?.toLowerCase()).filter(Boolean);
  const hexCodes = colors.map(color => color.hexCode?.toLowerCase()).filter(Boolean);
  
  const uniqueNames = new Set(names);
  const uniqueHexCodes = new Set(hexCodes);
  
  return names.length === uniqueNames.size && hexCodes.length === uniqueHexCodes.size;
};

// @desc    Get all products with advanced filtering
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
    // Find products that have active offers
    const activeOffers = await Offer.find({
      isActive: true,
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gt: new Date() } }
      ]
    }).select('_id');
    
    filter.offers = { $in: activeOffers.map(offer => offer._id) };
  }

  const products = await Product.find(filter)
    .populate('createdBy', 'username email')
    .populate({
      path: 'offers',
      match: { isActive: true }, // Only populate active offers
      select: 'title description discount validUntil isActive'
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate({
      path: 'offers',
      select: 'title description discount validUntil isActive'
    });

  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  ResponseHandler.success(
    res,
    { product },
    'Product retrieved successfully'
  );
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = [
  ...productValidationRules.create,
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
      console.log("validated")

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

    // Validate offer IDs if provided
    if (req.body.offers && req.body.offers.length > 0) {
      const validOffers = await Offer.find({ _id: { $in: req.body.offers } });
      if (validOffers.length !== req.body.offers.length) {
        return ResponseHandler.error(
          res,
          'One or more invalid offer IDs provided',
          400,
          [{
            field: 'offers',
            message: 'All offer IDs must be valid',
            value: req.body.offers,
            location: 'body'
          }],
          'VALIDATION_ERROR'
        );
      }
    }

    // Initialize predefined fields if not provided
    const predefinedFields = req.body.predefinedFields || initializePredefinedFields();

    // Auto-detect reference from query parameters if not provided
    let reference = req.body.reference;
    if (!reference && req.query.ref) {
      reference = req.query.ref as string;
    } else if (!reference && req.query.utm_source) {
      reference = req.query.utm_source as string;
    }

    const productData = {
      ...req.body,
      predefinedFields,
      createdBy: req.user?.id,
      reference
    };

    const product = await Product.create(productData);
    await product.populate([
      { path: 'createdBy', select: 'username email' },
      { path: 'offers', select: 'title description discount validUntil isActive' }
    ]);

    ResponseHandler.success(
      res,
      { product },
      'Product created successfully',
      201
    );
  })
];

// @desc    Update product
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
    if (!product) return ResponseHandler.notFound(res, 'Product');

    // Check if user owns the product or is admin
    if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return ResponseHandler.forbidden(res, 'Not authorized to update this product');
    }

    // Handle offers: accept both IDs and new objects
    if (req.body.offers && req.body.offers.length > 0) {
      const finalOffers: string[] = [];

      for (const offer of req.body.offers) {
        if (typeof offer === 'string') {
          // Case 1: existing Offer ID
          const existing = await Offer.findById(offer);
          if (!existing) {
            return ResponseHandler.error(
              res,
              'One or more invalid offer IDs provided',
              400,
              [{
                field: 'offers',
                message: `Offer ID ${offer} is invalid`,
                value: offer,
                location: 'body'
              }],
              'VALIDATION_ERROR'
            );
          }
          finalOffers.push(existing._id.toString());
        } else if (typeof offer === 'object') {
          // Case 2: new Offer object → create it
          const newOffer = await Offer.create({
            title: offer.title,
            description: offer.description,
            discount: offer.discount,
            validUntil: offer.validUntil,
            isActive: offer.isActive ?? true
          });
          finalOffers.push(newOffer._id.toString());
        }
      }

      req.body.offers = finalOffers;
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'createdBy', select: 'username email' },
      { path: 'offers', select: 'title description discount validUntil isActive' }
    ]);

    ResponseHandler.success(res, { product }, 'Product updated successfully');
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

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, color, availableColorsOnly, minPrice, maxPrice, onSale, hasOffers } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  let query: any = {};

  // Text search
  if (q) {
    query.$text = { $search: q as string };
  }

  // Category filter
  if (category) {
    query['predefinedFields.category'] = category;
    query['predefinedFields.isActive'] = true;
  }

  // Color filter
  if (color) {
    const colorQuery = color as string;
    query.$or = [
      { 'colors.name': { $regex: colorQuery, $options: 'i' } },
      { 'colors.hexCode': { $regex: colorQuery, $options: 'i' } }
    ];
  }

  // Available colors only filter
  if (availableColorsOnly === 'true') {
    query['colors.isAvailable'] = true;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
  }

  // Sale items filter
  if (onSale === 'true') {
    query.discountPrice = { $exists: true, $lt: query.price?.$gte || 0 };
  }

  // Active offers filter
  if (hasOffers === 'true') {
    const activeOffers = await Offer.find({
      isActive: true,
      $or: [
        { validUntil: { $exists: false } },
        { validUntil: { $gt: new Date() } }
      ]
    }).select('_id');
    
    query.offers = { $in: activeOffers.map(offer => offer._id) };
  }

  const products = await Product.find(query)
    .populate('createdBy', 'username email')
    .populate({
      path: 'offers',
      match: { isActive: true },
      select: 'title description discount validUntil isActive'
    })
    .skip(skip)
    .limit(limit)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 });

  const total = await Product.countDocuments(query);

  ResponseHandler.paginated(
    res,
    products,
    total,
    page,
    limit,
    'Products search results'
  );
});

// @desc    Bulk update products
// @route   PATCH /api/products/bulk
// @access  Private/Admin
export const bulkUpdateProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productIds, updateData } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return ResponseHandler.error(
      res,
      'Product IDs are required and must be a non-empty array',
      400,
      [{
        field: 'productIds',
        message: 'Product IDs are required and must be a non-empty array',
        value: productIds,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return ResponseHandler.error(
      res,
      'Update data is required',
      400,
      [{
        field: 'updateData',
        message: 'Update data is required and cannot be empty',
        value: updateData,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  // Validate colors in bulk update if provided
  if (updateData.colors && !validateUniqueColors(updateData.colors)) {
    return ResponseHandler.error(
      res,
      'Colors must have unique names and hex codes',
      400,
      [{
        field: 'updateData.colors',
        message: 'Duplicate color names or hex codes are not allowed',
        value: updateData.colors,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  // Validate offer IDs in bulk update if provided
  if (updateData.offers && updateData.offers.length > 0) {
    const validOffers = await Offer.find({ _id: { $in: updateData.offers } });
    if (validOffers.length !== updateData.offers.length) {
      return ResponseHandler.error(
        res,
        'One or more invalid offer IDs provided',
        400,
        [{
          field: 'updateData.offers',
          message: 'All offer IDs must be valid',
          value: updateData.offers,
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }
  }

  const result = await Product.updateMany(
    { _id: { $in: productIds }, createdBy: req.user?.id },
    updateData,
    { runValidators: true }
  );

  ResponseHandler.success(
    res,
    { 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    },
    `${result.modifiedCount} products updated successfully`
  );
});

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Public
export const getProductStats = asyncHandler(async (req: Request, res: Response) => {
  // Count total products
  const totalProducts = await Product.countDocuments();

  // Products on sale (discountPrice < price)
  const onSaleCount = await Product.countDocuments({
    discountPrice: { $exists: true, $ne: null },
    $expr: { $lt: ["$discountPrice", "$price"] }
  });

  // Products with at least one active offer
  const activeOffers = await Offer.find({
    isActive: true,
    $or: [
      { validUntil: { $exists: false } },
      { validUntil: { $gt: new Date() } }
    ]
  }).select('_id');
  
  const withActiveOffers = await Product.countDocuments({
    offers: { $in: activeOffers.map(offer => offer._id) }
  });

  // Products with colors
  const withColorsCount = await Product.countDocuments({
    colors: { $exists: true, $ne: [], $size: { $gte: 1 } }
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
          $sum: { $cond: ["$colors.isAvailable", 1, 0] }
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

  // Most popular offers
  const offerStats = await Product.aggregate([
    { $unwind: "$offers" },
    {
      $lookup: {
        from: "offers",
        localField: "offers",
        foreignField: "_id",
        as: "offerDetails"
      }
    },
    { $unwind: "$offerDetails" },
    { $match: { "offerDetails.isActive": true } },
    {
      $group: {
        _id: "$offerDetails._id",
        offerTitle: { $first: "$offerDetails.title" },
        discount: { $first: "$offerDetails.discount" },
        productCount: { $sum: 1 }
      }
    },
    { $sort: { productCount: -1 } },
    { $limit: 10 }
  ]);

  // Recently created products (e.g., last 5)
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name price discountPrice images colors createdAt")
    .populate('offers', 'title discount isActive');

  ResponseHandler.success(
    res,
    {
      totalProducts,
      onSaleCount,
      withActiveOffers,
      withColorsCount,
      popularColors,
      categoryStats,
      offerStats,
      recentProducts
    },
    'Product statistics retrieved successfully'
  );
});

// @desc    Clone an existing product
// @route   POST /api/products/:id/clone
// @access  Private/Admin
export const cloneProduct = [
  body('reference')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reference cannot exceed 200 characters'),
  validateRequest,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const productId = req.params.id;
    
    // Find the original product
    const originalProduct = await Product.findById(productId).populate('offers');
    
    if (!originalProduct) {
      return ResponseHandler.notFound(res, 'Product');
    }
    
    // Create a copy of the product data
    const productData = {
      ...originalProduct.toObject(),
      _id: undefined, // Remove the original ID
      name: `${originalProduct.name} (Copy)`, // Append "Copy" to the name
      createdBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      reference: req.body.reference || originalProduct.reference // Allow reference override
    };
    
    // Create the cloned product
    const clonedProduct = await Product.create(productData);
    await clonedProduct.populate([
      { path: 'createdBy', select: 'username email' },
      { path: 'offers', select: 'title description discount validUntil isActive' }
    ]);
    
    ResponseHandler.success(
      res,
      { product: clonedProduct },
      'Product cloned successfully',
      201
    );
  })
];

// @desc    Get products by color
// @route   GET /api/products/colors/:colorName
// @access  Public
export const getProductsByColor = asyncHandler(async (req: Request, res: Response) => {
  const { colorName } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const availableOnly = req.query.availableOnly === 'true';

  let filter: any = {
    'colors.name': { $regex: colorName, $options: 'i' }
  };

  if (availableOnly) {
    filter['colors.isAvailable'] = true;
  }

  const products = await Product.find(filter)
    .populate('createdBy', 'username email')
    .populate({
      path: 'offers',
      match: { isActive: true },
      select: 'title description discount validUntil isActive'
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  ResponseHandler.paginated(
    res,
    products,
    total,
    page,
    limit,
    `Products with color "${colorName}" retrieved successfully`
  );
});

// @desc    Add offers to product
// @route   POST /api/products/:id/offers
// @access  Private/Admin
export const addOffersToProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { offerIds } = req.body;
  
  if (!offerIds || !Array.isArray(offerIds) || offerIds.length === 0) {
    return ResponseHandler.error(
      res,
      'Offer IDs are required and must be a non-empty array',
      400,
      [{
        field: 'offerIds',
        message: 'Offer IDs are required and must be a non-empty array',
        value: offerIds,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  // Validate offer IDs
  const validOffers = await Offer.find({ _id: { $in: offerIds } });
  if (validOffers.length !== offerIds.length) {
    return ResponseHandler.error(
      res,
      'One or more invalid offer IDs provided',
      400,
      [{
        field: 'offerIds',
        message: 'All offer IDs must be valid',
        value: offerIds,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  // Check authorization
  if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
    return ResponseHandler.forbidden(res, 'Not authorized to update this product');
  }

  // Add offers to product (avoid duplicates)
  const existingOfferIds = product.offers.map(id => id.toString());
  const newOfferIds = offerIds.filter(id => !existingOfferIds.includes(id));
  
  if (newOfferIds.length === 0) {
    return ResponseHandler.error(
      res,
      'All provided offers are already associated with this product',
      400,
      [],
      'VALIDATION_ERROR'
    );
  }

  product.offers.push(...newOfferIds);
  await product.save();
  await product.populate({
    path: 'offers',
    select: 'title description discount validUntil isActive'
  });

  ResponseHandler.success(
    res,
    { product },
    `${newOfferIds.length} offers added to product successfully`
  );
});

// @desc    Remove offers from product
// @route   DELETE /api/products/:id/offers
// @access  Private/Admin
export const removeOffersFromProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { offerIds } = req.body;
  
  if (!offerIds || !Array.isArray(offerIds) || offerIds.length === 0) {
    return ResponseHandler.error(
      res,
      'Offer IDs are required and must be a non-empty array',
      400,
      [{
        field: 'offerIds',
        message: 'Offer IDs are required and must be a non-empty array',
        value: offerIds,
        location: 'body'
      }],
      'VALIDATION_ERROR'
    );
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return ResponseHandler.notFound(res, 'Product');
  }

  // Check authorization
  if (product.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
    return ResponseHandler.forbidden(res, 'Not authorized to update this product');
  }

  // Remove offers from product
  const originalLength = product.offers.length;
  product.offers = product.offers.filter(offerId => !offerIds.includes(offerId.toString()));
  const removedCount = originalLength - product.offers.length;

  if (removedCount === 0) {
    return ResponseHandler.error(
      res,
      'None of the provided offers were associated with this product',
      400,
      [],
      'VALIDATION_ERROR'
    );
  }

  await product.save();
  await product.populate({
    path: 'offers',
    select: 'title description discount validUntil isActive'
  });

  ResponseHandler.success(
    res,
    { product },
    `${removedCount} offers removed from product successfully`
  );
});