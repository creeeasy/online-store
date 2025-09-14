import React, { useState } from 'react';
import InquiryFilters from './InquiryFilters';
import InquiryTable from './InquiryTable';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiries } from '../hooks/useOrderInquiry';
import type { OrderInquiryFilters } from '../types/orderInquiry';

const InquiryList: React.FC = () => {
  const [filters, setFilters] = useState<OrderInquiryFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useOrderInquiries(filters);

  const handleFilterChange = (newFilters: OrderInquiryFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
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
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
            <button
              onClick={handleRefresh}
              className="mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg 
              className={`-ml-1 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <InquiryFilters filters={filters} onChange={handleFilterChange} />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : data ? (
          <>
            <InquiryTable inquiries={data.inquiries} />
            {data.pagination && (
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={data.pagination.totalItems}
                itemsPerPage={data.pagination.itemsPerPage}
                hasNextPage={data.pagination.hasNextPage}
                hasPrevPage={data.pagination.hasPrevPage}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.keys(filters).length > 2 ? 'Try adjusting your filters.' : 'No inquiries have been submitted yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryList;