import React, { createContext, useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const ProductsContext = createContext();

// Mock data to use when API fails
const mockProducts = [
  {
    _id: 'mock1',
    name: 'Handcrafted Pottery',
    description: 'Beautiful handmade pottery from rural artisans. Each piece is unique and crafted with traditional techniques passed down through generations.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1565193298357-c5b64a816c38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 15
  },
  {
    _id: 'mock2',
    name: 'Brass Decor Items',
    description: 'Traditional brass items for home decoration. These pieces showcase the rich heritage of Indian metalwork and craftsmanship.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 8
  },
  {
    _id: 'mock3',
    name: 'Embroidered Cushion Cover',
    description: 'Hand-embroidered cushion covers with traditional designs. Each piece is carefully crafted by skilled artisans.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80',
    category: 'Home Decor',
    countInStock: 12
  },
  {
    _id: 'mock4',
    name: 'Organic Tea Collection',
    description: 'Premium organic tea sourced from the hills of Darjeeling. This collection includes a variety of flavors and aromas that will delight your senses.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 25
  },
  {
    _id: 'mock5',
    name: 'Handwoven Scarf',
    description: 'Beautiful handwoven scarf made with traditional techniques. Perfect for adding a touch of elegance to any outfit.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Fashion',
    countInStock: 18
  }
];

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
      console.log('Using mock products as fallback');
      // Use mock data instead of empty array when API fails
      setProducts(mockProducts);
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
      
      // Find a mock product to return as fallback
      const mockProduct = mockProducts.find(p => p._id === id) || mockProducts[0];
      console.log('Using mock product as fallback');
      return mockProduct;
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
