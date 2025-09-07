import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
  onGoToFirstPage?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onGoToFirstPage }) => {
  const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200 max-w-md">
        <FiAlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <div className="space-y-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          )}
          {onGoToFirstPage && (
            <button
              onClick={onGoToFirstPage}
              className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to First Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;