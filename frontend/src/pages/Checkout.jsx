import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store/store';
import { orderService, paymentService } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
    },
    paymentMethod: 'card',
    cardDetails: {
      number: '',
      expiry: '',
      cvc: '',
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to checkout</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shippingCost = 10;
  const totalAmount = subtotal + tax + shippingCost;

  const handleCheckout = async () => {
    if (
      !formData.shippingAddress.street ||
      !formData.shippingAddress.city ||
      !formData.shippingAddress.zipCode
    ) {
      alert('Please fill in all shipping address fields');
      return;
    }

    if (
      !formData.cardDetails.number ||
      !formData.cardDetails.expiry ||
      !formData.cardDetails.cvc
    ) {
      alert('Please fill in all payment details');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await orderService.create({
        userId: user.id,
        items,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
      });

      const orderId = orderResponse.data.order._id;

      // Process payment
      await paymentService.process({
        orderId,
        userId: user.id,
        amount: totalAmount,
        paymentMethod: formData.paymentMethod,
        cardDetails: {
          lastFour: formData.cardDetails.number.slice(-4),
          brand: 'visa',
        },
      });

      // Clear cart and redirect
      clearCart();
      alert('Order placed successfully!');
      navigate(`/orders`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', padding: '3rem 1rem' }}>
      <div className="container">
        <h1 className="text-3xl font-bold text-neutral mb-8">Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="">
          {/* Checkout Form */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <h2 className="text-xl font-bold text-neutral mb-4">Shipping Address</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.shippingAddress.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        street: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          zipCode: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.shippingAddress.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: {
                          ...formData.shippingAddress,
                          country: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.shippingAddress.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      placeholder="Card Number (e.g., 4242 4242 4242 4242)"
                      value={formData.cardDetails.number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cardDetails: {
                            ...formData.cardDetails,
                            number: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      maxLength="19"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardDetails.expiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardDetails: {
                              ...formData.cardDetails,
                              expiry: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                        maxLength="5"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={formData.cardDetails.cvc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardDetails: {
                              ...formData.cardDetails,
                              cvc: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                        maxLength="3"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: '1rem' }}>
            <h2 className="text-xl font-bold text-neutral mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${shippingCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-2xl text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="btn btn-ghost"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
