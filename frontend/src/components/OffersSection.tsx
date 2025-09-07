// components/OffersSection.tsx
import React from 'react';
import type { Offer } from '../types/types';

interface OffersSectionProps {
  offers: Offer[];
}

const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Special Offers</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer, index) => (
          <div 
            key={offer.id} 
            className="border border-red-100 bg-red-50 rounded-xl p-4 relative overflow-hidden"
          >
            {offer.discount && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-bold">
                {offer.discount}% OFF
              </div>
            )}
            
            <h4 className="font-bold text-red-700 mb-2">{offer.title}</h4>
            <p className="text-gray-700 text-sm mb-2">{offer.description}</p>
            
            {offer.validUntil && (
              <p className="text-xs text-gray-500">
                Valid until: {new Date(offer.validUntil).toLocaleDateString()}
              </p>
            )}
            
            {/* Hidden input for backend processing */}
            <input type="hidden" name={`offer_${index}_id`} value={offer.id} />
            <input type="hidden" name={`offer_${index}_title`} value={offer.title} />
            {offer.discount && (
              <input type="hidden" name={`offer_${index}_discount`} value={offer.discount} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;