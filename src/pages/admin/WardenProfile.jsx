import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { User, Phone, MapPin, Calendar, Camera, Trash2, Upload } from 'lucide-react';

const WardenProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWarden = user.role === 'warden' || user.role === 'resident tutor';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/auth/me');
      setProfileData(data.user);
      setProfilePicUrl(data.user.photoUrl);
      
      formik.setValues({
        phoneNumber: data.user.phoneNumber || '',
        age: data.user.age || '',
        address: data.user.address || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    age: Yup.number()
      .min(18, 'Age must be at least 18')
      .max(100, 'Age must be less than 100')
      .required('Age is required'),
    address: Yup.string()
      .min(10, 'Address must be at least 10 characters')
      .required('Address is required')
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      age: '',
      address: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setUpdating(true);
        await axios.put('/auth/update-profile', values);
        
        const updatedUser = { ...profileData, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileData(updatedUser);
        
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setUpdating(false);
      }
    }
  });

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post('/users/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfilePicUrl(data.imageUrl);
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.photoUrl = data.imageUrl;
      localStorage.setItem('user', JSON.stringify(user));
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      setUploading(true);
      await axios.delete('/users/delete-profile-picture');

      setProfilePicUrl(null);
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.photoUrl = null;
      localStorage.setItem('user', JSON.stringify(user));
      
      alert('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      alert(error.response?.data?.message || 'Failed to delete profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isWarden ? 'from-teal-600 to-cyan-600' : 'from-indigo-600 to-purple-600'} rounded-lg shadow-xl p-6`}>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/90">Manage your personal information</p>
        </div>

        {/* Profile Picture Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover border-4 ${isWarden ? 'border-teal-500' : 'border-indigo-500'}`}
                />
              ) : (
                <div className={`w-32 h-32 bg-gradient-to-br ${isWarden ? 'from-teal-500 to-cyan-500' : 'from-indigo-500 to-purple-500'} text-white rounded-full flex items-center justify-center text-4xl font-bold border-4 ${isWarden ? 'border-teal-600' : 'border-indigo-600'}`}>
                  {(profileData?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-400 mb-4">JPG, PNG or GIF. Max size 5MB</p>
              
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
                
                {profilePicUrl ? (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`flex items-center gap-2 px-4 py-2 ${isWarden ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Camera size={16} />
                      Change Picture
                    </button>
                    <button
                      onClick={handleDeleteProfilePicture}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`flex items-center gap-2 px-4 py-2 ${isWarden ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Upload size={16} />
                    Upload Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information - Read Only */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User size={20} className={isWarden ? 'text-teal-400' : 'text-indigo-400'} />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 rounded-lg border border-slate-700">
                {profileData?.username || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 rounded-lg border border-slate-700">
                {profileData?.email || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 rounded-lg border border-slate-700 capitalize">
                {profileData?.gender || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 rounded-lg border border-slate-700 capitalize">
                {profileData?.role || 'N/A'}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Designation</label>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 rounded-lg border border-slate-700 capitalize">
                {profileData?.designation || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Editable Contact Information */}
        <form onSubmit={formik.handleSubmit} className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Phone size={20} className={isWarden ? 'text-teal-400' : 'text-indigo-400'} />
            Contact Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter 10-digit phone number"
                className={`w-full px-4 py-3 bg-slate-900 text-white rounded-lg border ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-red-500 focus:border-red-500'
                    : `border-slate-700 ${isWarden ? 'focus:border-teal-500 focus:ring-teal-500/20' : 'focus:border-indigo-500 focus:ring-indigo-500/20'}`
                } focus:outline-none focus:ring-2`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Calendar size={16} className={isWarden ? 'text-teal-400' : 'text-indigo-400'} />
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your age"
                className={`w-full px-4 py-3 bg-slate-900 text-white rounded-lg border ${
                  formik.touched.age && formik.errors.age
                    ? 'border-red-500 focus:border-red-500'
                    : `border-slate-700 ${isWarden ? 'focus:border-teal-500 focus:ring-teal-500/20' : 'focus:border-indigo-500 focus:ring-indigo-500/20'}`
                } focus:outline-none focus:ring-2`}
              />
              {formik.touched.age && formik.errors.age && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <MapPin size={16} className={isWarden ? 'text-teal-400' : 'text-indigo-400'} />
                Address *
              </label>
              <textarea
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your address"
                rows={3}
                className={`w-full px-4 py-3 bg-slate-900 text-white rounded-lg border ${
                  formik.touched.address && formik.errors.address
                    ? 'border-red-500 focus:border-red-500'
                    : `border-slate-700 ${isWarden ? 'focus:border-teal-500 focus:ring-teal-500/20' : 'focus:border-indigo-500 focus:ring-indigo-500/20'}`
                } focus:outline-none focus:ring-2 resize-none`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.address}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={updating || !formik.isValid}
              className={`px-6 py-3 ${isWarden ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default WardenProfile;
