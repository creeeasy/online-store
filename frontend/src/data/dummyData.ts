import type { Product } from "../types/types";

export const dummyProducts: Product[] = [
  {
    _id: '1',
    name: 'Premium Winter Jacket',
    price: 129.99,
    discountPrice: 89.99,
    description: 'Stay warm and stylish with our premium winter jacket. Made with high-quality materials to keep you comfortable in cold weather conditions. Features waterproof exterior, thermal insulation, and adjustable hood.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    dynamicFields: [
      { key: 'Special Instructions', placeholder: 'Any special requirements or notes?' },
      { key: 'Gift Message', placeholder: 'Add a personalized gift message' }
    ],
    predefinedFields: [
      {
        category: 'sizes',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        selectedOptions: ['S', 'M', 'L', 'XL'],
        isActive: true
      },
      {
        category: 'colors',
        options: ['red', 'blue', 'black', 'white', 'green', 'navy', 'grey'],
        selectedOptions: ['black', 'navy', 'grey'],
        isActive: true
      },
      {
        category: 'materials',
        options: ['wool', 'cotton', 'polyester', 'fleece', 'down'],
        selectedOptions: ['down', 'polyester'],
        isActive: true
      }
    ],
    references: {
      facebook: 'https://facebook.com/winterwear',
      instagram: 'https://instagram.com/winterwear',
      tiktok: 'https://tiktok.com/@winterwear'
    },
    offers: [
      {
        id: 'winter_sale_2024',
        title: 'Winter Clearance',
        description: 'Get an additional 15% off on all winter items until end of season',
        discount: 15,
        validUntil: '2024-03-31',
        isActive: true
      },
      {
        id: 'free_shipping_winter',
        title: 'Free Express Shipping',
        description: 'Free express shipping on winter jacket orders over $75',
        validUntil: '2024-02-28',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'utm_source',
        value: 'winter_campaign',
        description: 'Track marketing campaign source'
      },
      {
        key: 'product_category',
        value: 'winter_clothing',
        description: 'Internal product categorization'
      }
    ],
    createdAt: '2023-10-15T08:30:00.000Z',
    updatedAt: '2023-12-01T14:20:00.000Z'
  },
  {
    _id: '2',
    name: 'Wireless Bluetooth Earbuds',
    price: 199.99,
    discountPrice: 149.99,
    description: 'Experience crystal-clear audio with our premium wireless earbuds. Features active noise cancellation, 24-hour battery life, and water resistance for all-day comfort and superior sound quality.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    dynamicFields: [
      { key: 'Device Compatibility', placeholder: 'What device will you use these with?' },
      { key: 'Usage Priority', placeholder: 'Main use case (music, calls, sports, etc.)' }
    ],
    predefinedFields: [
      {
        category: 'colors',
        options: ['white', 'black', 'silver', 'rose-gold', 'space-grey'],
        selectedOptions: ['white', 'black', 'space-grey'],
        isActive: true
      },
      {
        category: 'connectivity',
        options: ['bluetooth-5.0', 'bluetooth-5.1', 'bluetooth-5.2', 'usb-c'],
        selectedOptions: ['bluetooth-5.2'],
        isActive: true
      },
      {
        category: 'features',
        options: ['noise-cancellation', 'water-resistant', 'wireless-charging', 'voice-assistant'],
        selectedOptions: ['noise-cancellation', 'water-resistant', 'wireless-charging'],
        isActive: true
      }
    ],
    references: {
      facebook: 'https://facebook.com/audiotech',
      instagram: 'https://instagram.com/audiotech',
      tiktok: 'https://tiktok.com/@audiotech'
    },
    offers: [
      {
        id: 'tech_tuesday',
        title: 'Tech Tuesday Special',
        description: 'Special discount for tech enthusiasts - limited time offer',
        discount: 20,
        validUntil: '2024-01-30',
        isActive: true
      },
      {
        id: 'bundle_deal',
        title: 'Bundle & Save',
        description: 'Buy earbuds with wireless charger and save $30',
        validUntil: '2024-02-15',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'utm_campaign',
        value: 'audio_tech_2024',
        description: 'Marketing campaign identifier'
      },
      {
        key: 'affiliate_code',
        value: '',
        description: 'Affiliate partner tracking code'
      }
    ],
    createdAt: '2023-11-20T10:15:00.000Z',
    updatedAt: '2023-12-15T16:45:00.000Z'
  },
  {
    _id: '3',
    name: 'Smart Fitness Watch',
    price: 299.99,
    description: 'Track your fitness goals with our advanced smart watch. Features heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Compatible with both iOS and Android.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    dynamicFields: [
      { key: 'Fitness Goals', placeholder: 'What are your main fitness objectives?' },
      { key: 'Wrist Size', placeholder: 'Measure your wrist circumference in inches' }
    ],
    predefinedFields: [
      {
        category: 'sizes',
        options: ['38mm', '42mm', '44mm', '46mm'],
        selectedOptions: ['42mm', '44mm'],
        isActive: true
      },
      {
        category: 'colors',
        options: ['black', 'white', 'silver', 'gold', 'rose-gold', 'blue'],
        selectedOptions: ['black', 'silver', 'blue'],
        isActive: true
      },
      {
        category: 'band-materials',
        options: ['silicone', 'leather', 'metal', 'nylon', 'fabric'],
        selectedOptions: ['silicone', 'leather'],
        isActive: true
      },
      {
        category: 'features',
        options: ['gps', 'heart-rate', 'sleep-tracking', 'waterproof', 'cellular'],
        selectedOptions: ['gps', 'heart-rate', 'sleep-tracking', 'waterproof'],
        isActive: false
      }
    ],
    references: {
      instagram: 'https://instagram.com/smartweartech'
    },
    offers: [
      {
        id: 'fitness_new_year',
        title: 'New Year Fitness Goals',
        description: 'Start your fitness journey with 25% off smart watches',
        discount: 25,
        validUntil: '2024-01-31',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'product_line',
        value: 'fitness_wearables',
        description: 'Product category for internal tracking'
      }
    ],
    createdAt: '2023-12-01T09:00:00.000Z',
    updatedAt: '2023-12-20T11:30:00.000Z'
  },
  {
    _id: '4',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    discountPrice: 24.99,
    description: 'Comfortable and sustainable organic cotton t-shirt. Made from 100% certified organic cotton with eco-friendly dyes. Perfect for casual wear with a classic fit.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    dynamicFields: [
      { key: 'Style Preference', placeholder: 'Fitted, regular, or loose fit?' }
    ],
    predefinedFields: [
      {
        category: 'sizes',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        selectedOptions: ['S', 'M', 'L', 'XL'],
        isActive: true
      },
      {
        category: 'colors',
        options: ['white', 'black', 'grey', 'navy', 'red', 'green', 'yellow', 'pink'],
        selectedOptions: ['white', 'black', 'grey', 'navy'],
        isActive: true
      }
    ],
    references: {
      facebook: 'https://facebook.com/sustainablefashion',
      instagram: 'https://instagram.com/sustainablefashion'
    },
    offers: [
      {
        id: 'eco_friendly',
        title: 'Sustainable Fashion Week',
        description: 'Support sustainable fashion with 15% off organic clothing',
        discount: 15,
        validUntil: '2024-04-22',
        isActive: true
      },
      {
        id: 'bulk_tshirt',
        title: 'Buy 3 Get 1 Free',
        description: 'Mix and match any t-shirts - buy 3 and get the 4th one free',
        validUntil: '2024-03-15',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'sustainability_score',
        value: 'A+',
        description: 'Internal sustainability rating'
      },
      {
        key: 'supplier_id',
        value: 'organic_cotton_co_001',
        description: 'Supplier identification for tracking'
      }
    ],
    createdAt: '2023-09-10T14:20:00.000Z',
    updatedAt: '2023-11-25T09:15:00.000Z'
  },
  {
    _id: '5',
    name: 'Professional Camera Lens',
    price: 899.99,
    discountPrice: 749.99,
    description: 'Professional grade 85mm f/1.4 portrait lens with exceptional image quality. Perfect for portrait photography with beautiful bokeh and sharp focus. Compatible with major camera brands.',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1528134379709-1988dd80b5ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    dynamicFields: [
      { key: 'Camera Brand', placeholder: 'What camera brand do you use?' },
      { key: 'Photography Type', placeholder: 'Main photography focus (portraits, events, etc.)' },
      { key: 'Experience Level', placeholder: 'Beginner, intermediate, or professional?' }
    ],
    predefinedFields: [
      {
        category: 'mounts',
        options: ['canon-ef', 'nikon-f', 'sony-e', 'fuji-x', 'micro-43'],
        selectedOptions: ['canon-ef', 'nikon-f', 'sony-e'],
        isActive: true
      },
      {
        category: 'focal-lengths',
        options: ['35mm', '50mm', '85mm', '135mm', '200mm'],
        selectedOptions: ['85mm'],
        isActive: true
      },
      {
        category: 'apertures',
        options: ['f1.4', 'f1.8', 'f2.8', 'f4', 'f5.6'],
        selectedOptions: ['f1.4'],
        isActive: true
      }
    ],
    references: {
      facebook: 'https://facebook.com/prophotogear',
      instagram: 'https://instagram.com/prophotogear',
      tiktok: 'https://tiktok.com/@prophotogear'
    },
    offers: [
      {
        id: 'pro_photographer',
        title: 'Professional Photographer Discount',
        description: 'Special pricing for verified professional photographers',
        discount: 12,
        validUntil: '2024-06-30',
        isActive: true
      },
      {
        id: 'trade_in_program',
        title: 'Lens Trade-In Program',
        description: 'Trade in your old lens and get additional discount',
        validUntil: '2024-05-31',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'professional_verification',
        value: '',
        description: 'Professional photographer verification status'
      },
      {
        key: 'trade_in_value',
        value: '',
        description: 'Estimated trade-in value for old equipment'
      }
    ],
    createdAt: '2023-08-15T11:45:00.000Z',
    updatedAt: '2023-12-10T15:20:00.000Z'
  }
];