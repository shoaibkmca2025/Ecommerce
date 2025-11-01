import React, { createContext, useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product
  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productAPI.getProduct(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      console.error('Error fetching product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create product (admin only)
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productAPI.createProduct(productData);
      setProducts(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product (admin only)
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productAPI.updateProduct(id, productData);
      setProducts(prev => prev.map(product => 
        product._id === id ? data : product
      ));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productAPI.deleteProduct(id);
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
