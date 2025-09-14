import React, { useState } from 'react';
import { useBulkDeleteOrderInquiries, useBulkUpdateOrderInquiryStatus, useOrderInquiry } from '../hooks/useOrderInquiry';
import InquiryUtils from '../utils/orderInquiryUtils';

interface InquiryActionsProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const InquiryActions: React.FC<InquiryActionsProps> = ({ selectedIds, onSelectionChange }) => {
  const [action, setAction] = useState('');

  const bulkDeleteMutation = useBulkDeleteOrderInquiries();
  const bulkUpdateMutation = useBulkUpdateOrderInquiryStatus();

  const isProcessing = bulkDeleteMutation.isPending || bulkUpdateMutation.isPending;

  const handleBulkAction = async () => {
    if (!action || selectedIds.length === 0) return;

    try {
      if (action === 'delete') {
        await bulkDeleteMutation.mutateAsync(selectedIds);
      } else if (['pending', 'contacted', 'converted', 'cancelled'].includes(action)) {
        await bulkUpdateMutation.mutateAsync({ ids: selectedIds, status: action });
      } else if (action === 'export') {
        // Use queries to fetch each inquiry
        const results = await Promise.all(
          selectedIds.map(id =>
            useOrderInquiry(id).refetch() // manually refetch
          )
        );
        const inquiries = results
          .map(r => r.data)
          .filter(Boolean);

        if (inquiries.length > 0) {
          InquiryUtils.exportInquiriesToCSV(inquiries);
        }
      }

      onSelectionChange([]);
      setAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between border-b border-indigo-100">
      <div className="flex items-center">
        <span className="text-sm text-indigo-700">
          {selectedIds.length} {selectedIds.length === 1 ? 'inquiry' : 'inquiries'} selected
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          disabled={isProcessing}
        >
          <option value="">Choose action...</option>
          <option value="pending">Mark as Pending</option>
          <option value="contacted">Mark as Contacted</option>
          <option value="converted">Mark as Converted</option>
          <option value="cancelled">Mark as Cancelled</option>
          <option value="export">Export Selected</option>
          <option value="delete">Delete Selected</option>
        </select>
        
        <button
          onClick={handleBulkAction}
          disabled={!action || isProcessing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Apply'}
        </button>
        
        <button
          onClick={() => onSelectionChange([])}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InquiryActions;
