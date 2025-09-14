import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ApiError } from '../utils/apiClient';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          {this.state.error instanceof ApiError ? (
            <div>
              <p>{this.state.error.message}</p>
              {this.state.error.isValidationError && (
                <div>
                  <h4>Validation Errors:</h4>
                  <ul>
                    {this.state.error.validationErrors?.map((error, index) => (
                      <li key={index}>
                        <strong>{error.field}:</strong> {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>An unexpected error occurred. Please try again later.</p>
          )}
          <button onClick={() => this.setState({ hasError: false, error: undefined })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}