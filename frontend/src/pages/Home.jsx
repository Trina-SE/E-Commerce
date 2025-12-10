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
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productService.getAll(params);
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Fallback to mock products when backend returns no products
  const displayProducts = products && products.length > 0 ? products : mockProducts;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <div style={{ background: 'var(--color-primary)', color: '#fff', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to EcomStore</h1>
          <p className="text-xl">Discover curated products with a modern shopping experience</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>

        {/* Products Section */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {displayProducts.length === 0 ? (
          <div className="text-center text-neutral">No products available</div>
        ) : (
          <>
            <p className="text-neutral mb-4">Found {displayProducts.length} products</p>
            <div className="product-grid">
              {displayProducts.map((product) => (
                <div key={product._id} className="product-card card">
                  <Link to={`/product/${product._id}`} className="block">
                    <div style={{ aspectRatio: '1 / 1', background: '#f3f4f6', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-neutral truncate" style={{ fontSize: '0.95rem' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral truncate">{product.category}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-lg font-bold text-primary">${product.price}</p>
                        {product.discount > 0 && (
                          <p className="text-xs text-neutral">{product.discount}% off</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="icon-btn" style={{ background: '#f3f4f6' }}>
                          <FiHeart size={18} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn btn-primary"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <FiShoppingCart size={16} />
                        </button>
                      </div>
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
