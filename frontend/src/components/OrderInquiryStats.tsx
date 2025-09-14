// components/OrderInquiryStats.tsx
import React from 'react';
import { useOrderInquiryStats } from '../hooks/useOrderInquiry';

// Simple UI components (replace with your actual UI library)
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

// Simple chart components (replace with your actual chart library)
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

// Icons (replace with your actual icon library)
const UsersIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

const DollarSignIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OrderInquiryStats: React.FC = () => {
  const { data, isLoading, error, refetch } = useOrderInquiryStats();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4 inline mr-2" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load statistics. Please try again.
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
    statusStats: [],
    totalInquiries: 0,
    recentInquiries: 0,
    topProducts: []
  };

  // Prepare data for charts
  const statusData = stats.statusStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    totalValue: item.totalValue
  }));

  const topProductsData = stats.topProducts.slice(0, 5).map(product => ({
    name: product.productName,
    value: product.inquiryCount,
    revenue: product.totalValue
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries"
          value={stats.totalInquiries.toLocaleString()}
          icon={<UsersIcon className="h-4 w-4" />}
          description="All time inquiries"
        />
        <StatCard
          title="Recent Inquiries"
          value={stats.recentInquiries.toLocaleString()}
          icon={<ClockIcon className="h-4 w-4" />}
          description="Last 7 days"
        />
        <StatCard
          title="Pending"
          value={(stats.statusStats.find(s => s._id === 'pending')?.count || 0).toLocaleString()}
          icon={<AlertCircleIcon className="h-4 w-4" />}
          description="Requires attention"
          variant="warning"
        />
        <StatCard
          title="Total Value"
          value={`$${(stats.statusStats.reduce((acc, curr) => acc + curr.totalValue, 0) || 0).toLocaleString()}`}
          icon={<DollarSignIcon className="h-4 w-4" />}
          description="Potential revenue"
          variant="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Status Distribution</CardTitle>
            <CardDescription>Breakdown of inquiries by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <PieChart data={statusData} />
            </div>
            <div className="mt-4">
              {statusData.map((status, index) => (
                <div key={status.name} className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ 
                        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5] 
                      }}
                    />
                    <span>{status.name}</span>
                  </div>
                  <span className="font-medium">
                    {status.value} (${status.totalValue?.toLocaleString()})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Inquiries</CardTitle>
            <CardDescription>Most inquired products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={topProductsData}>
                {topProductsData.map((product, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xs mb-1">{product.name}</div>
                    <div 
                      className="bg-blue-500 w-full rounded-t"
                      style={{ height: `${(product.value / Math.max(...topProductsData.map(p => p.value))) * 70}%` }}
                    ></div>
                    <div className="text-xs mt-1">{product.value}</div>
                  </div>
                ))}
              </BarChart>
            </div>
            <div className="mt-4">
              {topProductsData.map((product, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span>{product.name}</span>
                  <span className="font-medium">
                    {product.value} inquiries (${product.revenue?.toLocaleString()})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Status Overview</CardTitle>
          <CardDescription>Complete breakdown by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Count</th>
                  <th className="p-3 text-right">Percentage</th>
                  <th className="p-3 text-right">Total Value</th>
                  <th className="p-3 text-right">Average Value</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((status, index) => (
                  <tr key={status.name} className="border-b">
                    <td className="p-3 font-medium">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5] 
                          }}
                        />
                        {status.name}
                      </div>
                    </td>
                    <td className="p-3 text-right">{status.value.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      {stats.totalInquiries > 0 
                        ? `${((status.value / stats.totalInquiries) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </td>
                    <td className="p-3 text-right">
                      ${status.totalValue?.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      ${status.totalValue && status.value > 0 
                        ? (status.totalValue / status.value).toFixed(2)
                        : '0.00'
                      }
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right">{stats.totalInquiries.toLocaleString()}</td>
                  <td className="p-3 text-right">100%</td>
                  <td className="p-3 text-right">
                    ${statusData.reduce((acc, curr) => acc + (curr.totalValue || 0), 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    ${stats.totalInquiries > 0 
                      ? (statusData.reduce((acc, curr) => acc + (curr.totalValue || 0), 0) / stats.totalInquiries).toFixed(2)
                      : '0.00'
                    }
                  </td>
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

export default OrderInquiryStats;