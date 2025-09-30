import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description?: string;
  originalPrice?: number;
  discountedPrice?: number;
  validUntil?: Date;
  isActive: boolean;
  reference?: string;
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontBold?: string;
  descriptionFontFamily?: string;
  descriptionFontSize?: string;
  descriptionFontBold?: string;
  originalPriceFontFamily?: string;
  originalPriceFontSize?: string;
  originalPriceFontBold?: string;
  discountedPriceFontFamily?: string;
  discountedPriceFontSize?: string;
  discountedPriceFontBold?: string;
}

export const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  reference: { type: String, required: false },
  titleFontFamily: { type: String, required: false },
  titleFontSize: { type: String, required: false },
  titleFontBold: { type: String, required: false },
  descriptionFontFamily: { type: String, required: false },
  descriptionFontSize: { type: String, required: false },
  descriptionFontBold: { type: String, required: false },
  originalPriceFontFamily: { type: String, required: false },
  originalPriceFontSize: { type: String, required: false },
  originalPriceFontBold: { type: String, required: false },
  discountedPriceFontFamily: { type: String, required: false },
  discountedPriceFontSize: { type: String, required: false },
  discountedPriceFontBold: { type: String, required: false },
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