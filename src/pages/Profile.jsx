import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../api/axios';
import { User, Phone, MapPin, AlertCircle, Save, Loader2, CheckCircle2, Camera, Trash2, Upload } from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

// Define Validation Schema
const profileSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, 'Must be at least 10 digits')
    .max(15, 'Must be 15 digits or less'),
  address: Yup.object({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
  }),
});

function Profile() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Setup Formik
  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSuccess(null);
      try {
        setSubmitting(true);
        const response = await apiClient.post('/profile', values);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setApiError('Failed to update profile.');
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch Profile and User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await apiClient.get('/auth/me');
        const user = userResponse.data.user || userResponse.data;
        setProfilePicUrl(user.photoUrl || null);

        // Fetch profile data
        let profile = {};
        try {
          const profileResponse = await apiClient.get('/profile/me');
          // Check if response has actual profile data (not just a message)
          if (profileResponse.data && !profileResponse.data.message && profileResponse.data._id) {
            profile = profileResponse.data;
          }
        } catch (profileErr) {
          console.log('No profile found yet:', profileErr);
          // Profile doesn't exist yet, that's okay
        }
        
        // Combine user and profile data
        const combinedData = {
          ...user,
          fullName: profile.fullName || user.username,
          dateOfBirth: profile.dateOfBirth,
          age: profile.age,
          gender: profile.gender || user.gender,
          phoneNumber: profile.phoneNumber,
          altPhone: profile.altPhone,
          address: profile.address
        };
        
        console.log('Combined user data:', combinedData); // Debug log
        setUserData(combinedData);

        // Set form values
        if (profile && profile.phoneNumber) {
          formik.setValues({
            phoneNumber: profile.phoneNumber || '',
            address: {
              street: profile.address?.street || '',
              city: profile.address?.city || '',
              state: profile.address?.state || '',
              zipCode: profile.address?.zipCode || '',
            },
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setApiError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setApiError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setApiError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setApiError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await apiClient.post('/users/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfilePicUrl(response.data.photoUrl);
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.photoUrl = response.data.photoUrl;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error uploading profile picture');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle profile picture delete
  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setUploading(true);
    setApiError(null);
    setSuccess(null);

    try {
      await apiClient.delete('/users/delete-profile-picture');
      setProfilePicUrl(null);
      setSuccess('Profile picture removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.photoUrl = null;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      setApiError(error.response?.data?.message || 'Error deleting profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSyncFromBooking = async () => {
    setSyncLoading(true);
    setApiError(null);
    setSuccess(null);

    try {
      const response = await apiClient.post('/profile/sync-from-booking');
      setSuccess('Profile synced successfully from your booking!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh the page data
      await fetchData();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Could not sync profile. Make sure you have a booking.');
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="bg-slate-50">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="text-indigo-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                <p className="text-xs text-slate-500">View and update your information</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              {/* Profile Picture Display */}
              <div className="relative">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-200 shadow-md">
                    {userData?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-3">
                  Upload a profile picture. Recommended size: 400x400px. Max size: 5MB.
                </p>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" />
                    {profilePicUrl ? 'Change Picture' : 'Upload Picture'}
                  </button>
                  {profilePicUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteProfilePicture}
                      disabled={uploading}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card (Read-only) */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Account Information
            </h2>
            
            {!userData?.fullName && !userData?.dateOfBirth && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Complete Your Profile</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your detailed profile information will be available after you complete a room booking.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSyncFromBooking}
                  disabled={syncLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {syncLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Already have a booking? Click to sync
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.fullName || userData?.username || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Username</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.username || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.email || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Date of Birth</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.dateOfBirth 
                    ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Age</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.age || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Gender</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.gender || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Alternate Phone</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                  {userData?.altPhone || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 capitalize">
                  {userData?.role || 'Student'}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Profile Form */}
          <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6">
            {/* Contact Information */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    placeholder="Enter your phone number"
                  />
                  {formik.errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formik.errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formik.values.address.street}
                    onChange={formik.handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formik.values.address.city}
                    onChange={formik.handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formik.values.address.state}
                    onChange={formik.handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formik.values.address.zipCode}
                    onChange={formik.handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {apiError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{apiError}</span>
              </div>
            )}
            {success && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Profile;