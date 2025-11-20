import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function MyDues() {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDues = async () => {
    try {
      const res = await apiClient.get('/billing/my-pending');
      setDues(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDues(); }, []);

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

  const handlePay = async (invoice) => {
    const res = await loadRazorpay();
    if (!res) return alert('Razorpay failed');
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      // 1. Create Order
      const { data: order } = await apiClient.post('/payment/invoice/checkout', { invoiceId: invoice._id });

      // 2. Open Razorpay
      const options = {
        key: "rzp_test_RhFyEYnxY7waP0", // YOUR KEY
        amount: order.amount,
        currency: order.currency,
        name: "Hostel Payment",
        description: invoice.items[0]?.description || "Dues Payment",
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // 3. Verify
            await apiClient.post('/payment/invoice/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: invoice._id,
              studentData: { username: user.username, email: user.email }
            });
            alert("Paid Successfully!");
            fetchDues(); // Refresh list
          } catch (err) { alert("Verification failed"); }
        },
        theme: { color: "#ef4444" }, // Red for Dues
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) { alert("Error initiating payment"); }
  };

  if (loading) return <div className="p-10 text-white text-center">Loading Dues...</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Pending Dues & Fines</h1>
      
      <div className="grid gap-4">
        {dues.length === 0 && (
          <div className="p-10 bg-gray-800 rounded-lg text-center text-gray-400 border border-gray-700">
            <h2 className="text-xl text-green-400 mb-2">All Clear!</h2>
            <p>You have no pending dues.</p>
          </div>
        )}

        {dues.map(due => (
          <div key={due._id} className="bg-gray-800 p-6 rounded-lg border-l-4 border-red-500 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-red-400">₹{due.totalAmount}</h3>
              <p className="text-gray-300 font-bold">{due.items[0]?.description}</p>
              <p className="text-xs text-gray-500">Invoice: {due.invoiceId} • Date: {new Date(due.createdAt).toLocaleDateString()}</p>
            </div>
            
            <button 
              onClick={() => handlePay(due)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition"
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDues;