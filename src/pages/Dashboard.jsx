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
          {user.role === "admin" ? (
            <>
              {/* --- Admin Links --- */}
              <Link
                to="/admin/structure"
                className="block w-full rounded-lg bg-purple-600 px-5 py-3 text-base font-medium text-white hover:bg-purple-700"
              >
                Hostel Builder (Manage Blocks)
              </Link>
              <Link
  to="/admin/occupancy"
  className="block w-full rounded-lg bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700"
>
  Occupancy Dashboard
</Link>
              
              {/* We'll add /manage-students later */}
            </>
          ) : (
            <>
              {/* --- Student Links --- */}
              <Link
                to="/my-profile" // We will create this page next
                className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                My Profile
              </Link>
              <Link
                to="/my-booking" // We will create this page later
                className="block w-full rounded-lg bg-gray-600 px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
              >
                My Booking
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
