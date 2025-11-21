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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Complete Your Profile</h2>
          </div>
          <p className="text-sm text-slate-500 ml-14">Fill in your details to complete the booking</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input type="text" {...formik.getFieldProps('fullName')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
            {formik.errors.fullName && <p className="text-red-600 text-xs mt-1">{formik.errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input type="date" {...formik.getFieldProps('dob')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
             {formik.errors.dob && <p className="text-red-600 text-xs mt-1">{formik.errors.dob}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select {...formik.getFieldProps('gender')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors">
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input type="email" {...formik.getFieldProps('email')} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-500" readOnly/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
            <input type="text" {...formik.getFieldProps('mobileNumber')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
             {formik.errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{formik.errors.mobileNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Phone</label>
            <input type="text" {...formik.getFieldProps('altPhone')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span>
            Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
              <input type="text" {...formik.getFieldProps('street')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
               {formik.errors.street && <p className="text-red-600 text-xs mt-1">{formik.errors.street}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <input type="text" {...formik.getFieldProps('city')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
               {formik.errors.city && <p className="text-red-600 text-xs mt-1">{formik.errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
              <input type="text" {...formik.getFieldProps('state')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
               {formik.errors.state && <p className="text-red-600 text-xs mt-1">{formik.errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pincode</label>
              <input type="text" {...formik.getFieldProps('pincode')} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
               {formik.errors.pincode && <p className="text-red-600 text-xs mt-1">{formik.errors.pincode}</p>}
            </div>
          </div>
        </div>

        <div className="mt-5 bg-blue-50 p-5 rounded-lg border border-blue-200">
           <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
             <span>📅</span>
             Expected Check-in Date
           </label>
           <input type="date" {...formik.getFieldProps('checkInDate')} className="w-full bg-white border border-blue-300 rounded-lg p-3 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"/>
            {formik.errors.checkInDate && <p className="text-red-600 text-xs mt-1">{formik.errors.checkInDate}</p>}
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-200 mt-6">
           <button type="button" onClick={onBack} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium transition-colors">
             Back
           </button>
           <button type="submit" className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold shadow-sm transition-colors">
             Proceed to Payment →
           </button>
        </div>
      </form>
      </div>
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
            
            // Dispatch event to unlock sidebar menu items
            window.dispatchEvent(new Event('bookingCompleted'));
            
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
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-slate-600 font-medium">Loading rooms...</p>
      </div>
    </div>
  );

  // View 1: Dashboard (Already Booked)
  if (booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center shadow-sm max-w-2xl w-full">
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <span className="text-5xl">🎉</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-3 text-slate-800">Welcome Home!</h1>
          <p className="text-lg mb-8 text-slate-600">You are successfully booked in:</p>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 text-left w-full mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-bold text-blue-600">Room {booking.room?.roomNumber}</h2>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium uppercase">{booking.room?.type}</span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600">
                Booking ID: <span className="font-mono text-slate-800 font-medium">{booking._id}</span>
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span>✉️</span>
                An official invoice has been sent to your email.
              </p>
            </div>
          </div>

          <Link 
            to="/dashboard" 
            className="inline-block w-full bg-emerald-600 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Go to Dashboard →
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Select Your Room</h1>
          </div>
          <p className="text-slate-600 ml-14">Choose a room that fits your needs</p>
        </div>
        
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {structure.map(block => (
            <button 
              key={block._id} 
              onClick={() => setActiveBlockId(block._id)} 
              className={`px-6 py-3 font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeBlockId === block._id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {block.name}
            </button>
          ))}
        </div>

        {getActiveBlockData() ? (
          <div className="space-y-6">
            {getActiveBlockData().floors.map(floor => (
              <div key={floor._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200 flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  {floor.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {floor.rooms.map(room => {
                     if (room.isStaffRoom) return null;
                     return (
                      <div key={room._id} className="relative bg-slate-50 p-4 rounded-lg text-center border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all">
                        
                        {/* SALE Badge */}
                        {room.activeDiscount && (
                          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-sm z-10">
                            SALE
                          </div>
                        )}

                        <div className="text-lg font-bold text-slate-800 mb-1">{room.roomNumber}</div>
                        <div className="text-xs text-slate-500 mb-3 flex items-center justify-center gap-1">
                          <span>👥</span>
                          {room.capacity} Sharing
                        </div>

                        {room.pricingPlans?.length > 0 ? (
                          <select 
                            className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-300 mb-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
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
                        ) : <div className="text-red-600 text-xs mb-2 bg-red-50 py-1 rounded">No Price</div>}
                        
                        {room.isOccupied ? (
                          <span className="block mt-2 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg py-2 font-medium">
                            Occupied
                          </span>
                        ) : (
                          <button onClick={() => handleRoomSelect(room)} className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm">
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
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-slate-500">Loading rooms...</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default MyBooking;