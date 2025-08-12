import React from 'react';
import ProductCard from '../components/ProductCard';
import useProducts from '../hooks/useProducts';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-red-500 font-medium">Oops! {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="inline-block transform hover:scale-105 transition-transform">
                Discover
              </span>
              <span className="text-red-200 mx-3">•</span>
              <span className="inline-block transform hover:scale-105 transition-transform">
                Shop
              </span>
              <span className="text-red-200 mx-3">•</span>
              <span className="inline-block transform hover:scale-105 transition-transform">
                Love
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of premium products, handpicked just for you
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Featured Products
          </h2>
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full mx-4"></div>
            <div className="w-16 h-1 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover quality products that bring joy to your everyday life
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product._id}
              className="transform hover:-translate-y-2 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <ProductCard
                product={product}
                onClick={() => window.location.href = `/products/${product._id}`}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our amazing products are coming soon! Check back later for exciting new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;