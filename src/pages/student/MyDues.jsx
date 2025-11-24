import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StudentLayout from '../../components/StudentLayout';
import { CheckCircle } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function MyDues() {
  const { showToast, showLoading, hideLoading } = useUI();
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDues = async () => {
    try {
      const res = await apiClient.get('/billing/my-pending');
      setDues(res.data);
    } catch (err) { 
      console.error('Error fetching dues:', err);
    }
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
    showLoading('Initializing payment...');
    const res = await loadRazorpay();
    if (!res) {
      hideLoading();
      return showToast('Razorpay failed', 'error');
    }
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      // Create Order
      const { data: order } = await apiClient.post('/payment/invoice/checkout', { invoiceId: invoice._id });

      // Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Hostel Payment",
        description: invoice.items[0]?.description || "Dues Payment",
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // Verify
            await apiClient.post('/payment/invoice/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: invoice._id,
              studentData: { username: user.username, email: user.email }
            });
            hideLoading();
            showToast("Paid Successfully!", 'success', 4000);
            fetchDues(); // Refresh list
          } catch (err) { 
            hideLoading();
            showToast("Verification failed", 'error'); 
          }
        },
        theme: { color: "#ef4444" }, // Red for Dues
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) { 
      hideLoading();
      showToast("Error initiating payment", 'error'); 
    }
  };

  if (loading) return <StudentLayout><div className="p-10 text-center">Loading Dues...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pending Dues & Fines</h2>
          <p className="text-slate-500">Manage your outstanding payments</p>
        </div>
      
      <div className="grid gap-4">
        {dues.length === 0 && (
          <div className="p-10 bg-white rounded-xl text-center border border-slate-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">All Clear!</h3>
            <p className="text-slate-600">You have no pending dues.</p>
          </div>
        )}

        {dues.map(due => (
          <div key={due._id} className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-slate-900">₹{due.totalAmount.toLocaleString()}</h3>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded">Due</span>
              </div>
              <p className="text-slate-700 font-medium">{due.items[0]?.description}</p>
              <p className="text-sm text-slate-500 mt-1">Invoice: {due.invoiceId} • {new Date(due.createdAt).toLocaleDateString()}</p>
            </div>
            
            <button 
              onClick={() => handlePay(due)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
    </StudentLayout>
  );
}

export default MyDues;