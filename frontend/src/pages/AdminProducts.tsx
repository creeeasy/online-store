import React, { useState, useEffect } from 'react';
import { FiPlus, FiAlertCircle, FiX, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProductModal from '../components/ProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';
import CloneProductModal from '../components/CloneProductModal.tsx';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useCloneProduct } from '../hooks/useProducts';
import { INITIAL_PRODUCT_STATE } from '../constants/products';
import type { IProduct, ApiError } from '../types/product';
import { PREDEFINED_CATEGORIES } from '../data/predefinedFields';
import ProductCard from '../components/ProductCard.tsx';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch } from '../hooks/redux';
import { openModal } from '../store/slices/modalSlice';

interface ValidationError {
  field: string;
  message: string;
}

const AdminProducts: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [cloningProduct, setCloningProduct] = useState<IProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useProducts({
    page: currentPage,
    limit: 10,
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const cloneProductMutation = useCloneProduct();

  const extractValidationErrors = (error: ApiError): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (error?.validationErrors && Array.isArray(error.validationErrors)) {
      error.validationErrors.forEach((err) => {
        errors.push({
          field: err.field || 'general',
          message: err.message || 'Invalid value'
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

  const clearErrors = () => {
    setValidationErrors([]);
  };

  const handleEditClick = (product: IProduct) => {
     dispatch(openModal(
      
      {
        modalType:'editProduct',
        product
      }));
    setEditingProduct(product);
    clearErrors();
  };

  const handleDeleteClick = (product: IProduct) => {
    dispatch(openModal({
      modalType: 'deleteProduct',
      product
    }));
  };

  const handleCloneClick = (product: IProduct) => {
    setCloningProduct(product);
  };

  const handleCloneConfirm = async (reference?: string) => {
    if (!cloningProduct) return;
    try {
      await cloneProductMutation.mutateAsync({
        id: cloningProduct._id,
        reference
      });
      setCloningProduct(null);
    } catch (error: any) {
      console.error('Error cloning product:', error);
      const errors = extractValidationErrors(error);
      setValidationErrors(errors);
      if (errors.length === 0 || errors.every(e => e.field === 'general')) {
        toast.error(error.message || 'Failed to clone product');
      }
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
    } catch (error: any) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveProduct = async (id: string, productData: Partial<IProduct>) => {
    try {
      clearErrors();
      await updateProductMutation.mutateAsync({ id, data: productData });
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errors = extractValidationErrors(error);
      setValidationErrors(errors);
      if (errors.length === 0 || errors.every(e => e.field === 'general')) {
        toast.error(error.message || 'Failed to update product');
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
      setValidationErrors(errors);
      if (errors.length === 0 || errors.every(e => e.field === 'general')) {
        toast.error(error.message || 'Failed to create product');
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setCloningProduct(null);
    setShowForm(false);
    clearErrors();
  };

  const handleRetry = () => {
    setCurrentPage(1);
    refetch();
  };

  useEffect(() => {
    if (createProductMutation.isSuccess || updateProductMutation.isSuccess || cloneProductMutation.isSuccess) {
      clearErrors();
    }
  }, [createProductMutation.isSuccess, updateProductMutation.isSuccess, cloneProductMutation.isSuccess]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: `${theme.spacing.lg} 0`,
  };

  const headerContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
  };

  const headerContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: theme.fonts.bold,
    background: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const addButtonContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.secondary,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    fontWeight: theme.fonts.semiBold,
    transition: 'all 0.2s ease',
    boxShadow: theme.shadows.md,
    cursor: 'pointer',
    border: 'none',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows.lg,
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  };

  const viewModeButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? theme.colors.surface : 'transparent',
    boxShadow: isActive ? theme.shadows.sm : 'none',
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    border: 'none',
    cursor: 'pointer',
    ':hover': {
      color: theme.colors.primary,
    },
  });

  const errorAlertStyle: React.CSSProperties = {
    backgroundColor: theme.colors.backgroundSecondary,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    animation: 'shake 0.5s ease-in-out',
  };

  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
  };

  const productListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
  };

  const loadingOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };

  const loadingCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.xl,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  const groupedErrors = validationErrors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);

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

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={headerContentStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md }}>
            <div>
              <h1 style={titleStyle}>Product Management</h1>
              <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>Create and manage your product catalog</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={createProductMutation.isPending}
              style={{
                ...addButtonContainerStyle,
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                color: theme.colors.secondary
              }}
            >
              <FiPlus size={20} />
              Add Product
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, alignSelf: 'flex-end' }}>
              <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>View:</span>
              <div style={{ backgroundColor: theme.colors.backgroundSecondary, borderRadius: theme.borderRadius.md, padding: theme.spacing.xs, display: 'flex' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={viewModeButtonStyle(viewMode === 'grid')}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={viewModeButtonStyle(viewMode === 'list')}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.md} ${theme.spacing.md}` }}>
          <div style={errorAlertStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <FiAlertCircle style={{ color: theme.colors.primary, marginRight: theme.spacing.sm, marginTop: '2px', flexShrink: 0 }} size={20} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: theme.colors.primaryDark, fontWeight: theme.fonts.semiBold, marginBottom: theme.spacing.sm }}>Please fix the following errors:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {Object.entries(groupedErrors).map(([field, messages]) => (
                      <div key={field}>
                        {field !== 'general' && (
                          <h4 style={{ color: theme.colors.primaryDark, fontWeight: theme.fonts.medium, textTransform: 'capitalize', marginBottom: theme.spacing.xs }}>
                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </h4>
                        )}
                        <ul style={{ color: theme.colors.primaryDark, fontSize: '0.875rem', listStyle: 'none', paddingLeft: theme.spacing.md }}>
                          {messages.map((message, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.xs }}>
                              <span>&bull;</span>
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
                style={{ color: theme.colors.primary, transition: 'all 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', marginLeft: theme.spacing.sm }}
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${theme.spacing.lg} ${theme.spacing.md}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 2fr' : '1fr', gap: theme.spacing.lg }}>
          {showForm && (
            <div style={{ position: 'sticky', top: '1.5rem' }}>
              <ProductForm
                product={INITIAL_PRODUCT_STATE}
                onSubmit={handleCreateProduct}
                onCancel={handleCancel}
                isLoading={createProductMutation.isPending}
                validationErrors={groupedErrors}
              />
            </div>
          )}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                {isFetching && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, color: theme.colors.primaryDark }}>
                    <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '1rem', width: '1rem', border: `2px solid ${theme.colors.primary}`, borderBottomColor: 'transparent' }} />
                    <span style={{ fontSize: '0.875rem' }}>Loading...</span>
                  </div>
                )}
                <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, backgroundColor: theme.colors.backgroundSecondary, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, borderRadius: '9999px' }}>
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
                {pagination && (
                  <span style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, backgroundColor: theme.colors.backgroundSecondary, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, borderRadius: '9999px' }}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                )}
              </div>
            </div>

            {products.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{ width: '6rem', height: '6rem', backgroundColor: theme.colors.primaryLight, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: theme.spacing.lg }}>
                  <FiPlus style={{ color: theme.colors.primary }} size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: theme.fonts.semiBold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>No products yet</h3>
                <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md, maxWidth: '24rem', margin: '0 auto' }}>
                  Get started by adding your first product to the catalog.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                    color: theme.colors.secondary,
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    borderRadius: theme.borderRadius.lg,
                    fontWeight: theme.fonts.semiBold,
                    transition: 'all 0.2s ease',
                    margin: '0 auto',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FiPlus size={18} />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <>
                <div style={viewMode === 'grid' ? productGridStyle : productListStyle}>
                  {products.map((product: IProduct) => (
                    <div key={product._id} style={{ animation: 'slide-in 0.3s ease-out forwards' }}>
                      <ProductCard
                        product={product}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onClone={handleCloneClick}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div style={{ marginTop: theme.spacing.lg }}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <ProductModal
        onSave={handleSaveProduct}
        predefinedCategories={PREDEFINED_CATEGORIES}
        isLoading={updateProductMutation.isPending}
        validationErrors={groupedErrors}
      />

      {/* Delete Confirmation Modal - Now using Redux */}
      <DeleteConfirmationModal
        onConfirm={handleDeleteConfirm}
        isLoading={deleteProductMutation.isPending}
      />

      {/* Clone Product Modal */}
      <CloneProductModal
        isOpen={!!cloningProduct}
        onClose={() => setCloningProduct(null)}
        product={cloningProduct}
        onConfirm={handleCloneConfirm}
        isLoading={cloneProductMutation.isPending}
      />

      {/* Global Loading Overlay */}
      {(createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending || cloneProductMutation.isPending) && (
        <div style={loadingOverlayStyle}>
          <div style={loadingCardStyle}>
            <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '1.5rem', width: '1.5rem', border: `2px solid ${theme.colors.primary}`, borderBottomColor: 'transparent' }} />
            <span style={{ color: theme.colors.text, fontWeight: theme.fonts.medium }}>
              {createProductMutation.isPending && 'Creating product...'}
              {updateProductMutation.isPending && 'Updating product...'}
              {deleteProductMutation.isPending && 'Deleting product...'}
              {cloneProductMutation.isPending && 'Cloning product...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;