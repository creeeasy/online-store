export const PREDEFINED_CATEGORIES = {
  size: { options: ["small", "medium", "large", "x-large", "xx-large"] },
  color: { options: ["red", "blue", "green", "black", "white", "yellow", "purple", "pink"] },
  material: { options: ["cotton", "polyester", "silk", "wool", "leather", "denim"] },
  style: { options: ["casual", "formal", "sport", "vintage", "modern"] }
};

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
  references: {},
  offers: [],
  hiddenFields: []
};