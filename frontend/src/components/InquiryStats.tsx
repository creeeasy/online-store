import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useOrderInquiryStats } from '../hooks/useOrderInquiry';

// Utility functions for formatting and styling
const InquiryUtils = {
  getStatusColor: (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'contacted':
        return 'bg-blue-400';
      case 'converted':
        return 'bg-green-400';
      case 'cancelled':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  },

  formatPrice: (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  getStatusLabel: (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'contacted':
        return 'Contacted';
      case 'converted':
        return 'Converted';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }
};

const InquiryStats: React.FC = () => {
  const { data: stats, isLoading, error } = useOrderInquiryStats();

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Statistics</h3>
        <div className="flex justify-center py-4">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Statistics</h3>
        <div className="text-red-600">
          Error loading statistics: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Statistics</h3>
        <div className="text-gray-500">No statistics available</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Statistics</h3>
      
      {/* Total Inquiries */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total Inquiries</span>
          <span className="text-2xl font-bold text-indigo-600">{stats.totalInquiries}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {stats.recentInquiries} in the last 7 days
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Status Breakdown</h4>
        <div className="space-y-2">
          {stats.statusStats.map((statusStat) => (
            <div key={statusStat._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${InquiryUtils.getStatusColor(statusStat._id)}`}
                ></span>
                <span className="text-sm text-gray-600 capitalize">
                  {InquiryUtils.getStatusLabel(statusStat._id)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{statusStat.count}</div>
                <div className="text-xs text-gray-500">
                  {InquiryUtils.formatPrice(statusStat.totalValue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      {stats.topProducts && stats.topProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Top Products</h4>
          <div className="space-y-2">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-400 mr-2">{index + 1}.</span>
                  <span className="text-sm text-gray-600 truncate max-w-[120px]" title={product.productName}>
                    {product.productName}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{product.inquiryCount}</div>
                  <div className="text-xs text-gray-500">
                    {InquiryUtils.formatPrice(product.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for top products */}
      {stats.topProducts && stats.topProducts.length === 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Top Products</h4>
          <div className="text-xs text-gray-500">No product inquiries yet</div>
        </div>
      )}
    </div>
  );
};

export default InquiryStats;