import React, { useState } from 'react';
import { 
  useBulkDeleteOrderInquiries, 
  useDeleteAllOrderInquiries
} from '../hooks/useOrderInquiry';

interface InquiryActionsProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  totalCount?: number;
}

const InquiryActions: React.FC<InquiryActionsProps> = ({ 
  selectedIds, 
  onSelectionChange, 
  totalCount = 0 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const bulkDelete = useBulkDeleteOrderInquiries();
  const deleteAll = useDeleteAllOrderInquiries();

  const isProcessing = bulkDelete.isPending || deleteAll.isPending;

  // Handle bulk delete selected
  const handleBulkDelete = () => {
    setShowConfirmDialog('bulk');
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDelete.mutateAsync(selectedIds);
      onSelectionChange([]);
      setShowConfirmDialog(null);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  // Handle delete all
  const handleDeleteAll = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = async () => {
    if (!confirmationCode.trim()) {
      alert('Please enter confirmation code');
      return;
    }
    
    try {
      await deleteAll.mutateAsync(confirmationCode);
      onSelectionChange([]);
      setShowDeleteAllModal(false);
      setConfirmationCode('');
    } catch (error) {
      console.error('Delete all failed:', error);
      setConfirmationCode('');
    }
  };
 

  // Reset functions
  const resetBulkDelete = () => {
    bulkDelete.reset();
  };

  const resetDeleteAll = () => {
    deleteAll.reset();
    setConfirmationCode('');
    setShowDeleteAllModal(false);
  };


  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedIds.length} selected
              </div>
              <span className="text-sm text-gray-600">
                of {totalCount} total
              </span>
            </div>
            
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear selection
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Bulk Delete */}
            <button
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedIds.length})
            </button>

            {/* Delete All - Danger Zone */}
            <button
              onClick={handleDeleteAll}
              disabled={isProcessing}
              className="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Delete All
            </button>
          </div>
        </div>

        {(bulkDelete.isError || deleteAll.isError) && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600">
                Operation failed. You can retry or reset.
              </span>
              <div className="flex space-x-2">
                {bulkDelete.isError && (
                  <button
                    onClick={resetBulkDelete}
                    className="text-xs px-2 py-1 text-red-600 hover:text-red-800 underline"
                  >
                    Reset Bulk Delete
                  </button>
                )}
                {deleteAll.isError && (
                  <button
                    onClick={resetDeleteAll}
                    className="text-xs px-2 py-1 text-red-600 hover:text-red-800 underline"
                  >
                    Reset Delete All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      {showConfirmDialog === 'bulk' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Bulk Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete {selectedIds.length} selected inquir{selectedIds.length === 1 ? 'y' : 'ies'}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={bulkDelete.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {bulkDelete.isPending ? 'Deleting...' : `Delete ${selectedIds.length} Inquir${selectedIds.length === 1 ? 'y' : 'ies'}`}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800">
                DANGER ZONE: Delete All Inquiries
              </h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 font-medium mb-2">
                This action will permanently delete ALL inquiries from the database.
              </p>
              <p className="text-red-600 text-sm">
                This action cannot be undone. Please make sure you have a backup if needed.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter confirmation code to proceed:
              </label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="DELETE_ALL_INQUIRIES_CONFIRM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hint: The confirmation code is set in your environment variables
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteAllModal(false);
                  setConfirmationCode('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAll}
                disabled={!confirmationCode.trim() || deleteAll.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {deleteAll.isPending ? 'Deleting All...' : 'Confirm Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiryActions;