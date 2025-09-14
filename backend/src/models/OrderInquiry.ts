// models/OrderInquiry.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerData {
  name: string;
  phone: string;
  reference: string;
  [key: string]: string;
}

export interface IOrderInquiry extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  customerData: ICustomerData;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  status: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerDataSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: { 
    type: String, 
    required: true, 
    trim: true,
    validate: {
      validator: function(phone: string) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
      },
      message: 'Invalid phone number format'
    }
  },
  reference: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [200, 'Reference cannot exceed 200 characters']
  }
}, { _id: false });

const OrderInquirySchema = new Schema({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  customerData: {
    type: CustomerDataSchema,
    required: true
  },
  quantity: { 
    type: Number, 
    min: [1, 'Quantity must be at least 1'],
    default: 1 
  },
  selectedVariants: {
    type: Schema.Types.Mixed,
    default: {}
  },
  totalPrice: { 
    type: Number, 
    min: [0, 'Total price cannot be negative'] 
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'cancelled'],
    default: 'pending'
  },
  notes: { 
    type: String, 
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
OrderInquirySchema.index({ productId: 1, createdAt: -1 });
OrderInquirySchema.index({ status: 1, createdAt: -1 });
OrderInquirySchema.index({ 'customerData.phone': 1 });
OrderInquirySchema.index({ createdAt: -1 });

// Virtual to populate product details
OrderInquirySchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to set productName from product
OrderInquirySchema.pre<IOrderInquiry>('save', async function(next) {
  try {
    if (this.isNew || this.isModified('productId')) {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.productId);
      
      if (!product) {
        const error = new Error('Product not found') as mongoose.CallbackError;
        return next(error);
      }
      
      this.productName = product.name;
      
      // Calculate total price if not provided
      if (!this.totalPrice && this.quantity) {
        const price = product.discountPrice || product.price;
        this.totalPrice = price * this.quantity;
      }
    }
    
    next();
  } catch (error) {
    // Properly type the error for mongoose
    const mongooseError = error instanceof Error ? error as mongoose.CallbackError : new Error('Unknown error') as mongoose.CallbackError;
    next(mongooseError);
  }
});

// Transform function to handle selectedVariants properly
OrderInquirySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Convert selectedVariants to a plain object if it exists
    if (ret.selectedVariants && typeof ret.selectedVariants === 'object') {
      ret.selectedVariants = ret.selectedVariants instanceof Map 
        ? Object.fromEntries(ret.selectedVariants) 
        : ret.selectedVariants;
    }
    return ret;
  }
});

OrderInquirySchema.set('toObject', {
  virtuals: true,
  transform: function(doc, ret) {
    // Convert selectedVariants to a plain object if it exists
    if (ret.selectedVariants && typeof ret.selectedVariants === 'object') {
      ret.selectedVariants = ret.selectedVariants instanceof Map 
        ? Object.fromEntries(ret.selectedVariants) 
        : ret.selectedVariants;
    }
    return ret;
  }
});

export default mongoose.model<IOrderInquiry>('OrderInquiry', OrderInquirySchema);

// Alternative approach using a more flexible interface for the document
export interface IOrderInquiryDocument extends Omit<IOrderInquiry, 'selectedVariants'> {
  selectedVariants?: Record<string, string> | Map<string, string>;
}

// Helper function to safely convert selectedVariants
export const convertSelectedVariants = (variants: Record<string, string> | Map<string, string> | undefined): Record<string, string> => {
  if (!variants) return {};
  if (variants instanceof Map) {
    return Object.fromEntries(variants);
  }
  return variants;
};

// Helper function to create order inquiry with proper typing
export const createOrderInquiry = (data: {
  productId: string | mongoose.Types.ObjectId;
  customerData: ICustomerData;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  status?: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
}) => {
  const OrderInquiry = mongoose.model<IOrderInquiry>('OrderInquiry');
  return new OrderInquiry({
    ...data,
    productId: typeof data.productId === 'string' ? new mongoose.Types.ObjectId(data.productId) : data.productId
  });
};