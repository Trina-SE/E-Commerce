import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import mockProducts from '../mockProducts';
import { useCartStore } from '../store/store';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data.categories || ['Electronics', 'Bags', 'Accessories', 'Home & Kitchen']);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set default categories if API fails
      setCategories(['Electronics', 'Bags', 'Accessories', 'Home & Kitchen', 'Clothing', 'Sports']);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productService.getAll(params);
      const fetchedProducts = response.data.products || [];
      
      // If API returns products, use them; otherwise use mock products
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        // Filter mock products based on search/category
        let filtered = [...mockProducts];
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
        setProducts(filtered);
      }
    } catch (err) {
      console.error('API Error, using mock products:', err);
      // On error, use mock products with filters
      let filtered = [...mockProducts];
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    });
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-neutral-light)' }}>Loading products...</p>
        </div>
      </div>
    );
  }

  // Always use products state which now includes mock products fallback
  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-light)' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1>Welcome to EcomStore</h1>
          <p>Discover amazing products with unbeatable prices and modern shopping experience</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-row">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn btn-ghost"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {error && <div className="alert alert-error">{error}</div>}

        {displayProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="text-2xl font-bold text-neutral mb-2">No products found</h2>
            <p className="text-neutral-light">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="text-neutral-light font-semibold">
                Showing <span style={{ color: 'var(--color-primary)' }}>{displayProducts.length}</span> products
              </p>
            </div>
            <div className="product-grid">
              {displayProducts.map((product) => (
                <div key={product._id} className="product-card card">
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="img-wrap">
                      {product.discount > 0 && (
                        <span className="badge">-{product.discount}%</span>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-cover"
                      />
                    </div>
                  </Link>

                  <div className="content">
                    <p className="product-category">{product.category}</p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="product-title">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="price-row" style={{ marginTop: 'auto' }}>
                      <span className="price">${product.price}</span>
                      {product.discount > 0 && (
                        <span className="price-old">${(product.price * 1.2).toFixed(2)}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.6rem' }}
                      >
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button className="icon-btn" style={{ padding: '0.6rem' }}>
                        <FiHeart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

