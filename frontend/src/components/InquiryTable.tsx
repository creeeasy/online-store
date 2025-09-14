import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import InquiryActions from './InquiryActions';
import { InquiryUtils } from '../utils/orderInquiryAPI';
import type { OrderInquiry } from '../types/orderInquiry';
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

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new inquiry.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <InquiryActions 
        selectedIds={selectedInquiries} 
        onSelectionChange={setSelectedInquiries} 
      />
      
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
            <tr key={inquiry._id} className={selectedInquiries.includes(inquiry._id) ? 'bg-gray-50' : undefined}>
              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                  checked={selectedInquiries.includes(inquiry._id)}
                  onChange={() => toggleSelectInquiry(inquiry._id)}
                />
              </td>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {inquiry.customerData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{inquiry.customerData.name}</div>
                    <div className="text-gray-500">{inquiry.customerData.phone}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="text-gray-900">{inquiry.productName}</div>
                <div className="text-gray-500 text-xs">Ref: {inquiry.customerData.reference}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {inquiry.quantity || 1}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {InquiryUtils.formatPrice(inquiry.totalPrice)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <StatusBadge status={inquiry.status} />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div>{InquiryUtils.formatDate(inquiry.createdAt)}</div>
                <div className="text-xs text-gray-400">
                  {InquiryUtils.getTimeAgo(inquiry.createdAt)}
                </div>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button className="text-indigo-600 hover:text-indigo-900">
                  View<span className="sr-only">, {inquiry.customerData.name}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;