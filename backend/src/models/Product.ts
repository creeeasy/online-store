import mongoose, { Schema, Document } from 'mongoose';

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

export interface IOffer {
  title: string;
  discount: number; // Discount percentage (1-99)
  validUntil?: Date;
  isActive: boolean;
  _id?: mongoose.Types.ObjectId;
}

const OfferSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true }
});

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

// New Color interface
export interface IProductColor {
  name: string;
  hexCode: string;
  isAvailable?: boolean;
  _id?: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  colors?: IProductColor[]; // Optional array of up to 3 colors
  dynamicFields: IDynamicField[];
  predefinedFields: IPredefinedField[];
  offers: IOffer[];
  hiddenFields: IHiddenField[];
  createdBy: mongoose.Types.ObjectId;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
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
    min: [0, 'Discount price cannot be negative']
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
    key: { type: String, required: true, trim: true },
    placeholder: { type: String, required: true, trim: true },
    isRequired: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false }
  }],
  predefinedFields: [{
    category: { type: String, required: true, trim: true },
    options: [{ type: String, trim: true }],
    selectedOptions: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: false }
  }],
  offers: [OfferSchema],
  hiddenFields: [{
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  }],
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

export default mongoose.model<IProduct>('Product', ProductSchema);