import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

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

  if (loading) return <div className="p-10 text-white text-center">Loading History...</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {invoices.map(inv => (
              <tr key={inv._id} className="hover:bg-gray-750 transition">
                <td className="p-4 text-sm text-gray-300">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                    {inv.items.map((item, i) => (
                        <div key={i} className="font-semibold text-white text-sm">
                          {/* Highlight keywords for clarity */}
                          {item.description.includes('Service') ? '🛠️ ' : 
                           item.description.includes('Fine') ? '⚠️ ' : 
                           item.description.includes('Hostel') ? '🏠 ' : '📄 '}
                          {item.description}
                        </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-1">{inv.invoiceId}</div>
                </td>
                <td className="p-4 font-mono font-bold text-blue-300">₹{inv.totalAmount}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        inv.status === 'Paid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                        {inv.status}
                    </span>
                </td>
                <td className="p-4 text-center">
                   {inv.status === 'Paid' && (
                     <button 
                       onClick={() => handleDownload(inv._id)}
                       className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition text-sm font-medium"
                       title="Download Invoice"
                     >
                       ⬇️ PDF
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <div className="p-8 text-center text-gray-500">No transaction history found.</div>}
      </div>
    </div>
  );
}

export default PaymentHistory;