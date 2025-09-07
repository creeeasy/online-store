import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiAlertCircle, FiRefreshCw, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Components
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';

// Hooks
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';

// Types
import { PREDEFINED_CATEGORIES, INITIAL_PRODUCT_STATE } from '../constants/products';
import type { IProduct, ApiError } from '../types/product';

interface ValidationError {
  field: string;
  message: string;
}

const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const { data: productsData, isLoading, isError, error, refetch, isFetching } = useProducts({
    page: currentPage,
    limit: 10,
    ...(searchQuery && { q: searchQuery })
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Helper function to extract validation errors
  const extractValidationErrors = (error: any): ValidationError[] => {
    const errors: ValidationError[] = [];
        console.log(error,"errors")

    if (error?.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        errors.push({
          field: err.param || err.field || 'general',
          message: err.msg || err.message || 'Invalid value'
        });
      });
    } else if (error?.message) {
      errors.push({
        field: 'general',
        message: error.message
      });
    }
    
    return errors;
  };

  // Clear errors when closing modals or forms
  const clearErrors = () => {
    setValidationErrors([]);
  };

  const handleEditClick = (product: IProduct) => {
    setEditingProduct(product);
    clearErrors();
  };

  const handleDeleteClick = (product: IProduct) => {
    setDeletingProduct(product);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      setDeletingProduct(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      // Error is handled by the hook's onError
    }
  };

  const handleSaveProduct = async (id: string, productData: Partial<IProduct>) => {
    try {
      clearErrors();
      console.log(productData)
      await updateProductMutation.mutateAsync({ id, data: productData });
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errors = extractValidationErrors(error);
      setValidationErrors(errors);
      
      // Show general error toast if no specific field errors
      if (errors.length === 0 || errors.every(e => e.field === 'general')) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to update product');
      }
    }
  };

  const handleCreateProduct = async (productData: Partial<IProduct>) => {
    try {
      clearErrors();
      await createProductMutation.mutateAsync(productData);
      setShowForm(false);
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errors = extractValidationErrors(error);
      console.log(errors)
      setValidationErrors(errors);
      
      // Show general error toast if no specific field errors
      if (errors.length === 0 || errors.every(e => e.field === 'general')) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to create product');
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    clearErrors();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleRetry = () => {
    setCurrentPage(1);
    refetch();
  };

  // Clear errors when mutations succeed
  useEffect(() => {
    if (createProductMutation.isSuccess || updateProductMutation.isSuccess) {
      clearErrors();
    }
  }, [createProductMutation.isSuccess, updateProductMutation.isSuccess]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState 
        error={error} 
        onRetry={handleRetry} 
        onGoToFirstPage={() => setCurrentPage(1)} 
      />
    );
  }

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination;

  // Group validation errors by field for better display
  const groupedErrors = validationErrors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage your product catalog</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={createProductMutation.isPending}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={20} />
              Add Product
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isFetching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <FiSearch size={16} />
              )}
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Enhanced Error Display */}
      {validationErrors.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <FiAlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-3">Please fix the following errors:</h3>
                  <div className="space-y-3">
                    {Object.entries(groupedErrors).map(([field, messages]) => (
                      <div key={field}>
                        {field !== 'general' && (
                          <h4 className="text-red-700 font-medium capitalize mb-1">
                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </h4>
                        )}
                        <ul className="text-red-600 text-sm space-y-1 ml-2">
                          {messages.map((message, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{message}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={clearErrors}
                className="text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1">
              <ProductForm
              
                product={INITIAL_PRODUCT_STATE}
                onSubmit={handleCreateProduct}
                onCancel={handleCancel}
                isLoading={createProductMutation.isPending}
                validationErrors={groupedErrors}
              />
            </div>
          )}
          
          <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h2>
              <div className="flex items-center gap-4">
                {isFetching && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {products.length} products
                </span>
                {pagination && (
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                )}
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiPlus className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchQuery ? 'No Products Found' : 'No Products Yet'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchQuery 
                    ? `No products match your search for "${searchQuery}". Try adjusting your search terms.`
                    : 'Get started by adding your first product to showcase in your store.'
                  }
                </p>
                {searchQuery ? (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                        refetch();
                      }}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      <FiRefreshCw size={18} />
                      Clear Search
                    </button>
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      <FiPlus size={18} />
                      Add Product
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 mx-auto"
                  >
                    <FiPlus size={18} />
                    Add Your First Product
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: IProduct) => (
                    <div key={product._id} className="animate-slide-in">
                      <ProductCard
                        product={product}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        isEditing={editingProduct?._id === product._id}
                        isDeleting={deletingProduct?._id === product._id}
                      />
                    </div>
                  ))}
                </div>

                {pagination && pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.pages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => {
          setEditingProduct(null);
          clearErrors();
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        predefinedCategories={PREDEFINED_CATEGORIES}
        isLoading={updateProductMutation.isPending}
        validationErrors={groupedErrors}
      />
      
      <DeleteConfirmationModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteProductMutation.isPending}
      />

      {/* Loading Overlays */}
      {(createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500" />
            <span className="text-gray-700 font-medium">
              {createProductMutation.isPending && 'Creating product...'}
              {updateProductMutation.isPending && 'Updating product...'}
              {deleteProductMutation.isPending && 'Deleting product...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;