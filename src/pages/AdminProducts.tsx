import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiDollarSign, FiImage, FiTag, FiSave, FiX, FiCheck } from 'react-icons/fi';

// Dummy hooks and types simulation
const useProducts = () => {
  const products = [
    {
      _id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      discountPrice: 149.99,
      description: 'High-quality wireless headphones with noise cancellation',
      images: ['https://picsum.photos/300/300?random=1', 'https://picsum.photos/300/300?random=2'],
      dynamicFields: [
        { key: 'Color', placeholder: 'Select your preferred color' },
        { key: 'Warranty', placeholder: 'Choose warranty period' }
      ]
    },
    {
      _id: '2',
      name: 'Smart Fitness Tracker',
      price: 89.99,
      description: 'Advanced fitness tracking with heart rate monitoring',
      images: ['https://picsum.photos/300/300?random=3'],
      dynamicFields: [
        { key: 'Band Size', placeholder: 'Select band size' }
      ]
    },
    {
      _id: '3',
      name: 'Bluetooth Speaker Set',
      price: 79.99,
      discountPrice: 59.99,
      description: 'Portable speakers with crystal clear sound',
      images: ['https://picsum.photos/300/300?random=4'],
      dynamicFields: []
    }
  ];

  return {
    products,
    loading: false,
    error: null,
    addProduct: async (product: Product) => console.log('Adding:', product),
    updateProduct: async (id:string, product:Product) => console.log('Updating:', id, product),
    deleteProduct: async (id:string) => console.log('Deleting:', id)
  };
};

type DynamicField = { key: string; placeholder: string; };
type Product = {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  dynamicFields: DynamicField[];
};

const AdminProducts: React.FC = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    images: [],
    dynamicFields: []
  });
  const [newField, setNewField] = useState<DynamicField>({ key: '', placeholder: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAddField = () => {
    if (!newField.key) return;
    setNewProduct(prev => ({
      ...prev,
      dynamicFields: [...(prev.dynamicFields || []), newField]
    }));
    setNewField({ key: '', placeholder: '' });
  };

  const handleRemoveField = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      dynamicFields: (prev.dynamicFields || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      await updateProduct(editingProduct._id, newProduct as Product);
    } else {
      await addProduct(newProduct as Product);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      images: [],
      dynamicFields: []
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
      images: [...product.images]
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-red-500 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage your product catalog</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Panel */}
          {showForm && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <FiPackage size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-red-100 text-sm">Fill in the product details</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  {/* Price Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                          required
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price</label>
                      <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newProduct.discountPrice || ''}
                          onChange={(e) => setNewProduct({ 
                            ...newProduct, 
                            discountPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                          })}
                          placeholder="Optional"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                      placeholder="Describe your product..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>
                  
                  {/* Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiImage className="inline mr-2" size={16} />
                      Image URLs (one per line)
                    </label>
                    <textarea
                      value={newProduct.images?.join('\n') || ''}
                      onChange={(e) => setNewProduct({ 
                        ...newProduct, 
                        images: e.target.value.split('\n').filter(url => url.trim()) 
                      })}
                      required
                      placeholder="https://example.com/image1.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                  
                  {/* Dynamic Fields */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Form Fields</label>
                    
                    {/* Existing Fields */}
                    <div className="space-y-2 mb-4">
                      {newProduct.dynamicFields?.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                          <span className="font-medium text-red-700">{field.key}</span>
                          <span className="text-red-500 text-sm">({field.placeholder})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveField(index)}
                            className="ml-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Field */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={newField.key}
                          onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Placeholder text"
                          value={newField.placeholder}
                          onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddField}
                        className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200"
                    >
                      <FiSave size={18} />
                      {editingProduct ? 'Update' : 'Save'} Product
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div className={showForm ? "xl:col-span-2" : "xl:col-span-3"}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {products.length} products
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.images[0] || 'https://picsum.photos/300/300?random=default'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 rounded-lg shadow-lg transition-all duration-200"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-lg shadow-lg transition-all duration-200"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      
                      {/* Discount Badge */}
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            SALE
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Price Section */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`font-bold text-xl ${
                          product.discountPrice ? 'text-red-500' : 'text-gray-800'
                        }`}>
                          ${product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      
                      {/* Custom Fields Count */}
                      {product.dynamicFields.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <FiCheck size={16} className="text-green-500" />
                          <span>{product.dynamicFields.length} custom field{product.dynamicFields.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          <FiEdit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;