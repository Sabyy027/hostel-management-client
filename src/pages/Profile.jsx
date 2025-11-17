import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../api/axios';

// 1. Define Validation Schema
const profileSchema = Yup.object({
  studentId: Yup.string(),
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
  emergencyContact: Yup.object({
    name: Yup.string(),
    phone: Yup.string(),
    relationship: Yup.string(),
  }),
});

function Profile() {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 2. Setup Formik
  const formik = useFormik({
    initialValues: {
      studentId: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
    },
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSuccess(null);
      try {
        setSubmitting(true);
        // This single POST call will create OR update
        const response = await apiClient.post('/profile', values);
        formik.setValues(response.data); // Update form with saved data
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setApiError('Failed to update profile.');
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 3. Fetch Existing Profile on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profile/me');
        if (response.data && response.data.user) {
          // If a profile exists, set the form values
          formik.setValues(response.data);
        }
        // If no profile (just a message), form stays with initialValues
      } catch (err) {
        setApiError('Failed to load profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // Run only once on mount

  if (loading) {
    return <div className="text-white text-center p-10">Loading profile...</div>;
  }

  // 4. The JSX (it's a big form!)
  return (
    <div className="container mx-auto max-w-3xl p-8 text-white">
      <h1 className="mb-6 text-4xl font-bold">My Profile</h1>
      <p className="mb-6 text-gray-400">
        Update your student information. This will be visible to the hostel admin.
      </p>

      <form onSubmit={formik.handleSubmit} className="rounded-lg bg-gray-800 p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* --- Contact Info --- */}
          <div>
            <label htmlFor="studentId" className="mb-2 block text-sm font-medium text-gray-300">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formik.values.studentId}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-300">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
            {formik.errors.phoneNumber && <p className="mt-1 text-sm text-red-400">{formik.errors.phoneNumber}</p>}
          </div>
        </div>

        {/* --- Address --- */}
        <h2 className="my-6 text-xl font-semibold">Address</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Street</label>
            <input
              type="text"
              name="address.street" // Use dot notation for nested objects
              value={formik.values.address.street}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">City</label>
            <input
              type="text"
              name="address.city"
              value={formik.values.address.city}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">State</label>
            <input
              type="text"
              name="address.state"
              value={formik.values.address.state}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Zip Code</label>
            <input
              type="text"
              name="address.zipCode"
              value={formik.values.address.zipCode}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
        </div>

        {/* --- Emergency Contact --- */}
        <h2 className="my-6 text-xl font-semibold">Emergency Contact</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formik.values.emergencyContact.name}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Phone</label>
            <input
              type="text"
              name="emergencyContact.phone"
              value={formik.values.emergencyContact.phone}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Relationship</label>
            <input
              type="text"
              name="emergencyContact.relationship"
              value={formik.values.emergencyContact.relationship}
              onChange={formik.handleChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
          </div>
        </div>
        
        {/* --- Submit Button --- */}
        <div className="mt-8 text-right">
          {apiError && <p className="mb-4 text-sm text-red-400">{apiError}</p>}
          {success && <p className="mb-4 text-sm text-green-400">{success}</p>}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;