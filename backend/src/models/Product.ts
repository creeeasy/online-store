import mongoose, { Schema, Document } from 'mongoose';
import { IOffer, OfferSchema } from './Offer';

// Define Wilaya (Region) enum
export const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
  'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
] as const;

export type Wilaya = typeof WILAYAS[number];


export interface IDynamicField {
  key: string;
  placeholder: string;
  isRequired?: boolean;
  isDefault?: boolean;
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

export interface IHiddenField {
  key: string;
  value: string;
  description: string;
  _id?: mongoose.Types.ObjectId;
}

// Color interface
export interface IProductColor {
  name: string;
  hexCode: string;
  isAvailable?: boolean;
  _id?: mongoose.Types.ObjectId;
}

// ✅ Enhanced Product interface with order inquiry support
export interface IProduct extends Document {
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  colors?: IProductColor[]; // Optional array of up to 3 colors
  dynamicFields: IDynamicField[];
  predefinedFields: IPredefinedField[];
  offers?: mongoose.Types.ObjectId[]; 
  hiddenFields: IHiddenField[];
  
  // ✅ New order inquiry configuration
  allowQuantity: boolean; // Whether product allows quantity selection
  allowMultipleQuantities: boolean; // Whether product allows multiple items per inquiry
  maxQuantityPerInquiry: number; // Maximum quantity allowed per inquiry
  
  createdBy: mongoose.Types.ObjectId;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Simple virtual methods for order inquiry logic
  getActiveOffers(): IOffer[];
  canOrderQuantity(quantity: number): boolean;
  getEffectivePrice(): number;
}

const ProductColorSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [30, 'Color name cannot exceed 30 characters']
  },
  hexCode: { 
    type: String, 
    required: true, 
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code']
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
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
        // Discount price must be less than regular price
        if (value && this.price) {
          return value < this.price;
        }
        return true;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  description: { 
    type: String, 
    required: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: {
    type: [String],
    validate: {
      validator: function (arr: string[]) {
        // allow empty or undefined
        if (!arr || arr.length === 0) return true;

        // validate each element as non-empty string
        return arr.every((str) => typeof str === 'string' && str.trim().length > 0);
      },
      message: 'Each image must be a non-empty string',
    },
    required: false, // optional field
  },
  colors: {
    type: [ProductColorSchema],
    validate: {
      validator: function (arr: IProductColor[]) {
        // Allow empty or undefined
        if (!arr || arr.length === 0) return true;
        
        // Maximum 3 colors allowed
        if (arr.length > 3) return false;
        
        // Check for unique color names and hex codes
        const names = arr.map(color => color.name.toLowerCase());
        const hexCodes = arr.map(color => color.hexCode.toLowerCase());
        
        return names.length === new Set(names).size && 
               hexCodes.length === new Set(hexCodes).size;
      },
      message: 'Maximum 3 colors allowed with unique names and hex codes',
    },
    required: false, // optional field
  },
  dynamicFields: [{
    key: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: [50, 'Dynamic field key cannot exceed 50 characters']
    },
    placeholder: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: [100, 'Dynamic field placeholder cannot exceed 100 characters']
    },
    isRequired: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false }
  }],
  predefinedFields: [{
    category: { type: String, required: true, trim: true },
    options: [{ type: String, trim: true }],
    selectedOptions: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: false }
  }],
 offers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
   hiddenFields: [{
    key: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: [50, 'Hidden field key cannot exceed 50 characters']
    },
    value: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: [200, 'Hidden field value cannot exceed 200 characters']
    },
    description: { 
      type: String, 
      trim: true,
      maxlength: [100, 'Hidden field description cannot exceed 100 characters']
    }
  }],
  
  // ✅ Fixed quantity configuration fields
  allowQuantity: {
    type: Boolean,
    default: true,
    required: true
  },
  
  allowMultipleQuantities: {
    type: Boolean,
    default: false,
  },
  
  maxQuantityPerInquiry: {
    type: Number,
    default: 1,
    min: [1, '2 Maximum quantity per inquiry must be at least 1'],
  },
  
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reference: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Reference cannot exceed 200 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Pre-save middleware to ensure quantity configuration consistency
ProductSchema.pre('save', function(next) {
  // If allowQuantity is false, force allowMultipleQuantities to false and maxQuantityPerInquiry to 1
  if (!this.allowQuantity) {
    this.allowMultipleQuantities = false;
    this.maxQuantityPerInquiry = 1;
  }
  
  // If allowMultipleQuantities is false, force maxQuantityPerInquiry to 1
  if (!this.allowMultipleQuantities) {
    this.maxQuantityPerInquiry = 1;
  }
  
  // If maxQuantityPerInquiry is greater than 1, allowMultipleQuantities should be true
  if (this.maxQuantityPerInquiry > 1) {
    this.allowMultipleQuantities = true;
    this.allowQuantity = true; // Enable quantity if multiple quantities are allowed
  }
  
  next();
});

// ✅ Simple instance method: Get active offers
ProductSchema.methods.getActiveOffers = function(): IOffer[] {
  const now = new Date();
  
  return this.offers.filter((offer: IOffer) => {
    return offer.isActive && (!offer.validUntil || offer.validUntil > now);
  });
};

// ✅ Instance method: Check if a quantity can be ordered
ProductSchema.methods.canOrderQuantity = function(quantity: number): boolean {
  if (!this.allowQuantity) return false; // Quantity selection disabled
  if (quantity < 1) return false;
  if (quantity === 1) return true; // Single items always allowed
  
  return this.allowMultipleQuantities && quantity <= this.maxQuantityPerInquiry;
};

// ✅ Instance method: Get effective price (discount price if available, otherwise regular price)
ProductSchema.methods.getEffectivePrice = function(): number {
  return this.discountPrice || this.price;
};

// ✅ Virtual: Check if product is currently on sale
ProductSchema.virtual('isOnSale').get(function() {
  return Boolean(this.discountPrice && this.discountPrice < this.price);
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

// Index for color availability
ProductSchema.index({ 'colors.isAvailable': 1 });

// ✅ New indexes for order inquiry functionality
ProductSchema.index({ allowQuantity: 1 });
ProductSchema.index({ allowMultipleQuantities: 1 });
ProductSchema.index({ maxQuantityPerInquiry: 1 });
ProductSchema.index({ 'offers.isActive': 1, 'offers.validUntil': 1 });
ProductSchema.index({ allowQuantity: 1, allowMultipleQuantities: 1, maxQuantityPerInquiry: 1 }); // Compound index

// ✅ Static method: Find products suitable for bulk orders
ProductSchema.statics.findBulkOrderSuitable = function(minQuantity: number = 2) {
  return this.find({
    allowQuantity: true,
    allowMultipleQuantities: true,
    maxQuantityPerInquiry: { $gte: minQuantity }
  });
};

// ✅ Static method: Find products with active offers
ProductSchema.statics.findWithActiveOffers = function() {
  return this.find({
    offers: { 
      $elemMatch: { 
        isActive: true,
        $or: [
          { validUntil: { $exists: false } },
          { validUntil: { $gt: new Date() } }
        ]
      }
    }
  });
};

export default mongoose.model<IProduct>('Product', ProductSchema);