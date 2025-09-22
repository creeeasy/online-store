import { FiPackage, FiInbox, FiPlus } from 'react-icons/fi';
import { useOrderInquiries, useOrderInquiryStats } from '../hooks/useOrderInquiry';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts, useProductStats } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();

  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 5 });
  const { data: inquiriesData, isLoading: inquiriesLoading } = useOrderInquiries({ page: 1, limit: 10 });
  const { data: inquiryStats, isLoading: inquiryStatsLoading } = useOrderInquiryStats();
  const { data: productStats, isLoading: productStatsLoading } = useProductStats();

  const loading = productsLoading || inquiriesLoading || inquiryStatsLoading || productStatsLoading;

  const totalProducts =
    productStats?.data?.totalProducts || productsData?.data?.pagination?.totalItems || 0;
  const totalInquiries =
    inquiryStats?.totalInquiries || inquiriesData?.pagination?.totalItems || 0;
  const recentInquiries = inquiryStats?.recentInquiries || 0;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: <FiPackage style={{ color: theme.colors.primaryDark }} size={28} />,
      link: "/admin/products",
      change: "+12%",
    },
    {
      title: "Total Inquiries",
      value: totalInquiries.toString(),
      icon: <FiInbox style={{ color: theme.colors.primaryDark }} size={28} />,
      link: "/admin/inquiries",
      change: `${recentInquiries} recent`,
    },
  ];

  // --- Styles ---
  const pageContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.xl,
  };
  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  };
  const statCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
  };
  const quickActionsSectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
  };

  return (
    <div style={pageContainerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: theme.fonts.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.xl,
          }}
        >
          Admin Dashboard
        </h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* --- Stats --- */}
            <div style={statsGridStyle}>
              {stats.map((stat, index) => (
                <div key={index} style={statCardStyle}>
                  <div style={{ position: 'relative', padding: theme.spacing.lg }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: theme.fonts.semiBold,
                            color: theme.colors.textSecondary,
                            textTransform: 'uppercase',
                          }}
                        >
                          {stat.title}
                        </p>
                        <p
                          style={{
                            fontSize: '1.875rem',
                            fontWeight: theme.fonts.bold,
                            color: theme.colors.text,
                          }}
                        >
                          {stat.value}
                        </p>
                        {stat.change && (
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: theme.colors.textSecondary,
                              marginTop: theme.spacing.xs,
                            }}
                          >
                            {stat.change}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          backgroundColor: theme.colors.surface,
                          padding: theme.spacing.sm,
                          borderRadius: theme.borderRadius.md,
                          border: `1px solid ${theme.colors.border}`,
                          boxShadow: theme.shadows.sm,
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Quick Actions --- */}
            <div style={quickActionsSectionStyle}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: theme.fonts.bold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.md,
                }}
              >
                Quick Actions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.md }}>
                <a
                  href="/admin/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: theme.colors.backgroundSecondary,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      marginRight: theme.spacing.md,
                    }}
                  >
                    <FiPlus style={{ color: theme.colors.primary }} size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: theme.fonts.medium, color: theme.colors.text }}>
                      Manage Products
                    </p>
                    <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                      Keep your catalog up to date
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/inquiries"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: theme.colors.backgroundSecondary,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      marginRight: theme.spacing.md,
                    }}
                  >
                    <FiInbox style={{ color: theme.colors.primary }} size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: theme.fonts.medium, color: theme.colors.text }}>
                      Manage Inquiries
                    </p>
                    <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                      View and respond to inquiries
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
