import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StudentLayout from '../../components/StudentLayout';
import { ShoppingCart, CheckCircle, Key, FileText, Package } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function StudentServices() {
  const { showToast, showLoading, hideLoading } = useUI();
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

  // Download Mess Pass
  const handleDownloadMessPass = async (studentServiceId, passNumber) => {
    try {
      const response = await apiClient.get(`/services/download-pass/${studentServiceId}`, {
        responseType: 'blob' // Important for file download
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mess_Pass_${passNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download mess pass. Please try again.', 'error');
    }
  };

  const handleBuy = async (service) => {
    showLoading('Initializing payment...');
    const res = await loadRazorpay();
    if (!res) {
      hideLoading();
      return showToast('Razorpay failed to load', 'error');
    }
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
            
            hideLoading();
            showToast("Payment Successful! Service Activated.", 'success', 4000);
            fetchData(); // <--- REFRESH LIST TO UPDATE STATUS
            
          } catch (err) { 
            hideLoading();
            showToast("Verification failed", 'error'); 
          }
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) { 
      hideLoading();
      showToast("Error initiating payment", 'error'); 
    }
  };

  if (loading) return (
    <StudentLayout>
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading services...</p>
      </div>
    </div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShoppingCart className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Available Services</h1>
              <p className="text-sm sm:text-base text-slate-500">Enhance your stay with these add-ons</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(svc => (
            <div 
              key={svc._id} 
              className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border transition-all relative overflow-hidden ${
                svc.isBought 
                  ? 'border-emerald-300 ring-2 ring-emerald-100' 
                  : 'border-slate-200 hover:shadow-md hover:border-indigo-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">{svc.name}</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full uppercase font-medium">
                  {svc.period}
                </span>
              </div>
              
              {/* Description */}
              {svc.description && (
                <p className="text-sm text-slate-600 mb-4">{svc.description}</p>
              )}

              {/* Price or Active Status */}
              <div className="mb-4">
                 {svc.isBought ? (
                   <div>
                     <span className="text-emerald-600 font-bold text-lg flex items-center gap-2">
                       <CheckCircle size={20} /> ACTIVE
                     </span>
                     <p className="text-xs text-slate-500 mt-1">{svc.validityText}</p>
                   </div>
                 ) : (
                   <div className="text-3xl font-bold text-slate-800">₹{svc.price}</div>
                 )}
              </div>

              {/* Credentials Display (for WiFi, etc.) */}
              {svc.isBought && svc.userCredentials && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                    <Key size={14} /> Your Credentials:
                  </p>
                  <pre className="text-xs text-amber-800 font-mono whitespace-pre-wrap break-all">
                    {svc.userCredentials}
                  </pre>
                </div>
              )}

              {/* Mess Pass Number */}
              {svc.isBought && svc.serviceType === 'Mess' && svc.passNumber && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                    <FileText size={14} /> Pass Number:
                  </p>
                  <p className="text-sm text-blue-800 font-mono">{svc.passNumber}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              {svc.isBought ? (
                <div className="space-y-2">
                  {svc.serviceType === 'Mess' && svc.studentServiceId && (
                    <button 
                      onClick={() => handleDownloadMessPass(svc.studentServiceId, svc.passNumber)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Mess Pass
                    </button>
                  )}
                  <button 
                    disabled 
                    className="w-full bg-slate-100 text-slate-400 font-semibold py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Already Purchased
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleBuy(svc)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-200 hover:scale-105"
                >
                  Buy Now
                </button>
              )}
              
              {/* Decorative Element for Active Cards */}
              {svc.isBought && (
                  <div className="absolute -right-6 -top-6 bg-emerald-400/20 w-24 h-24 rounded-full blur-2xl"></div>
              )}

            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Package className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-500 font-medium">No services available</p>
            <p className="text-sm text-slate-400 mt-1">Check back later for new offerings</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentServices;