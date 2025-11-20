import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

// --- STEP 2 FORM COMPONENT ---
function RegistrationForm({ initialData, onSubmit, onBack }) {
  const formik = useFormik({
    initialValues: {
      fullName: initialData?.username || '',
      dob: '',
      gender: 'Male',
      email: initialData?.email || '',
      mobileNumber: '',
      altPhone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      checkInDate: ''
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required'),
      dob: Yup.date().required('Required'),
      mobileNumber: Yup.string().required('Required').min(10, 'Invalid Number'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      pincode: Yup.string().required('Required'),
      checkInDate: Yup.date().required('Required').min(new Date(), 'Date must be in future')
    }),
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Complete Your Profile</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Full Name</label>
            <input type="text" {...formik.getFieldProps('fullName')} className="w-full bg-gray-700 rounded p-2 text-white"/>
            {formik.errors.fullName && <p className="text-red-500 text-xs">{formik.errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date of Birth</label>
            <input type="date" {...formik.getFieldProps('dob')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.dob && <p className="text-red-500 text-xs">{formik.errors.dob}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Gender</label>
            <select {...formik.getFieldProps('gender')} className="w-full bg-gray-700 rounded p-2 text-white">
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input type="email" {...formik.getFieldProps('email')} className="w-full bg-gray-700 rounded p-2 text-white" readOnly/>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Mobile Number</label>
            <input type="text" {...formik.getFieldProps('mobileNumber')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.mobileNumber && <p className="text-red-500 text-xs">{formik.errors.mobileNumber}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Alt Phone</label>
            <input type="text" {...formik.getFieldProps('altPhone')} className="w-full bg-gray-700 rounded p-2 text-white"/>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-300 mt-4 border-b border-gray-600 pb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">Street Address</label>
            <input type="text" {...formik.getFieldProps('street')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.street && <p className="text-red-500 text-xs">{formik.errors.street}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">City</label>
            <input type="text" {...formik.getFieldProps('city')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.city && <p className="text-red-500 text-xs">{formik.errors.city}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">State</label>
            <input type="text" {...formik.getFieldProps('state')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.state && <p className="text-red-500 text-xs">{formik.errors.state}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Pincode</label>
            <input type="text" {...formik.getFieldProps('pincode')} className="w-full bg-gray-700 rounded p-2 text-white"/>
             {formik.errors.pincode && <p className="text-red-500 text-xs">{formik.errors.pincode}</p>}
          </div>
        </div>

        <div className="mt-4 bg-blue-900/20 p-4 rounded border border-blue-500/30">
           <label className="block text-sm text-blue-300 mb-1 font-bold">Expected Check-in Date</label>
           <input type="date" {...formik.getFieldProps('checkInDate')} className="w-full bg-gray-700 rounded p-2 text-white"/>
            {formik.errors.checkInDate && <p className="text-red-500 text-xs">{formik.errors.checkInDate}</p>}
        </div>

        <div className="flex gap-4 pt-4">
           <button type="button" onClick={onBack} className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded font-bold">Back</button>
           <button type="submit" className="w-2/3 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold shadow-lg">Proceed to Payment</button>
        </div>
      </form>
    </div>
  );
}


// --- MAIN PAGE ---
function MyBooking() {
  const [step, setStep] = useState(1); // 1=Select, 2=Form, 3=Success
  const [booking, setBooking] = useState(null);
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // We need selectedPlans map for the dropdown state
  const [selectedPlansMap, setSelectedPlansMap] = useState({});

  // Helper to calculate discounted price
  const getDiscountedPrice = (planPrice, discount) => {
    if (!discount) return planPrice;
    if (discount.type === 'Fixed') return Math.max(0, planPrice - discount.value);
    return Math.round(planPrice - (planPrice * (discount.value / 100)));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const myBookingRes = await apiClient.get('/bookings/my');
      if (myBookingRes.data && myBookingRes.data._id) {
        setBooking(myBookingRes.data);
      } else {
        const structRes = await apiClient.get('/rooms/structure');
        setStructure(structRes.data);
        if (structRes.data.length > 0) setActiveBlockId(structRes.data[0]._id);
        
        // Init dropdowns
        const initPlans = {};
        structRes.data.forEach(b => b.floors.forEach(f => f.rooms.forEach(r => {
            if(r.pricingPlans?.length > 0) initPlans[r._id] = r.pricingPlans[0]._id;
        })));
        setSelectedPlansMap(initPlans);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- HANDLERS ---
  const handleRoomSelect = (room) => {
    const planId = selectedPlansMap[room._id];
    if (!planId) return alert("Please select a price plan.");
    setSelectedRoom(room);
    setSelectedPlanId(planId);
    setStep(2); // Move to Form
  };

  const handleFormSubmit = async (formData) => {
    const res = await loadRazorpay();
    if (!res) return alert('Razorpay SDK failed to load.');

    try {
      const { data: order } = await apiClient.post('/payment/checkout', { roomId: selectedRoom._id, planId: selectedPlanId });

      const options = {
        key: "rzp_test_RhFyEYnxY7waP0", // KEY ID
        amount: order.amount,
        currency: order.currency,
        name: "Hostel Booking",
        description: `Room ${selectedRoom.roomNumber}`,
        order_id: order.orderId,
        
        handler: async function (response) {
          try {
            // Send Payment + Form Data
            const verifyRes = await apiClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              roomId: selectedRoom._id,
              planId: selectedPlanId,
              residentDetails: formData // <--- The Form Data
            });
            
            alert("Booking Successful! Invoice sent to email.");
            setBooking(verifyRes.data.booking);
            setStep(1); // Reset to main view (which will now show "Welcome Home")
            fetchData();

          } catch (err) {
             alert("Payment verified, but server error: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.mobileNumber },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      alert("Payment Init Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);

  // --- RENDER LOGIC ---
  if (loading) return <div className="p-20 text-center text-white">Loading...</div>;

  // View 1: Dashboard (Already Booked)
  if (booking) {
    return (
      <div className="container mx-auto p-6 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="bg-green-900/30 border border-green-600 p-10 rounded-2xl text-center shadow-2xl max-w-2xl w-full">
          
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-4 text-green-400">Welcome Home!</h1>
          <p className="text-xl mb-8 text-gray-200">You are successfully booked in:</p>
          
          <div className="inline-block bg-gray-800 p-6 rounded-xl shadow-inner text-left w-full mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-3xl font-bold text-blue-400">Room {booking.room?.roomNumber}</h2>
              <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-xs uppercase">{booking.room?.type}</span>
            </div>
            <p className="text-gray-400">Booking ID: <span className="font-mono text-white">{booking._id}</span></p>
            <p className="text-gray-400">An official invoice has been sent to your email.</p>
          </div>

          {/* --- NEW BUTTON --- */}
          <Link 
            to="/dashboard" 
            className="inline-block w-full bg-white text-green-900 font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Go to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  // View 2: Form Wizard
  if (step === 2) {
    const user = JSON.parse(localStorage.getItem('user'));
    return <RegistrationForm initialData={user} onSubmit={handleFormSubmit} onBack={() => setStep(1)} />;
  }

  // View 3: Room Selection (Default)
  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Select Your Room</h1>
      
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {structure.map(block => (
          <button key={block._id} onClick={() => setActiveBlockId(block._id)} className={`px-6 py-3 font-bold rounded transition ${activeBlockId === block._id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {block.name}
          </button>
        ))}
      </div>

      {getActiveBlockData() ? (
        <div className="space-y-6 animate-fade-in">
          {getActiveBlockData().floors.map(floor => (
            <div key={floor._id} className="rounded-lg p-5 shadow-lg border border-gray-700 bg-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{floor.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {floor.rooms.map(room => {
                   if (room.isStaffRoom) return null;
                   return (
                    <div key={room._id} className="relative p-4 rounded-lg text-center border bg-gray-700 border-gray-600 shadow-md hover:scale-105 transition-transform">
                      
                      {/* SALE Badge */}
                      {room.activeDiscount && (
                        <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-lg z-10">
                          SALE
                        </div>
                      )}

                      <div className="text-lg font-bold text-white">{room.roomNumber}</div>
                      <div className="text-xs text-gray-300 mb-2">{room.capacity} Sharing</div>

                      {room.pricingPlans?.length > 0 ? (
                        <select 
                          className="w-full bg-gray-900 text-white text-xs p-2 rounded border border-gray-600 mb-3"
                          value={selectedPlansMap[room._id] || ''}
                          onChange={(e) => setSelectedPlansMap({ ...selectedPlansMap, [room._id]: e.target.value })}
                        >
                          {room.pricingPlans.map(p => {
                            const finalPrice = getDiscountedPrice(p.price, room.activeDiscount);
                            return (
                              <option key={p._id} value={p._id}>
                                {p.duration} {p.unit} - ₹{finalPrice}
                                {room.activeDiscount && ` (was ₹${p.price})`}
                              </option>
                            );
                          })}
                        </select>
                      ) : <div className="text-red-400 text-xs mb-2">No Price</div>}
                      
                      {room.isOccupied ? (
                        <span className="block mt-2 text-xs bg-red-900 text-red-200 rounded py-1">Occupied</span>
                      ) : (
                        <button onClick={() => handleRoomSelect(room)} className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition">
                          Book Now
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-center text-gray-500 mt-20">Loading...</div>}
    </div>
  );
}
export default MyBooking;