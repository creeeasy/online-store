import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminSubmissions from './pages/AdminSubmissions';
import ClientNavbar from './components/ClientNavbar';
import AdminNavbar from './components/AdminNavbar';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Client routes */}
        <Route path="/" element={<><ClientNavbar /><Home /></>} />
        <Route path="/products/:id" element={<><ClientNavbar /><ProductDetails /></>} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<><AdminNavbar /><AdminDashboard /></>} />
        <Route path="/admin/products" element={<><AdminNavbar /><AdminProducts /></>} />
        <Route path="/admin/submissions" element={<><AdminNavbar /><AdminSubmissions /></>} />
      </Routes>
    </Router>
  );
};

export default App;