import React from 'react';
import { FiPackage, FiInbox, FiDollarSign, FiUsers, FiPlus, FiTrendingUp, FiEye } from 'react-icons/fi';

// Dummy data to simulate your existing data structure
const dummyProducts = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
  { id: 4, name: "Product 4" },
  { id: 5, name: "Product 5" }
];

const dummySubmissions = [
  {
    _id: '1',
    productName: 'Premium Wireless Headphones',
    customerData: { name: 'Sarah Johnson' },
    status: 'new'
  },
  {
    _id: '2', 
    productName: 'Smart Fitness Tracker',
    customerData: { name: 'Mike Chen' },
    status: 'pending'
  },
  {
    _id: '3',
    productName: 'Bluetooth Speaker Set',
    customerData: { name: 'Emma Rodriguez' },
    status: 'responded'
  }
];

const AdminDashboard: React.FC = () => {
  const stats = [
    { 
      title: "Total Products", 
      value: dummyProducts.length, 
      icon: <FiPackage className="text-red-500" size={28} />, 
      link: "/admin/products",
      change: "+12%",
      bgGradient: "from-red-50 to-red-100",
      trend: "up"
    },
    { 
      title: "New Inquiries", 
      value: dummySubmissions.length, 
      icon: <FiInbox className="text-red-600" size={28} />, 
      link: "/admin/submissions",
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

  const recentSubmissions = dummySubmissions
    .slice(0, 3)
    .map(sub => ({
      ...sub,
      daysAgo: Math.floor(Math.random() * 3) + 1
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header Section */}
      <div className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium text-sm">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center gap-1 mb-1">
                          <FiTrendingUp className="text-green-500" size={16} />
                          <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow border border-gray-100">
                    {stat.icon}
                  </div>
                </div>
                
                {stat.link && (
                  <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105">
                    View Details →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Recent Inquiries</h2>
                    <p className="text-red-100 mt-1">Latest customer interest</p>
                  </div>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    View All
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {recentSubmissions.map((submission, index) => (
                    <div 
                      key={submission._id} 
                      className="group p-4 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {submission.customerData.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                                {submission.productName}
                              </h3>
                              <p className="text-gray-500 text-sm mt-1">
                                {submission.customerData.name} • {submission.daysAgo} day{submission.daysAgo !== 1 ? 's' : ''} ago
                              </p>
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                          <FiEye size={16} />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                <h2 className="text-xl font-bold">Quick Actions</h2>
                <p className="text-gray-300 mt-1">Manage your store</p>
              </div>
              
              <div className="p-6 space-y-4">
                <button className="w-full group p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-500 hover:to-red-600 border-2 border-red-200 hover:border-red-500 rounded-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500 group-hover:bg-white text-white group-hover:text-red-500 rounded-xl transition-colors duration-300">
                      <FiPlus size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-red-700 group-hover:text-white transition-colors">Add New Product</h3>
                      <p className="text-red-600 group-hover:text-red-100 text-sm transition-colors">Create product listing</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full group p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-500 hover:to-red-600 border-2 border-gray-200 hover:border-red-500 rounded-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-500 group-hover:bg-white text-white group-hover:text-red-500 rounded-xl transition-colors duration-300">
                      <FiInbox size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-700 group-hover:text-white transition-colors">View Inquiries</h3>
                      <p className="text-gray-600 group-hover:text-red-100 text-sm transition-colors">Check messages</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Performance Widget */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Page Views</span>
                  <span className="font-bold text-red-600">1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-bold text-red-600">3.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;