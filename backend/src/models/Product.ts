// models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicField {
  key: string;
  placeholder: string;
  _id?: mongoose.Types.ObjectId;
}

export interface IPredefinedField {
  category: string;
  options: string[];
  selectedOptions: string[];
  isActive: boolean;
  _id?: mongoose.Types.ObjectId;
}

export interface IReferenceLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface IOffer {
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  isActive: boolean;
  _id?: mongoose.Types.ObjectId;
}

export interface IHiddenField {
  key: string;
  value: string;
  description: string;
  _id?: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: IDynamicField[];
  predefinedFields: IPredefinedField[];
  references: IReferenceLinks;
  offers: IOffer[];
  hiddenFields: IHiddenField[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DynamicFieldSchema = new Schema({
  key: { type: String, required: true, trim: true },
  placeholder: { type: String, required: true, trim: true }
});

const PredefinedFieldSchema = new Schema({
  category: { type: String, required: true, trim: true },
  options: [{ type: String, trim: true }],
  selectedOptions: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: false }
});

const ReferenceLinksSchema = new Schema({
  facebook: { type: String, trim: true },
  instagram: { type: String, trim: true },
  tiktok: { type: String, trim: true }
});

const OfferSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true }
});

const HiddenFieldSchema = new Schema({
  key: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  description: { type: String, trim: true }
});

const ProductSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price cannot be negative']
  },
  discountPrice: { 
    type: Number, 
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(this: IProduct, value: number) {
        return value <= this.price;
      },
      message: 'Discount price cannot be higher than regular price'
    }
  },
  description: { 
    type: String, 
    required: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{ 
    type: String, 
    validate: {
      validator: function(url: string) {
        return /^https?:\/\/.+\..+/.test(url);
      },
      message: 'Invalid image URL format'
    }
  }],
  dynamicFields: [DynamicFieldSchema],
  predefinedFields: [PredefinedFieldSchema],
  references: ReferenceLinksSchema,
  offers: [OfferSchema],
  hiddenFields: [HiddenFieldSchema],
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for text search
ProductSchema.index({ 
  name: 'text', 
  description: 'text',
  'dynamicFields.key': 'text',
  'dynamicFields.placeholder': 'text'
});

// Index for category search
ProductSchema.index({ 'predefinedFields.category': 1, 'predefinedFields.isActive': 1 });

// Virtual for checking if product is on sale
ProductSchema.virtual('isOnSale').get(function(this: IProduct) {
  return this.discountPrice !== undefined && this.discountPrice < this.price;
});

// Virtual for discount percentage
//ProductSchema.virtual('discountPercentage').get(function(this: IProduct) {
//  if (!this.isOnSale) return 0;
//  return Math.round(((this.price - this.discountPrice!) / this.price) * 100);
//});

// Pre-save middleware to validate offers
ProductSchema.pre('save', function(next) {
  const product = this as IProduct;
  
  // Validate that at least one image exists
  if (product.images.length === 0) {
    return next(new Error('At least one image is required'));
  }
  
  // Validate dynamic fields have unique keys
  const dynamicFieldKeys = product.dynamicFields.map(f => f.key);
  if (new Set(dynamicFieldKeys).size !== dynamicFieldKeys.length) {
    return next(new Error('Dynamic field keys must be unique'));
  }
  
  // Validate hidden fields have unique keys
  const hiddenFieldKeys = product.hiddenFields.map(f => f.key);
  if (new Set(hiddenFieldKeys).size !== hiddenFieldKeys.length) {
    return next(new Error('Hidden field keys must be unique'));
  }
  
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);