import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  discount?: number;       // % discount, e.g. 20 = -20%
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    discount: { 
      type: Number, 
      min: [0, 'Discount cannot be negative'], 
      max: [100, 'Discount cannot exceed 100'] 
    },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Indexes for faster queries
OfferSchema.index({ isActive: 1 });
OfferSchema.index({ validUntil: 1 });

export default mongoose.model<IOffer>('Offer', OfferSchema);

// ✅ Helper for type-safe creation
export const createOffer = (data: {
  title: string;
  description?: string;
  discount?: number;
  validUntil?: Date;
  isActive?: boolean;
}) => {
  const Offer = mongoose.model<IOffer>('Offer');
  return new Offer({
    ...data,
    isActive: data.isActive ?? true
  });
};
