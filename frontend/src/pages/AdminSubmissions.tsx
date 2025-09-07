import React, { useState } from 'react';
import { FiInbox, FiUser, FiPhone, FiCalendar, FiEye, FiSearch, FiFilter, FiDownload, FiMail, FiClock, FiMessageCircle, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

// Dummy data to simulate your existing data structure
const dummySubmissions = [
  {
    _id: '1',
    productName: 'Premium Wireless Headphones',
    customerData: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      message: 'Interested in bulk purchase for my company. Need 50+ units with custom branding options.'
    },
    createdAt: '2025-01-10T10:30:00Z',
    status: 'new',
    priority: 'high'
  },
  {
    _id: '2',
    productName: 'Smart Fitness Tracker',
    customerData: {
      name: 'Mike Chen',
      email: 'mike.chen@gmail.com',
      phone: '+1 (555) 987-6543',
      message: 'Questions about battery life and compatibility with iOS devices.'
    },
    createdAt: '2025-01-09T14:15:00Z',
    status: 'pending',
    priority: 'medium'
  },
  {
    _id: '3',
    productName: 'Bluetooth Speaker Set',
    customerData: {
      name: 'Emma Rodriguez',
      email: 'emma.r@yahoo.com',
      phone: '+1 (555) 456-7890',
      message: 'Looking for speakers for outdoor events. Need weather resistant options with good bass.'
    },
    createdAt: '2025-01-08T09:20:00Z',
    status: 'responded',
    priority: 'low'
  },
  {
    _id: '4',
    productName: 'Gaming Keyboard Pro',
    customerData: {
      name: 'Alex Thompson',
      email: 'alex.t@email.com',
      phone: '+1 (555) 321-9876',
      message: 'Need detailed info about mechanical switches and RGB lighting customization.'
    },
    createdAt: '2025-01-07T16:45:00Z',
    status: 'new',
    priority: 'medium'
  },
  {
    _id: '5',
    productName: 'Wireless Mouse Elite',
    customerData: {
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      phone: '+1 (555) 654-3210',
      message: 'Bulk order inquiry for office setup. Need 100 units with volume discount pricing.'
    },
    createdAt: '2025-01-06T11:30:00Z',
    status: 'responded',
    priority: 'high'
  },
  {
    _id: '6',
    productName: 'Smart Watch Series X',
    customerData: {
      name: 'David Kim',
      email: 'david.kim@tech.com',
      phone: '+1 (555) 789-0123',
      message: 'Interested in health monitoring features and integration with medical apps.'
    },
    createdAt: '2025-01-05T08:15:00Z',
    status: 'pending',
    priority: 'medium'
  }
];

type Submission = typeof dummySubmissions[number];

const AdminSubmissions: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <FiAlertCircle size={16} />;
      case 'pending': return <FiClock size={16} />;
      case 'responded': return <FiCheck size={16} />;
      default: return <FiInbox size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredSubmissions = dummySubmissions.filter(submission => {
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      submission.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.customerData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.customerData.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  interface CustomerData {
    name: string;
    email: string;
    phone: string;
    message: string;
  }

  interface Submission {
    _id: string;
    productName: string;
    customerData: CustomerData;
    createdAt: string;
    status: string;
    priority: string;
  }

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Customer Inquiries
              </h1>
              <p className="text-gray-600 mt-1">Manage and respond to customer submissions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                <FiInbox className="text-red-500" size={16} />
                <span className="text-red-700 font-semibold text-sm">{filteredSubmissions.length} inquiries</span>
              </div>
              <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <FiDownload size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by product, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            
            {/* Status Filter */}
            <div className="min-w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="new">New Inquiries</option>
                <option value="pending">Pending Response</option>
                <option value="responded">Responded</option>
              </select>
            </div>
            
            {/* Clear Filters */}
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              <FiFilter size={16} />
              Clear
            </button>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiInbox size={18} />
                      Product Inquiry
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser size={18} />
                      Customer Info
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiPhone size={18} />
                      Contact
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={18} />
                      Date & Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredSubmissions.map((submission, index) => (
                  <tr 
                    key={submission._id} 
                    className={`transition-colors duration-200 hover:bg-red-50 border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Product Column */}
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-16 rounded-full ${getPriorityColor(submission.priority)}`}></div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg mb-1">
                            {submission.productName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(submission.priority)}`}></span>
                            {submission.priority} priority
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Customer Column */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {submission.customerData.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {submission.customerData.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail size={12} />
                            {submission.customerData.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <FiPhone size={16} className="text-red-500" />
                          {submission.customerData.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMessageCircle size={12} />
                          Message available
                        </div>
                      </div>
                    </td>

                    {/* Date & Status Column */}
                    <td className="px-6 py-6">
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <FiClock size={14} className="text-gray-400" />
                          {getTimeAgo(submission.createdAt)}
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-6">
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <FiEye size={16} />
                        <span className="hidden sm:inline">View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results State */}
        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center mt-8">
            <FiInbox className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedSubmission.customerData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSubmission.customerData.name}</h2>
                    <p className="text-red-100 text-lg">{selectedSubmission.productName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="text-red-500" size={20} />
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedSubmission.customerData.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                      <p className="text-gray-900 font-medium">{selectedSubmission.customerData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                      <p className="text-gray-900 font-medium">{selectedSubmission.customerData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                    <FiInbox className="text-red-600" size={20} />
                    Inquiry Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-red-700 mb-1">Product Interest</label>
                      <p className="text-red-900 font-bold text-lg">{selectedSubmission.productName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-red-700 mb-1">Submission Date</label>
                      <p className="text-red-800">{new Date(selectedSubmission.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-red-700 mb-1">Status</label>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                          {getStatusIcon(selectedSubmission.status)}
                          {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-red-700 mb-1">Priority</label>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getPriorityColor(selectedSubmission.priority)}`}></div>
                          <span className="font-medium capitalize text-red-800">{selectedSubmission.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMessageCircle className="text-red-500" size={24} />
                  Customer Message
                </h3>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedSubmission.customerData.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                <button className="flex-1 min-w-48 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <FiMail size={20} />
                  Send Response Email
                </button>
                <button className="flex-1 min-w-48 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <FiCheck size={20} />
                  Mark as Responded
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;