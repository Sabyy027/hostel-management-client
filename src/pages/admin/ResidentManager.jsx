import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { User, MapPin, Phone, Mail, Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';

function ResidentManager() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResident, setSelectedResident] = useState(null);

  // Filter states
  const [filterBlock, setFilterBlock] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterRT, setFilterRT] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/resident/dashboard-view');
      setResidents(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Get unique values for filters
  const uniqueBlocks = [...new Set(residents.map(r => r.block?.name).filter(Boolean))];
  const uniqueFloors = [...new Set(residents.map(r => r.floor?.name).filter(Boolean))];
  const uniqueRooms = [...new Set(residents.map(r => r.room?.roomNumber).filter(Boolean))];
  const uniqueRTs = [...new Set(residents.map(r => r.assignedRT?.name).filter(Boolean))];
  
  // Apply filters
  const filteredResidents = residents.filter(resident => {
    if (filterBlock && resident.block?.name !== filterBlock) return false;
    if (filterFloor && resident.floor?.name !== filterFloor) return false;
    if (filterRoom && resident.room?.roomNumber !== filterRoom) return false;
    if (filterRT && resident.assignedRT?.name !== filterRT) return false;
    if (filterStatus && resident.status !== filterStatus) return false;
    return true;
  });

  const clearFilters = () => {
    setFilterBlock('');
    setFilterFloor('');
    setFilterRoom('');
    setFilterRT('');
    setFilterStatus('');
  };

  const handleSendReminder = async (student) => {
    if (!window.confirm(`Send payment reminder to ${student.name}?`)) return;
    try {
      await apiClient.post('/billing/send-reminder', {
        studentId: student._id,
        email: student.email,
        name: student.name,
        amount: student.pendingDues
      });
      alert("Reminder Email Sent!");
    } catch (err) { alert("Failed to send email"); }
  };

  const getResidentIcon = (gender) => {
    if (gender === 'Male') return '👨';
    if (gender === 'Female') return '👩';
    return '👤';
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700';
    if (status === 'Vacated') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading residents...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resident Overview</h1>
          <p className="text-sm text-slate-500">Comprehensive resident management dashboard</p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
            </div>
            <button 
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Block Filter */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Block</label>
              <select 
                value={filterBlock}
                onChange={(e) => setFilterBlock(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All Blocks</option>
                {uniqueBlocks.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>

            {/* Floor Filter */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Floor</label>
              <select 
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All Floors</option>
                {uniqueFloors.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>

            {/* Room Filter */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Room</label>
              <select 
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All Rooms</option>
                {uniqueRooms.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            {/* RT Filter */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Resident Tutor</label>
              <select 
                value={filterRT}
                onChange={(e) => setFilterRT(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All RTs</option>
                {uniqueRTs.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Vacated">Vacated</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Filter Results Count */}
          <div className="mt-3 text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredResidents.length}</span> of <span className="font-semibold text-slate-700">{residents.length}</span> residents
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Resident Type</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Room</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Tickets</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Dues / Action</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Assigned RT</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">Check-In Date</th>
                <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map(res => (
                <tr key={res._id} className="hover:bg-slate-50 transition-colors">
                  {/* 1. RESIDENT TYPE + INFO ICON */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getResidentIcon(res.gender)}</div>
                      <div>
                        <div className="font-semibold text-slate-800">{res.name}</div>
                        <div className="text-xs text-slate-500">{res.gender || 'N/A'}</div>
                      </div>
                      {/* INFO ICON */}
                      <button 
                        onClick={() => setSelectedResident(res)}
                        className="ml-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                        title="View full details"
                      >
                        <User size={18} />
                      </button>
                    </div>
                  </td>

                  {/* 2. ROOM NO WITH HOVER */}
                  <td className="p-4 relative">
                    {res.room ? (
                      <div className="relative inline-block group">
                        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg cursor-pointer">
                          <span>🚪</span>
                          {res.room.roomNumber}
                        </div>
                        {/* HOVER TOOLTIP */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="bg-slate-800 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">Floor:</span>
                                <span className="font-semibold">{res.floor?.name || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">Block:</span>
                                <span className="font-semibold">{res.block?.name || 'N/A'}</span>
                              </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full">
                              <div className="border-4 border-transparent border-t-slate-800"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded">No Room</span>
                    )}
                  </td>

                  {/* 3. TICKETS */}
                  <td className="p-4">
                    {res.activeTickets > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-100 font-semibold text-xs px-2.5 py-1 rounded-full">
                        <span>⚠️</span>
                        {res.activeTickets} Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 text-xs px-2.5 py-1 rounded-full font-medium">
                        <span>✓</span>
                        No Issues
                      </span>
                    )}
                  </td>

                  {/* 4. DUES + ACTION COMBINED */}
                  <td className="p-4">
                    {res.pendingDues > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="text-red-700 font-mono font-bold bg-red-50 px-3 py-1 rounded-lg text-sm">
                          ₹{res.pendingDues}
                        </div>
                        <button 
                          onClick={() => handleSendReminder(res)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors"
                          title="Send Reminder"
                        >
                          📧
                        </button>
                      </div>
                    ) : (
                      <div className="text-emerald-700 text-xs bg-emerald-50 inline-block px-3 py-1 rounded-lg font-medium">
                        ✓ Settled
                      </div>
                    )}
                  </td>

                  {/* 5. ASSIGNED RT */}
                  <td className="p-4">
                    {res.assignedRT ? (
                      <div className="text-sm">
                        <div className="font-semibold text-slate-800">{res.assignedRT.name}</div>
                        <div className="text-xs text-slate-500">{res.assignedRT.email}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Not Assigned</span>
                    )}
                  </td>

                  {/* 6. CHECK-IN DATE */}
                  <td className="p-4">
                    {res.checkInDate ? (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(res.checkInDate).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">--</span>
                    )}
                  </td>

                  {/* 7. STATUS */}
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(res.status)}`}>
                      {res.status === 'Active' && <CheckCircle size={14} />}
                      {res.status === 'Vacated' && <XCircle size={14} />}
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResidents.length === 0 && residents.length > 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-slate-500 font-medium">No residents match your filters</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting or clearing your filters</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {residents.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <p className="text-slate-500 font-medium">No residents found</p>
              <p className="text-sm text-slate-400 mt-1">Resident data will appear here once bookings are made</p>
            </div>
          )}
        </div>
      </div>

      {/* RESIDENT DETAILS MODAL */}
      {selectedResident && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedResident(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-3xl">{getResidentIcon(selectedResident.gender)}</span>
                  {selectedResident.name}
                </h2>
                <p className="text-slate-500 text-sm mt-1">Complete Resident Profile</p>
              </div>
              <button 
                onClick={() => setSelectedResident(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="text-sm font-medium">{selectedResident.email}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Phone</div>
                  <div className="text-sm font-medium">{selectedResident.profile?.phoneNumber || 'N/A'}</div>
                </div>
              </div>

              {/* Address */}
              {selectedResident.profile?.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-1" />
                  <div>
                    <div className="text-xs text-slate-500">Address</div>
                    <div className="text-sm font-medium">
                      {selectedResident.profile.address.street && `${selectedResident.profile.address.street}, `}
                      {selectedResident.profile.address.city && `${selectedResident.profile.address.city}, `}
                      {selectedResident.profile.address.state} 
                      {selectedResident.profile.address.zipCode && ` - ${selectedResident.profile.address.zipCode}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Gender & Age */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-slate-500">Gender</div>
                  <div className="text-sm font-medium">{selectedResident.gender || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Age</div>
                  <div className="text-sm font-medium">{selectedResident.profile?.age || 'N/A'}</div>
                </div>
              </div>

              {/* Room Details */}
              {selectedResident.room && (
                <div className="pt-4 border-t">
                  <div className="text-xs text-slate-500 mb-2">Room Details</div>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-1">
                    <div><strong>Room:</strong> {selectedResident.room.roomNumber}</div>
                    <div><strong>Floor:</strong> {selectedResident.floor?.name || 'N/A'}</div>
                    <div><strong>Block:</strong> {selectedResident.block?.name || 'N/A'}</div>
                    <div><strong>Type:</strong> {selectedResident.room.type}</div>
                    <div><strong>Capacity:</strong> {selectedResident.room.capacity} beds</div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setSelectedResident(null)}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ResidentManager;