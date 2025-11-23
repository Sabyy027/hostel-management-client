import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { useFormik } from 'formik'; // <-- Import Formik
import * as Yup from 'yup'; // <-- Import Yup
import { ChevronDown } from 'lucide-react';

// --- 1. Define Validation Schema with Yup ---
const roomValidationSchema = Yup.object({
  roomNumber: Yup.string()
    .required('Room number is required')
    .min(2, 'Must be at least 2 characters'),
  roomType: Yup.string()
    .oneOf(['single', 'double', 'dormitory'], 'Invalid room type')
    .required('Room type is required'),
  capacity: Yup.number()
    .min(1, 'Capacity must be at least 1')
    .required('Capacity is required'),
  price: Yup.number()
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
});


function Rooms() {
  // --- State for the list of rooms (this stays the same) ---
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- This logic stays the same ---
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/rooms'); 
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // --- 2. Setup Formik ---
  // We replace all the `useState` hooks for the form!
  const formik = useFormik({
    // Set initial values
    initialValues: {
      roomNumber: '',
      roomType: 'single',
      capacity: 1,
      price: 100,
    },
    // Attach the validation schema
    validationSchema: roomValidationSchema,
    
    // Define the submit function
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(true);
        const response = await apiClient.post('/rooms', values);
        
        // Add the new room to our state
        setRooms((prevRooms) => [...prevRooms, response.data]);
        
        // Reset the form to initial values
        resetForm();

      } catch (err) {
        let apiError = 'Failed to create room.';
        if (err.response && err.response.data && err.response.data.message) {
          apiError = err.response.data.message; // e.g., "Room number already exists."
        }
        // Set a general API error for the form
        setErrors({ apiError: apiError });
        console.error(err);
      } finally {
        setSubmitting(false);
      }

      
    },
  });

  // --- 3. The JSX (Return Statement) ---
  return (
    <div className="container mx-auto max-w-6xl p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Hostel Rooms Management</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* --- Section 1: Create Room Form (Refactored) --- */}
        <div className="md:col-span-1">
          <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Add New Room</h2>
            
            {/* Use formik.handleSubmit */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              
              {/* Room Number Field */}
              <div>
                <label htmlFor="roomNumber" className="mb-2 block text-sm font-medium text-gray-300">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber" // <-- Must match initialValues key
                  value={formik.values.roomNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur} // <-- Triggers validation
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                />
                {/* Show error if field is touched and has an error */}
                {formik.touched.roomNumber && formik.errors.roomNumber ? (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.roomNumber}</div>
                ) : null}
              </div>

              {/* Room Type Field */}
              <div>
                <label htmlFor="roomType" className="mb-2 block text-sm font-medium text-gray-300">Room Type</label>
                <div className="relative">
                  <select
                    id="roomType"
                    name="roomType" // <-- Must match
                    value={formik.values.roomType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 pr-10 text-white appearance-none"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="dormitory">Dormitory</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {formik.touched.roomType && formik.errors.roomType ? (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.roomType}</div>
                ) : null}
              </div>

              {/* Capacity Field */}
              <div>
                <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-300">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity" // <-- Must match
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                  min="1"
                />
                {formik.touched.capacity && formik.errors.capacity ? (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.capacity}</div>
                ) : null}
              </div>
              
              {/* Price Field */}
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-300">Price (per night)</label>
                <input
                  type="number"
                  id="price"
                  name="price" // <-- Must match
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
                  min="0"
                />
                {formik.touched.price && formik.errors.price ? (
                  <div className="mt-1 text-sm text-red-400">{formik.errors.price}</div>
                ) : null}
              </div>
              
              {/* --- Show general API error --- */}
              {formik.errors.apiError && (
                <p className="text-sm text-red-400">{formik.errors.apiError}</p>
              )}
              
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={formik.isSubmitting} // <-- Use Formik's state
              >
                {formik.isSubmitting ? 'Adding...' : 'Add Room'}
              </button>
            </form>
          </div>
        </div>

        {/* --- Section 2: Room List (This stays the same) --- */}
        <div className="md:col-span-2">
          {/* ... (all the code for displaying the room list is unchanged) ... */}
          <h2 className="mb-4 text-2xl font-semibold">Existing Rooms</h2>
          {loading && <p>Loading rooms...</p>}
          {error && <p className="text-red-400">{error}</p>}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {rooms.length === 0 && !loading && (
              <p className="text-gray-400">No rooms found. Add one to get started!</p>
            )}
            {rooms.map((room) => (
              <div key={room._id} className="rounded-lg bg-gray-800 p-4 shadow-lg">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-white">Room {room.roomNumber}</h3>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      room.isOccupied ? 'bg-yellow-600 text-yellow-100' : 'bg-green-600 text-green-100'
                    }`}>
                    {room.isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </div>
                <p className="mt-2 text-gray-300">Type: <span className="capitalize text-white">{room.roomType}</span></p>
                <p className="text-gray-300">Capacity: <span className="text-white">{room.capacity}</span></p>
                <p className="mt-2 text-xl font-semibold text-blue-400">₹{room.price} / night</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;