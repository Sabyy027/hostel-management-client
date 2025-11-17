import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  // We can be confident 'user' exists because ProtectedRoute let us in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 text-center shadow-lg">
        {/* 1. Dynamic Welcome Message */}
        <h1 className="mb-4 text-3xl font-bold">
          Welcome, <span className="capitalize">{user.role}</span>
        </h1>
        <p className="mb-6 text-xl">
          Hello,{" "}
          <span className="font-medium text-blue-400">{user.username}</span>
        </p>

        {/* 2. Conditional Links */}
        <div className="space-y-4">
          {/* --- ADMIN VIEW --- */}
          {user.role === "admin" ? (
            <>
              <Link
                to="/rooms"
                className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                Manage Rooms
              </Link>
              <Link
                to="/admin/occupancy"
                className="block w-full rounded-lg bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700"
              >
                Occupancy Dashboard
              </Link>
              <Link
                to="/admin/structure"
                className="block w-full rounded-lg bg-purple-600 px-5 py-3 text-base font-medium text-white hover:bg-purple-700"
              >
                Hostel Structure (Blocks)
              </Link>

              {/* --- NEW BUTTONS --- */}
              <Link
                to="/admin/staff"
                className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Manage Staff
              </Link>
              <Link
                to="/admin/maintenance"
                className="block w-full rounded-lg bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
              >
                Maintenance Desk
              </Link>
            </>
          ) : (
            /* --- STUDENT VIEW --- */
            <>
              <Link
                to="/my-profile"
                className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                My Profile
              </Link>
              <Link
                to="/my-booking"
                className="block w-full rounded-lg bg-gray-600 px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
              >
                My Booking / Room
              </Link>

              {/* --- NEW BUTTON --- */}
              <Link
                to="/student/complaints"
                className="block w-full rounded-lg bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
              >
                Raise Complaint / Maintenance
              </Link>
            </>
          )}

          {/* 3. Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
