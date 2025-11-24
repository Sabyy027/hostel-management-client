import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';

// We can reuse the same validation schema
const roomValidationSchema = Yup.object({
  roomNumber: Yup.string().required('Room number is required'),
  roomType: Yup.string().oneOf(['single', 'double', 'dormitory']).required('Room type is required'),
  capacity: Yup.number().min(1).required('Capacity is required'),
  price: Yup.number().min(0).required('Price is required'),
  isOccupied: Yup.boolean(),
});

function EditRoomModal({ room, onClose, onUpdateSuccess }) {
  if (!room) return null; // Don't render if no room is selected

  const formik = useFormik({
    // Set initial values from the 'room' prop
    initialValues: {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      price: room.price,
      isOccupied: room.isOccupied,
    },
    validationSchema: roomValidationSchema,
    // This is key: it re-initializes the form when the 'room' prop changes
    enableReinitialize: true, 
    
    onSubmit: (values, { setSubmitting, setErrors }) => {
      // Call the onUpdateSuccess function passed from the parent
      onUpdateSuccess(room._id, values, setSubmitting, setErrors);
    },
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-lg bg-gray-800 p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent closing on content click
      >
        <h2 className="mb-4 text-2xl font-semibold text-white">Edit Room {room.roomNumber}</h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          
          {/* Room Number */}
          <div>
            <label htmlFor="roomNumber" className="mb-2 block text-sm font-medium text-gray-300">Room Number</label>
            <input
              type="text" id="roomNumber" name="roomNumber"
              value={formik.values.roomNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white"
            />
            {formik.touched.roomNumber && formik.errors.roomNumber ? (
              <div className="mt-1 text-sm text-red-400">{formik.errors.roomNumber}</div>
            ) : null}
          </div>
          
          {/* Room Type */}
          <div>
            <label htmlFor="roomType" className="mb-2 block text-sm font-medium text-gray-300">Room Type</label>
            <div className="relative">
              <select
                id="roomType" name="roomType"
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

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-300">Capacity</label>
            <input
              type="number" id="capacity" name="capacity"
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

          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-300">Price (per night)</label>
            <input
              type="number" id="price" name="price"
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
          
          {/* isOccupied Checkbox */}
          <div>
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name="isOccupied"
                checked={formik.values.isOccupied}
                onChange={formik.handleChange}
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600"
              />
              Mark as Occupied
            </label>
          </div>
          
          {formik.errors.apiError && (
            <p className="text-sm text-red-400">{formik.errors.apiError}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-600 px-5 py-2.5 text-center font-medium text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoomModal;