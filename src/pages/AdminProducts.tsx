// components/AdminProducts.tsx
import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiDollarSign, FiImage, FiTag, FiSave, FiX, FiEyeOff, FiLink, FiGift, FiCheck, FiAlertTriangle } from 'react-icons/fi';

// Types
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: Array<{ key: string; placeholder: string }>;
  predefinedFields: Array<{
    category: string;
    options: string[];
    selectedOptions: string[];
    isActive: boolean;
  }>;
  references: Record<string, string>;
  offers: Array<{
    id: string;
    title: string;
    description: string;
    discount: number;
    validUntil: string;
    isActive: boolean;
  }>;
  hiddenFields: Array<{
    key: string;
    value: string;
    description: string;
  }>;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  isActive: boolean;
}

interface HiddenField {
  key: string;
  value: string;
  description: string;
}

interface ReferenceLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

// Predefined categories
const PREDEFINED_CATEGORIES = {
  size: {
    options: ['small', 'medium', 'large', 'x-large']
  },
  color: {
    options: ['red', 'blue', 'green', 'black', 'white']
  },
  material: {
    options: ['cotton', 'polyester', 'wool', 'silk']
  }
};

// Dummy data
const dummyProducts: Product[] = [
  {
    _id: '1',
    name: 'Premium T-Shirt',
    price: 29.99,
    discountPrice: 24.99,
    description: 'High-quality cotton t-shirt with premium finish.',
    images: ['https://picsum.photos/300/300?random=1'],
    dynamicFields: [
      { key: 'Custom Text', placeholder: 'Enter custom text' },
      { key: 'Logo Placement', placeholder: 'Select logo position' }
    ],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: category === 'size'
    })),
    references: {
      facebook: 'https://facebook.com/product1',
      instagram: 'https://instagram.com/product1'
    },
    offers: [
      {
        id: 'offer1',
        title: 'Summer Sale',
        description: 'Special summer discount',
        discount: 15,
        validUntil: '2023-08-31',
        isActive: true
      }
    ],
    hiddenFields: [
      {
        key: 'utm_source',
        value: 'summer_campaign',
        description: 'Tracking source'
      }
    ]
  },
  {
    _id: '2',
    name: 'Classic Jeans',
    price: 59.99,
    description: 'Comfortable and stylish jeans for everyday wear.',
    images: ['https://picsum.photos/300/300?random=2'],
    dynamicFields: [
      { key: 'Wash Type', placeholder: 'Select wash type' }
    ],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: true
    })),
    references: {},
    offers: [],
    hiddenFields: []
  }
];

// Modal Components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} animate-slide-in`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <FiX size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (id: string) => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, product, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(product._id);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setIsDeleting(false);
      }, 1500);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {isSuccess ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Deleted!</h3>
          <p className="text-gray-600">The product has been successfully removed.</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FiAlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0] || 'https://picsum.photos/80/80?random=default'}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="text-red-600 font-bold mt-1">${product.price}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Impact Assessment</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• This product has {product.dynamicFields.length} custom fields</li>
              <li>• {product.predefinedFields.filter(f => f.isActive).length} predefined fields will be removed</li>
              <li>• {product.offers.length} associated offers will be deleted</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (id: string, product: Product) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(product);
  const [newField, setNewField] = useState({ key: '', placeholder: '' });
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  const [newHiddenField, setNewHiddenField] = useState<Partial<HiddenField>>({ key: '', value: '', description: '' });

  React.useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  if (!editedProduct) return null;

  const tabConfig = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage, color: 'from-blue-500 to-blue-600' },
    { id: 'predefined', label: 'Predefined', icon: FiCheck, color: 'from-green-500 to-green-600' },
    { id: 'references', label: 'References', icon: FiLink, color: 'from-purple-500 to-purple-600' },
    { id: 'offers', label: 'Offers', icon: FiGift, color: 'from-pink-500 to-pink-600' },
    { id: 'hidden', label: 'Hidden', icon: FiEyeOff, color: 'from-gray-500 to-gray-600' },
    { id: 'dynamic', label: 'Dynamic', icon: FiTag, color: 'from-orange-500 to-orange-600' },
  ];

  const handleSave = async () => {
    if (!editedProduct) return;
    
    setIsSaving(true);
    try {
      await onSave(editedProduct._id, editedProduct);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddField = () => {
    if (!newField.key) return;
    setEditedProduct(prev => prev ? {
      ...prev,
      dynamicFields: [...prev.dynamicFields, { ...newField }]
    } : null);
    setNewField({ key: '', placeholder: '' });
  };

  const handleRemoveField = (index: number) => {
    setEditedProduct(prev => prev ? {
      ...prev,
      dynamicFields: prev.dynamicFields.filter((_, i) => i !== index)
    } : null);
  };

  const handleAddOffer = () => {
    if (!newOffer.title) return;
    setEditedProduct(prev => prev ? {
      ...prev,
      offers: [...prev.offers, { ...newOffer, id: `offer_${Date.now()}` } as Offer]
    } : null);
    setNewOffer({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  };

  const handleRemoveOffer = (index: number) => {
    setEditedProduct(prev => prev ? {
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index)
    } : null);
  };

  const handleAddHiddenField = () => {
    if (!newHiddenField.key) return;
    setEditedProduct(prev => prev ? {
      ...prev,
      hiddenFields: [...prev.hiddenFields, { ...newHiddenField } as HiddenField]
    } : null);
    setNewHiddenField({ key: '', value: '', description: '' });
  };

  const handleRemoveHiddenField = (index: number) => {
    setEditedProduct(prev => prev ? {
      ...prev,
      hiddenFields: prev.hiddenFields.filter((_, i) => i !== index)
    } : null);
  };

  const handlePredefinedFieldToggle = (category: string, isActive: boolean) => {
    setEditedProduct(prev => prev ? {
      ...prev,
      predefinedFields: prev.predefinedFields.map(field =>
        field.category === category ? { ...field, isActive } : field
      )
    } : null);
  };

  const handlePredefinedOptionToggle = (category: string, option: string, isSelected: boolean) => {
    setEditedProduct(prev => prev ? {
      ...prev,
      predefinedFields: prev.predefinedFields.map(field => {
        if (field.category === category) {
          const selectedOptions = isSelected
            ? [...field.selectedOptions, option]
            : field.selectedOptions.filter(opt => opt !== option);
          return { ...field, selectedOptions };
        }
        return field;
      })
    } : null);
  };

  const currentTab = tabConfig.find(tab => tab.id === activeTab);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col h-full">
        <div className={`bg-gradient-to-r ${currentTab?.color} p-6 text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {currentTab?.icon && React.createElement(currentTab.icon, { size: 24 })}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <p className="text-white text-opacity-80">Manage product details and configuration</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-1 overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {React.createElement(tab.icon, { size: 16 })}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editedProduct.discountPrice || ''}
                      onChange={(e) => setEditedProduct({ 
                        ...editedProduct, 
                        discountPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                      })}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  required
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiImage className="inline mr-2" size={16} />
                  Image URLs (one per line)
                </label>
                <textarea
                  value={editedProduct.images.join('\n')}
                  onChange={(e) => setEditedProduct({ 
                    ...editedProduct, 
                    images: e.target.value.split('\n').filter(url => url.trim()) 
                  })}
                  required
                  placeholder="https://example.com/image1.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'predefined' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predefined Fields</h3>
              <div className="space-y-4">
                {editedProduct.predefinedFields.map((field) => (
                  <div key={field.category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-gray-700 capitalize">
                        {field.category}
                      </label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          {field.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePredefinedFieldToggle(field.category, !field.isActive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            field.isActive ? 'bg-red-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              field.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {field.isActive && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Select available options:</p>
                        <div className="flex flex-wrap gap-2">
                          {field.options.map(option => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={field.selectedOptions.includes(option)}
                                onChange={(e) => handlePredefinedOptionToggle(field.category, option, e.target.checked)}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'references' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reference Links</h3>
              <div className="space-y-4">
                {['facebook', 'instagram', 'tiktok'].map(platform => (
                  <div key={platform}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {platform} URL
                    </label>
                    <div className="relative">
                      <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="url"
                        value={editedProduct.references[platform as keyof ReferenceLinks] || ''}
                        onChange={(e) => setEditedProduct({
                          ...editedProduct,
                          references: {
                            ...editedProduct.references,
                            [platform]: e.target.value
                          }
                        })}
                        placeholder={`https://${platform}.com/yourpage`}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Offers</h3>
              
              <div className="space-y-3 mb-4">
                {editedProduct.offers.map((offer, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <FiGift className="text-red-500" size={16} />
                    <div className="flex-1">
                      <span className="font-medium text-red-700">{offer.title}</span>
                      {offer.discount && (
                        <span className="text-red-500 text-sm ml-2">({offer.discount}% off)</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOffer(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700">Add New Offer</h4>
                <input
                  type="text"
                  placeholder="Offer title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                />
                <textarea
                  placeholder="Offer description"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm resize-none"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={newOffer.discount || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                  />
                  <input
                    type="date"
                    placeholder="Valid until"
                    value={newOffer.validUntil || ''}
                    onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Add Offer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hidden' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hidden Tracking Fields</h3>
              <p className="text-sm text-gray-600 mb-4">
                These fields will be stored with submissions but not shown to customers.
              </p>
              
              <div className="space-y-3 mb-4">
                {editedProduct.hiddenFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <FiEyeOff className="text-gray-500" size={16} />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">{field.key}</span>
                      <span className="text-gray-500 text-sm block">{field.description}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHiddenField(index)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700">Add Hidden Field</h4>
                <input
                  type="text"
                  placeholder="Field key (e.g., utm_source)"
                  value={newHiddenField.key}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Default value"
                  value={newHiddenField.value}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newHiddenField.description}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddHiddenField}
                  className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Add Hidden Field
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dynamic' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Form Fields</h3>
              
              <div className="space-y-2 mb-4">
                {editedProduct.dynamicFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="font-medium text-red-700">{field.key}</span>
                    <span className="text-red-500 text-sm">({field.placeholder})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="ml-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={newField.key}
                    onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Placeholder text"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Add Field
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
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
  });
  const [newField, setNewField] = useState({ key: '', placeholder: '' });
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  const [newHiddenField, setNewHiddenField] = useState<Partial<HiddenField>>({ key: '', value: '', description: '' });
  const [activeTab, setActiveTab] = useState('basic');

  const handleAddProduct = async (product: Product) => {
    const newProductWithId = {
      ...product,
      _id: `product_${Date.now()}`
    };
    setProducts(prev => [...prev, newProductWithId as Product]);
    console.log('Adding:', newProductWithId);
  };

  const handleUpdateProduct = async (id: string, product: Product) => {
    setProducts(prev => prev.map(p => p._id === id ? product : p));
    console.log('Updating:', id, product);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p._id !== id));
    console.log('Deleting:', id);
  };

  const handleAddField = () => {
    if (!newField.key) return;
    setNewProduct(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { ...newField }]
    }));
    setNewField({ key: '', placeholder: '' });
  };

  const handleRemoveField = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      dynamicFields: (prev.dynamicFields || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddOffer = () => {
    if (!newOffer.title) return;
    setNewProduct(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { ...newOffer, id: `offer_${Date.now()}` } as Offer]
    }));
    setNewOffer({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  };

  const handleRemoveOffer = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      offers: (prev.offers || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddHiddenField = () => {
    if (!newHiddenField.key) return;
    setNewProduct(prev => ({
      ...prev,
      hiddenFields: [...(prev.hiddenFields || []), { ...newHiddenField } as HiddenField]
    }));
    setNewHiddenField({ key: '', value: '', description: '' });
  };

  const handleRemoveHiddenField = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      hiddenFields: (prev.hiddenFields || []).filter((_, i) => i !== index)
    }));
  };

  const handlePredefinedFieldToggle = (category: string, isActive: boolean) => {
    setNewProduct(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field =>
        field.category === category ? { ...field, isActive } : field
      )
    }));
  };

  const handlePredefinedOptionToggle = (category: string, option: string, isSelected: boolean) => {
    setNewProduct(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field => {
        if (field.category === category) {
          const selectedOptions = isSelected
            ? [...field.selectedOptions, option]
            : field.selectedOptions.filter(opt => opt !== option);
          return { ...field, selectedOptions };
        }
        return field;
      })
    }));
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      await handleUpdateProduct(editingProduct._id, newProduct as Product);
    } else {
      await handleAddProduct(newProduct as Product);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    setNewProduct({
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
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
      images: [...product.images],
      predefinedFields: product.predefinedFields.map(field => ({ ...field })),
      offers: product.offers.map(offer => ({ ...offer })),
      hiddenFields: product.hiddenFields.map(field => ({ ...field }))
    });
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleDeleteConfirm = async (id: string) => {
    await handleDeleteProduct(id);
    setDeletingProduct(null);
  };

  const handleSaveProduct = async (id: string, productData: Product) => {
    await handleUpdateProduct(id, productData);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      <div className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage your product catalog</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <FiPackage size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-red-100 text-sm">Fill in the product details</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-100 p-2 flex overflow-x-auto">
                  {['basic', 'predefined', 'references', 'offers', 'hidden', 'dynamic'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-red-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {activeTab === 'basic' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                          placeholder="Enter product name"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price</label>
                          <div className="relative">
                            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                              required
                              placeholder="0.00"
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price</label>
                          <div className="relative">
                            <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newProduct.discountPrice || ''}
                              onChange={(e) => setNewProduct({ 
                                ...newProduct, 
                                discountPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                              })}
                              placeholder="Optional"
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          required
                          placeholder="Describe your product..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FiImage className="inline mr-2" size={16} />
                          Image URLs (one per line)
                        </label>
                        <textarea
                          value={newProduct.images?.join('\n') || ''}
                          onChange={(e) => setNewProduct({ 
                            ...newProduct, 
                            images: e.target.value.split('\n').filter(url => url.trim()) 
                          })}
                          required
                          placeholder="https://example.com/image1.jpg"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'predefined' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Predefined Fields</h3>
                      <div className="space-y-4">
                        {newProduct.predefinedFields?.map((field) => (
                          <div key={field.category} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <label className="font-medium text-gray-700 capitalize">
                                {field.category}
                              </label>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">
                                  {field.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handlePredefinedFieldToggle(field.category, !field.isActive)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    field.isActive ? 'bg-red-500' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      field.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                            
                            {field.isActive && (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">Select available options:</p>
                                <div className="flex flex-wrap gap-2">
                                  {field.options.map(option => (
                                    <label key={option} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={field.selectedOptions.includes(option)}
                                        onChange={(e) => handlePredefinedOptionToggle(field.category, option, e.target.checked)}
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'references' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Reference Links</h3>
                      <div className="space-y-4">
                        {['facebook', 'instagram', 'tiktok'].map(platform => (
                          <div key={platform}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                              {platform} URL
                            </label>
                            <div className="relative">
                              <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <input
                                type="url"
                                value={newProduct.references?.[platform as keyof ReferenceLinks] || ''}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  references: {
                                    ...newProduct.references,
                                    [platform]: e.target.value
                                  }
                                })}
                                placeholder={`https://${platform}.com/yourpage`}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'offers' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Offers</h3>
                      
                      <div className="space-y-3 mb-4">
                        {newProduct.offers?.map((offer, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                            <FiGift className="text-red-500" size={16} />
                            <div className="flex-1">
                              <span className="font-medium text-red-700">{offer.title}</span>
                              {offer.discount && (
                                <span className="text-red-500 text-sm ml-2">({offer.discount}% off)</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveOffer(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700">Add New Offer</h4>
                        <input
                          type="text"
                          placeholder="Offer title"
                          value={newOffer.title}
                          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                        <textarea
                          placeholder="Offer description"
                          value={newOffer.description}
                          onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm resize-none"
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Discount %"
                            value={newOffer.discount || ''}
                            onChange={(e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) || 0 })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                          />
                          <input
                            type="date"
                            placeholder="Valid until"
                            value={newOffer.validUntil || ''}
                            onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddOffer}
                          className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Add Offer
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hidden' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hidden Tracking Fields</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        These fields will be stored with submissions but not shown to customers.
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        {newProduct.hiddenFields?.map((field, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                            <FiEyeOff className="text-gray-500" size={16} />
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">{field.key}</span>
                              <span className="text-gray-500 text-sm block">{field.description}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveHiddenField(index)}
                              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700">Add Hidden Field</h4>
                        <input
                          type="text"
                          placeholder="Field key (e.g., utm_source)"
                          value={newHiddenField.key}
                          onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Default value"
                          value={newHiddenField.value}
                          onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={newHiddenField.description}
                          onChange={(e) => setNewHiddenField({ ...newHiddenField, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAddHiddenField}
                          className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          Add Hidden Field
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'dynamic' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Form Fields</h3>
                      
                      <div className="space-y-2 mb-4">
                        {newProduct.dynamicFields?.map((field, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                            <span className="font-medium text-red-700">{field.key}</span>
                            <span className="text-red-500 text-sm">({field.placeholder})</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveField(index)}
                              className="ml-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Field name"
                            value={newField.key}
                            onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Placeholder text"
                            value={newField.placeholder}
                            onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddField}
                          className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Add Field
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200"
                    >
                      <FiSave size={18} />
                      {editingProduct ? 'Update' : 'Save'} Product
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {products.length} products
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 rounded-lg shadow-lg transition-all duration-200"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-lg shadow-lg transition-all duration-200"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    {product.discountPrice && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          SALE
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`font-bold text-xl ${
                        product.discountPrice ? 'text-red-500' : 'text-gray-800'
                      }`}>
                        ${product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      {product.dynamicFields.length > 0 && (
                        <div className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          <span>{product.dynamicFields.length} custom field{product.dynamicFields.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {product.predefinedFields.filter(f => f.isActive).length > 0 && (
                        <div className="flex items-center gap-2">
                          <FiCheck size={16} className="text-green-500" />
                          <span>{product.predefinedFields.filter(f => f.isActive).length} predefined field{product.predefinedFields.filter(f => f.isActive).length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {product.offers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <FiGift size={16} className="text-green-500" />
                          <span>{product.offers.length} active offer{product.offers.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
      
      <DeleteModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminProducts;