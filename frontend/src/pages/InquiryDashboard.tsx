import React from 'react';
import InquiryList from '../components/InquiryList';
import InquiryStats from '../components/InquiryStats';

const InquiryDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Inquiries</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and track customer inquiries</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InquiryList />
          </div>
          
          <div className="lg:col-span-1">
            <InquiryStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDashboard;