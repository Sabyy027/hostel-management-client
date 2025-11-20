import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

function ReportsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/reports/dashboard-stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-white text-center">Analyzing Financials...</div>;
  if (!stats) return <div className="p-10 text-white text-center">No data found</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

  return (
    <div className="container mx-auto p-6 text-white space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold">Financial Performance</h1>
        <div className="text-right text-xs text-gray-400">Real-time Analysis</div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Total Revenue</p>
          <p className="text-3xl font-bold text-white mt-1">₹{stats.financials.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Total Expenses</p>
          <p className="text-3xl font-bold text-white mt-1">₹{stats.financials.totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${stats.financials.netProfit >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <p className="text-gray-400 text-xs font-bold uppercase">Net Profit</p>
          <p className={`text-3xl font-bold mt-1 ${stats.financials.netProfit >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            ₹{stats.financials.netProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Occupancy</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.occupancy.rate}%</p>
          <p className="text-xs text-gray-500 mt-1">{stats.occupancy.occupied} / {stats.occupancy.total} Rooms</p>
        </div>
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CHART: INCOME vs EXPENSE vs PROFIT */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg h-96">
          <h3 className="text-xl font-bold mb-4">Financial Performance Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend verticalAlign="top" height={36}/>
              
              <Area type="monotone" dataKey="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorInc)" />
              <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" />
              {/* We can overlay Profit line if needed, but usually Income/Expense is clearer */}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* EXPENSE BREAKDOWN PIE */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
          <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.expensePie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.expensePie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} 
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default ReportsDashboard;