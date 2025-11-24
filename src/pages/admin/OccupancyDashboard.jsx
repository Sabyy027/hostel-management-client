import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Building2, Users, UserCheck, Droplets, Wind, X, ChevronDown } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useUI } from '../../context/UIContext';

function OccupancyDashboard() {
  const { showToast } = useUI();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isWarden = user.role === 'warden';
  const isRT = user.role === 'rt';
  
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rts, setRts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/rooms/structure');
      setStructure(res.data);
      if (res.data.length > 0 && !activeBlockId) {
        setActiveBlockId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRTs = async () => {
    if (!isAdmin && !isWarden) return;
    try {
      const res = await apiClient.get('/users/staff');
      console.log('📋 All staff fetched:', res.data);
      console.log('📋 Filtering for role === rt');
      const rtList = res.data.filter(s => {
        console.log(`User: ${s.username}, Role: ${s.role}, Designation: ${s.designation}`);
        return s.role === 'rt';
      });
      console.log('✅ Filtered RTs:', rtList);
      setRts(rtList);
    } catch (err) {
      console.error('Error fetching RTs:', err);
    }
  };

  const fetchAssignments = async () => {
    if (!isAdmin) return;
    try {
      const res = await apiClient.get('/floors/assignments');
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  useEffect(() => { 
    fetchData(); 
    fetchRTs();
    fetchAssignments();
  }, []);

  const handleAssignRT = async (floorId, rtId) => {
    try {
      if (!rtId) {
        // Unassign
        await apiClient.delete(`/floors/unassign-rt/${floorId}`);
        showToast('RT unassigned successfully', 'success');
      } else {
        // Assign
        await apiClient.post('/floors/assign-rt', { floorId, rtId });
        showToast('RT assigned successfully', 'success');
      }
      fetchAssignments(); // Refresh assignments
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);
  const getRoomColor = (room) => {
    if (room.isStaffRoom) return 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100';
    if (room.isOccupied) return 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100';
    return 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100';
  };

  // Calculate stats
  const totalRooms = structure.reduce((sum, block) => 
    sum + block.floors.reduce((fsum, floor) => fsum + floor.rooms.length, 0), 0
  );
  const occupiedRooms = structure.reduce((sum, block) => 
    sum + block.floors.reduce((fsum, floor) => 
      fsum + floor.rooms.filter(r => !r.isStaffRoom && r.occupants && r.occupants.length > 0).length, 0
    ), 0
  );
  const staffRooms = structure.reduce((sum, block) => 
    sum + block.floors.reduce((fsum, floor) => 
      fsum + floor.rooms.filter(r => r.isStaffRoom).length, 0
    ), 0
  );
  const availableRooms = totalRooms - occupiedRooms - staffRooms;
  const totalBlocks = structure.length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="text-indigo-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {isAdmin ? 'Occupancy & RT Assignment' : 'Occupancy Dashboard'}
                </h1>
                <p className="text-xs text-slate-500">
                  {isAdmin 
                    ? 'Assign Resident Tutors to floors and monitor occupancy' 
                    : isRT 
                    ? 'View occupancy for your assigned floors' 
                    : 'Visual room map and availability'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Rooms</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalRooms}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Building2 className="text-indigo-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Occupied</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{occupiedRooms}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <Users className="text-red-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Available</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{availableRooms}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Users className="text-emerald-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Staff Rooms</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{staffRooms}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UserCheck className="text-purple-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Property Selector Pills */}
          {structure.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
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

          {/* Floor Cards */}
          {getActiveBlockData() ? (
            <div className="space-y-6">
              {getActiveBlockData().floors.map(floor => {
                const rtAssigned = assignments.find(a => a.floor === floor._id);
                const rtName = rtAssigned
                  ? rts.find(r => r._id === rtAssigned.rt)?.username || rts.find(r => r._id === rtAssigned.rt)?.name || 'Unknown'
                  : null;

                const occupied = floor.rooms.filter(r => !r.isStaffRoom && r.occupants?.length > 0).length;
                const staff = floor.rooms.filter(r => r.isStaffRoom).length;
                const available = floor.rooms.length - occupied - staff;

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
                            {floor.acType} • {occupied} Occupied • {available} Available • {staff} Staff
                          </p>
                        </div>
                      </div>
                      
                      {/* RT Assignment (Admin Only) */}
                      {isAdmin && (
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <div className="relative">
                            <select
                              value={rtAssigned?.rt || ''}
                              onChange={(e) => handleAssignRT(floor._id, e.target.value)}
                              className="px-3 py-1.5 pr-8 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                            >
                              <option value="">Assign RT...</option>
                              {rts.map(rt => (
                                <option key={rt._id} value={rt._id}>
                                  {rt.username || rt.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                          {rtName && (
                            <span className="text-sm text-slate-600">
                              Current: <span className="font-medium">{rtName}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* RT View - Show if this floor is assigned to viewing RT */}
                      {isRT && (
                        <div className="text-sm text-teal-600 font-medium flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg">
                          <UserCheck className="w-4 h-4" />
                          Your Assigned Floor
                        </div>
                      )}
                      
                      {/* Warden View - Show assigned RT */}
                      {isWarden && rtName && (
                        <div className="text-sm text-slate-600 flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          RT: <span className="font-medium">{rtName}</span>
                        </div>
                      )}
                    </div>

                    {/* Room Grid */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {floor.rooms.map(room => {
                        const isOccupied = !room.isStaffRoom && room.occupants?.length > 0;
                        const isStaff = room.isStaffRoom;
                        const isAvailable = !isOccupied && !isStaff;

                        return (
                          <button
                            key={room._id}
                            onClick={() => setSelectedRoom(room)}
                            className={`relative p-4 rounded-lg text-center transition-all border-2 hover:scale-105 hover:shadow-lg ${
                              isOccupied
                                ? 'bg-red-50 border-red-200 text-red-900 hover:bg-red-100'
                                : isStaff
                                ? 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                            }`}
                          >
                            <div className="text-lg font-bold">{room.roomNumber}</div>
                            <div className="text-xs mt-1 mb-2">
                              {room.isStaffRoom ? (room.staffRole || 'Staff') : `${room.occupants?.length || 0}/${room.capacity}`}
                            </div>
                            
                            {/* Icons */}
                            <div className="flex justify-center gap-1.5 mt-2">
                              {room.bathroomType === 'Attached' && (
                                <Droplets className="w-3.5 h-3.5" title="Attached Bath" />
                              )}
                              {room.acType === 'AC' && (
                                <Wind className="w-3.5 h-3.5" title="AC" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-slate-400 mt-20 bg-white rounded-xl p-12 border border-slate-200">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">No Data Available</p>
            </div>
          )}

          {/* Room Details Modal */}
          {selectedRoom && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
              onClick={() => setSelectedRoom(null)}
            >
              <div 
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200" 
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Room {selectedRoom.roomNumber}</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                      {selectedRoom.acType === 'AC' && <Wind className="w-4 h-4" />}
                      {selectedRoom.bathroomType === 'Attached' && <Droplets className="w-4 h-4" />}
                      {selectedRoom.acType} | {selectedRoom.bathroomType} Bath
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedRoom(null)} 
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Staff Room */}
                {selectedRoom.isStaffRoom && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Staff Room
                    </h3>
                    <p className="text-slate-700">Role: {selectedRoom.staffRole || 'N/A'}</p>
                    {selectedRoom.otherStaffDetails && (
                      <p className="text-slate-600 text-sm mt-1">Details: {selectedRoom.otherStaffDetails}</p>
                    )}
                  </div>
                )}

                {/* Student Room */}
                {!selectedRoom.isStaffRoom && (
                  <>
                    <h3 className="font-bold text-slate-700 mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Current Residents
                    </h3>
                    
                    {selectedRoom.occupants && selectedRoom.occupants.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRoom.occupants.map(user => (
                          <div key={user._id} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-3 rounded-lg border border-slate-200 transition-colors">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{user.username}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                        <p className="text-slate-400 text-sm">This room is currently empty</p>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Capacity:</span>
                      <span className="text-lg font-bold text-slate-800">
                        {selectedRoom.occupants?.length || 0} / {selectedRoom.capacity}
                      </span>
                    </div>
                  </>
                )}

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="w-full mt-6 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default OccupancyDashboard;