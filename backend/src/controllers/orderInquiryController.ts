
// controllers/orderInquiryController.ts
import { Request, Response } from 'express';
import Product from '../models/Product';
import { validationResult } from 'express-validator';
import OrderInquiry from '../models/OrderInquiry';
export class OrderInquiryController {
  // Create new order inquiry
  static async createInquiry(req: Request, res: Response) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { 
        productId, 
        customerData, 
        quantity = 1, 
        selectedVariants = {},
        notes 
      } = req.body;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Calculate total price
      const price = product.discountPrice || product.price;
      const totalPrice = price * quantity;

      // Create new inquiry
      const inquiry = new OrderInquiry({
        productId,
        productName: product.name,
        customerData,
        quantity,
        selectedVariants,
        totalPrice,
        notes
      });

      await inquiry.save();

      // Populate product details in response
      await inquiry.populate('product');

      res.status(201).json({
        success: true,
        message: 'Order inquiry created successfully',
        data: { inquiry }
      });

    } catch (error) {
      console.error('Error creating order inquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order inquiry',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all inquiries with filtering and pagination
  static async getAllInquiries(req: Request, res: Response) {
    try {
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

      // Execute query
      const inquiries = await OrderInquiry.find(filter)
        .populate('product', 'name price discountPrice images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await OrderInquiry.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
      console.log(inquiries)
      res.json({
        success: true,
        data: {
          inquiries,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inquiries',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get inquiry by ID
  static async getInquiryById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const inquiry = await OrderInquiry.findById(id)
        .populate('product', 'name price discountPrice images dynamicFields predefinedFields');

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: 'Order inquiry not found'
        });
      }

      res.json({
        success: true,
        data: { inquiry }
      });

    } catch (error) {
      console.error('Error fetching inquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inquiry',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update inquiry
  static async updateInquiry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates._id;
      delete updates.createdAt;
      delete updates.updatedAt;

      const inquiry = await OrderInquiry.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate('product', 'name price discountPrice images');

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: 'Order inquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Order inquiry updated successfully',
        data: { inquiry }
      });

    } catch (error) {
      console.error('Error updating inquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inquiry',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update inquiry status
  static async updateInquiryStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const validStatuses = ['pending', 'contacted', 'converted', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const inquiry = await OrderInquiry.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('product', 'name price discountPrice images');

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: 'Order inquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Inquiry status updated successfully',
        data: { inquiry }
      });

    } catch (error) {
      console.error('Error updating inquiry status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inquiry status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete inquiry
  static async deleteInquiry(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const inquiry = await OrderInquiry.findByIdAndDelete(id);

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: 'Order inquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Order inquiry deleted successfully',
        data: { deletedInquiry: inquiry }
      });

    } catch (error) {
      console.error('Error deleting inquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete inquiry',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get inquiries statistics
  static async getInquiriesStats(req: Request, res: Response) {
    try {
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
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      // Top products by inquiry count
      const topProducts = await OrderInquiry.aggregate([
        {
          $group: {
            _id: '$productId',
            productName: { $first: '$productName' },
            inquiryCount: { $sum: 1 },
            totalValue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { inquiryCount: -1 } },
        { $limit: 10 }
      ]);

      res.json({
        success: true,
        data: {
          statusStats: stats,
          totalInquiries,
          recentInquiries,
          topProducts
        }
      });

    } catch (error) {
      console.error('Error fetching inquiries stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inquiries statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
