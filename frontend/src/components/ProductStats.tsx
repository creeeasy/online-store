// components/ProductStats.tsx
import React from 'react';
import { useProductStats } from '../hooks/useProducts';

// UI components (same as before, but I'll include them for completeness)
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border rounded-lg p-4 bg-white shadow-sm ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const Alert: React.FC<{ 
  variant?: 'default' | 'destructive'; 
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'default', children, className = '' }) => (
  <div className={`p-4 rounded border ${
    variant === 'destructive' 
      ? 'bg-red-100 border-red-300 text-red-800' 
      : 'bg-blue-100 border-blue-300 text-blue-800'
  } ${className}`}>
    {children}
  </div>
);

const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="font-semibold mb-1">{children}</h4>
);

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

// Icons
const PackageIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const TrendingUpIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Simple chart components
const BarChart: React.FC<{ data: any[]; children: React.ReactNode }> = ({ data, children }) => (
  <div className="w-full h-full flex items-end justify-between gap-2 pt-4">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center flex-1">
        <div className="text-xs mb-1 text-center" style={{ height: '2rem' }}>
          {item.name.length > 10 ? `${item.name.substring(0, 10)}...` : item.name}
        </div>
        <div 
          className="bg-blue-500 w-full rounded-t transition-all duration-300"
          style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 80}%` }}
        ></div>
        <div className="text-xs mt-1">{item.value}</div>
      </div>
    ))}
  </div>
);

const PieChart: React.FC<{ data: any[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const cumulativePercentage = data
            .slice(0, index)
            .reduce((sum, item) => sum + (item.value / total) * 100, 0);
          
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-xs">Total</div>
      </div>
    </div>
  );
};

const ProductStats: React.FC = () => {
  const { data, isLoading, error, refetch } = useProductStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4 inline mr-2" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load product statistics. Please try again.
          <button 
            onClick={() => refetch()}
            className="ml-2 text-sm underline"
          >
            Retry
          </button>
        </AlertDescription>
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

  // Prepare data for charts
  const categoryData = stats.categoryStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.totalProducts
  }));

  const statusData = [
    { name: 'Total Products', value: stats.totalProducts },
    { name: 'On Sale', value: stats.onSaleCount },
    { name: 'With Active Offers', value: stats.withActiveOffers }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<PackageIcon className="h-4 w-4" />}
          description="All products in catalog"
        />
        <StatCard
          title="On Sale"
          value={stats.onSaleCount.toLocaleString()}
          icon={<TagIcon className="h-4 w-4" />}
          description="Products with discounts"
          variant="success"
        />
        <StatCard
          title="With Active Offers"
          value={stats.withActiveOffers.toLocaleString()}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          description="Products with active promotions"
          variant="warning"
        />
        <StatCard
          title="Recent Products"
          value={stats.recentProducts.length.toLocaleString()}
          icon={<ClockIcon className="h-4 w-4" />}
          description="Recently added products"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
            <CardDescription>Breakdown of products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <PieChart data={categoryData} />
            </div>
            <div className="mt-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ 
                        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5] 
                      }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">
                    {category.value} ({(category.value / stats.totalProducts * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Status Overview</CardTitle>
            <CardDescription>Product counts by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={statusData}>
                {statusData.map((status, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xs mb-1">{status.name}</div>
                    <div 
                      className="bg-blue-500 w-full rounded-t"
                      style={{ height: `${(status.value / Math.max(...statusData.map(p => p.value))) * 70}%` }}
                    ></div>
                    <div className="text-xs mt-1">{status.value}</div>
                  </div>
                ))}
              </BarChart>
            </div>
            <div className="mt-4">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span>{status.name}</span>
                  <span className="font-medium">
                    {status.value} products
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Products</CardTitle>
          <CardDescription>Latest products added to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent products</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Discount</th>
                    <th className="p-3 text-right">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((product, index) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">ID: {product._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        {product.discountPrice ? (
                          <span className="text-green-600">
                            ${(product.price - product.discountPrice).toFixed(2)} off
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
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

      {/* Category Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Category Statistics</CardTitle>
          <CardDescription>Complete breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-right">Product Count</th>
                  <th className="p-3 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category, index) => (
                  <tr key={category.name} className="border-b">
                    <td className="p-3 font-medium">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5] 
                          }}
                        />
                        {category.name}
                      </div>
                    </td>
                    <td className="p-3 text-right">{category.value.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      {stats.totalProducts > 0 
                        ? `${((category.value / stats.totalProducts) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right">{stats.totalProducts.toLocaleString()}</td>
                  <td className="p-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}> = ({ title, value, icon, description, variant = 'default' }) => {
  const variantStyles = {
    default: 'text-blue-600 bg-blue-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    destructive: 'text-red-600 bg-red-100'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${variantStyles[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

const StatsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductStats;