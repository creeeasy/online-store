import type { ApiError } from "../utils/apiClient";

interface ErrorStateProps {
  error: ApiError;
  onRetry: () => void;
  onGoToFirstPage: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onGoToFirstPage }) => {
  return (
    <div className="text-center py-16">
      <h3 className="text-xl font-semibold text-red-600 mb-4">
        {error.status === 404 ? 'Products not found' : 'Failed to load products'}
      </h3>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <div className="flex gap-4 justify-center">
        <button onClick={onRetry} className="px-6 py-2 bg-red-600 text-white rounded-lg">
          Try Again
        </button>
        <button onClick={onGoToFirstPage} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">
          Go to First Page
        </button>
      </div>
    </div>
  );
};

export default ErrorState;