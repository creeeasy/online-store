import React, { useState } from 'react';
import { 
  FiPackage, FiInbox, FiDollarSign, FiUsers, 
  FiPlus, FiTrendingUp, FiEye, FiFileText,
  FiBarChart2, FiPieChart
} from 'react-icons/fi';
import InquiryStats from '../components/InquiryStats';
import ProductStats from '../components/ProductStats';
import { useOrderInquiries, useOrderInquiryStats } from '../hooks/useOrderInquiry';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts, useProductStats } from '../hooks/useProducts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiryStats' | 'productStats'>('overview');
  
  // Fetch data using React Query hooks
  const { data: productsData, isLoading: productsLoading } = useProducts({ page: 1, limit: 5 });
  const { data: inquiriesData, isLoading: inquiriesLoading } = useOrderInquiries({ page: 1, limit: 10 });
  const { data: inquiryStats, isLoading: inquiryStatsLoading } = useOrderInquiryStats();
  const { data: productStats, isLoading: productStatsLoading } = useProductStats();

  const loading = productsLoading || inquiriesLoading || inquiryStatsLoading || productStatsLoading;

  // Calculate stats from actual data
  const totalProducts = productStats?.data?.totalProducts || productsData?.data?.pagination?.totalItems || 0;
  const totalInquiries = inquiryStats?.totalInquiries || inquiriesData?.pagination?.totalItems || 0;
  const recentInquiries = inquiryStats?.recentInquiries || 0;
  
  // Calculate estimated revenue from inquiry stats
  const estimatedRevenue = inquiryStats?.statusStats?.reduce((total, stat) => total + stat.totalValue, 0) || 0;

  const stats = [
    { 
      title: "Total Products", 
      value: totalProducts.toString(), 
      icon: <FiPackage className="text-red-500" size={28} />, 
      link: "/admin/products",
      change: "+12%",
      bgGradient: "from-red-50 to-red-100",
      trend: "up"
    },
    { 
      title: "Total Inquiries", 
      value: totalInquiries.toString(), 
      icon: <FiInbox className="text-red-600" size={28} />, 
      link: "/admin/inquiries",
      change: `${recentInquiries} recent`,
      bgGradient: "from-rose-50 to-rose-100", 
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
      icon: <FiDollarSign className="text-red-700" size={28} />,
      change: "+24%",
      bgGradient: "from-red-50 to-pink-100",
      trend: "up"
    },
    { 
      title: "Conversion Rate", 
      value: inquiryStats?.statusStats?.find(s => s._id === 'converted')?.count 
        ? `${Math.round((inquiryStats.statusStats.find(s => s._id === 'converted')!.count / totalInquiries) * 100)}%`
        : "0%", 
      icon: <FiUsers className="text-red-500" size={28} />,
      change: "+5%",
      bgGradient: "from-pink-50 to-red-100",
      trend: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'converted': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiEye className="inline mr-2" size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inquiryStats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'inquiryStats'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiBarChart2 className="inline mr-2" size={16} />
              Inquiry Stats
            </button>
            <button
              onClick={() => setActiveTab('productStats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'productStats'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiPieChart className="inline mr-2" size={16} />
              Product Stats
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 uppercase">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        {stat.change && (
                          <p className="text-sm text-gray-600 mt-1">{stat.change}</p>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-xl border shadow-sm">{stat.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Inquiries</h2>
                <a href="/admin/inquiries" className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                  View all →
                </a>
              </div>
              
              {inquiriesLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : inquiriesData?.inquiries?.length === 0 ? (
                <div className="text-center py-8">
                  <FiInbox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No inquiries yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiriesData?.inquiries?.slice(0, 5).map((inquiry) => (
                    <div key={inquiry._id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{inquiry.productName}</p>
                        <p className="text-sm text-gray-500">
                          {inquiry.customerData.name} • {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                        {inquiry.totalPrice && (
                          <p className="text-sm font-medium text-gray-700">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(inquiry.totalPrice)}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            {inquiryStats?.topProducts && inquiryStats.topProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Top Products by Inquiries</h2>
                  <a href="/admin/products" className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                    View all →
                  </a>
                </div>
                <div className="space-y-4">
                  {inquiryStats.topProducts.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center flex-1">
                        <span className="text-sm font-medium text-gray-400 mr-3 w-6">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{product.productName}</p>
                          <p className="text-sm text-gray-500">{product.inquiryCount} inquiries</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
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

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/admin/products" className="flex items-center p-4 border rounded-lg hover:bg-red-50 transition-colors group">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <FiPlus className="text-red-600" size={20} />
                  </div>
                <div>
                   <p className="font-medium text-gray-900">Manage Products</p>
                   <p className="text-sm text-gray-500">Keep your catalog up to date</p>
                </div>

                </a>
                <a href="/admin/inquiries" className="flex items-center p-4 border rounded-lg hover:bg-red-50 transition-colors group">
                  <div className="bg-red-100 p-3 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <FiInbox className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Inquiries</p>
                    <p className="text-sm text-gray-500">View and respond to inquiries</p>
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