import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description?: string;
  originalPrice?: number;
  discountedPrice?: number;
  validUntil?: Date;
  isActive: boolean;
}

export const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  originalPrice: { type: Number, min: [0, 'Original price cannot be negative'] },
  discountedPrice: { 
    type: Number, 
    min: [0, 'Discounted price cannot be negative'],
    validate: {
      validator: function(this: IOffer, value: number) {
        if (value != null && this.originalPrice != null) {
          return value < this.originalPrice;
        }
        return true;
      },
      message: 'Discounted price must be less than original price'
    }
  },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IOffer>('Offer', OfferSchema);
