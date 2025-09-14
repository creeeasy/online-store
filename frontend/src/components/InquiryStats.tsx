import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { InquiryUtils, useOrderInquiryStats } from '../utils/orderInquiryAPI';

const InquiryStats: React.FC = () => {
  const { stats, loading, error } = useOrderInquiryStats();

  if (loading) {
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
        <div className="text-red-600">Error loading statistics: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
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
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${InquiryUtils.getStatusColor(statusStat._id)}`}></span>
                <span className="text-sm text-gray-600 capitalize">{statusStat._id}</span>
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
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Top Products</h4>
        <div className="space-y-2">
          {stats.topProducts.slice(0, 5).map((product, index) => (
            <div key={product._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-400 mr-2">{index + 1}.</span>
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
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
    </div>
  );
};

export default InquiryStats;