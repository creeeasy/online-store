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


export const DEFAULT_COLOR_PALETTES = [
  {
    name: 'Basic Colors',
    colors: [
      { name: 'Black', hexCode: '#000000' },
      { name: 'White', hexCode: '#FFFFFF' },
      { name: 'Red', hexCode: '#FF0000' },
      { name: 'Blue', hexCode: '#0000FF' },
      { name: 'Green', hexCode: '#008000' },
      { name: 'Yellow', hexCode: '#FFFF00' },
    ]
  },
  {
    name: 'Fashion Colors',
    colors: [
      { name: 'Navy Blue', hexCode: '#001f3f' },
      { name: 'Burgundy', hexCode: '#800020' },
      { name: 'Forest Green', hexCode: '#228B22' },
      { name: 'Charcoal', hexCode: '#36454F' },
      { name: 'Cream', hexCode: '#FFFDD0' },
      { name: 'Rose Gold', hexCode: '#E8B4B8' },
    ]
  },
  {
    name: 'Modern Colors',
    colors: [
      { name: 'Slate Gray', hexCode: '#708090' },
      { name: 'Coral', hexCode: '#FF7F50' },
      { name: 'Teal', hexCode: '#008080' },
      { name: 'Lavender', hexCode: '#E6E6FA' },
      { name: 'Mustard', hexCode: '#FFDB58' },
      { name: 'Sage Green', hexCode: '#9CAF88' },
    ]
  }
];