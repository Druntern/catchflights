import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Mail, User } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const params = new URLSearchParams(window.location.search);
  const { plan } = location.state ? location.state : {plan: {
    type: params.get('planType'),
    price: params.get('planType') === 'monthly' ? 4.99 : 49.99
  }};

  const [formData, setFormData] = useState({
    email: 'j_henrique_21@hotmail.com',
    name: 'Henrique',
    password: 'password',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+'/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: plan.type,
          email: formData.email,
          name: formData.name,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-blue-100">
            {plan?.type === 'monthly' 
              ? 'Monthly Plan - $4.99/month'
              : 'Annual Plan - $49.99/year (Save 17%)'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </div>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </div>
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your payment will be securely processed by Stripe. Your card details are never stored on our servers.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
          </button>

          <p className="text-sm text-gray-500 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Checkout;