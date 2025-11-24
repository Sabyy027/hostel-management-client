import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUI } from '../context/UIContext';
import { Link, Navigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Home,
  Sparkles,
  ArrowRight,
  BedDouble,
  Droplets,
  Wind,
  Tag,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
  X,
  Upload,
  Wifi,
  Utensils,
  Shield,
  Zap,
  Coffee,
  Book,
  Dumbbell,
  Package
} from 'lucide-react';

// --- STEP 2 FORM COMPONENT ---
function RegistrationForm({ initialData, onSubmit, onBack }) {
  const { showToast } = useUI();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadError('');
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      fullName: Yup.string().required('Full Name is required'),
      dob: Yup.date().required('Date of Birth is required'),
      mobileNumber: Yup.string().required('Mobile Number is required').min(10, 'Invalid Number'),
      street: Yup.string().required('Street Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string().required('Pincode is required'),
      checkInDate: Yup.date().required('Check-in Date is required').min(new Date(), 'Date must be in future')
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Check if form is valid
      const errors = Object.keys(formik.errors);
      if (errors.length > 0) {
        const firstError = formik.errors[errors[0]];
        showToast(firstError, 'error');
        setSubmitting(false);
        return;
      }
      onSubmit({ ...values, profileImage });
    },
    validateOnChange: false,
    validateOnBlur: true
  });

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden max-w-full">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Complete Your Profile</h1>
              <p className="text-xs text-slate-500">Fill in your details to complete the booking</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('fullName')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.fullName && <p className="text-red-600 text-xs mt-1">{formik.errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    {...formik.getFieldProps('dob')}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.dob && <p className="text-red-600 text-xs mt-1">{formik.errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <div className="relative">
                    <select 
                      {...formik.getFieldProps('gender')} 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    {...formik.getFieldProps('email')} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500" 
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('mobileNumber')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{formik.errors.mobileNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Phone</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('altPhone')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('street')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.street && <p className="text-red-600 text-xs mt-1">{formik.errors.street}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('city')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.city && <p className="text-red-600 text-xs mt-1">{formik.errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('state')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.state && <p className="text-red-600 text-xs mt-1">{formik.errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pincode</label>
                  <input 
                    type="text" 
                    {...formik.getFieldProps('pincode')} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                  {formik.errors.pincode && <p className="text-red-600 text-xs mt-1">{formik.errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Profile Picture (Optional)
              </h3>
              
              {uploadError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {uploadError}
                </div>
              )}

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700">
                    {profileImage?.name}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-slate-700 mb-1">Click to upload your profile picture</p>
                      <p className="text-sm text-slate-500">PNG, JPG or GIF (Max 5MB)</p>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Check-in Date */}
            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
              <label className="block text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Expected Check-in Date
              </label>
              <input 
                type="date" 
                {...formik.getFieldProps('checkInDate')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border border-indigo-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
              {formik.errors.checkInDate && <p className="text-red-600 text-xs mt-2">{formik.errors.checkInDate}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <button 
                type="button" 
                onClick={onBack} 
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={async () => {
                  const errors = await formik.validateForm();
                  if (Object.keys(errors).length > 0) {
                    const errorFields = Object.keys(errors);
                    const missingFields = errorFields.map(field => {
                      const fieldNames = {
                        fullName: 'Full Name',
                        dob: 'Date of Birth',
                        mobileNumber: 'Mobile Number',
                        street: 'Street Address',
                        city: 'City',
                        state: 'State',
                        pincode: 'Pincode',
                        checkInDate: 'Check-in Date'
                      };
                      return fieldNames[field] || field;
                    });
                    showToast(`Please fill in: ${missingFields.join(', ')}`, 'error', 5000);
                    formik.setTouched(errorFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
                  } else {
                    formik.handleSubmit();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2.5 rounded-lg font-semibold shadow-sm transition-all"
              >
                Proceed to Payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// --- MAIN PAGE ---
function MyBooking() {
  const { showToast, showLoading, hideLoading } = useUI();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Redirect non-students to their appropriate dashboard
  if (user.role !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [step, setStep] = useState(-1); // -1: Welcome page, 0: Prefs, 2: Form, 3: Rooms
  const [booking, setBooking] = useState(null);
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [justBooked, setJustBooked] = useState(false); // New state to track if booking was just completed
  
  // User preferences
  const [preferences, setPreferences] = useState({
    acType: '', // 'AC' or 'Non-AC'
    sharing: '' // 1, 2, 3, 4, 5
  });
  
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
      const [myBookingRes, servicesRes] = await Promise.all([
        apiClient.get('/bookings/my'),
        apiClient.get('/services')
      ]);
      
      if (myBookingRes.data && myBookingRes.data._id) {
        setBooking(myBookingRes.data);
        localStorage.setItem('hasBooking', 'true');
      } else {
        localStorage.setItem('hasBooking', 'false');
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
      
      setServices(servicesRes.data || []);
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
    if (!planId) return showToast("Please select a price plan.", 'warning');
    setSelectedRoom(room);
    setSelectedPlanId(planId);
    setStep(2); // Move to Form
  };

  const handleFormSubmit = async (formData) => {
    showLoading('Initializing payment...');
    const res = await loadRazorpay();
    if (!res) {
      hideLoading();
      return showToast('Razorpay SDK failed to load.', 'error');
    }

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
            const { profileImage, ...residentDetails } = formData;
            const verifyRes = await apiClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              roomId: selectedRoom._id,
              planId: selectedPlanId,
              residentDetails // Form data without image
            });
            
            // Upload profile picture if provided
            if (profileImage) {
              try {
                const imageFormData = new FormData();
                imageFormData.append('image', profileImage);
                
                await apiClient.post('/users/upload-profile-picture', imageFormData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                // Update user in localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUserRes = await apiClient.get('/auth/me');
                if (updatedUserRes.data?.user?.photoUrl) {
                  user.photoUrl = updatedUserRes.data.user.photoUrl;
                  localStorage.setItem('user', JSON.stringify(user));
                }
                
                console.log('Profile picture uploaded successfully');
              } catch (uploadErr) {
                console.error('Profile picture upload failed:', uploadErr);
                // Don't block booking completion if image upload fails
              }
            }
            
            hideLoading();
            showToast("Booking Successful! Invoice sent to email.", 'success', 4000);
            setBooking(verifyRes.data.booking);
            setJustBooked(true); // Set flag to show acknowledgement
            
            // Update localStorage to unlock dashboard access
            localStorage.setItem('hasBooking', 'true');
            
            // Dispatch event to unlock sidebar menu items
            window.dispatchEvent(new Event('bookingCompleted'));
            
            setStep(1); // Reset to main view (which will now show "Welcome Home")
            fetchData();

          } catch (err) {
             hideLoading();
             showToast("Payment verified, but server error: " + (err.response?.data?.message || err.message), 'error');
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.mobileNumber },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      hideLoading();
      showToast("Payment Init Failed: " + (err.response?.data?.message || err.message), 'error');
    }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);

  // --- RENDER LOGIC ---
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
        <p className="text-slate-600 font-medium">Loading rooms...</p>
      </div>
    </div>
  );

  // View 1: Dashboard (Already Booked)
  if (booking) {
    // Only show the acknowledgement if the user just completed the booking
    if (!justBooked) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6 overflow-x-hidden max-w-full">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center border border-slate-200">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          {/* Welcome Message */}
          <h1 className="text-4xl font-bold mb-2 text-slate-900">
            Welcome Home!
          </h1>
          <p className="text-base text-slate-600 mb-8">You are successfully booked in</p>

          {/* Room Details Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl mb-6 text-white text-left">
            {/* Room Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BedDouble className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200 font-medium">Your Room</p>
                  <h2 className="text-2xl font-bold text-white">Room {booking.room?.roomNumber}</h2>
                </div>
              </div>
              <span className="px-3 py-1 bg-white text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                {booking.room?.type || 'Standard'}
              </span>
            </div>

            {/* Booking Details */}
            <div className="space-y-2 pt-3 border-t border-white/20">
              <div className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-indigo-200 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-indigo-200">Booking ID:</p>
                  <p className="font-mono text-xs font-semibold text-white break-words overflow-hidden">{booking._id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-200 flex-shrink-0" />
                <p className="text-xs text-white">Invoice sent to your email</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base py-3.5 px-6 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Decorative Text */}
          <p className="text-xs text-slate-500 mt-4">🎉 Your hostel journey begins now!</p>
        </div>
      </div>
    );
  }

  // View -1: Welcome Landing Page (First Time)
  if (step === -1 && !booking) {
    const amenityIcons = {
      'WiFi': Wifi,
      'Mess': Utensils,
      'Security': Shield,
      'Power Backup': Zap,
      'Common Room': Coffee,
      'Library': Book,
      'Gym': Dumbbell
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-x-hidden">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to HMS! 
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Start your hostel journey by booking your perfect room and exploring our premium amenities
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {/* Book Room Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-indigo-100 rounded-2xl">
                  <BedDouble className="w-10 h-10 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Book Your Room</h2>
                  <p className="text-slate-600">Find your perfect space</p>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Choose from AC/Non-AC rooms</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Single to 5-sharing options</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Flexible pricing plans</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Instant booking confirmation</span>
                </li>
              </ul>

              <button
                onClick={() => setStep(0)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Start Booking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Available Services</h2>
                  <p className="text-slate-600">Premium amenities for you</p>
                </div>
              </div>

              {services.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {services.slice(0, 4).map(service => {
                    const IconComponent = amenityIcons[service.name] || Package;
                    return (
                      <div key={service._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <IconComponent className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{service.name}</p>
                            <p className="text-xs text-slate-500">{service.period}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-indigo-600">₹{service.price}</span>
                      </div>
                    );
                  })}
                  {services.length > 4 && (
                    <p className="text-sm text-slate-500 text-center pt-2">
                      +{services.length - 4} more services available
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Services will be available after booking</p>
                </div>
              )}

              <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <span className="font-semibold">💡 Pro Tip:</span> You can add these services anytime after booking your room!
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Why Choose Us?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">24/7 Security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                <Wifi className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">High-Speed WiFi</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                <Utensils className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Quality Mess</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Power Backup</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-white/80 text-sm">
              Have questions? Contact support for assistance
            </p>
          </div>
        </div>
      </div>
    );
  }

  // View 0: Preference Selection
  if (step === 0 && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 flex items-center justify-center p-6 overflow-x-hidden max-w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <BedDouble className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Room Preferences</h1>
            <p className="text-slate-600">Tell us what you're looking for</p>
          </div>

          <div className="space-y-6">
            {/* AC Type Preference */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Wind className="w-5 h-5 text-indigo-600" />
                Room Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPreferences({ ...preferences, acType: 'AC' })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    preferences.acType === 'AC'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Droplets className={`w-8 h-8 mx-auto mb-3 ${
                    preferences.acType === 'AC' ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 mb-1">AC Room</h3>
                    <p className="text-xs text-slate-600">Air conditioned comfort</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setPreferences({ ...preferences, acType: 'Non-AC' })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    preferences.acType === 'Non-AC'
                      ? 'border-slate-500 bg-slate-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Wind className={`w-8 h-8 mx-auto mb-3 ${
                    preferences.acType === 'Non-AC' ? 'text-slate-600' : 'text-slate-400'
                  }`} />
                  <div className="text-center">
                    <h3 className="font-bold text-slate-900 mb-1">Non-AC Room</h3>
                    <p className="text-xs text-slate-600">Natural ventilation</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Room Sharing Preference */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Room Sharing
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map(capacity => (
                  <button
                    key={capacity}
                    onClick={() => setPreferences({ ...preferences, sharing: capacity })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.sharing === capacity
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${
                        preferences.sharing === capacity ? 'text-indigo-600' : 'text-slate-900'
                      }`}>
                        {capacity}
                      </div>
                      <div className="text-xs text-slate-600">
                        {capacity === 1 ? 'Single' : 'Sharing'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                if (!preferences.acType || !preferences.sharing) {
                  showToast('Please select both room type and sharing preference', 'warning');
                  return;
                }
                setStep(1);
              }}
              disabled={!preferences.acType || !preferences.sharing}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                preferences.acType && preferences.sharing
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Room Selection
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
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
    <div className="min-h-screen bg-slate-50 overflow-x-hidden max-w-full">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
              <BedDouble className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">Select Your Room</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Showing {preferences.acType} rooms with {preferences.sharing} {preferences.sharing === 1 ? 'person' : 'sharing'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStep(0)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-xs sm:text-sm flex-shrink-0 ml-2"
          >
            <Wind className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Change Preferences</span>
            <span className="sm:hidden">Change</span>
          </button>
        </div>
      </header>

      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full">
        {/* Property Selector Pills */}
        {structure.length > 0 && (
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              {structure.map(block => (
                <button 
                  key={block._id} 
                  onClick={() => setActiveBlockId(block._id)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeBlockId === block._id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Building2 size={16} />
                  {block.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Room Cards by Floor */}
        {getActiveBlockData() ? (
          <div className="space-y-6">
            {(() => {
              const floors = getActiveBlockData().floors;
              const hasAnyRooms = floors.some(floor => {
                const filteredRooms = floor.rooms.filter(r => {
                  if (r.isStaffRoom) return false;
                  if (preferences.acType && r.type !== preferences.acType) return false;
                  if (preferences.sharing && r.capacity !== preferences.sharing) return false;
                  return true;
                });
                return filteredRooms.length > 0;
              });

              if (!hasAnyRooms) {
                return (
                  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                      <BedDouble className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Rooms Available</h3>
                    <p className="text-slate-600 mb-6">
                      No rooms match your preferences ({preferences.acType}, {preferences.sharing} {preferences.sharing === 1 ? 'person' : 'sharing'}) in {getActiveBlockData().name}
                    </p>
                    <button
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Wind className="w-4 h-4" />
                      Change Preferences
                    </button>
                  </div>
                );
              }

              return floors.map(floor => {
              // Filter rooms based on preferences
              const filteredRooms = floor.rooms.filter(r => {
                if (r.isStaffRoom) return false;
                if (preferences.acType && r.type !== preferences.acType) return false;
                if (preferences.sharing && r.capacity !== preferences.sharing) return false;
                return true;
              });
              
              const availableRooms = filteredRooms.filter(r => !r.isOccupied).length;
              const totalRooms = filteredRooms.length;
              
              // Skip floor if no rooms match the preferences
              if (totalRooms === 0) return null;

              return (
                <div key={floor._id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {/* Floor Header */}
                  <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-200 ${
                    floor.acType === 'AC' ? 'bg-blue-50' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        floor.acType === 'AC' ? 'bg-blue-100' : 'bg-slate-200'
                      }`}>
                        {floor.acType === 'AC' ? (
                          <Droplets className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Wind className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{floor.name}</h3>
                        <p className="text-xs text-slate-600">
                          {floor.acType} • {availableRooms} Available of {totalRooms} Rooms
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Room Grid */}
                  <div className="p-3 sm:p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {filteredRooms.map(room => {
                      
                      return (
                        <div 
                          key={room._id} 
                          className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                        >
                          {/* SALE Badge */}
                          {room.activeDiscount && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              SALE
                            </div>
                          )}

                          {/* Room Number */}
                          <div className="text-center mb-3">
                            <div className="text-2xl font-bold text-slate-900 mb-1">
                              {room.roomNumber}
                            </div>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
                              <Users className="w-3.5 h-3.5" />
                              <span>{room.capacity} Sharing</span>
                            </div>
                          </div>

                          {/* Room Features */}
                          <div className="flex items-center justify-center gap-2 mb-3">
                            {room.acType === 'AC' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                AC
                              </span>
                            )}
                            {room.bathroomType === 'Attached' && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                Attached Bath
                              </span>
                            )}
                          </div>

                          {/* Price Plan Selector */}
                          {room.pricingPlans?.length > 0 ? (
                            <div className="relative mb-3">
                              <select 
                                className="w-full bg-white text-slate-900 text-sm p-2.5 pr-10 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors font-medium appearance-none"
                                value={selectedPlansMap[room._id] || ''}
                                onChange={(e) => setSelectedPlansMap({ ...selectedPlansMap, [room._id]: e.target.value })}
                              >
                                {room.pricingPlans.map(p => {
                                  const finalPrice = getDiscountedPrice(p.price, room.activeDiscount);
                                  return (
                                    <option key={p._id} value={p._id}>
                                      {p.duration} {p.unit} - ₹{finalPrice}
                                      {room.activeDiscount && ` (₹${p.price})`}
                                    </option>
                                  );
                                })}
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-red-600 text-xs mb-3 bg-red-50 py-2 rounded-lg font-medium text-center border border-red-200">
                              No pricing available
                            </div>
                          )}
                          
                          {/* Action Button */}
                          {room.isOccupied ? (
                            <div className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg py-2.5 font-semibold text-sm">
                              <Users className="w-4 h-4" />
                              Occupied
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleRoomSelect(room)} 
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-sm"
                            >
                              Book Now
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
            })()}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
            <Loader2 className="w-12 h-12 mx-auto text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading rooms...</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default MyBooking;