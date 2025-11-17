import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';

function MyBooking() {
  const [booking, setBooking] = useState(null);
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Load Razorpay Script Dynamically ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- 2. Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Check if user already has a booking
      const myBookingRes = await apiClient.get('/bookings/my'); // Ensure this route exists from previous steps
      
      if (myBookingRes.data && myBookingRes.data._id) {
        setBooking(myBookingRes.data); // User has booking -> Show Dashboard
      } else {
        // No booking -> Fetch Rooms to Buy
        const structRes = await apiClient.get('/rooms/structure');
        setStructure(structRes.data);
        if (structRes.data.length > 0) setActiveBlockId(structRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 3. Handle Payment Flow ---
  const handleBookRoom = async (room) => {
    if (room.isOccupied) return alert("Room is occupied");
    
    const res = await loadRazorpay();
    if (!res) return alert('Razorpay SDK failed to load. Are you online?');

    try {
      // A. Create Order on Backend
      const { data: order } = await apiClient.post('/payment/checkout', { roomId: room._id });

      // B. Open Razorpay Options
      const options = {
        key: "rzp_test_RgpIoxFzAq82ro", // REPLACE with your Test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Hostel Management",
        description: `Booking Room ${room.roomNumber}`,
        order_id: order.orderId,
        handler: async function (response) {
          // C. Verify Payment on Backend
          try {
            const verifyRes = await apiClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              roomId: room._id
            });
            
            alert("Payment Successful! Booking Confirmed.");
            setBooking(verifyRes.data); // Switch to "Booked" view
            fetchData(); // Refresh

          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Student Name", // You can get this from Auth Context
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      alert("Error initiating payment");
      console.error(err);
    }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);

  // --- LOADING STATE ---
  if (loading) return <div className="p-10 text-white text-center">Loading...</div>;

  // --- VIEW 1: ALREADY BOOKED (The Dashboard) ---
  if (booking) {
    return (
      <div className="container mx-auto p-6 text-white">
        <div className="bg-green-900/30 border border-green-600 p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400">Welcome Home!</h1>
          <p className="text-xl mb-8">Your booking is confirmed.</p>
          
          <div className="inline-block bg-gray-800 p-6 rounded-lg shadow-xl text-left">
            <h2 className="text-2xl font-bold mb-2 text-blue-400">Room {booking.room?.roomNumber}</h2>
            <p className="text-gray-400">Block: {booking.room?.floor?.block?.name || 'Main'}</p>
            <p className="text-gray-400">Floor: {booking.room?.floor?.name}</p>
            <p className="text-gray-400">Type: {booking.room?.type} ({booking.room?.bathroomType})</p>
          </div>
          
          <div className="mt-10 p-4 bg-blue-900/20 rounded-lg">
            <p className="font-bold text-blue-200">AI Maintenance Feature Coming Soon...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: ROOM BROWSER (The Booking Flow) ---
  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Select Your Room</h1>
      <p className="text-gray-400 mb-8">Choose a block, check facilities, and book instantly.</p>

      {/* Block Tabs */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {structure.map(block => (
          <button
            key={block._id}
            onClick={() => setActiveBlockId(block._id)}
            className={`px-6 py-3 font-bold rounded transition ${
              activeBlockId === block._id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {block.name}
          </button>
        ))}
      </div>

      {/* Floors & Rooms */}
      {getActiveBlockData() ? (
        <div className="space-y-6 animate-fade-in">
          {getActiveBlockData().floors.map(floor => (
            <div key={floor._id} className={`rounded-lg p-5 shadow-lg border border-gray-700 ${floor.type === 'AC' ? 'bg-blue-900/10' : 'bg-gray-800'}`}>
              
              {/* Floor Header */}
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-bold text-white">
                  {floor.name} 
                  <span className={`ml-3 text-xs px-2 py-1 rounded uppercase ${floor.type === 'AC' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {floor.type}
                  </span>
                </h3>
                <span className="text-xs text-gray-400">
                  {floor.type === 'AC' ? 'Attached Washrooms' : `Common Washrooms (${floor.commonToilets})`}
                </span>
              </div>

              {/* Room Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {floor.rooms.map(room => {
                   // Don't show Staff rooms to students
                   if (room.isStaffRoom) return null;
                   
                   return (
                    <div 
                      key={room._id} 
                      className={`relative p-4 rounded-lg text-center transition border 
                        ${room.isOccupied 
                          ? 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed' 
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500 cursor-pointer shadow-md'
                        }`}
                    >
                      <div className="text-lg font-bold text-white">{room.roomNumber}</div>
                      <div className="text-xs text-gray-300 mb-2">{room.capacity} Sharing</div>
                      <div className="font-mono text-green-400 font-bold text-sm">₹{room.pricePerYear}</div>
                      
                      {room.isOccupied ? (
                        <span className="block mt-2 text-xs bg-red-900 text-red-200 rounded py-1">Occupied</span>
                      ) : (
                        <button 
                          onClick={() => handleBookRoom(room)}
                          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded"
                        >
                          Book
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">Loading Blocks...</div>
      )}
    </div>
  );
}

export default MyBooking;