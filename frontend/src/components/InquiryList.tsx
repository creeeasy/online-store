// components/InquiryList.tsx
import React, { useState } from 'react';
import InquiryFilters from './InquiryFilters';
import InquiryTable from './InquiryTable';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiries } from '../utils/orderInquiryAPI';
import type { OrderInquiryFilters } from '../types/orderInquiry';
const InquiryList: React.FC = () => {
  const [filters, setFilters] = useState<OrderInquiryFilters>({
    page: 1,
    limit: 10,
  });

  const { inquiries, pagination, loading, error, refetch } = useOrderInquiries(filters);

  const handleFilterChange = (newFilters: OrderInquiryFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading inquiries</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Order Inquiries</h2>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        <InquiryFilters filters={filters} onChange={handleFilterChange} />
        
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <InquiryTable inquiries={inquiries} />
            {pagination && (
             <Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={handlePageChange}
/>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryList;