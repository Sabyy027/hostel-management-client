import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { Users, BedDouble, AlertCircle, DollarSign, TrendingUp, Activity, LogOut, Bell, CreditCard, ShoppingBag, Home, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import NotificationBell from '../components/NotificationBell';
import AdminLayout from '../components/AdminLayout';
import StudentLayout from '../components/StudentLayout';
import NoticeBoard from '../components/NoticeBoard';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // --- STATE ---
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBooking, setHasBooking] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch Global Stats (Admin/Warden/RT View)
        const isAdmin = user.role === 'admin';
        const isWarden = user.role === 'warden';
        const isRT = user.role === 'rt';
        
        if (isAdmin || isWarden || isRT) {
          const res = await apiClient.get('/reports/dashboard-stats');
          setStats(res.data);
        }
        
        // 2. Check Booking (Student View)
        if (user.role === 'student') {
          const bookingRes = await apiClient.get('/bookings/my');
          if (bookingRes.data && bookingRes.data._id) setHasBooking(true);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // --- 1. STUDENT VIEW (With Sidebar Layout) ---
  if (user.role === 'student') {
    return (
      <StudentLayout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500">Your hostel overview and quick actions</p>
          </div>

          {/* Welcome Banner for Booked Students */}
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Home size={28} /> Welcome Home, {user.username}! 🎉
                  </h3>
                  <p className="text-emerald-100 mb-2 max-w-lg">
                    Your booking is confirmed! Manage your hostel experience from here.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <BedDouble size={120} className="text-white opacity-10" />
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>

          {/* Notice Board */}
          <NoticeBoard />

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              to="/student/complaints" 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-orange-300 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Maintenance</h3>
                  <p className="text-sm text-slate-500">Raise complaints</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Report issues with your room or facilities</p>
            </Link>

            <Link 
              to="/student/payments" 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-green-300 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">My Dues</h3>
                  <p className="text-sm text-slate-500">Pending payments</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Check and pay your hostel dues</p>
            </Link>

            <Link 
              to="/student/payment-history" 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Payment History</h3>
                  <p className="text-sm text-slate-500">Transaction records</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">View all your payment history and invoices</p>
            </Link>

            <Link 
              to="/student/services" 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Services</h3>
                  <p className="text-sm text-slate-500">Additional services</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Purchase WiFi, food packages, and more</p>
            </Link>

            <Link 
              to="/profile" 
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Profile</h3>
                  <p className="text-sm text-slate-500">Manage account</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Update your personal information</p>
            </Link>
          </div>

          {/* Info Section */}
          {hasBooking && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-3">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                If you have any questions or need assistance, feel free to contact the hostel administration or raise a maintenance ticket.
              </p>
              <div className="flex gap-3">
                <Link 
                  to="/student/complaints" 
                  className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors border border-slate-200"
                >
                  Report Issue
                </Link>
              </div>
            </div>
          )}
        </div>
      </StudentLayout>
    );
  }

  // --- 2. ADMIN / WARDEN VIEW (The Beautiful Dashboard) ---
  // Data Preparation
  const occupancyData = stats ? [
    { name: 'Occupied', value: stats.occupancy.occupied },
    { name: 'Available', value: stats.occupancy.total - stats.occupancy.occupied },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${(user.role === 'warden' || user.role === 'rt') ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
            
            {/* Card 1: Occupancy */}
            <Link to="/admin/occupancy" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                    <p className="text-sm font-medium text-slate-500">Occupancy Rate</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.occupancy.rate}%</h3>
                    <p className="text-xs text-slate-400 mt-1">{stats.occupancy.occupied} / {stats.occupancy.total} Beds Filled</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><BedDouble size={24} /></div>
            </Link>

            {/* Card 2: Residents */}
            <Link to="/admin/residents" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                    <p className="text-sm font-medium text-slate-500">Active Residents</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.occupancy.occupied}</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp size={12} /> Live Count</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><Users size={24} /></div>
            </Link>

            {/* Card 3: Maintenance */}
            <Link to="/admin/maintenance" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-all hover:-translate-y-1">
                <div>
                    <p className="text-sm font-medium text-slate-500">Maintenance</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">Desk</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage Tickets</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-orange-600"><AlertCircle size={24} /></div>
            </Link>

            {/* Card 4: Revenue - Only for Admin */}
            {user.role === 'admin' && (
              <Link to="/admin/reports" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-all hover:-translate-y-1">
                  <div>
                      <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-1">₹{stats.financials.totalRevenue.toLocaleString()}</h3>
                      <p className="text-xs text-slate-400 mt-1">Net Profit: ₹{stats.financials.netProfit.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><DollarSign size={24} /></div>
              </Link>
            )}

        </div>
      )}

      {/* Notice Board */}
      <NoticeBoard />

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-2">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Room Availability Overview</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={occupancyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" barSize={40}>
                            {occupancyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#e2e8f0'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Quick Links / Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
             <div className="space-y-3">
                {user.role === 'admin' && (
                    <>
                        <Link to="/admin/structure" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition group">
                            <span className="font-medium text-slate-700">Hostel Structure</span>
                            <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
                        </Link>
                        <Link to="/admin/staff" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition group">
                            <span className="font-medium text-slate-700">Manage Staff</span>
                            <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
                        </Link>
                        <Link to="/admin/billing-tools" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition group">
                            <span className="font-medium text-slate-700">Billing Tools</span>
                            <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
                        </Link>
                    </>
                )}
                
                <Link to="/admin/residents" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition group">
                     <span className="font-medium text-slate-700">Resident Directory</span>
                     <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
                </Link>
             </div>
          </div>
      </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
