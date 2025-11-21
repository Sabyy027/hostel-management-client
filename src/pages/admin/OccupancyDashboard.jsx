import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

function OccupancyDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isRT = user.designation === 'Resident Tutor';
  
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableRTs, setAvailableRTs] = useState([]);
  
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

  const fetchAvailableRTs = async () => {
    if (!isAdmin) return;
    try {
      const res = await apiClient.get('/users/staff');
      const rts = res.data.filter(s => s.designation === 'Resident Tutor');
      setAvailableRTs(rts);
    } catch (err) {
      console.error('Error fetching RTs:', err);
    }
  };

  useEffect(() => { 
    fetchData(); 
    fetchAvailableRTs();
  }, []);

  const handleAssignRT = async (floorId, rtId) => {
    try {
      await apiClient.put(`/floors/assign-rt/${floorId}`, { rtId: rtId || null });
      alert('RT assignment updated successfully');
      fetchData(); // Refresh data
    } catch (err) {
      alert('Error assigning RT: ' + (err.response?.data?.message || err.message));
    }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);

  // --- HELPER: Status Color ---
  const getRoomColor = (room) => {
    if (room.isStaffRoom) return 'bg-purple-100 border-purple-300 text-purple-700';
    if (room.isOccupied) return 'bg-red-100 border-red-300 text-red-700';
    return 'bg-green-100 border-green-300 text-green-700';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isAdmin ? 'Occupancy & RT Assignment' : 'Occupancy Dashboard'}
        </h1>
        <p className="text-sm text-slate-500">
          {isAdmin 
            ? 'Assign Resident Tutors to floors and monitor occupancy' 
            : isRT 
            ? 'View occupancy for your assigned floors' 
            : 'Visual room map and availability'}
        </p>
      </div>

      {/* --- LEGEND --- */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Occupied</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Staff</div>
      </div>

      {/* --- BLOCK TABS --- */}
      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        {structure.map(block => (
          <button
            key={block._id}
            onClick={() => setActiveBlockId(block._id)}
            className={`px-6 py-3 font-bold rounded transition ${
              activeBlockId === block._id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {block.name}
          </button>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      {getActiveBlockData() ? (
        <div className="space-y-6 animate-fade-in">
          {getActiveBlockData().floors.map(floor => (
            <div key={floor._id} className="rounded-lg p-5 shadow-lg border border-gray-700 bg-gray-800">
              <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{floor.name}</h3>
                  <span className="text-xs text-gray-400 uppercase">{floor.type} Floor</span>
                </div>
                
                {/* RT ASSIGNMENT DROPDOWN (Admin Only) */}
                {isAdmin && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-300">Assigned RT:</label>
                    <select
                      value={floor.assignedRT?._id || ''}
                      onChange={(e) => handleAssignRT(floor._id, e.target.value)}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">-- Unassigned --</option>
                      {availableRTs.map(rt => (
                        <option key={rt._id} value={rt._id}>
                          {rt.username} ({rt.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* RT VIEW: Show assigned RT name */}
                {isRT && floor.assignedRT && (
                  <div className="text-sm text-indigo-300">
                    Assigned to: {floor.assignedRT.username}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {floor.rooms.map(room => (
                  <div 
                    key={room._id} 
                    onClick={() => setSelectedRoom(room)}
                    className={`relative p-4 rounded-lg text-center transition border cursor-pointer hover:scale-105 shadow-md ${getRoomColor(room)}`}
                  >
                    <div className="text-lg font-bold">{room.roomNumber}</div>
                    <div className="text-xs opacity-80 mb-2">
                      {room.isStaffRoom ? (room.staffRole || 'Staff') : `${room.occupants.length}/${room.capacity} Filled`}
                    </div>
                    
                    {/* Tiny indicator icons */}
                    <div className="flex justify-center gap-1 mt-1">
                      {room.bathroomType === 'Attached' && <span title="Attached Bath">🚿</span>}
                      {room.type === 'AC' && <span title="AC">❄️</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">No Data Available</div>
      )}

      {/* --- RESIDENT DETAILS MODAL --- */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRoom(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Room {selectedRoom.roomNumber}</h2>
                <p className="text-gray-400 text-sm">{selectedRoom.type} | {selectedRoom.bathroomType} Bath</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>

            {/* STAFF VIEW */}
            {selectedRoom.isStaffRoom && (
               <div className="bg-purple-900/30 p-4 rounded border border-purple-500/50">
                 <h3 className="font-bold text-purple-300 mb-2">Staff Room</h3>
                 <p>Role: {selectedRoom.staffRole}</p>
                 {selectedRoom.otherStaffDetails && <p>Details: {selectedRoom.otherStaffDetails}</p>}
               </div>
            )}

            {/* STUDENT VIEW */}
            {!selectedRoom.isStaffRoom && (
              <>
                <h3 className="font-bold text-blue-400 mb-3 uppercase text-xs tracking-wider">Current Residents</h3>
                
                {selectedRoom.occupants && selectedRoom.occupants.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRoom.occupants.map(user => (
                      <div key={user._id} className="flex items-center gap-3 bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.username}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">This room is currently empty.</p>
                )}

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-sm">
                  <span className="text-gray-400">Capacity:</span>
                  <span className="text-white">{selectedRoom.occupants.length} / {selectedRoom.capacity}</span>
                </div>
              </>
            )}

            <button 
              onClick={() => setSelectedRoom(null)}
              className="w-full mt-6 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      </div>
    </AdminLayout>
  );
}

export default OccupancyDashboard;