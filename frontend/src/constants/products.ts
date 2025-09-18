import { PREDEFINED_CATEGORIES } from "../data/predefinedFields";

export const INITIAL_PRODUCT_STATE = {
  name: '',
  price: 0,
  description: '',
  images: [],
  dynamicFields: [],
  predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
    category,
    options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
    selectedOptions: [],
    isActive: false
  })),
  offers: [],
  hiddenFields: []
};