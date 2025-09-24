import mongoose, { Schema, Document } from 'mongoose';

/* =====================
   Order Inquiry Interface
===================== */
export interface IOrderInquiry extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  customerData: Record<string, any>;
  offerId?: mongoose.Types.ObjectId;
  quantity?: number;
  selectedVariants?: Record<string, string>;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  typeOfOrder: 'offer' | 'quantity';
}

const OrderInquirySchema = new Schema<IOrderInquiry>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true, trim: true },
    customerData: { type: Schema.Types.Mixed, required: true, default: {} },

    typeOfOrder: { type: String, enum: ['offer', 'quantity'], required: true },

    offerId: { type: Schema.Types.ObjectId, ref: 'Offer' },
    quantity: { type: Number, min: [1, 'Quantity must be at least 1'] },

    selectedVariants: { type: Schema.Types.Mixed, default: {} },
    totalPrice: { type: Number, min: 0, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ✅ Validation: typeOfOrder consistency
OrderInquirySchema.pre('validate', function(next) {
  if (this.typeOfOrder === 'offer' && !this.offerId) {
    return next(new Error('Offer ID is required for offer inquiries') as mongoose.CallbackError);
  }
  if (this.typeOfOrder === 'quantity' && !this.quantity) {
    return next(new Error('Quantity is required for quantity inquiries') as mongoose.CallbackError);
  }
  next();
});

// Virtuals
OrderInquirySchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

OrderInquirySchema.virtual('offer', {
  ref: 'Offer',
  localField: 'offerId',
  foreignField: '_id',
  justOne: true
});

// Pre-save hook to calculate totalPrice
OrderInquirySchema.pre<IOrderInquiry>('save', async function(next) {
  try {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.productId);
    if (!product) return next(new Error('Product not found') as mongoose.CallbackError);

    this.productName = product.name;

    if (this.typeOfOrder === 'offer') {
      const Offer = mongoose.model('Offer');
      const offer = await Offer.findById(this.offerId);
      if (!offer) return next(new Error('Offer not found') as mongoose.CallbackError);
      if (!offer.isActive || (offer.validUntil && offer.validUntil < new Date())) {
        return next(new Error('Offer is not valid or has expired') as mongoose.CallbackError);
      }

      this.totalPrice = offer.discountedPrice ?? offer.originalPrice ?? product.price;
    } else if (this.typeOfOrder === 'quantity') {
      if (!product.allowMultipleQuantities && this.quantity! > 1) {
        return next(new Error('Product allows only one item per inquiry') as mongoose.CallbackError);
      }
      this.totalPrice = (product.discountPrice ?? product.price) * this.quantity!;
    }

    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

// Transform selectedVariants to plain object
function normalizeVariants(ret: any) {
  if (ret.selectedVariants && typeof ret.selectedVariants === 'object') {
    ret.selectedVariants = ret.selectedVariants instanceof Map
      ? Object.fromEntries(ret.selectedVariants)
      : ret.selectedVariants;
  }
  return ret;
}

OrderInquirySchema.set('toJSON', { virtuals: true, transform: (_, ret) => normalizeVariants(ret) });
OrderInquirySchema.set('toObject', { virtuals: true, transform: (_, ret) => normalizeVariants(ret) });

export const OrderInquiry = mongoose.model<IOrderInquiry>('OrderInquiry', OrderInquirySchema);

// ✅ Helpers
export const createOfferInquiry = (data: {
  productId: string | mongoose.Types.ObjectId;
  offerId: string | mongoose.Types.ObjectId;
  customerData: Record<string, any>;
  selectedVariants?: Record<string, string>;
  notes?: string;
}) => {
  return new OrderInquiry({
    ...data,
    typeOfOrder: 'offer',
    productId: typeof data.productId === 'string' ? new mongoose.Types.ObjectId(data.productId) : data.productId,
    offerId: typeof data.offerId === 'string' ? new mongoose.Types.ObjectId(data.offerId) : data.offerId
  });
};

export const createQuantityInquiry = (data: {
  productId: string | mongoose.Types.ObjectId;
  quantity: number;
  customerData: Record<string, any>;
  selectedVariants?: Record<string, string>;
  notes?: string;
}) => {
  return new OrderInquiry({
    ...data,
    typeOfOrder: 'quantity',
    productId: typeof data.productId === 'string' ? new mongoose.Types.ObjectId(data.productId) : data.productId
  });
};
