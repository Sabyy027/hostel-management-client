import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import NotificationBell from '../components/NotificationBell';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [hasBooking, setHasBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- HELPER: DETERMINE DISPLAY TITLE ---
  // If designation exists (e.g. "Resident Tutor"), use it. Otherwise use role.
  const displayRole = user.designation || user.role;

  // --- FETCH BOOKING STATUS (For Students) ---
  useEffect(() => {
    if (user.role === 'student') {
      apiClient.get('/bookings/my')
        .then(res => {
          // If they have a valid booking ID, they are "Booked"
          if (res.data && res.data._id) setHasBooking(true);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false); // Staff/Admin don't need this check
    }
  }, [user.role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="p-20 text-white text-center">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen flex-col items-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
            {/* --- FIX 1: DISPLAY DESIGNATION INSTEAD OF ROLE --- */}
            <p className="text-gray-400 uppercase text-sm tracking-widest font-semibold">
              {displayRole}
            </p>
            {/* -------------------------------------------------- */}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold">Logout</button>
          </div>
        </div>

        {/* --- ROLE BASED MENU GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ============================================================
              1. STUDENT FLOW
          ============================================================ */}
          {user.role === 'student' && (
            <>
              {/* STEP 1: BOOKING (Always Visible) */}
              <Link to="/my-booking" className={`p-6 rounded-xl shadow-lg transition transform hover:scale-105 ${hasBooking ? 'bg-blue-900 border border-blue-500' : 'bg-green-600'}`}>
                <h2 className="text-xl font-bold mb-2">{hasBooking ? 'My Room Details' : 'Book a Room'}</h2>
                <p className="text-sm opacity-80">{hasBooking ? 'View your room info & invoice' : 'Start here to get your room!'}</p>
              </Link>

              {/* STEP 2: FEATURES (Only Visible IF Booked) */}
              {hasBooking ? (
                <>
                  <Link to="/student/complaints" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-750 border-t-4 border-yellow-500">
                    <h2 className="text-xl font-bold mb-2">Maintenance</h2>
                    <p className="text-sm text-gray-400">Raise a complaint</p>
                  </Link>

                  <Link to="/student/services" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-750 border-t-4 border-purple-500">
                    <h2 className="text-xl font-bold mb-2">Add-on Services</h2>
                    <p className="text-sm text-gray-400">Wifi, Food, & More</p>
                  </Link>

                  <Link to="/student/payments" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-750 border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-2">Payment History</h2>
                    <p className="text-sm text-gray-400">Download Invoices</p>
                  </Link>

                  <Link to="/student/dues" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-750 border-t-4 border-red-500">
                    <h2 className="text-xl font-bold mb-2">My Dues</h2>
                    <p className="text-sm text-gray-400">Pay Pending Fines</p>
                  </Link>
                  
                  <Link to="/my-profile" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-750">
                    <h2 className="text-xl font-bold mb-2">My Profile</h2>
                    <p className="text-sm text-gray-400">Update Personal Info</p>
                  </Link>
                </>
              ) : (
                <div className="col-span-2 bg-gray-800/50 border border-dashed border-gray-600 p-8 rounded-xl flex items-center justify-center text-gray-500">
                  <span>🔒 Book a room to unlock Services, Maintenance, and Profile.</span>
                </div>
              )}
            </>
          )}

          {/* ============================================================
              2. STAFF FLOW (Maintenance Only)
          ============================================================ */}
          {user.role === 'staff' && (
            <Link to="/staff/dashboard" className="bg-blue-600 p-8 rounded-xl shadow-lg col-span-3 text-center hover:bg-blue-700 transition">
              <h2 className="text-3xl font-bold mb-2">My Work Dashboard</h2>
              <p className="text-blue-100">View and Update Assigned Tasks</p>
            </Link>
          )}

          {/* ============================================================
              3. WARDEN FLOW (Manager Pages)
          ============================================================ */}
          {/* Check for 'warden' OR 'admin' so Admins see these too */}
          {(user.role === 'warden' || user.role === 'admin') && (
            <>
              {/* --- FIX 2: DYNAMIC SECTION HEADER --- */}
              <div className="col-span-3 text-gray-400 text-sm font-bold uppercase mt-4 mb-2 border-b border-gray-700 pb-1">
                 {user.role === 'admin' ? 'Supervision' : `${displayRole} Management`}
              </div>
              {/* ------------------------------------- */}
              
              <Link to="/admin/residents" className="bg-teal-700 p-6 rounded-xl shadow-lg hover:bg-teal-600">
                <h2 className="text-xl font-bold mb-2">Resident Management</h2>
                <p className="text-sm text-teal-200">360° View & Check-in/out</p>
              </Link>
              <Link to="/admin/occupancy" className="bg-indigo-700 p-6 rounded-xl shadow-lg hover:bg-indigo-600">
                <h2 className="text-xl font-bold mb-2">Occupancy Dashboard</h2>
                <p className="text-sm text-indigo-200">Visual Room Map</p>
              </Link>
              <Link to="/admin/maintenance" className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700 border-l-4 border-yellow-500">
                <h2 className="text-xl font-bold mb-2">Maintenance Overview</h2>
                <p className="text-sm text-gray-400">View All Tickets</p>
              </Link>
            </>
          )}

          {/* ============================================================
              4. ADMIN FLOW (Everything)
          ============================================================ */}
          {user.role === 'admin' && (
            <>
              {/* Structure & Rooms */}
              <div className="col-span-3 text-gray-400 text-sm font-bold uppercase mt-4 mb-2 border-b border-gray-700 pb-1">Setup & Infrastructure</div>
              <Link to="/admin/structure" className="bg-purple-900/40 border border-purple-600 p-6 rounded-xl hover:bg-purple-900/60">
                <h2 className="text-lg font-bold">Hostel Structure</h2>
                <p className="text-xs text-gray-400">Create Blocks, Floors, Rooms</p>
              </Link>
              
              {/* People & Operations */}
              <div className="col-span-3 text-gray-400 text-sm font-bold uppercase mt-4 mb-2 border-b border-gray-700 pb-1">Operations</div>
              <Link to="/admin/staff" className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700">
                <h2 className="text-lg font-bold">Manage Staff</h2>
              </Link>

              {/* Finance */}
              <div className="col-span-3 text-gray-400 text-sm font-bold uppercase mt-4 mb-2 border-b border-gray-700 pb-1">Finance</div>
              <Link to="/admin/billing-tools" className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 border-b-4 border-green-600">
                <h2 className="text-lg font-bold">Billing & Services</h2>
              </Link>
              <Link to="/admin/expenses" className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 border-b-4 border-orange-600">
                <h2 className="text-lg font-bold">Expense Manager</h2>
              </Link>
              <Link to="/admin/reports" className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 border-b-4 border-blue-600">
                <h2 className="text-lg font-bold">Financial Reports</h2>
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
