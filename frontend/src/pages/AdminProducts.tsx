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
            console.log(productData)

      await updateProductMutation.mutateAsync({ id, data: productData });
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

  // Enhanced styles using the theme system
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    fontFamily: theme.fonts.family.body,
  };

  const headerContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md,
  };

  const headerContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['4xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    background: theme.colors.gradientPrimary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.fonts.letterSpacing.tight,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const subtitleStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.regular,
    lineHeight: theme.fonts.lineHeight.normal,
    marginBottom: theme.spacing.xl,
  };

  const headerActionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: theme.spacing.lg,
  };

  const addButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    background: theme.colors.gradientPrimary,
    color: theme.colors.textOnPrimary,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.lg,
    fontWeight: theme.fonts.weight.semiBold,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.body,
    transition: theme.transitions.normal,
    boxShadow: theme.shadows.md,
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    letterSpacing: theme.fonts.letterSpacing.wide,
  };

  const viewControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const viewModeContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    display: 'flex',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.xs,
  };

  const viewModeButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.fast,
    backgroundColor: isActive ? theme.colors.surface : 'transparent',
    boxShadow: isActive ? theme.shadows.sm : 'none',
    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
    border: 'none',
    cursor: 'pointer',
    fontWeight: isActive ? theme.fonts.weight.medium : theme.fonts.weight.regular,
    fontSize: theme.fonts.size.sm,
  });

  const errorAlertStyle: React.CSSProperties = {
    backgroundColor: `rgba(229, 115, 115, 0.05)`,
    border: `1px solid ${theme.colors.error}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: `${theme.spacing.lg} auto`,
    maxWidth: '1200px',
    animation: 'slideInDown 0.3s ease-out',
    boxShadow: theme.shadows.sm,
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
  };

  const gridLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: showForm ? '1fr 2fr' : '1fr',
    gap: theme.spacing['2xl'],
    alignItems: 'start',
  };

  const formSidebarStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    maxWidth: '100%',
  };

  const productSectionStyle: React.CSSProperties = {
    minHeight: '500px',
  };

  const statusBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
  };

  const statusInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexWrap: 'wrap' as const,
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.full,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.xs,
  };

  const loadingIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
  };

  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  };

  const productListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    padding: theme.spacing['3xl'],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '500px',
    margin: '0 auto',
  };

  const emptyIconStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${theme.spacing.xl}`,
    boxShadow: theme.shadows.md,
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: theme.fonts.size['2xl'],
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.family.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: theme.fonts.lineHeight.tight,
  };

  const emptyDescriptionStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.fonts.lineHeight.relaxed,
    marginBottom: theme.spacing.xl,
  };

  const loadingOverlayStyle: React.CSSProperties = {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.modal,
  };

  const loadingCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.xl,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    border: `1px solid ${theme.colors.border}`,
    minWidth: '300px',
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
      {/* Enhanced Header */}
      <header style={headerContainerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Product Management</h1>
            <p style={subtitleStyle}>Create and manage your product catalog with ease</p>
          </div>
          
          <div style={headerActionsStyle}>
            <button
              onClick={() => setShowForm(true)}
              disabled={createProductMutation.isPending}
              style={{
                ...addButtonStyle,
                opacity: createProductMutation.isPending ? 0.7 : 1,
                transform: createProductMutation.isPending ? 'scale(0.98)' : 'scale(1)',
                cursor: createProductMutation.isPending ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!createProductMutation.isPending) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }
              }}
              onMouseLeave={(e) => {
                if (!createProductMutation.isPending) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }
              }}
            >
              <FiPlus size={20} />
              Add Product
            </button>

            <div style={viewControlsStyle}>
              <span style={{ fontSize: theme.fonts.size.sm, color: theme.colors.textSecondary, fontWeight: theme.fonts.weight.medium }}>
                View:
              </span>
              <div style={viewModeContainerStyle}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={viewModeButtonStyle(viewMode === 'grid')}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'grid') {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'grid') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={viewModeButtonStyle(viewMode === 'list')}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'list') {
                      e.currentTarget.style.backgroundColor = theme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'list') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Error Display */}
      {validationErrors.length > 0 && (
        <div style={errorAlertStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <FiAlertCircle 
                style={{ 
                  color: theme.colors.error, 
                  marginRight: theme.spacing.md, 
                  marginTop: '2px', 
                  flexShrink: 0 
                }} 
                size={24} 
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  color: theme.colors.error, 
                  fontWeight: theme.fonts.weight.semiBold, 
                  fontSize: theme.fonts.size.lg,
                  fontFamily: theme.fonts.family.heading,
                  marginBottom: theme.spacing.md 
                }}>
                  Please fix the following errors:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {Object.entries(groupedErrors).map(([field, messages]) => (
                    <div key={field}>
                      {field !== 'general' && (
                        <h4 style={{ 
                          color: theme.colors.error, 
                          fontWeight: theme.fonts.weight.medium,
                          fontSize: theme.fonts.size.md,
                          textTransform: 'capitalize' as const, 
                          marginBottom: theme.spacing.sm 
                        }}>
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </h4>
                      )}
                      <ul style={{ 
                        color: theme.colors.error, 
                        fontSize: theme.fonts.size.sm, 
                        listStyle: 'none', 
                        paddingLeft: theme.spacing.lg,
                        lineHeight: theme.fonts.lineHeight.relaxed
                      }}>
                        {messages.map((message, index) => (
                          <li key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: theme.spacing.sm,
                            marginBottom: theme.spacing.xs
                          }}>
                            <span style={{ color: theme.colors.error, fontWeight: theme.fonts.weight.bold }}>&bull;</span>
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
              style={{ 
                color: theme.colors.error, 
                transition: theme.transitions.fast, 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                marginLeft: theme.spacing.md,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(229, 115, 115, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Main Content */}
      <main style={contentStyle}>
        <div style={gridLayoutStyle}>
          {/* Enhanced Form Sidebar */}
          {showForm && (
            <aside style={formSidebarStyle}>
              <ProductForm
                product={INITIAL_PRODUCT_STATE}
                onSubmit={handleCreateProduct}
                onCancel={handleCancel}
                isLoading={createProductMutation.isPending}
                validationErrors={groupedErrors}
              />
            </aside>
          )}

          {/* Enhanced Product Section */}
          <section style={productSectionStyle}>
            {/* Enhanced Status Bar */}
            <div style={statusBarStyle}>
              <div style={statusInfoStyle}>
                {isFetching && (
                  <div style={loadingIndicatorStyle}>
                    <div style={{ 
                      animation: 'spin 1s linear infinite', 
                      borderRadius: '50%', 
                      height: '16px', 
                      width: '16px', 
                      border: `2px solid ${theme.colors.primary}`, 
                      borderBottomColor: 'transparent' 
                    }} />
                    <span>Refreshing...</span>
                  </div>
                )}
                <div style={badgeStyle}>
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </div>
                {pagination && (
                  <div style={badgeStyle}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                )}
              </div>
            </div>

            {/* Products Display */}
            {products.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>
                  <FiPlus style={{ color: theme.colors.primary }} size={40} />
                </div>
                <h3 style={emptyTitleStyle}>No products yet</h3>
                <p style={emptyDescriptionStyle}>
                  Get started by adding your first product to build your catalog and start managing your inventory.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    ...addButtonStyle,
                    margin: '0 auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                >
                  <FiPlus size={18} />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <>
                <div style={viewMode === 'grid' ? productGridStyle : productListStyle}>
                  {products.map((product: IProduct, index: number) => (
                    <div 
                      key={product._id} 
                      style={{ 
                        animation: `slideInUp 0.3s ease-out ${index * 0.05}s forwards`,
                        opacity: 0,
                        transform: 'translateY(20px)'
                      }}
                    >
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

                {/* Enhanced Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    padding: theme.spacing.xl,
                    borderTop: `1px solid ${theme.colors.border}`,
                    marginTop: theme.spacing.xl
                  }}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        onSave={handleSaveProduct}
        predefinedCategories={PREDEFINED_CATEGORIES}
        isLoading={updateProductMutation.isPending}
        validationErrors={groupedErrors}
      />

      <DeleteConfirmationModal
        onConfirm={handleDeleteConfirm}
        isLoading={deleteProductMutation.isPending}
      />

      <CloneProductModal
        isOpen={!!cloningProduct}
        onClose={() => setCloningProduct(null)}
        product={cloningProduct}
        onConfirm={handleCloneConfirm}
        isLoading={cloneProductMutation.isPending}
      />

      {/* Enhanced Global Loading Overlay */}
      {(createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending || cloneProductMutation.isPending) && (
        <div style={loadingOverlayStyle}>
          <div style={loadingCardStyle}>
            <div style={{ 
              animation: 'spin 1s linear infinite', 
              borderRadius: '50%', 
              height: '24px', 
              width: '24px', 
              border: `3px solid ${theme.colors.primary}`, 
              borderBottomColor: 'transparent' 
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
              <span style={{ 
                color: theme.colors.text, 
                fontWeight: theme.fonts.weight.semiBold,
                fontSize: theme.fonts.size.md
              }}>
                {createProductMutation.isPending && 'Creating product...'}
                {updateProductMutation.isPending && 'Updating product...'}
                {deleteProductMutation.isPending && 'Deleting product...'}
                {cloneProductMutation.isPending && 'Cloning product...'}
              </span>
              <span style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.fonts.size.sm 
              }}>
                Please wait a moment
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add animations via CSS-in-JS styles */}
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminProducts;