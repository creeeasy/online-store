// data/predefinedFields.ts
export const PREDEFINED_CATEGORIES = {
  sizes: {
    label: "Sizes",
    options: ["S", "M", "L", "XL", "XXL"]
  },
  colors: {
    label: "Colors",
    options: ["red", "blue", "black", "white", "green"]
  },
  seasons: {
    label: "Seasons",
    options: ["summer", "winter", "spring", "autumn"]
  },
  materials: {
    label: "Materials",
    options: ["wool", "cotton", "fleece", "down"]
  },
  availability: {
    label: "Availability",
    options: ["in stock", "out of stock", "discounted", "coming soon"]
  }
};

export type PredefinedCategoryKey = keyof typeof PREDEFINED_CATEGORIES;