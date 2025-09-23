import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderInquiry extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;

  offerId?: mongoose.Types.ObjectId;
  offerName?: string;

  customerData: Record<string, any>;
  selectedVariants?: Record<string, string>;

  totalPrice?: number;
  status: 'pending' | 'contacted' | 'converted' | 'cancelled';
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderInquirySchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true, trim: true },

    offerId: { type: Schema.Types.ObjectId, ref: 'Offer' },
    offerName: { type: String, trim: true },

    customerData: { type: Schema.Types.Mixed, required: true, default: {} },
    selectedVariants: { type: Schema.Types.Mixed, default: {} },

    totalPrice: { type: Number, min: [0, 'Total price cannot be negative'] },

    status: {
      type: String,
      enum: ['pending', 'contacted', 'converted', 'cancelled'],
      default: 'pending'
    },
    notes: { type: String, trim: true, maxlength: [1000, 'Notes cannot exceed 1000 characters'] }
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

// Pre-save hook: auto-fill productName, offerName, totalPrice
OrderInquirySchema.pre<IOrderInquiry>('save', async function (next) {
  try {
    const Product = mongoose.model('Product');
    const Offer = mongoose.model('Offer');

    // Fetch product
    const product = await Product.findById(this.productId);
    if (!product) return next(new Error('Product not found') as mongoose.CallbackError);

    this.productName = product.name;

    let basePrice = product.discountPrice || product.price;

    // If offer is linked
    if (this.offerId) {
      const offer = await Offer.findById(this.offerId);
      if (!offer) return next(new Error('Offer not found') as mongoose.CallbackError);

      this.offerName = offer.title;

      if (offer.isActive && (!offer.validUntil || offer.validUntil > new Date())) {
        if (offer.discount && offer.discount > 0) {
          basePrice = basePrice - (basePrice * offer.discount) / 100;
        }
      }
    }

    this.totalPrice = basePrice;

    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

// Normalize variants
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

// Helper for creation
export const createOrderInquiry = (data: {
  productId: string | mongoose.Types.ObjectId;
  offerId?: string | mongoose.Types.ObjectId;
  customerData: Record<string, any>;
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
      : data.productId,
    offerId: data.offerId && typeof data.offerId === 'string'
      ? new mongoose.Types.ObjectId(data.offerId)
      : data.offerId
  });
};
