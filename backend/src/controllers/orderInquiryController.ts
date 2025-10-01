// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';
import { OrderInquiry } from '../models/OrderInquiry';
import Product from '../models/Product';
import Offer, { IOffer } from '../models/Offer';
import { validateAlgerianPhone } from '../types/orderInquiry';
import path from 'path';
import fs from 'fs';
import { google } from "googleapis";
import Sheet from "../models/sheet"
import requestIp from "request-ip"
import mongoose from 'mongoose';
import { OrderFake } from '../models/OrderFake';
// Load credentials from a JSON file
const credentialsPath = path.join(__dirname, "../../apiGoogleSheet.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// Create Google Auth instance with proper scopes
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/spreadsheets.readonly", 
      "https://www.googleapis.com/auth/drive"
  ],
});

// Initialize Sheets API client
const sheets = google.sheets({ version: "v4", auth });

// Phone validation utility


export class OrderInquiryController {



  
  static createInquiry = asyncHandler(async (req: Request, res: Response) => {
    const {
      productId,
      customerData = {},
      quantity = 1,
      typeOfOrder,       // 'offer' | 'quantity'
      offerId,           // optional
      selectedVariants = {},
      notes,
      botScore
    } = req.body;
  
    // Check if file exists
    const sheetData = await Sheet.findOne({});
    let SPREADSHEET_ID;
    if (sheetData) {
      SPREADSHEET_ID = sheetData.sheetID || "";
      console.log(SPREADSHEET_ID);
    } else {
      console.log("No sheet found");
    }
  
    // Restrict orders to one every 24 hours per phone number
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
    const ipClient = requestIp.getClientIp(req);
  
    const existingOrder = await OrderInquiry.findOne({
      ipClient,
      productId: new mongoose.Types.ObjectId(req.body.productId),
      timeEnter: { $gte: twentyFourHoursAgo }
    });
  
    if (existingOrder) {
      return ResponseHandler.error(
        res,
        'يمكنك تقديم طلب واحد فقط كل 24 ساعة. يُرجى المحاولة لاحقًا.'
      );
    }
  
    // Wrap sheet metadata fetch in try-catch
    try {
      if (SPREADSHEET_ID) {
        const sheetMetadata = await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
        });
      }
    } catch (error) {
      console.error('Error fetching sheet metadata (continuing anyway):', error);
    }
   
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseHandler.notFound(res, 'المنتج غير موجود');
    }
  
    // Validate required dynamic fields
    const validationErrors: any[] = [];
    if (product.dynamicFields?.length) {
      for (const field of product.dynamicFields) {
        if (field.isRequired) {
          const fieldValue = selectedVariants[field.key];
          if (!fieldValue || fieldValue.trim() === '') {
            validationErrors.push({
              field: `selectedVariants.${field.key}`,
              message: `${field.placeholder || field.key} مطلوب`,
              value: fieldValue,
              location: 'body'
            });
          }
  
          // Phone validation
          if (field.key.toLowerCase().includes('phone') && fieldValue) {
            if (!validateAlgerianPhone(fieldValue)) {
              validationErrors.push({
                field: `selectedVariants.${field.key}`,
                message: 'رقم الهاتف غير صالح. يجب أن يكون 10 أرقام: 0[567]XXXXXXXX',
                value: fieldValue,
                location: 'body'
              });
            }
          }
  
          // Name validation
          if (field.key.toLowerCase().includes('name') && fieldValue) {
            const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,100}$/;
            if (!nameRegex.test(fieldValue.trim())) {
              validationErrors.push({
                field: `selectedVariants.${field.key}`,
                message: 'الاسم يجب أن يحتوي على أحرف ومسافات فقط، ويكون بين 2-100 حرف',
                value: fieldValue,
                location: 'body'
              });
            }
          }
  
          // Email validation
          if (field.key.toLowerCase().includes('email') && fieldValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fieldValue)) {
              validationErrors.push({
                field: `selectedVariants.${field.key}`,
                message: 'البريد الإلكتروني غير صالح',
                value: fieldValue,
                location: 'body'
              });
            }
          }
  
          // Age validation
          if (field.key.toLowerCase().includes('age') && fieldValue) {
            const age = parseInt(fieldValue);
            if (isNaN(age) || age < 1 || age > 120) {
              validationErrors.push({
                field: `selectedVariants.${field.key}`,
                message: 'العمر غير صالح',
                value: fieldValue,
                location: 'body'
              });
            }
          }
  
          // Wilaya validation
          if (field.key.toLowerCase().includes('wilaya') && fieldValue) {
            if (fieldValue.trim().length < 2) {
              validationErrors.push({
                field: `selectedVariants.${field.key}`,
                message: 'الولاية غير صالحة',
                value: fieldValue,
                location: 'body'
              });
            }
          }
        }
      }
    }
  
    if (validationErrors.length > 0) {
      return ResponseHandler.error(
        res,
        'فشل في التحقق من بيانات العميل',
        400,
        validationErrors,
        'VALIDATION_ERROR'
      );
    }
  
    let totalPrice = 0;
    let offerTitle = '';
    let offerReference = '';
  
    if (typeOfOrder === 'offer') {
      if (!offerId) {
        return ResponseHandler.error(res, 'معرف العرض مطلوب للطلبات بالعرض', 400);
      }
  
      const offer: IOffer | null = await Offer.findById(offerId);
      if (!offer || !offer.isActive ) {
        return ResponseHandler.error(res, 'العرض المحدد غير صالح أو منتهي الصلاحية', 400);
      }
  
      totalPrice = offer.discountedPrice ?? offer.originalPrice ?? product.price;
      offerTitle = offer.title || '';
      offerReference = offer?.reference || "";
  
    } else if (typeOfOrder === 'quantity') {
      if (quantity < 1) {
        return ResponseHandler.error(res, 'الكمية يجب أن تكون أكبر من صفر', 400);
      }
  
      if (product.allowMultipleQuantities && product.maxQuantityPerInquiry && quantity > product.maxQuantityPerInquiry) {
        return ResponseHandler.error(res, `الحد الأقصى للكمية هو ${product.maxQuantityPerInquiry}`, 400);
      }
  
      totalPrice = (product.discountPrice ?? product.price) * quantity;
    } else {
      return ResponseHandler.error(res, 'نوع الطلب غير صالح', 400);
    }
  
    try {
      const timeEnter = new Date();
      const inquiry = new OrderInquiry({
        productId,
        customerData: selectedVariants,
        quantity: typeOfOrder === 'quantity' ? quantity : 1,
        offerId: typeOfOrder === 'offer' ? offerId : undefined,
        selectedVariants,
        totalPrice,
        notes,
        typeOfOrder,
        ipClient,
        timeEnter,
        BotScore: botScore,
      });
  
      await inquiry.save();
      await inquiry.populate('product');
  
      // Send success response first
      ResponseHandler.success(
        res,
        { inquiry, order: true,thankYouButton:product.thankYou },
        'تم إنشاء طلب الاستفسار بنجاح',
        201
      );
  
      // Try to append to Google Sheets, but don't fail if it errors
      if (SPREADSHEET_ID) {
        try {
          const selectedVariantsValues = Object.values(selectedVariants);
          const rowData = [
            ...selectedVariantsValues,
            product.name, 
            quantity, 
            typeOfOrder, 
            totalPrice, 
            offerTitle,
            offerReference,
            product.reference
          ];
  
          await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "store!A:F",
            valueInputOption: "RAW",
            requestBody: {
              values: [rowData],
            },
          });
          
          console.log('Successfully appended data to Google Sheets');
        } catch (sheetError: any) {
          // Log the error but don't throw it
          console.error('Failed to append to Google Sheets (order still saved):', {
            error: sheetError.message,
            code: sheetError.code,
            details: sheetError.errors?.[0]?.message || 'No additional details'
          });
        }
      }
  
    } catch (error) {
      return ResponseHandler.error(res, 'حدث خطأ أثناء إنشاء الطلب', 500);
    }
  });

  static saveInquiryToSheet = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    console.log(req.body)
    // Validate ID
    if (!id) {
      return ResponseHandler.error(
        res,
        'معرف الاستفسار مطلوب',
        400,
        [{
          field: 'id',
          message: 'معرف الاستفسار مطلوب',
          value: id,
          location: 'body'
        }],
        'VALIDATION_ERROR'
      );
    }

    // Check if sheet exists and get spreadsheet ID
    const sheetData = await Sheet.findOne({});
    let SPREADSHEET_ID: string;

    if (sheetData && sheetData.sheetID) {
      SPREADSHEET_ID = sheetData.sheetID;
      console.log('Using spreadsheet ID:', SPREADSHEET_ID);
    } else {
      return ResponseHandler.error(
        res,
        'لم يتم العثور على إعدادات جداول جوجل',
        404,
        [{
          field: 'sheetID',
          message: 'لم يتم العثور على إعدادات جداول جوجل',
          value: '',
          location: 'system'
        }],
        'SHEET_NOT_FOUND'
      );
    }

    try {
      // Try fetching from OrderInquiry
      let inquiry = await OrderInquiry.findById(id)
        .populate('product')
        .populate('offerId');
    
      // If not found, try fetching from OrderFake
      if (!inquiry) {
        inquiry = await OrderFake.findById(id)
          .populate('product')
          .populate('offerId');
      }
    
      // If still not found, return 404
      if (!inquiry) {
        return ResponseHandler.notFound(res, 'لم يتم العثور على الاستفسار');
      }
  

      // Verify spreadsheet access (optional, like in previous code)
      try {
        await sheets.spreadsheets.get({
          spreadsheetId: SPREADSHEET_ID,
        });
      } catch (error) {
        console.error('Error accessing Google Sheets (continuing anyway):', error);
        // Don't return error here, just log it like in previous code
      }

      // Prepare data for Google Sheets - matching the previous code structure
      const customerData = inquiry.customerData || {};
      const selectedVariantsValues = Object.values(customerData);
      
      // Get product name
      const productName = (inquiry as any).product?.name || 'N/A';
      
      // Get offer details - matching previous code logic
      let offerTitle = '';
      let offerReference = '';
      
      if (inquiry.typeOfOrder === 'offer' && inquiry.offerId) {
        if (typeof inquiry.offerId === 'object' && inquiry.offerId !== null) {
          // If offerId is populated
          offerTitle = (inquiry.offerId as any).title || '';
          offerReference = (inquiry.offerId as any).reference || '';
        }
        // If offerId is just an ID, we don't fetch it (like in previous code)
      }

      // Get product reference
      const productReference = (inquiry as any).product?.reference || '';

      // Prepare row data - matching the exact structure from previous code
      const rowData = [
        ...selectedVariantsValues,           // Customer data (name, phone, wilaya, etc.)
        productName,                        // Product name
        inquiry.quantity || 1,              // Quantity
        inquiry.typeOfOrder || 'quantity',  // Order type
        inquiry.totalPrice || 0,            // Total price
        offerTitle,                         // Offer title (if any)
        offerReference,                     // Offer reference (if any)
        productReference                    // Product reference
      ];

      // Append to Google Sheets - using same range and approach as previous code
      try {
        const appendResponse = await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: "store!A:F", // Using same range as previous code
          valueInputOption: "RAW",
          requestBody: {
            values: [rowData],
          },
        });

        console.log('Successfully appended inquiry to Google Sheets:', {
          inquiryId: inquiry._id,
          updatedCells: appendResponse.data.updates?.updatedCells,
          updatedRange: appendResponse.data.updates?.updatedRange
        });

        // Return success response
        ResponseHandler.success(
          res,
          {
            inquiryId: inquiry._id,
            sheetUpdate: {
              updatedCells: appendResponse.data.updates?.updatedCells,
              updatedRange: appendResponse.data.updates?.updatedRange,
              success: true
            },
            data: {
              customerName: customerData.name || customerData.fullName || 'N/A',
              product: productName,
              totalPrice: inquiry.totalPrice,
              typeOfOrder: inquiry.typeOfOrder
            }
          },
          'تم حفظ الاستفسار في جداول جوجل بنجاح',
          200
        );

      } catch (sheetError: any) {
        // Log the error but don't fail the request, similar to previous code
        console.error('Failed to append to Google Sheets:', {
          error: sheetError.message,
          code: sheetError.code,
          details: sheetError.errors?.[0]?.message || 'No additional details'
        });

        // Still return success since the main operation (finding inquiry) worked
        ResponseHandler.success(
          res,
          {
            inquiryId: inquiry._id,
            sheetUpdate: {
              success: false,
              error: 'فشل في الحفظ في جداول جوجل ولكن الاستفسار موجود في النظام'
            },
            data: {
              customerName: customerData.name || customerData.fullName || 'N/A',
              product: productName,
              totalPrice: inquiry.totalPrice,
              typeOfOrder: inquiry.typeOfOrder
            }
          },
          'تم العثور على الاستفسار ولكن فشل الحفظ في جداول جوجل',
          200
        );
      }

    } catch (error: any) {
      console.error('Error processing inquiry:', error);
      
      return ResponseHandler.error(
        res,
        'فشل في معالجة الاستفسار',
        500,
        [{
          field: 'system',
          message: error.message,
          value: '',
          location: 'system'
        }],
        'PROCESSING_ERROR'
      );
    }
  });





  // Get all inquiries with filtering and pagination
static getAllInquiries = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.productId) {
    filter.productId = req.query.productId;
  }

  // Dynamic customer data filtering
  if (req.query.phone) {
    filter['customerData.phone'] = { 
      $regex: req.query.phone, 
      $options: 'i' 
    };
  }

  if (req.query.name) {
    filter['customerData.name'] = { 
      $regex: req.query.name, 
      $options: 'i' 
    };
  }

  // Support dynamic field filtering
  Object.keys(req.query).forEach(key => {
    if (key.startsWith('customerData.')) {
      const fieldName = key.substring('customerData.'.length);
      filter[`customerData.${fieldName}`] = { 
        $regex: req.query[key], 
        $options: 'i' 
      };
    }
  });

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate as string);
    }
  }

  // Execute query with population
  const inquiries = await OrderInquiry.find(filter)
    .populate('product', 'name price discountPrice images dynamicFields')
    .populate('offer', 'title originalPrice discountedPrice isActive')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await OrderInquiry.countDocuments(filter);

  ResponseHandler.paginated(
    res,
    inquiries,
    total,
    page,
    limit,
    'Inquiries retrieved successfully'
  );
});
static getAllFakeOrdersInquiries = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.productId) {
    filter.productId = req.query.productId;
  }

  // Dynamic customer data filtering
  if (req.query.phone) {
    filter['customerData.phone'] = { 
      $regex: req.query.phone, 
      $options: 'i' 
    };
  }

  if (req.query.name) {
    filter['customerData.name'] = { 
      $regex: req.query.name, 
      $options: 'i' 
    };
  }

  // Support dynamic field filtering
  Object.keys(req.query).forEach(key => {
    if (key.startsWith('customerData.')) {
      const fieldName = key.substring('customerData.'.length);
      filter[`customerData.${fieldName}`] = { 
        $regex: req.query[key], 
        $options: 'i' 
      };
    }
  });

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate as string);
    }
  }

  // Execute query with population
  const inquiries = await OrderFake.find(filter)
    .populate('product', 'name price discountPrice images dynamicFields')
    .populate('offer', 'title originalPrice discountedPrice isActive')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await OrderFake.countDocuments(filter);

  ResponseHandler.paginated(
    res,
    inquiries,
    total,
    page,
    limit,
    'Inquiries retrieved successfully'
  );
});

static getInquiryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inquiry = await OrderInquiry.findById(id)
    .populate('product', 'name price discountPrice images dynamicFields predefinedFields')
    .populate('offer', 'title originalPrice discountedPrice isActive ');

  if (!inquiry) {
    return ResponseHandler.notFound(res, 'Order inquiry');
  }

  ResponseHandler.success(
    res,
    { inquiry },
    'Inquiry retrieved successfully'
  );
});

 

static deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Try deleting from OrderInquiry first
  let deletedDoc = await OrderInquiry.findByIdAndDelete(id);

  // If not found, try deleting from OrderFake
  if (!deletedDoc) {
    deletedDoc = await OrderFake.findByIdAndDelete(id);
  }

  // If not found in either collection
  if (!deletedDoc) {
    return ResponseHandler.notFound(res, 'Order inquiry or fake order');
  }

  ResponseHandler.success(
    res,
    { deleted: deletedDoc },
    'Order deleted successfully'
  );
});

static getInquiriesStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await OrderInquiry.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' }
      }
    }
  ]);

  const totalInquiries = await OrderInquiry.countDocuments();
  const recentInquiries = await OrderInquiry.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // last 7 days
  });

  // Top products by inquiry count
  const topProducts = await OrderInquiry.aggregate([
    {
      $group: {
        _id: '$productId',
        inquiryCount: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { inquiryCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products', // collection name in Mongo
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        inquiryCount: 1,
        totalValue: 1,
        'product._id': 1,
        'product.name': 1,
        'product.price': 1,
        'product.discountPrice': 1,
        'product.images': 1
      }
    }
  ]);

  ResponseHandler.success(
    res,
    {
      statusStats: stats,
      totalInquiries,
      recentInquiries,
      topProducts
    },
    'Inquiry statistics retrieved successfully'
  );
});


  // Bulk delete inquiries
  static bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
  
    // Delete from OrderInquiry
    const inquiryResult = await OrderInquiry.deleteMany({ _id: { $in: ids } });
  
    // Delete from OrderFake
    const fakeResult = await OrderFake.deleteMany({ _id: { $in: ids } });
  
    const totalDeleted = (inquiryResult.deletedCount || 0) + (fakeResult.deletedCount || 0);
  
    ResponseHandler.success(
      res,
      { 
        deletedFromInquiry: inquiryResult.deletedCount, 
        deletedFromFake: fakeResult.deletedCount,
        totalDeleted 
      },
      `${totalDeleted} orders deleted successfully`
    );
  });
  

  // Delete all inquiries (requires confirmation code)
  static deleteAllInquiries = asyncHandler(async (req: Request, res: Response) => {
    const { confirmationCode } = req.body;
  
    // Security check – to avoid accidental deletion
    const REQUIRED_CODE = process.env.DELETE_ALL_CONFIRMATION || 'CONFIRM_DELETE_ALL';
  
    if (!confirmationCode || confirmationCode !== REQUIRED_CODE) {
      return ResponseHandler.error(
        res,
        'Invalid or missing confirmation code',
        403,
        undefined,
        'INVALID_CONFIRMATION'
      );
    }
  
    // Delete everything from both collections
    const inquiryResult = await OrderInquiry.deleteMany({});
    const fakeResult = await OrderFake.deleteMany({});
  
    const totalDeleted = (inquiryResult.deletedCount || 0) + (fakeResult.deletedCount || 0);
  
    ResponseHandler.success(
      res,
      {
        deletedFromInquiry: inquiryResult.deletedCount,
        deletedFromFake: fakeResult.deletedCount,
        totalDeleted,
      },
      `${totalDeleted} orders deleted successfully`
    );
  });
  

}