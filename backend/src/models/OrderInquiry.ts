import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderInquiry extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  customerData: Record<string, any>; // ✅ dynamic
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  status: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderInquirySchema = new Schema(
  {
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
      type: Schema.Types.Mixed, // ✅ allows any shape (Record<string, any>)
      required: true,
      default: {}
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
OrderInquirySchema.index({ productId: 1, createdAt: -1 });
OrderInquirySchema.index({ status: 1, createdAt: -1 });
OrderInquirySchema.index({ createdAt: -1 });

// Virtual for product population
OrderInquirySchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

// Pre-save hook to set productName and calculate totalPrice
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

      if (!this.totalPrice && this.quantity) {
        const price = product.discountPrice || product.price;
        this.totalPrice = price * this.quantity;
      }
    }

    next();
  } catch (error) {
    const mongooseError = error instanceof Error 
      ? (error as mongoose.CallbackError) 
      : new Error('Unknown error') as mongoose.CallbackError;
    next(mongooseError);
  }
});

// Transform selectedVariants into plain object
function normalizeVariants(ret: any) {
  if (ret.selectedVariants && typeof ret.selectedVariants === 'object') {
    ret.selectedVariants = ret.selectedVariants instanceof Map
      ? Object.fromEntries(ret.selectedVariants)
      : ret.selectedVariants;
  }
  return ret;
}

OrderInquirySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => normalizeVariants(ret)
});

OrderInquirySchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => normalizeVariants(ret)
});

export default mongoose.model<IOrderInquiry>('OrderInquiry', OrderInquirySchema);

// Helper for type-safe creation
export const createOrderInquiry = (data: {
  productId: string | mongoose.Types.ObjectId;
  customerData: Record<string, any>; // ✅ dynamic
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice?: number;
  status?: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;
}) => {
  const OrderInquiry = mongoose.model<IOrderInquiry>('OrderInquiry');
  return new OrderInquiry({
    ...data,
    productId: typeof data.productId === 'string' 
      ? new mongoose.Types.ObjectId(data.productId) 
      : data.productId
  });
};
