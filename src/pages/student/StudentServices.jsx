import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function StudentServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Services (now includes status)
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/services');
      setServices(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (service) => {
    const res = await loadRazorpay();
    if (!res) return alert('Razorpay failed to load');
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      // 1. Create Order
      const { data: order } = await apiClient.post('/payment/service/checkout', { serviceId: service._id });

      // 2. Razorpay
      const options = {
        key: "rzp_test_RhFyEYnxY7waP0", // YOUR KEY
        amount: order.amount,
        currency: order.currency,
        name: "Hostel Service",
        description: service.name,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // 3. Verify & Invoice
            await apiClient.post('/payment/service/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId: service._id,
              studentData: { username: user.username, email: user.email }
            });
            
            alert("Payment Successful! Service Activated.");
            fetchData(); // <--- REFRESH LIST TO UPDATE STATUS
            
          } catch (err) { alert("Verification failed"); }
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) { alert("Error initiating payment"); }
  };

  if (loading) return <div className="p-10 text-white text-center">Loading Services...</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Available Services</h1>
      <p className="text-gray-400 mb-8">Enhance your stay with these add-ons.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(svc => (
          <div 
            key={svc._id} 
            className={`p-6 rounded-xl shadow-lg border transition relative overflow-hidden ${
              svc.isBought 
                ? 'bg-gray-900 border-green-500/50' // Active Style
                : 'bg-gray-800 border-gray-700 hover:border-blue-500' // Default Style
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{svc.name}</h3>
              <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded uppercase">{svc.period}</span>
            </div>
            
            {/* Price or Active Status */}
            <div className="mb-6">
               {svc.isBought ? (
                 <div>
                   <span className="text-green-400 font-bold text-lg flex items-center gap-2">
                     ✓ ACTIVE
                   </span>
                   <p className="text-xs text-gray-400 mt-1">{svc.validityText}</p>
                 </div>
               ) : (
                 <div className="text-3xl font-bold text-green-400">₹{svc.price}</div>
               )}
            </div>
            
            {/* Action Button */}
            {svc.isBought ? (
              <button 
                disabled 
                className="w-full bg-gray-700 text-gray-400 font-bold py-2 rounded cursor-not-allowed"
              >
                Already Purchased
              </button>
            ) : (
              <button 
                onClick={() => handleBuy(svc)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-lg"
              >
                Buy Now
              </button>
            )}
            
            {/* Decorative Element for Active Cards */}
            {svc.isBought && (
                <div className="absolute -right-6 -top-6 bg-green-500/20 w-24 h-24 rounded-full blur-xl"></div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentServices;