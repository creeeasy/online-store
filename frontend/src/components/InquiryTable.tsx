import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import InquiryActions from './InquiryActions';
import type { OrderInquiry } from '../types/orderInquiry';

// Utility functions for formatting
const InquiryUtils = {
  formatPrice: (price?: number) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  formatDate: (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  },

  getTimeAgo: (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  },

  truncateText: (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

interface InquiryTableProps {
  inquiries: OrderInquiry[];
}

const InquiryTable: React.FC<InquiryTableProps> = ({ inquiries }) => {
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map(i => i._id));
    }
  };

  const handleViewInquiry = (inquiry: OrderInquiry) => {
    // TODO: Navigate to inquiry detail page or open modal
    console.log('View inquiry:', inquiry._id);
  };

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
        <p className="mt-1 text-sm text-gray-500">No inquiries match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {selectedInquiries.length > 0 && (
        <InquiryActions 
          selectedIds={selectedInquiries} 
          onSelectionChange={setSelectedInquiries} 
        />
      )}
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                  checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Product
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Quantity
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {inquiries.map((inquiry) => (
              <tr 
                key={inquiry._id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedInquiries.includes(inquiry._id) ? 'bg-indigo-50' : ''
                }`}
              >
                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    checked={selectedInquiries.includes(inquiry._id)}
                    onChange={() => toggleSelectInquiry(inquiry._id)}
                  />
                </td>
                
                {/* Customer Column */}
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">
                          {inquiry.customerData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900" title={inquiry.customerData.name}>
                        {InquiryUtils.truncateText(inquiry.customerData.name, 20)}
                      </div>
                      <div className="text-gray-500 text-xs">{inquiry.customerData.phone}</div>
                      {inquiry.customerData.reference && (
                        <div className="text-gray-400 text-xs">
                          Ref: {inquiry.customerData.reference}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Product Column */}
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="flex items-center">
                    {inquiry.product?.images?.[0] && (
                      <div className="h-8 w-8 flex-shrink-0 mr-3">
                        <img 
                          src={inquiry.product.images[0]} 
                          alt={inquiry.productName}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900 font-medium" title={inquiry.productName}>
                        {InquiryUtils.truncateText(inquiry.productName, 25)}
                      </div>
                      {inquiry.selectedVariants && Object.keys(inquiry.selectedVariants).length > 0 && (
                        <div className="text-xs text-gray-500">
                          {Object.entries(inquiry.selectedVariants).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Quantity Column */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                  {inquiry.quantity || 1}
                </td>

                {/* Total Price Column */}
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="text-gray-900 font-semibold">
                    {InquiryUtils.formatPrice(inquiry.totalPrice)}
                  </div>
                </td>

                {/* Status Column */}
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <StatusBadge status={inquiry.status} />
                </td>

                {/* Date Column */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="text-gray-900">{InquiryUtils.formatDate(inquiry.createdAt)}</div>
                  <div className="text-xs text-gray-400">
                    {InquiryUtils.getTimeAgo(inquiry.createdAt)}
                  </div>
                </td>

                {/* Actions Column */}
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button 
                    onClick={() => handleViewInquiry(inquiry)}
                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                  >
                    View
                    <span className="sr-only">, {inquiry.customerData.name}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-700">
        Showing {inquiries.length} inquiries
        {selectedInquiries.length > 0 && (
          <span className="ml-2 text-indigo-600">
            ({selectedInquiries.length} selected)
          </span>
        )}
      </div>
    </div>
  );
};

export default InquiryTable;