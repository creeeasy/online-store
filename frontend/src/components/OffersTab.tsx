import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import type { IProduct, IOffer } from '../types/product';
import { ValidatedInput, ValidatedTextarea } from './ValidationErrorDisplay';

interface OffersTabProps {
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  validationErrors: Record<string, string[]>;
}

const OffersTab: React.FC<OffersTabProps> = ({ formData, setFormData, validationErrors }) => {
  const [newOffer, setNewOffer] = useState<Partial<IOffer>>({
    title: '',
    description: '',
    discount: 0,
    validUntil: '',
    isActive: true
  });

  const addOffer = () => {
    setFormData(prev => ({
      ...prev,
      offers: [...(prev.offers || []), { ...newOffer } as IOffer]
    }));
    setNewOffer({
      title: '',
      description: '',
      discount: 0,
      validUntil: '',
      isActive: true
    });
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

  return (
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
  );
};

export default OffersTab;