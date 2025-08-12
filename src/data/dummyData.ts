import type { FormSubmission, Product } from "../types/types";

export const dummyProducts: Product[] = [
  {
    _id: '1',
    name: 'Soft Plush Pillow',
    price: 29.99,
    discountPrice: 24.99,
    description: 'Ultra-soft plush pillow for maximum comfort. Perfect for naps and relaxation.',
    images: [
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ],
    dynamicFields: [
      { key: 'Color', placeholder: 'Select color' },
      { key: 'Quantity', placeholder: 'Enter quantity' }
    ],
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Cozy Blanket',
    price: 49.99,
    description: 'Warm and cozy blanket for chilly nights. Made with premium materials.',
    images: [
      'https://images.unsplash.com/photo-1598295893369-1918ffaf89a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ],
    dynamicFields: [
      { key: 'Size', placeholder: 'Select size' }
    ],
    createdAt: '2023-05-05T14:30:00Z',
    updatedAt: '2023-05-05T14:30:00Z'
  }
];

export const dummySubmissions: FormSubmission[] = [
  {
    _id: '1',
    productId: '1',
    productName: 'Soft Plush Pillow',
    customerData: {
      name: 'John Doe',
      phone: '555-123-4567',
      Color: 'Blue',
      Quantity: '2'
    },
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '2',
    productId: '2',
    productName: 'Cozy Blanket',
    customerData: {
      name: 'Jane Smith',
      phone: '555-987-6543',
      Size: 'Queen'
    },
    createdAt: '2023-05-16T15:45:00Z',
    updatedAt: '2023-05-16T15:45:00Z'
  }
];