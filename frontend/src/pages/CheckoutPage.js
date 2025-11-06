import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { createOrder, loading, error, clearError } = useContext(OrderContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: user?.defaultShippingAddress?.address || '',
    city: user?.defaultShippingAddress?.city || '',
    state: user?.defaultShippingAddress?.state || '',
    zipCode: user?.defaultShippingAddress?.postalCode || '',
    country: user?.defaultShippingAddress?.country || '',
    phone: user?.defaultShippingAddress?.phone || '',
    paymentMethod: 'cod'
  });
  
  const [step, setStep] = useState(1);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const calculateOrderTotals = () => {
    const subtotal = cartTotal;
    const shippingPrice = subtotal > 0 ? 100 : 0; // Fixed shipping cost
    const taxPrice = subtotal * 0.18; // 18% GST
    const totalPrice = subtotal + shippingPrice + taxPrice;

    return { subtotal, shippingPrice, taxPrice, totalPrice };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    } else {
      try {
        // Validate form
        if (!formData.address || !formData.city || !formData.zipCode || !formData.country || !formData.phone) {
          alert('Please fill in all shipping information');
          return;
        }

        if (!user) {
          navigate('/login');
          return;
        }

        const { subtotal, shippingPrice, taxPrice, totalPrice } = calculateOrderTotals();

        // Prepare order data
        const orderData = {
          orderItems: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            qty: item.qty || item.quantity || 1,
            price: item.price,
            image: item.image
          })),
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          },
          paymentMethod: formData.paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice
        };

        // Create order
        const createdOrder = await createOrder(orderData);

        // Clear cart
        clearCart();

        // Navigate to order confirmation page
        navigate(`/order-confirmation/${createdOrder._id}`);

      } catch (error) {
        console.error('Order creation failed:', error);
        // Error is already handled by OrderContext
      }
    }
  };

  // Check if user is logged in
  if (!user) {
    return (
      <motion.div
        className="checkout-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container">
          <div className="login-required">
            <h2>Login Required</h2>
            <p>Please login to proceed with checkout.</p>
            <Link to="/login" className="login-btn">
              Login to Continue
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="checkout-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
            <p>You need to add items to your cart before checkout.</p>
            <Link to="/products" className="continue-shopping">
              <FaArrowLeft /> Browse Products
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="checkout-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner />}

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-title">Shipping</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-title">Payment</span>
          </div>
        </div>
        
        <div className="checkout-container">
          <div className="checkout-form">
            {step === 1 ? (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2>Shipping Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <Link to="/cart" className="back-btn">
                    <FaArrowLeft /> Back to Cart
                  </Link>
                  <motion.button 
                    type="submit"
                    className="next-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <label htmlFor="card">Credit/Debit Card</label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="back-btn"
                    onClick={() => setStep(1)}
                  >
                    <FaArrowLeft /> Back to Shipping
                  </button>
                  <motion.button 
                    type="submit"
                    className="place-order-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="cart-items-summary">
              {cartItems.map(item => (
                <div className="summary-item" key={item._id}>
                  <div className="item-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Qty: {item.qty || item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * (item.qty || item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{cartTotal > 0 ? '100.00' : '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(cartTotal + (cartTotal > 0 ? 100 : 0) + (cartTotal * 0.18)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;