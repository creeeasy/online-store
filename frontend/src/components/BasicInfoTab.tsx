// src/components/ProductForm/BasicInfoTab.tsx
import React from 'react';
import { FiDollarSign, FiTag, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { IProduct } from '../types/product';
import { FieldWrapper, ValidatedInput, ValidatedTextarea } from './ValidationErrorDisplay';

interface BasicInfoTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, setFormData, validationErrors }) => {
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

  return (
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

      <ValidatedInput
        label="Reference Source"
        fieldName="reference"
        errors={validationErrors}
        type="text"
        value={formData.reference || ''}
        onChange={(e) => handleInputChange('reference', e.target.value)}
        placeholder="e.g., facebook, tiktok, instagram"
        helpText="Track where customers come from (auto-detected from URL parameters)"
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
  );
};

export default BasicInfoTab;