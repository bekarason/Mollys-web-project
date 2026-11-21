import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AidifyPaymentSystem = () => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentData, setPaymentData] = useState({
    amount: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    email: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'orange',
      name: 'Orange Money',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-orange-500',
      fields: ['phone', 'amount']
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-yellow-500',
      fields: ['phone', 'amount']
    },
    {
      id: 'afriland',
      name: 'Afriland First Bank',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-green-600',
      fields: ['accountNumber', 'amount']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-600',
      fields: ['email', 'amount']
    },
    {
      id: 'uba',
      name: 'UBA Bank',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-red-600',
      fields: ['cardNumber', 'expiryDate', 'cvv', 'amount']
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    const selectedMethod = paymentMethods.find(m => m.id === selectedPayment);
    
    if (!selectedMethod) {
      newErrors.method = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }

    selectedMethod.fields.forEach(field => {
      if (!paymentData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Additional validation
    if (paymentData.phone && !/^\d{9}$/.test(paymentData.phone)) {
      newErrors.phone = 'Phone number must be 9 digits';
    }
    
    if (paymentData.email && !/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (paymentData.cardNumber && !/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (paymentData.amount && (isNaN(paymentData.amount) || parseFloat(paymentData.amount) <= 0)) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    setPaymentStatus('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;
      
      if (success) {
        setPaymentStatus('success');
        // Reset form
        setPaymentData({
          amount: '',
          phone: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          accountNumber: '',
          email: ''
        });
        setSelectedPayment('');
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      setPaymentStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderPaymentFields = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPayment);
    if (!selectedMethod) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
        
        {selectedMethod.fields.includes('amount') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (XAF)
            </label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>
        )}

        {selectedMethod.fields.includes('phone') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                +237
              </span>
              <input
                type="tel"
                value={paymentData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="6XXXXXXXX"
                maxLength="9"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        )}

        {selectedMethod.fields.includes('email') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PayPal Email
            </label>
            <input
              type="email"
              value={paymentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        )}

        {selectedMethod.fields.includes('accountNumber') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={paymentData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter account number"
            />
            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
          </div>
        )}

        {selectedMethod.fields.includes('cardNumber') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Aidify Payments</h1>
        <p className="text-gray-600">Choose your preferred payment method</p>
      </div>

      {/* Payment Status Messages */}
      {paymentStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800">Payment successful! Thank you for your purchase.</span>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">Payment failed. Please try again or use a different method.</span>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPayment === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg text-white ${method.color}`}>
                  {method.icon}
                </div>
                <span className="font-medium text-gray-800">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
        {errors.method && <p className="text-red-500 text-sm mt-2">{errors.method}</p>}
      </div>

      {/* Payment Form */}
      {selectedPayment && (
        <div className="mb-8">
          {renderPaymentFields()}
        </div>
      )}

      {/* Payment Button */}
      {selectedPayment && (
        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } text-white`}
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing Payment...
            </div>
          ) : (
            `Pay ${paymentData.amount ? `${paymentData.amount} XAF` : ''}`
          )}
        </button>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          🔒 Your payment information is secure and encrypted. We never store your sensitive data.
        </p>
      </div>
    </div>
  );
};

export default AidifyPaymentSystem;