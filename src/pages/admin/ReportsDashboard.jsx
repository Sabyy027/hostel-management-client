import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Users, BarChart3, Download, Calendar, FileText } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useUI } from '../../context/UIContext';

function ReportsDashboard() {
  const { showToast } = useUI();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, transactionsRes, expensesRes] = await Promise.all([
        apiClient.get('/reports/dashboard-stats'),
        apiClient.get('/billing/all-invoices'),
        apiClient.get('/expenses')
      ]);
      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!startDate || !endDate) {
      showToast('Please select both start and end dates', 'error');
      return;
    }

    setDownloading(true);
    try {
      const response = await apiClient.post('/reports/download-report', 
        { startDate, endDate },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Financial-Report-${startDate}-to-${endDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download report');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  // Filter data by date range
  const filteredTransactions = transactions.filter(t => {
    if (!startDate || !endDate) return true;
    const tDate = new Date(t.createdAt);
    return tDate >= new Date(startDate) && tDate <= new Date(endDate);
  });

  const filteredExpenses = expenses.filter(e => {
    if (!startDate || !endDate) return true;
    const eDate = new Date(e.date);
    return eDate >= new Date(startDate) && eDate <= new Date(endDate);
  });

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600 font-medium">Analyzing Financials...</p>
      </div>
    </AdminLayout>
  );
  
  if (!stats) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600 font-medium">No data found</p>
      </div>
    </AdminLayout>
  );

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <AdminLayout>
      <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="text-sm text-slate-500">Real-time financial analytics and insights</p>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Revenue</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-800">₹{stats.financials.totalRevenue.toLocaleString()}</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">Expenses</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-slate-800">₹{stats.financials.totalExpenses.toLocaleString()}</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.financials.netProfit >= 0 ? 'bg-indigo-100' : 'bg-amber-100'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                stats.financials.netProfit >= 0 ? 'text-indigo-600' : 'text-amber-600'
              }`} />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              stats.financials.netProfit >= 0 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-amber-600 bg-amber-50'
            }`}>
              {stats.financials.netProfit >= 0 ? 'Profit' : 'Loss'}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Net Profit</p>
          <p className={`text-3xl font-bold ${
            stats.financials.netProfit >= 0 ? 'text-indigo-600' : 'text-amber-600'
          }`}>
            ₹{stats.financials.netProfit.toLocaleString()}
          </p>
        </div>

        {/* Occupancy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Occupancy</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">Occupancy Rate</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-800">{stats.occupancy.rate}%</p>
            <p className="text-sm text-slate-500">{stats.occupancy.occupied}/{stats.occupancy.total}</p>
          </div>
        </div>
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART: INCOME vs EXPENSE vs PROFIT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-6">Revenue vs Expenses (YTD)</h3>
          <div className="h-72">
            {stats.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={stats.chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    style={{ fontSize: '12px' }}
                  />
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    opacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Income" 
                    stroke="#4f46e5" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Expense" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-sm">No data available for chart</p>
              </div>
            )}
          </div>
        </div>

        {/* EXPENSE BREAKDOWN PIE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-6">Expense Distribution</h3>
          <div className="h-72">
            {stats.expensePie && stats.expensePie.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.expensePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => `₹${entry.value.toLocaleString()}`}
                  >
                    {stats.expensePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-sm">No expense data available</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Transaction & Expense History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Transaction & Expense History</h3>
              <p className="text-sm text-slate-500">Filter by date range and download report</p>
            </div>
          </div>

          {/* Date Range Filter & Download */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={downloading || !startDate || !endDate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mb-8">
          <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Revenue Transactions ({filteredTransactions.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Invoice ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-700">
                      {transaction.invoiceId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {transaction.student?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {transaction.items?.[0]?.description || 'Payment'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-bold text-emerald-600 text-right">
                      ₹{transaction.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                      No transactions found for selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div>
          <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Expenses ({filteredExpenses.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.slice(0, 10).map((expense) => (
                  <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-bold text-red-600 text-right">
                      ₹{expense.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {expense.vendor || 'N/A'}
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                      No expenses found for selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      </div>
    </AdminLayout>
  );
}

export default ReportsDashboard;