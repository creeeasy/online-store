import React from 'react';
import { useProductStats } from '../hooks/useProducts';
import { useTheme } from '../contexts/ThemeContext';
// UI components
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style = {} }) => {
  const { theme } = useTheme();
  const defaultStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm,
  };
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
};
const CardHeader: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style = {} }) => {
  const { theme } = useTheme();
  const defaultStyle: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  };
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
};
const CardTitle: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style = {} }) => {
  const { theme } = useTheme();
  const defaultStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: theme.fonts.semiBold,
  };
  return <h3 style={{ ...defaultStyle, ...style }}>{children}</h3>;
};
const CardDescription: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style = {} }) => {
  const { theme } = useTheme();
  const defaultStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
  };
  return <p style={{ ...defaultStyle, ...style }}>{children}</p>;
};
const CardContent: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style = {} }) => {
  return <div style={style}>{children}</div>;
};
const Skeleton: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  const { theme } = useTheme();
  const defaultStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  };
  return <div style={{ ...defaultStyle, ...style }}></div>;
};
const Alert: React.FC<{ 
  variant?: 'default' | 'destructive'; 
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ variant = 'default', children, style = {} }) => {
  const { theme } = useTheme();
  const variantStyles = {
    default: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff', color: '#003a8c' },
    destructive: { backgroundColor: '#fff1f0', borderColor: '#ffa39e', color: '#a8071a' },
  };
  const defaultStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: '1px solid',
    ...variantStyles[variant],
  };
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
};
const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <h4 style={{ fontWeight: theme.fonts.semiBold, marginBottom: theme.spacing.xs }}>{children}</h4>;
};
const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);
// Icons
const PackageIcon: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);
const TagIcon: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const TrendingUpIcon: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const ClockIcon: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const AlertCircleIcon: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing.xs, paddingTop: theme.spacing.md }}>
      {data.map((item, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', marginBottom: theme.spacing.xs, textAlign: 'center', height: '2rem', overflow: 'hidden' }}>
            {item.name.length > 10 ? `${item.name.substring(0, 10)}...` : item.name}
          </div>
          <div
            style={{
              backgroundColor: theme.colors.primary,
              width: '100%',
              borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
              transition: 'all 0.3s ease',
              height: `${(item.value / maxValue) * 80}%`,
            }}
          ></div>
          <div style={{ fontSize: '0.75rem', marginTop: theme.spacing.xs }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};
const PieChart: React.FC<{ data: any[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#8884D8', // Purple
  ];
  return (
    <div style={{ position: 'relative', width: '16rem', height: '16rem', margin: '0 auto' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const cumulativePercentage = data
            .slice(0, index)
            .reduce((sum, i) => sum + (total > 0 ? (i.value / total) * 100 : 0), 0);
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="10"
              strokeDasharray={`${percentage} ${100 - percentage}`}
              strokeDashoffset={100 - cumulativePercentage}
              transform="rotate(-90 50 50)"
            />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{total}</div>
        <div style={{ fontSize: '0.75rem' }}>Total</div>
      </div>
    </div>
  );
};
const ProductStats: React.FC = () => {
  const { theme } = useTheme();
  const { data, isLoading, error, refetch } = useProductStats();
  if (error) {
    return (
      <Alert variant="destructive">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AlertCircleIcon style={{ height: '1rem', width: '1rem', marginRight: theme.spacing.xs }} />
          <div>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load product statistics. Please try again.
              <button
                onClick={() => refetch()}
                style={{ marginLeft: theme.spacing.xs, fontSize: '0.875rem', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                Retry
              </button>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }
  if (isLoading) {
    return <StatsSkeleton />;
  }
  const stats = data?.data || {
    totalProducts: 0,
    onSaleCount: 0,
    withActiveOffers: 0,
    categoryStats: [],
    recentProducts: []
  };
  const categoryData = stats.categoryStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.totalProducts
  }));
  const statusData = [
    { name: 'Total Products', value: stats.totalProducts },
    { name: 'On Sale', value: stats.onSaleCount },
    { name: 'With Active Offers', value: stats.withActiveOffers }
  ];
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    variant?: 'default' | 'success' | 'warning' | 'destructive';
  }> = ({ title, value, icon, description, variant = 'default' }) => {
    const variantStyles = {
      default: { color: '#2563eb', backgroundColor: '#eff6ff' },
      success: { color: '#16a34a', backgroundColor: '#dcfce7' },
      warning: { color: '#ca8a04', backgroundColor: '#fefce8' },
      destructive: { color: '#dc2626', backgroundColor: '#fee2e2' }
    };
    return (
      <Card>
        <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: theme.spacing.xs }}>
          <CardTitle style={{ fontSize: '0.875rem', fontWeight: theme.fonts.medium }}>{title}</CardTitle>
          <div style={{ height: '2rem', width: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...variantStyles[variant] }}>
            {React.cloneElement(icon as React.ReactElement, { style: { height: '1rem', width: '1rem' } })}
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '1.5rem', fontWeight: theme.fonts.bold }}>{value}</div>
          <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>{description}</p>
        </CardContent>
      </Card>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: theme.spacing.md }}>
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<PackageIcon />}
          description="All products in catalog"
        />
        <StatCard
          title="On Sale"
          value={stats.onSaleCount.toLocaleString()}
          icon={<TagIcon />}
          description="Products with discounts"
          variant="success"
        />
        <StatCard
          title="With Active Offers"
          value={stats.withActiveOffers.toLocaleString()}
          icon={<TrendingUpIcon />}
          description="Products with active promotions"
          variant="warning"
        />
        <StatCard
          title="Recent Products"
          value={stats.recentProducts.length.toLocaleString()}
          icon={<ClockIcon />}
          description="Recently added products"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg }}>
        <Card style={{ padding: theme.spacing.lg }}>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
            <CardDescription>Breakdown of products by category</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ height: '20rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart data={categoryData} />
            </div>
            <div style={{ marginTop: theme.spacing.md, width: '100%' }}>
              {categoryData.map((category, index) => (
                <div key={category.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        borderRadius: '9999px',
                        marginRight: theme.spacing.xs,
                        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]
                      }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span style={{ fontWeight: theme.fonts.medium }}>
                    {category.value} ({total > 0 ? ((category.value / stats.totalProducts) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card style={{ padding: theme.spacing.lg }}>
          <CardHeader>
            <CardTitle>Product Status Overview</CardTitle>
            <CardDescription>Product counts by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '20rem' }}>
              <BarChart data={statusData} />
            </div>
            <div style={{ marginTop: theme.spacing.md }}>
              {statusData.map((status, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
                  <span>{status.name}</span>
                  <span style={{ fontWeight: theme.fonts.medium }}>
                    {status.value} products
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card style={{ padding: theme.spacing.lg }}>
        <CardHeader>
          <CardTitle>Recently Added Products</CardTitle>
          <CardDescription>Latest products added to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentProducts.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing.xl }}>No recent products</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.875rem' }}>
                <thead style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.backgroundSecondary }}>
                  <tr>
                    <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Product</th>
                    <th style={{ padding: theme.spacing.sm, textAlign: 'right' }}>Price</th>
                    <th style={{ padding: theme.spacing.sm, textAlign: 'right' }}>Discount</th>
                    <th style={{ padding: theme.spacing.sm, textAlign: 'right' }}>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((product) => (
                    <tr key={product._id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                      <td style={{ padding: theme.spacing.sm }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {product.images && product.images.length > 0 && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', borderRadius: theme.borderRadius.sm, marginRight: theme.spacing.sm }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: theme.fonts.medium }}>{product.name}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.colors.textSecondary }}>ID: {product._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
                        ${product.price.toFixed(2)}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
                        {product.discountPrice ? (
                          <span style={{ color: theme.colors.primaryDark }}>
                            ${(product.price - product.discountPrice).toFixed(2)} off
                          </span>
                        ) : (
                          <span style={{ color: theme.colors.textMuted }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Card style={{ padding: theme.spacing.lg }}>
        <CardHeader>
          <CardTitle>Detailed Category Statistics</CardTitle>
          <CardDescription>Complete breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead style={{ borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.backgroundSecondary }}>
                <tr>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Category</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'right' }}>Product Count</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'right' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category, index) => (
                  <tr key={category.name} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                    <td style={{ padding: theme.spacing.sm, fontWeight: theme.fonts.medium }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '0.75rem',
                            height: '0.75rem',
                            borderRadius: '9999px',
                            marginRight: theme.spacing.xs,
                            backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]
                          }}
                        />
                        {category.name}
                      </div>
                    </td>
                    <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>{category.value.toLocaleString()}</td>
                    <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
                      {stats.totalProducts > 0
                        ? `${((category.value / stats.totalProducts) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: theme.colors.backgroundSecondary, fontWeight: theme.fonts.semiBold }}>
                  <td style={{ padding: theme.spacing.sm }}>Total</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>{stats.totalProducts.toLocaleString()}</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const StatsSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const cardStyle: React.CSSProperties = {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: theme.spacing.md }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: theme.spacing.xs }}>
              <Skeleton style={{ height: '1rem', width: '5rem' }} />
              <Skeleton style={{ height: '2rem', width: '2rem', borderRadius: '9999px' }} />
            </div>
            <div>
              <Skeleton style={{ height: '2rem', width: '4rem', marginBottom: theme.spacing.xs }} />
              <Skeleton style={{ height: '0.75rem', width: '6rem' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg }}>
        {[1, 2].map((i) => (
          <div key={i} style={cardStyle}>
            <div>
              <Skeleton style={{ height: '1.5rem', width: '10rem', marginBottom: theme.spacing.xs }} />
              <Skeleton style={{ height: '1rem', width: '15rem' }} />
            </div>
            <div>
              <Skeleton style={{ height: '20rem', width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        <div>
          <Skeleton style={{ height: '1.5rem', width: '10rem', marginBottom: theme.spacing.xs }} />
          <Skeleton style={{ height: '1rem', width: '15rem' }} />
        </div>
        <div>
          <Skeleton style={{ height: '16rem', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
export default ProductStats;