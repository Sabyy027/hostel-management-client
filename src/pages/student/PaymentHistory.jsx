import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StudentLayout from '../../components/StudentLayout';

function PaymentHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // This route fetches ALL invoices (Paid & Pending)
        const res = await apiClient.get('/resident/my-invoices');
        setInvoices(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  // --- DOWNLOAD HANDLER ---
  const handleDownload = async (invoiceId) => {
    try {
      // Request the file as a 'blob' (binary large object)
      const response = await apiClient.get(`/payment/invoice/${invoiceId}`, {
        responseType: 'blob' 
      });
      
      // Create a hidden link to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup
      window.URL.revokeObjectURL(url); // Free up memory
      
    } catch (err) {
      alert("Failed to download invoice");
      console.error(err);
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
          <p className="text-slate-600 font-medium">Loading payment history...</p>
        </div>
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
            <p className="text-sm text-slate-500">View and download your invoices</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Description</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Amount</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                      {inv.items.map((item, i) => (
                          <div key={i} className="font-semibold text-slate-800 text-sm">
                            {item.description.includes('Service') ? '🛠️ ' : 
                             item.description.includes('Fine') ? '⚠️ ' : 
                             item.description.includes('Hostel') ? '🏠 ' : '📄 '}
                            {item.description}
                          </div>
                      ))}
                      <div className="text-xs text-slate-400 mt-1 font-mono">{inv.invoiceId}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800">₹{inv.totalAmount}</td>
                  <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'Paid' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                          {inv.status}
                      </span>
                  </td>
                  <td className="p-4 text-center">
                     {inv.status === 'Paid' && (
                       <button 
                         onClick={() => handleDownload(inv._id)}
                         className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-1.5 shadow-sm"
                         title="Download Invoice"
                       >
                         <span>📥</span> PDF
                       </button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-slate-500 font-medium">No transaction history found</p>
              <p className="text-sm text-slate-400 mt-1">Your payment records will appear here</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

export default PaymentHistory;