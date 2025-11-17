import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// --- ( 1 ) CREATE BLOCK WIZARD (Fixed: No external icons) ---
function CreateBlockWizard({ onBlockCreated }) {
  const [blockName, setBlockName] = useState('');
  const [batches, setBatches] = useState([{ count: '', type: 'AC' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBatch = () => {
    setBatches([...batches, { count: '', type: 'Non-AC' }]);
  };

  const removeBatch = (index) => {
    if (batches.length === 1) return;
    const newBatches = batches.filter((_, i) => i !== index);
    setBatches(newBatches);
  };

  const updateBatch = (index, field, value) => {
    const newBatches = [...batches];
    newBatches[index][field] = value;
    setBatches(newBatches);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blockName) return alert("Please enter a Block Name");
    
    setIsSubmitting(true);
    try {
      // 1. Create Block
      const blockRes = await apiClient.post('/blocks', { name: blockName });
      const newBlockId = blockRes.data._id;

      // 2. Create Floors
      await apiClient.post('/floors/auto-generate', {
        blockId: newBlockId,
        batches: batches
      });

      setBlockName('');
      setBatches([{ count: '', type: 'AC' }]);
      onBlockCreated(newBlockId);
      alert(`Block ${blockName} created successfully!`);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create block');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        {/* Replaced Icon with Emoji for simplicity */}
        🏢 Create New Block & Floors
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Block Name</label>
          <input 
            type="text" 
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            placeholder="e.g. Block A"
            className="w-full md:w-1/2 rounded bg-gray-900 border border-gray-600 p-2 text-white focus:border-blue-500 outline-none"
          />
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <label className="block text-sm text-blue-400 mb-3 font-bold">Floor Configuration (Stack Builder)</label>
          
          {batches.map((batch, index) => (
            <div key={index} className="flex items-end gap-4 mb-3 animate-fade-in">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">No. of Floors</label>
                <input 
                  type="number" 
                  min="1"
                  value={batch.count}
                  onChange={(e) => updateBatch(index, 'count', e.target.value)}
                  placeholder="3"
                  className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-white"
                  required
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Floor Type</label>
                <select 
                  value={batch.type}
                  onChange={(e) => updateBatch(index, 'type', e.target.value)}
                  className="w-full rounded bg-gray-800 border border-gray-600 p-2 text-white"
                >
                  <option value="AC">AC (Attached Bath)</option>
                  <option value="Non-AC">Non-AC (Common Bath)</option>
                </select>
              </div>

              {batches.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeBatch(index)}
                  className="p-2 text-red-400 hover:bg-red-900/30 rounded mb-[1px] font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button 
            type="button"
            onClick={addBatch}
            className="mt-2 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold"
          >
            <span className="text-lg font-bold">+</span> Add more floors
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Generate Block Structure'}
        </button>
      </form>
    </div>
  );
}

// --- ( 2 ) ADD ROOM FORM ---
function AddRoomForm({ floor, onRoomAdded }) {
  const formik = useFormik({
    initialValues: { roomNumber: '', capacity: 4, pricePerYear: 50000, isStaffRoom: false, staffRole: 'RT', otherStaffDetails: '' },
    validationSchema: Yup.object({ roomNumber: Yup.string().required() }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // Auto-inherit floor type
        const roomData = { ...values, type: floor.type, floorId: floor._id };
        await apiClient.post('/rooms/add', roomData);
        onRoomAdded();
        resetForm();
      } catch (err) { alert(err.response?.data?.message || 'Error'); }
    }
  });

  return (
    <div className="rounded bg-gray-800 p-4 shadow-inner mt-4">
      <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center justify-between">
        <span>Add Room</span>
        <span className="text-[10px] bg-gray-700 px-2 py-1 rounded text-gray-300">{floor.type === 'AC' ? 'Attached Bath' : 'Common Bath'}</span>
      </h4>
      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Room No" {...formik.getFieldProps('roomNumber')} className="w-full rounded bg-gray-700 p-2 text-sm"/>
          <input type="number" placeholder="Price" {...formik.getFieldProps('pricePerYear')} className="w-full rounded bg-gray-700 p-2 text-sm"/>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <select {...formik.getFieldProps('capacity')} className="w-full rounded bg-gray-700 p-2 text-sm">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Sharing</option>)}
          </select>
        </div>
        <div className="rounded bg-gray-700 p-2 space-y-2">
          <div className="flex items-center space-x-2"><input type="checkbox" name="isStaffRoom" checked={formik.values.isStaffRoom} onChange={formik.handleChange} className="h-4 w-4"/><span>Staff Room</span></div>
          {formik.values.isStaffRoom && (
            <>
              <select {...formik.getFieldProps('staffRole')} className="w-full rounded bg-gray-600 p-2 text-sm">
                <option value="RT">Resident Tutor</option><option value="Warden">Warden</option><option value="Other">Other</option>
              </select>
              {formik.values.staffRole === 'Other' && <input type="text" placeholder="Role" {...formik.getFieldProps('otherStaffDetails')} className="w-full rounded bg-gray-600 p-2 text-sm"/>}
            </>
          )}
        </div>
        <button type="submit" className="w-full rounded bg-blue-600 text-xs py-2 font-bold hover:bg-blue-700">+ Add</button>
      </form>
    </div>
  );
}

// --- ( 3 ) MAIN COMPONENT ---
function HostelManager() {
  const [structure, setStructure] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  const fetchData = async (newBlockId = null) => {
    try {
      const res = await apiClient.get('/rooms/structure');
      setStructure(res.data);
      
      if (newBlockId) {
        setActiveBlockId(newBlockId);
        setShowWizard(false);
      } else if (res.data.length > 0 && (!activeBlockId || !res.data.find(b => b._id === activeBlockId))) {
        setActiveBlockId(res.data[0]._id);
      }
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleDeleteBlock = async (block) => {
    if (!window.confirm(`Delete ${block.name}?`)) return;
    try { await apiClient.delete(`/blocks/${block._id}`); setActiveBlockId(null); fetchData(); } catch (err) { alert('Error'); }
  };
  const handleDeleteRoom = async (roomId) => {
    if(!window.confirm("Delete?")) return;
    try { await apiClient.delete(`/rooms/${roomId}`); fetchData(); } catch (err) { alert("Error"); }
  }
  const handleDeleteFloor = async (floor) => {
     if (!window.confirm("Delete floor?")) return;
     try { await apiClient.delete(`/floors/${floor._id}`); fetchData(); } catch(e) { alert("Error"); }
  }

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);

  return (
    <div className="container mx-auto p-6 text-white min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hostel Manager</h1>
        <button 
          onClick={() => setShowWizard(!showWizard)} 
          className={`rounded px-4 py-2 font-bold shadow-lg transition ${showWizard ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {showWizard ? 'Cancel Creation' : '+ Add New Block'}
        </button>
      </div>

      {showWizard && (
        <CreateBlockWizard onBlockCreated={(id) => fetchData(id)} />
      )}

      {!showWizard && (
        <>
          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
            {structure.map(block => (
              <div key={block._id} className="flex rounded shadow-md">
                <button onClick={() => setActiveBlockId(block._id)} className={`px-6 py-2 font-bold transition ${activeBlockId === block._id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{block.name}</button>
                <button onClick={() => handleDeleteBlock(block)} className="bg-gray-900 px-3 text-gray-500 hover:bg-red-900 hover:text-white">&times;</button>
              </div>
            ))}
            {structure.length === 0 && <p className="text-gray-500 mt-2">No blocks. Click "+ Add New Block" to start.</p>}
          </div>

          {getActiveBlockData() && (
            <div className="space-y-6 animate-fade-in">
              {getActiveBlockData().floors.map(floor => (
                <div key={floor._id} className={`rounded-lg p-4 shadow-lg border border-gray-700 ${floor.type === 'AC' ? 'bg-blue-900/20' : 'bg-gray-800'}`}>
                  <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{floor.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ml-2 ${floor.type === 'AC' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {floor.type} Floor
                      </span>
                    </div>
                    <button onClick={() => handleDeleteFloor(floor)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {floor.rooms.map(room => (
                      <div key={room._id} className={`relative group rounded p-3 text-center shadow-md min-w-[90px] cursor-pointer ${room.isStaffRoom ? 'bg-purple-900/80 border-purple-500' : 'bg-gray-700 border-gray-600'}`}>
                        <div className="font-bold text-white text-lg">{room.roomNumber}</div>
                        <div className="text-xs text-gray-300 mb-1 uppercase">{room.isStaffRoom ? (room.staffRole || 'Staff') : `${room.capacity} Bed`}</div>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room._id); }} className="absolute -top-2 -right-2 hidden group-hover:block bg-red-600 text-white rounded-full w-5 h-5 text-xs leading-none">&times;</button>
                      </div>
                    ))}
                    {floor.rooms.length === 0 && <span className="text-gray-500 italic text-sm py-2">No rooms.</span>}
                  </div>

                  <AddRoomForm floor={floor} onRoomAdded={() => fetchData()} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HostelManager;