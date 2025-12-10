import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/store';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral">Your cart is empty</h2>
          <p className="text-neutral mt-2">Add some products to get started</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary mt-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-6 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, parseInt(e.target.value))
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <p className="w-24 text-right font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">$10.00</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl">
                  ${(total * 1.1 + 10).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary w-full mb-2"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="btn btn-ghost w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
