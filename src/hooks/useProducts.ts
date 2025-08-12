/*import { useState, useEffect } from 'react';
import type { Product } from '../types/types';

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError('Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, '_id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError('Failed to add product');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p._id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      setError('Failed to update product');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error, 
    fetchProduct,
    addProduct, 
    updateProduct, 
    deleteProduct 
  };
};

export default useProducts;*/
import { useState } from 'react';
import { dummyProducts } from '../data/dummyData';
import type { Product } from '../types/types';
const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchProduct = async (id: string) => {
    return dummyProducts.find(product => product._id === id) || null;
  };

  const addProduct = async (product: Omit<Product, '_id'>) => {
    const newProduct = {
      ...product,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product._id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
    );
    setProducts(updatedProducts);
    return updatedProducts.find(product => product._id === id);
  };

  const deleteProduct = async (id: string) => {
    setProducts(products.filter(product => product._id !== id));
  };

  return { 
    products, 
    loading, 
    error, 
    fetchProduct,
    addProduct, 
    updateProduct, 
    deleteProduct 
  };
};

export default useProducts;