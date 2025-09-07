import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPlus, FiTrash2, FiCheck, FiDollarSign, FiEyeOff, FiGift, FiImage, FiLink, FiPackage, FiTag } from 'react-icons/fi';
import { ValidatedInput, ValidatedTextarea, FieldWrapper } from './ValidationErrorDisplay';
import { PREDEFINED_CATEGORIES } from '../constants/products';
import type { IDynamicField, IHiddenField, IOffer, IProduct } from '../types/product';

interface ProductFormProps {
  product: Partial<IProduct>;
  onSubmit: (productData: Partial<IProduct>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  validationErrors?: Record<string, string[]>;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
  validationErrors = {},
  isEditing = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '',
    price: 0,
    discountPrice: undefined,
    description: '',
    images: [''],
    dynamicFields: [],
    predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
      category,
      options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
      selectedOptions: [],
      isActive: false
    })),
    references: {},
    offers: [],
    hiddenFields: [],
    ...product
  });
  const [newField, setNewField] = useState<Omit<IDynamicField, '_id'>>({ key: '', placeholder: '' });
  const [newOffer, setNewOffer] = useState<Partial<IOffer>>({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  const [newHiddenField, setNewHiddenField] = useState<Partial<IHiddenField>>({ key: '', value: '', description: '' });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const tabConfig = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage, color: 'from-red-500 to-red-600' },
    { id: 'predefined', label: 'Categories', icon: FiCheck, color: 'from-red-500 to-red-600' },
    { id: 'references', label: 'References', icon: FiLink, color: 'from-red-500 to-red-600' },
    { id: 'offers', label: 'Offers', icon: FiGift, color: 'from-red-500 to-red-600' },
    { id: 'hidden', label: 'Hidden', icon: FiEyeOff, color: 'from-red-500 to-red-600' },
    { id: 'dynamic', label: 'Custom Fields', icon: FiTag, color: 'from-red-500 to-red-600' },
  ];

  // Reset form when product changes
  useEffect(() => {
    setFormData({
      name: '',
      price: 0,
      discountPrice: undefined,
      description: '',
      images: [''],
      dynamicFields: [],
      predefinedFields: Object.keys(PREDEFINED_CATEGORIES).map(category => ({
        category,
        options: PREDEFINED_CATEGORIES[category as keyof typeof PREDEFINED_CATEGORIES].options,
        selectedOptions: [],
        isActive: false
      })),
      references: {},
      offers: [],
      hiddenFields: [],
      ...product
    });
    setSubmitAttempted(false);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleInputChange = (field: keyof IProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const removeImage = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addDynamicField = () => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), { ...newField }]
    }));
    setNewField({ key: '', placeholder: '' });
  };

  const updateDynamicField = (index: number, field: 'key' | 'placeholder', value: string) => {
    const newFields = [...(formData.dynamicFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
  };

  const removeDynamicField = (index: number) => {
    const newFields = (formData.dynamicFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dynamicFields: newFields }));
  };

  const addOffer = () => {
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { ...newOffer } as IOffer]
    }));
    setNewOffer({ title: '', description: '', discount: 0, validUntil: '', isActive: true });
  };

  const updateOffer = (index: number, field: string, value: any) => {
    const newOffers = [...(formData.offers || [])];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  const removeOffer = (index: number) => {
    const newOffers = (formData.offers || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, offers: newOffers }));
  };

  const addHiddenField = () => {
    if (!newHiddenField.key?.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      hiddenFields: [...(prev.hiddenFields || []), { ...newHiddenField } as IHiddenField]
    }));
    setNewHiddenField({ key: '', value: '', description: '' });
  };

  const removeHiddenField = (index: number) => {
    const newHiddenFields = (formData.hiddenFields || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hiddenFields: newHiddenFields }));
  };

  const handlePredefinedFieldToggle = (category: string, isActive: boolean) => {
    setFormData(prev => ({
      ...prev,
      predefinedFields: (prev.predefinedFields || []).map(field =>
        field.category === category ? { ...field, isActive } : field
      )
    }));
  };

  const handlePredefinedOptionToggle = (category: string, option: string, isSelected: boolean) => {
    setFormData(prev => ({
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

  const handleReferenceChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: {
        ...(prev.references || {}),
        [platform]: value
      }
    }));
  };

  const currentTab = tabConfig.find(tab => tab.id === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${currentTab?.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              {currentTab?.icon && React.createElement(currentTab.icon, { size: 24 })}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-white text-opacity-80">Manage product details and configuration</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
          >
            <FiX size={20} />
          </button>
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

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === 'basic' && (
          <>
            <ValidatedInput
              label="Product Name"
              fieldName="name"
              errors={validationErrors}
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Regular Price"
                fieldName="price"
                errors={validationErrors}
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                icon={<FiDollarSign className="text-gray-400" size={20} />}
              />

              <ValidatedInput
                label="Sale Price"
                fieldName="discountPrice"
                errors={validationErrors}
                type="number"
                min="0"
                step="0.01"
                value={formData.discountPrice || ''}
                onChange={(e) => handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Optional discount price"
                icon={<FiTag className="text-gray-400" size={20} />}
              />
            </div>

            <ValidatedTextarea
              label="Description"
              fieldName="description"
              errors={validationErrors}
              required
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your product..."
              rows={4}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Product Images</h4>
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center gap-2 text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiPlus size={14} />
                  Add Image
                </button>
              </div>

              {(formData.images || []).map((image, index) => (
                <FieldWrapper
                  key={index}
                  label={`Image ${index + 1} URL`}
                  fieldName={`images.${index}`}
                  errors={validationErrors}
                  required={index === 0}
                >
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                    {(formData.images?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </FieldWrapper>
              ))}
            </div>
          </>
        )}

        {activeTab === 'predefined' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
            <div className="space-y-4">
              {(formData.predefinedFields || []).map((field) => (
                <div key={field.category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-gray-700 capitalize">
                      {field.category}
                    </label>
                    <div className="flex items-center">
                      <span className={`text-sm mr-2 ${field.isActive ? 'text-red-600' : 'text-gray-500'}`}>
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
                      <div className="grid grid-cols-2 gap-2">
                        {field.options.map(option => (
                          <label key={option} className="flex items-center p-2 rounded hover:bg-red-50 transition-colors">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media References</h3>
            <div className="space-y-4">
              {['facebook', 'instagram', 'tiktok'].map(platform => (
                <ValidatedInput
                  key={platform}
                  label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  fieldName={`references.${platform}`}
                  errors={validationErrors}
                  type="url"
                  value={(formData.references || {})[platform as keyof typeof formData.references] || ''}
                  onChange={(e) => handleReferenceChange(platform, e.target.value)}
                  placeholder={`https://${platform}.com/yourpage`}
                  icon={<FiLink className="text-gray-400" size={20} />}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Offers</h3>
            
            <div className="space-y-3 mb-4">
              {(formData.offers || []).map((offer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Offer {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ValidatedInput
                      label="Offer Title"
                      fieldName={`offers.${index}.title`}
                      errors={validationErrors}
                      required
                      type="text"
                      value={offer.title}
                      onChange={(e) => updateOffer(index, 'title', e.target.value)}
                      placeholder="e.g., Black Friday Sale"
                    />

                    <ValidatedInput
                      label="Discount Percentage"
                      fieldName={`offers.${index}.discount`}
                      errors={validationErrors}
                      required
                      type="number"
                      min="1"
                      max="99"
                      value={offer.discount}
                      onChange={(e) => updateOffer(index, 'discount', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 20"
                    />
                  </div>

                  <ValidatedTextarea
                    label="Offer Description"
                    fieldName={`offers.${index}.description`}
                    errors={validationErrors}
                    value={offer.description || ''}
                    onChange={(e) => updateOffer(index, 'description', e.target.value)}
                    placeholder="Describe this offer..."
                    rows={2}
                  />

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={offer.isActive !== false}
                        onChange={(e) => updateOffer(index, 'isActive', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      Active
                    </label>

                    <ValidatedInput
                      label="Valid Until"
                      fieldName={`offers.${index}.validUntil`}
                      errors={validationErrors}
                      type="datetime-local"
                      value={offer.validUntil ? new Date(offer.validUntil).toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateOffer(index, 'validUntil', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700">Add New Offer</h4>
              <ValidatedInput
                label="Offer Title"
                fieldName="newOffer.title"
                errors={validationErrors}
                required
                type="text"
                value={newOffer.title}
                onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                placeholder="e.g., Black Friday Sale"
              />

              <ValidatedTextarea
                label="Offer Description"
                fieldName="newOffer.description"
                errors={validationErrors}
                value={newOffer.description || ''}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                placeholder="Describe this offer..."
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ValidatedInput
                  label="Discount Percentage"
                  fieldName="newOffer.discount"
                  errors={validationErrors}
                  required
                  type="number"
                  min="1"
                  max="99"
                  value={newOffer.discount || ''}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 20"
                />

                <ValidatedInput
                  label="Valid Until"
                  fieldName="newOffer.validUntil"
                  errors={validationErrors}
                  type="datetime-local"
                  value={newOffer.validUntil || ''}
                  onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                />
              </div>

              <button
                type="button"
                onClick={addOffer}
                disabled={!newOffer.title?.trim()}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
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
              {(formData.hiddenFields || []).map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Hidden Field {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHiddenField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ValidatedInput
                      label="Field Key"
                      fieldName={`hiddenFields.${index}.key`}
                      errors={validationErrors}
                      required
                      type="text"
                      value={field.key}
                      onChange={(e) => {
                        const newFields = [...(formData.hiddenFields || [])];
                        newFields[index] = { ...newFields[index], key: e.target.value };
                        setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                      }}
                      placeholder="e.g., utm_source"
                    />

                    <ValidatedInput
                      label="Default Value"
                      fieldName={`hiddenFields.${index}.value`}
                      errors={validationErrors}
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const newFields = [...(formData.hiddenFields || [])];
                        newFields[index] = { ...newFields[index], value: e.target.value };
                        setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                      }}
                      placeholder="Default value"
                    />

                    <ValidatedInput
                      label="Description"
                      fieldName={`hiddenFields.${index}.description`}
                      errors={validationErrors}
                      type="text"
                      value={field.description || ''}
                      onChange={(e) => {
                        const newFields = [...(formData.hiddenFields || [])];
                        newFields[index] = { ...newFields[index], description: e.target.value };
                        setFormData(prev => ({ ...prev, hiddenFields: newFields }));
                      }}
                      placeholder="Field description"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700">Add Hidden Field</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <ValidatedInput
                  label="Field Key"
                  fieldName="newHiddenField.key"
                  errors={validationErrors}
                  required
                  type="text"
                  value={newHiddenField.key}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, key: e.target.value })}
                  placeholder="e.g., utm_source"
                />

                <ValidatedInput
                  label="Default Value"
                  fieldName="newHiddenField.value"
                  errors={validationErrors}
                  type="text"
                  value={newHiddenField.value}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, value: e.target.value })}
                  placeholder="Default value"
                />

                <ValidatedInput
                  label="Description"
                  fieldName="newHiddenField.description"
                  errors={validationErrors}
                  type="text"
                  value={newHiddenField.description}
                  onChange={(e) => setNewHiddenField({ ...newHiddenField, description: e.target.value })}
                  placeholder="Field description"
                />
              </div>
              <button
                type="button"
                onClick={addHiddenField}
                disabled={!newHiddenField.key?.trim()}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Hidden Field
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dynamic' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Form Fields</h3>
            
            <div className="space-y-3 mb-4">
              {(formData.dynamicFields || []).map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Dynamic Field {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDynamicField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ValidatedInput
                      label="Field Key"
                      fieldName={`dynamicFields.${index}.key`}
                      errors={validationErrors}
                      required
                      type="text"
                      value={field.key}
                      onChange={(e) => updateDynamicField(index, 'key', e.target.value)}
                      placeholder="e.g., size, color"
                    />

                    <ValidatedInput
                      label="Placeholder Text"
                      fieldName={`dynamicFields.${index}.placeholder`}
                      errors={validationErrors}
                      required
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateDynamicField(index, 'placeholder', e.target.value)}
                      placeholder="e.g., Enter size"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700">Add Custom Field</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ValidatedInput
                  label="Field Key"
                  fieldName="newField.key"
                  errors={validationErrors}
                  required
                  type="text"
                  value={newField.key}
                  onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                  placeholder="e.g., size, color"
                />

                <ValidatedInput
                  label="Placeholder Text"
                  fieldName="newField.placeholder"
                  errors={validationErrors}
                  required
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  placeholder="e.g., Enter size"
                />
              </div>
              <button
                type="button"
                onClick={addDynamicField}
                disabled={!newField.key?.trim() || !newField.placeholder?.trim()}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Field
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave size={18} />
                {isEditing ? 'Update' : 'Save'} Product
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;