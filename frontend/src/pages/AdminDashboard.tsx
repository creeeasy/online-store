import React, { useState } from 'react';
import { 
  FiPackage, FiInbox, FiDollarSign, FiUsers, 
  FiPlus, FiTrendingUp, FiEye,
  FiBarChart2, FiPieChart
} from 'react-icons/fi';
import InquiryStats from '../components/InquiryStats';
import ProductStats from '../components/ProductStats';
import { useOrderInquiries, useOrderInquiryStats } from '../hooks/useOrderInquiry';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts, useProductStats } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiryStats' | 'productStats'>('overview');
  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 5 });
  const { data: inquiriesData, isLoading: inquiriesLoading } = useOrderInquiries({ page: 1, limit: 10 });
  const { data: inquiryStats, isLoading: inquiryStatsLoading } = useOrderInquiryStats();
  const { data: productStats, isLoading: productStatsLoading } = useProductStats();
  const loading = productsLoading || inquiriesLoading || inquiryStatsLoading || productStatsLoading;
  const totalProducts = productStats?.data?.totalProducts || productsData?.data?.pagination?.totalItems || 0;
  const totalInquiries = inquiryStats?.totalInquiries || inquiriesData?.pagination?.totalItems || 0;
  const recentInquiries = inquiryStats?.recentInquiries || 0;
  const estimatedRevenue = inquiryStats?.statusStats?.reduce((total, stat) => total + stat.totalValue, 0) || 0;
  const stats = [
    { 
      title: "Total Products", 
      value: totalProducts.toString(), 
      icon: <FiPackage style={{ color: theme.colors.primaryDark }} size={28} />, 
      link: "/admin/products",
      change: "+12%",
      trend: "up"
    },
    { 
      title: "Total Inquiries", 
      value: totalInquiries.toString(), 
      icon: <FiInbox style={{ color: theme.colors.primaryDark }} size={28} />, 
      link: "/admin/inquiries",
      change: `${recentInquiries} recent`,
      trend: "up"
    },
    { 
      title: "Estimated Revenue", 
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(estimatedRevenue), 
      icon: <FiDollarSign style={{ color: theme.colors.primaryDark }} size={28} />,
      change: "+24%",
      trend: "up"
    },
    { 
      title: "Conversion Rate", 
      value: inquiryStats?.statusStats?.find(s => s._id === 'converted')?.count 
        ? `${Math.round((inquiryStats.statusStats.find(s => s._id === 'converted')!.count / totalInquiries) * 100)}%`
        : "0%", 
      icon: <FiUsers style={{ color: theme.colors.primaryDark }} size={28} />,
      change: "+5%",
      trend: "up"
    }
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#fffbe6', color: '#9a6700', borderColor: '#ffe58f' };
      case 'contacted': return { backgroundColor: '#e6f7ff', color: '#0050b3', borderColor: '#91d5ff' };
      case 'converted': return { backgroundColor: '#f6ffed', color: '#237804', borderColor: '#b7eb8f' };
      case 'cancelled': return { backgroundColor: '#fff1f0', color: '#a8071a', borderColor: '#ffa39e' };
      default: return { backgroundColor: '#f0f2f5', color: '#595959', borderColor: '#d9d9d9' };
    }
  };
  const pageContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.xl,
  };
  const dashboardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  };
  const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
  };
  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: '0.875rem',
    fontWeight: theme.fonts.medium,
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: isActive ? theme.colors.backgroundSecondary : 'transparent',
    color: isActive ? theme.colors.primaryDark : theme.colors.textSecondary,
    ':hover': {
      color: theme.colors.primaryDark,
    },
  });
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
  const recentInquiriesSectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
        <div style={dashboardHeaderStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: theme.fonts.bold, color: theme.colors.text }}>Admin Dashboard</h1>
          <div style={tabContainerStyle}>
            <button
              onClick={() => setActiveTab('overview')}
              style={tabButtonStyle(activeTab === 'overview')}
            >
              <FiEye size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inquiryStats')}
              style={tabButtonStyle(activeTab === 'inquiryStats')}
            >
              <FiBarChart2 size={16} />
              Inquiry Stats
            </button>
            <button
              onClick={() => setActiveTab('productStats')}
              style={tabButtonStyle(activeTab === 'productStats')}
            >
              <FiPieChart size={16} />
              Product Stats
            </button>
          </div>
        </div>
        {activeTab === 'overview' ? (
          <>
            <div style={statsGridStyle}>
              {stats.map((stat, index) => (
                <div key={index} style={statCardStyle}>
                  <div style={{ position: 'relative', padding: theme.spacing.lg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.md }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: theme.fonts.semiBold, color: theme.colors.textSecondary, textTransform: 'uppercase' }}>{stat.title}</p>
                        <p style={{ fontSize: '1.875rem', fontWeight: theme.fonts.bold, color: theme.colors.text }}>{stat.value}</p>
                        {stat.change && (
                          <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>{stat.change}</p>
                        )}
                      </div>
                      <div style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadows.sm }}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={recentInquiriesSectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: theme.fonts.bold, color: theme.colors.text }}>Recent Inquiries</h2>
                <a href="/admin/inquiries" style={{ color: theme.colors.primary, transition: 'all 0.3s ease', textDecoration: 'none', fontSize: '0.875rem', fontWeight: theme.fonts.medium }}>
                  View all &rarr;
                </a>
              </div>
              {inquiriesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
                  <LoadingSpinner size="md" />
                </div>
              ) : inquiriesData?.inquiries?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                  <FiInbox style={{ margin: '0 auto', height: '3rem', width: '3rem', color: theme.colors.textMuted, marginBottom: theme.spacing.md }} />
                  <p style={{ color: theme.colors.textSecondary }}>No inquiries yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {inquiriesData?.inquiries?.slice(0, 5).map((inquiry) => (
                    <div key={inquiry._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: theme.spacing.sm }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: theme.fonts.semiBold, color: theme.colors.text }}>{inquiry.productName}</p>
                        <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>
                          {inquiry.customerData.name} • {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                        {inquiry.totalPrice && (
                          <p style={{ fontSize: '0.875rem', fontWeight: theme.fonts.medium, color: theme.colors.textSecondary }}>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(inquiry.totalPrice)}
                          </p>
                        )}
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: theme.fonts.medium, border: '1px solid', textTransform: 'capitalize', ...getStatusColor(inquiry.status) }}>
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {inquiryStats?.topProducts && inquiryStats.topProducts.length > 0 && (
              <div style={{ ...recentInquiriesSectionStyle, marginBottom: theme.spacing.xl }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: theme.fonts.bold, color: theme.colors.text }}>Top Products by Inquiries</h2>
                  <a href="/admin/products" style={{ color: theme.colors.primary, transition: 'all 0.3s ease', textDecoration: 'none', fontSize: '0.875rem', fontWeight: theme.fonts.medium }}>
                    View all &rarr;
                  </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {inquiryStats.topProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: theme.spacing.sm }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: theme.fonts.medium, color: theme.colors.textMuted, marginRight: theme.spacing.sm, width: '1.5rem' }}>#{index + 1}</span>
                        <div>
                          <p style={{ fontWeight: theme.fonts.semiBold, color: theme.colors.text }}>{product.productName}</p>
                          <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>{product.inquiryCount} inquiries</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: theme.fonts.semiBold, color: theme.colors.text }}>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(product.totalValue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={quickActionsSectionStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: theme.fonts.bold, color: theme.colors.text, marginBottom: theme.spacing.md }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.md }}>
                <a href="/admin/products" style={{ display: 'flex', alignItems: 'center', padding: theme.spacing.md, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, textDecoration: 'none', transition: 'all 0.3s ease', ':hover': { backgroundColor: theme.colors.backgroundSecondary } }}>
                  <div style={{ backgroundColor: theme.colors.backgroundSecondary, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, marginRight: theme.spacing.md, transition: 'all 0.3s ease', ':hover': { backgroundColor: theme.colors.primaryLight } }}>
                    <FiPlus style={{ color: theme.colors.primary }} size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: theme.fonts.medium, color: theme.colors.text }}>Manage Products</p>
                    <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>Keep your catalog up to date</p>
                  </div>
                </a>
                <a href="/admin/inquiries" style={{ display: 'flex', alignItems: 'center', padding: theme.spacing.md, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, textDecoration: 'none', transition: 'all 0.3s ease', ':hover': { backgroundColor: theme.colors.backgroundSecondary } }}>
                  <div style={{ backgroundColor: theme.colors.backgroundSecondary, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, marginRight: theme.spacing.md, transition: 'all 0.3s ease', ':hover': { backgroundColor: theme.colors.primaryLight } }}>
                    <FiInbox style={{ color: theme.colors.primary }} size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: theme.fonts.medium, color: theme.colors.text }}>Manage Inquiries</p>
                    <p style={{ fontSize: '0.875rem', color: theme.colors.textSecondary }}>View and respond to inquiries</p>
                  </div>
                </a>
              </div>
            </div>
          </>
        ) : activeTab === 'inquiryStats' ? (
          <InquiryStats />
        ) : (
          <ProductStats />
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;