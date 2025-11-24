import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { UserPlus, Link as LinkIcon, Copy, Users, Mail, Phone, MapPin, Briefcase, ChevronDown, X, Trash2, User, Calendar } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useUI } from '../../context/UIContext';

function StaffManager() {
  const { showToast } = useUI();
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'link'
  const [staffList, setStaffList] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Detailed Form State
  const [form, setForm] = useState({
    username: '', email: '', age: '', gender: 'Male', phoneNumber: '', 
    altPhoneNumber: '', address: '', designation: 'Electrician'
  });

  const fetchStaff = async () => {
    try {
      const res = await apiClient.get('/users/staff');
      setStaffList(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStaff(); }, []);
  const handleDirectCreate = async (e) => {
    e.preventDefault();
    
    try {
      await apiClient.post('/users/create-staff-direct', form);
      showToast('Staff created successfully! Credentials sent via email.', 'success');
      fetchStaff();
      setForm({ username: '', email: '', age: '', gender: 'Male', phoneNumber: '', altPhoneNumber: '', address: '', designation: 'Electrician' });
    } catch (err) { 
      console.error('Full error:', err);
      showToast(err.response?.data?.message || 'Failed to create staff member', 'error'); 
    }
  };
  const generateLink = async () => {
    try {
      const res = await apiClient.post('/users/generate-invite');
      setInviteLink(res.data.link);
      showToast('Invite link generated successfully', 'success');
    } catch (err) { 
      showToast('Failed to generate invite link', 'error'); 
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleRemoveStaff = async (staffId, staffName) => {
    try {
      await apiClient.delete(`/users/staff/${staffId}`);
      showToast(`${staffName} removed successfully`, 'success');
      fetchStaff();
      setShowModal(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error('Error removing staff:', err);
      showToast(err.response?.data?.message || 'Failed to remove staff member', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Staff</h1>
          <p className="text-sm text-slate-500">Create and manage staff accounts</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {/* TABS */}
        <div className="flex border-b border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('direct')} 
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'direct' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Direct Add
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('link')} 
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'link' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Invite Link
            </div>
          </button>
        </div>

        {/* --- METHOD 1 FORM --- */}
        {activeTab === 'direct' && (
          <form onSubmit={handleDirectCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={form.username} 
              onChange={e => setForm({...form, username: e.target.value})} 
              required 
            />
            
            <input 
              type="email" 
              placeholder="Email (Login ID)" 
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
            
            <input 
              type="text" 
              placeholder="Phone Number" 
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={form.phoneNumber} 
              onChange={e => setForm({...form, phoneNumber: e.target.value})} 
              required 
            />

            <input 
              type="text" 
              placeholder="Alt Phone (Optional)" 
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={form.altPhoneNumber} 
              onChange={e => setForm({...form, altPhoneNumber: e.target.value})} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Age" 
                className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                value={form.age} 
                onChange={e => setForm({...form, age: e.target.value})} 
                required 
              />
              
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
                  value={form.gender} 
                  onChange={e => setForm({...form, gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <select 
                className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none" 
                value={form.designation} 
                onChange={e => setForm({...form, designation: e.target.value})}
              >
                <option>Electrician</option>
                <option>Plumber</option>
                <option>Carpenter</option>
                <option>Cleaner</option>
                <option>Warden</option>
                <option>Resident Tutor</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <textarea 
              placeholder="Full Address" 
              className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-20"
              value={form.address} 
              onChange={e => setForm({...form, address: e.target.value})} 
              required 
            />

            <button 
              type="submit" 
              className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create & Send Credentials
            </button>
          </form>
        )}

        {/* --- METHOD 2 GENERATOR --- */}
        {activeTab === 'link' && (
          <div className="text-center py-8">
            <LinkIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 mb-6">Generate a unique link for staff to register themselves</p>
            <button 
              onClick={generateLink} 
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-bold text-white transition-colors flex items-center gap-2 mx-auto mb-6"
            >
              <LinkIcon className="w-5 h-5" />
              Generate New Link
            </button>
            
            {inviteLink && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between max-w-2xl mx-auto">
                <code className="text-indigo-600 text-sm overflow-hidden text-ellipsis flex-1">{inviteLink}</code>
                <button 
                  onClick={copyLink} 
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff List Display */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-slate-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Staff Directory</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffList.map(staff => (
          <div 
            key={staff._id} 
            onClick={() => handleStaffClick(staff)}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-indigo-600">{staff.username.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800">{staff.username}</div>
                  <div className="flex items-center gap-1 text-indigo-600 text-xs font-medium mt-1">
                    <Briefcase className="w-3 h-3" />
                    {staff.designation}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {staff.phoneNumber}
              </div>
              {staff.role === 'rt' && staff.assignedFloors && staff.assignedFloors.length > 0 && (
                <div className="flex items-center gap-2 text-teal-600 text-xs mt-2 bg-teal-50 px-2 py-1 rounded">
                  <MapPin className="w-3 h-3" />
                  {staff.assignedFloors.length} Floor{staff.assignedFloors.length > 1 ? 's' : ''} Assigned
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Details Modal */}
      {showModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{selectedStaff.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStaff.username}</h2>
                    <div className="flex items-center gap-2 text-indigo-100 mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">{selectedStaff.designation}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <p className="text-sm font-medium text-slate-800">{selectedStaff.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-sm font-medium text-slate-800">{selectedStaff.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  {selectedStaff.altPhoneNumber && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Alternative Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-medium text-slate-800">{selectedStaff.altPhoneNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Age</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <p className="text-sm font-medium text-slate-800">{selectedStaff.age || 'Not provided'} years</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{selectedStaff.gender || 'Not provided'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Role</p>
                    <p className="text-sm font-medium text-slate-800 capitalize">{selectedStaff.role}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selectedStaff.address && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Address
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-700">{selectedStaff.address}</p>
                  </div>
                </div>
              )}

              {/* Assigned Floors (RT Only) */}
              {selectedStaff.role === 'rt' && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    Assigned Floors
                  </h3>
                  {selectedStaff.assignedFloors && selectedStaff.assignedFloors.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedStaff.assignedFloors.map((floor) => (
                        <div key={floor._id} className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                          <p className="text-sm font-semibold text-teal-900">{floor.name}</p>
                          <p className="text-xs text-teal-600">Floor {floor.number}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-500">No floors assigned yet</p>
                      <p className="text-xs text-slate-400 mt-1">Assign floors from the Occupancy Dashboard</p>
                    </div>
                  )}
                </div>
              )}

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Created At</p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(selectedStaff.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">User ID</p>
                    <p className="text-xs font-mono text-slate-600">{selectedStaff._id}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleRemoveStaff(selectedStaff._id, selectedStaff.username)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
export default StaffManager;