// src/components/ProductForm/ProductFormTabs.tsx
import React from 'react';
import { FiPackage, FiCheck, FiGift, FiEyeOff, FiTag, FiX } from 'react-icons/fi';

const tabConfig = [
  { id: 'basic', label: 'Basic Info', icon: FiPackage, color: 'from-red-500 to-red-600' },
  { id: 'predefined', label: 'Categories', icon: FiCheck, color: 'from-red-500 to-red-600' },
  { id: 'offers', label: 'Offers', icon: FiGift, color: 'from-red-500 to-red-600' },
  { id: 'hidden', label: 'Hidden', icon: FiEyeOff, color: 'from-red-500 to-red-600' },
  { id: 'dynamic', label: 'Custom Fields', icon: FiTag, color: 'from-red-500 to-red-600' },
];

interface ProductFormTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProductFormTabs: React.FC<ProductFormTabsProps> = ({ activeTab, setActiveTab, onCancel, isEditing }) => {
  const currentTab = tabConfig.find(tab => tab.id === activeTab);

  return (
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
  );
};

export default ProductFormTabs;