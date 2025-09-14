import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiPackage, FiInbox, FiDollarSign, FiUsers, 
  FiPlus, FiTrendingUp, FiEye, FiFileText,
  FiBarChart2, FiPieChart
} from 'react-icons/fi';
import OrderInquiryStats from '../components/OrderInquiryStats';
import ProductStats from '../components/ProductStats'; // Import the new ProductStats component

interface Product {
  id: string;
  name: string;
}

interface Inquiry {
  _id: string;
  productName: string;
  customerData: { name: string };
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiryStats' | 'productStats'>('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, inquiriesRes] = await Promise.all([
          axios.get<Product[]>('/api/products'),
          axios.get<{data: {inquiries: Inquiry[]}}>('/api/order-inquiries'),
        ]);

        setProducts(productsRes.data);
        setInquiries(inquiriesRes.data.data.inquiries);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { 
      title: "Total Products", 
      value: products.length, 
      icon: <FiPackage className="text-red-500" size={28} />, 
      link: "/admin/products",
      change: "+12%",
      bgGradient: "from-red-50 to-red-100",
      trend: "up"
    },
    { 
      title: "New Inquiries", 
      value: inquiries.length, 
      icon: <FiInbox className="text-red-600" size={28} />, 
      link: "/admin/inquiries",
      change: "+8%",
      bgGradient: "from-rose-50 to-rose-100", 
      trend: "up"
    },
    { 
      title: "Estimated Revenue", 
      value: "$1,250", 
      icon: <FiDollarSign className="text-red-700" size={28} />,
      change: "+24%",
      bgGradient: "from-red-50 to-pink-100",
      trend: "up"
    },
    { 
      title: "Active Users", 
      value: "24", 
      icon: <FiUsers className="text-red-500" size={28} />,
      change: "+5%",
      bgGradient: "from-pink-50 to-red-100",
      trend: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Tabs */}
        <div className="flex justify-between items-center mb-8">
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
                <div key={index} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 uppercase">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border">{stat.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Inquiries</h2>
                <a href="/admin/inquiries" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  View all →
                </a>
              </div>
              {inquiries.length === 0 ? (
                <p className="text-gray-500">No inquiries yet.</p>
              ) : (
                <div className="space-y-4">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq._id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-semibold">{inq.productName}</p>
                        <p className="text-sm text-gray-500">
                          {inq.customerData.name} • {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/products/new" className="flex items-center p-4 border rounded-lg hover:bg-red-50 transition-colors">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <FiPlus className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Add New Product</p>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                  </div>
                </a>
                <a href="/admin/inquiries" className="flex items-center p-4 border rounded-lg hover:bg-red-50 transition-colors">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <FiInbox className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Manage Inquiries</p>
                    <p className="text-sm text-gray-500">View and respond to inquiries</p>
                  </div>
                </a>
                <a href="/admin/analytics" className="flex items-center p-4 border rounded-lg hover:bg-red-50 transition-colors">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <FiTrendingUp className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-500">Detailed analytics and reports</p>
                  </div>
                </a>
              </div>
            </div>
          </>
        ) : activeTab === 'inquiryStats' ? (
          <OrderInquiryStats />
        ) : (
          <ProductStats />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;