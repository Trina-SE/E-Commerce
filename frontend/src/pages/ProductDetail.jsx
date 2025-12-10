import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import { useCartStore } from '../store/store';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity,
    });
    alert('Added to cart!');
  };

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      await productService.addReview(id, {
        userId: 'user_id',
        username: 'Anonymous User',
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setNewReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="card" style={{ padding: '2rem' }}>
            <img
              src={product.image}
              alt={product.name}
              className="img-cover"
              style={{ height: 420, borderRadius: '8px' }}
            />
          </div>

          {/* Product Info */}
          <div className="card" style={{ padding: '2rem' }}>
            <h1 className="text-3xl font-bold text-neutral mb-2">{product.name}</h1>
            <p className="text-neutral text-sm mb-4">{product.category}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={20}
                    className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews?.length || 0} reviews)</span>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-primary mb-2">${product.price}</p>
              {product.discount > 0 && (
                <p className="text-secondary font-semibold">{product.discount}% off</p>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-2">Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
              <p className="text-gray-600">Available items: {product.stock}</p>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="btn btn-ghost">
                <FiHeart size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

            {/* Add Review Form */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-semibold text-gray-800 mb-4">Add a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="pb-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{review.username}</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Product Info Sidebar */}
          <div className="bg-white rounded-lg p-8 h-fit">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Product Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-semibold">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-semibold">{product.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-semibold">{product.rating.toFixed(1)}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
