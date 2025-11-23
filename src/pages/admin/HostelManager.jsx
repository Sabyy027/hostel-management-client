import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '../../components/AdminLayout';
import { Building2, Layers, Plus, Trash2, Sparkles, Home, Snowflake, Tag, X, Users, BedDouble, Bath, Wifi, Search, ChevronDown } from 'lucide-react';

// --- MODAL COMPONENT ---
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- ( 1 ) CREATE BLOCK WIZARD ---
function CreateBlockWizard({ onClose, onCreated }) {
  const [blockName, setBlockName] = useState('');
  const [batches, setBatches] = useState([{ count: 1, type: 'AC' }]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blockName) return;
    setLoading(true);
    try {
      const blockRes = await apiClient.post('/blocks', { name: blockName });
      const newBlockId = blockRes.data._id;
      await apiClient.post('/floors/auto-generate', { blockId: newBlockId, batches });
      onCreated(newBlockId);
      onClose();
    } catch (error) {
      alert('Failed to create block');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Property">
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Property / Block Name</label>
        <input 
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g. Ocean Wing, Tower A"
          value={blockName}
          onChange={e => setBlockName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="block text-sm font-semibold text-slate-700">Floor Configuration</label>
          <button 
            type="button" 
            onClick={() => setBatches([...batches, { count: 1, type: 'Non-AC' }])}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus size={14} /> Add Batch
          </button>
        </div>
        
        {batches.map((batch, idx) => (
          <div key={idx} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Floors</label>
              <input 
                type="number" 
                min="1"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                value={batch.count}
                onChange={e => {
                  const newBatches = [...batches];
                  newBatches[idx].count = e.target.value;
                  setBatches(newBatches);
                }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Type</label>
              <div className="relative">
                <select 
                  className="w-full p-2 pr-8 bg-white border border-slate-200 rounded-lg text-sm appearance-none"
                  value={batch.type}
                  onChange={e => {
                    const newBatches = [...batches];
                    newBatches[idx].type = e.target.value;
                    setBatches(newBatches);
                  }}
                >
                  <option value="AC">Premium AC</option>
                  <option value="Non-AC">Standard Non-AC</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
            {batches.length > 1 && (
              <button 
                type="button"
                onClick={() => setBatches(batches.filter((_, i) => i !== idx))}
                className="mt-6 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2"
        >
          {loading ? <Sparkles className="animate-spin" size={18} /> : 'Create Property'}
        </button>
      </div>
    </form>
    </Modal>
  );
}

// --- ( 2 ) ADD ROOM MODAL ---
function AddRoomModal({ floor, onClose, onSuccess }) {
  const [isBulk, setIsBulk] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    startNumber: '',
    endNumber: '',
    capacity: 2,
    isStaff: false
  });
  
  const [pricingPlans, setPricingPlans] = useState([
    { duration: 6, unit: 'months', price: 30000 },
    { duration: 12, unit: 'months', price: 50000 }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricingPlans: pricingPlans,
      floorId: floor._id,
      type: floor.type
    };
    
    try {
      if (isBulk) await apiClient.post('/rooms/bulk-create', payload);
      else await apiClient.post('/rooms/add', payload);
      onSuccess();
      onClose();
    } catch (e) { alert('Error creating room'); }
  };
  
  const addPricingPlan = () => {
    setPricingPlans([...pricingPlans, { duration: 1, unit: 'months', price: 0 }]);
  };
  
  const updatePricingPlan = (index, field, value) => {
    const updated = [...pricingPlans];
    updated[index][field] = field === 'price' || field === 'duration' ? Number(value) : value;
    setPricingPlans(updated);
  };
  
  const removePricingPlan = (index) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Add Room - ${floor.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex p-1 bg-slate-100 rounded-lg">
        <button 
          type="button" 
          onClick={() => setIsBulk(false)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isBulk ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          Single Room
        </button>
        <button 
          type="button" 
          onClick={() => setIsBulk(true)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isBulk ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          Bulk Create
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isBulk ? (
          <>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Start #</label>
              <input type="number" className="w-full p-3 border rounded-lg bg-slate-50" required 
                onChange={e => setFormData({...formData, startNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">End #</label>
              <input type="number" className="w-full p-3 border rounded-lg bg-slate-50" required
                onChange={e => setFormData({...formData, endNumber: e.target.value})}
              />
            </div>
          </>
        ) : (
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Room Number</label>
            <input type="text" className="w-full p-3 border rounded-lg bg-slate-50" placeholder="101" required
              onChange={e => setFormData({...formData, roomNumber: e.target.value})}
            />
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Capacity</label>
        <div className="relative">
          <select className="w-full p-3 pr-10 border rounded-lg bg-white appearance-none" 
            value={formData.capacity}
            onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
          >
            {[1,2,3,4,6].map(n => <option key={n} value={n}>{n} Person</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isStaff" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
          checked={formData.isStaff} onChange={e => setFormData({...formData, isStaff: e.target.checked})}
        />
        <label htmlFor="isStaff" className="text-sm font-medium text-slate-700">Mark as Staff Room</label>
      </div>

      {!formData.isStaff && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase">Pricing Plans</label>
            <button 
              type="button"
              onClick={addPricingPlan}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add Plan
            </button>
          </div>
          
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Duration</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-2 bg-white border border-slate-200 rounded text-sm"
                  value={plan.duration}
                  onChange={e => updatePricingPlan(idx, 'duration', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Unit</label>
                <div className="relative">
                  <select 
                    className="w-full p-2 pr-8 bg-white border border-slate-200 rounded text-sm appearance-none"
                    value={plan.unit}
                    onChange={e => updatePricingPlan(idx, 'unit', e.target.value)}
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Price (₹)</label>
                <input 
                  type="number"
                  className="w-full p-2 bg-white border border-slate-200 rounded text-sm"
                  value={plan.price}
                  onChange={e => updatePricingPlan(idx, 'price', e.target.value)}
                />
              </div>
              {pricingPlans.length > 1 && (
                <button 
                  type="button"
                  onClick={() => removePricingPlan(idx)}
                  className="mt-5 p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
        {isBulk ? 'Generate Rooms' : 'Add Room'}
      </button>
    </form>
    </Modal>
  );
}

// --- ( 3 ) ROOM CARD - Hotel Style ---
function RoomCard({ room, onDelete, onDiscount }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Header */}
      <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
          <BedDouble size={48} className="text-indigo-200" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
           {room.isStaffRoom && (
             <span className="px-2 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Staff</span>
           )}
           {room.activeDiscount && (
             <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
               {room.activeDiscount.type === 'Fixed' ? '₹' : '%'}{room.activeDiscount.value} Off
             </span>
           )}
        </div>

        <div className="absolute bottom-2 left-3 text-white">
          <div className="text-lg font-bold tracking-wide">Room {room.roomNumber}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Users size={14} />
              <span>{room.capacity} Guests</span>
           </div>
           <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
             room.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
           }`}>
             <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'Available' ? 'bg-green-500' : 'bg-amber-500'}`} />
             {room.status || 'Available'}
           </div>
        </div>

        <div className="flex gap-2 mb-4">
            <div className="p-1.5 bg-slate-50 rounded text-slate-400" title="Bed"><BedDouble size={14} /></div>
            {room.type === 'AC' && <div className="p-1.5 bg-blue-50 text-blue-400 rounded" title="AC"><Snowflake size={14} /></div>}
            <div className="p-1.5 bg-slate-50 rounded text-slate-400" title="Wifi"><Wifi size={14} /></div>
            <div className="p-1.5 bg-slate-50 rounded text-slate-400" title="Bath"><Bath size={14} /></div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-end">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Per Year</div>
            <div className="text-sm font-bold text-slate-900">
              ₹{room.pricingPlans?.[0]?.price.toLocaleString() || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Actions Overlay */}
      <div className={`absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <button 
           onClick={onDiscount} 
           className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center hover:bg-indigo-50 hover:scale-110 transition-all shadow-lg"
           title="Offers"
          >
           <Tag size={18} />
         </button>
         <button 
           onClick={onDelete}
           className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all shadow-lg"
           title="Delete"
          >
           <Trash2 size={18} />
         </button>
      </div>
    </div>
  );
}

// --- ( 3 ) MAIN COMPONENT ---
function HostelManager() {
  const [structure, setStructure] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);

  const fetchData = async (newBlockId = null) => {
    try {
      const [structRes, discRes] = await Promise.all([
        apiClient.get('/rooms/structure'),
        apiClient.get('/discounts')
      ]);
      
      setStructure(structRes.data);
      setDiscounts(discRes.data);
      
      if (newBlockId) {
        setActiveBlockId(newBlockId);
        setShowWizard(false);
      } else if (structRes.data.length > 0 && (!activeBlockId || !structRes.data.find(b => b._id === activeBlockId))) {
        setActiveBlockId(structRes.data[0]._id);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApplyDiscount = async (discountId) => {
    try {
      await apiClient.put(`/rooms/apply-discount/${targetRoom._id}`, { discountId });
      alert("Discount Updated!");
      setDiscountModalOpen(false);
      fetchData();
    } catch (err) { alert("Failed to apply discount"); }
  };

  const openDiscountModal = (room) => {
    setTargetRoom(room);
    setDiscountModalOpen(true);
  };

  const handleDeleteBlock = async (block) => {
    if (!window.confirm(`Delete ${block.name}?`)) return;
    try { 
      await apiClient.delete(`/blocks/${block._id}`); 
      setActiveBlockId(null); 
      fetchData(); 
    } catch (err) { alert('Error'); }
  };

  const handleDeleteRoom = async (roomId) => {
    if(!window.confirm("Delete room?")) return;
    try { 
      await apiClient.delete(`/rooms/${roomId}`); 
      fetchData(); 
    } catch (err) { alert("Error"); }
  };

  const handleDeleteFloor = async (floor) => {
    if (!window.confirm("Delete floor?")) return;
    try { 
      await apiClient.delete(`/floors/${floor._id}`); 
      fetchData(); 
    } catch(e) { alert("Error"); }
  };

  const getActiveBlockData = () => structure.find(b => b._id === activeBlockId);
  const activeBlock = getActiveBlockData();

  // Calculate stats
  const totalRooms = structure.reduce((sum, block) => 
    sum + block.floors.reduce((fsum, floor) => fsum + floor.rooms.length, 0), 0
  );
  const totalBlocks = structure.length;
  const totalFloors = structure.reduce((sum, block) => sum + block.floors.length, 0);
  const totalDiscounts = discounts.length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <Building2 className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">Hostel Management</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Manage blocks, floors, and rooms</p>
              </div>
            </div>
            <button 
              onClick={() => setShowWizard(true)} 
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm flex-shrink-0 ml-2"
            >
              <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">New Property</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Rooms</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalRooms}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <BedDouble className="text-indigo-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Properties</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalBlocks}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Building2 className="text-purple-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Floors</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalFloors}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Layers className="text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Active Offers</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalDiscounts}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Tag className="text-emerald-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Property Selector Pills */}
          {structure.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {structure.map(block => (
                  <div
                    key={block._id}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      activeBlockId === block._id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div 
                      onClick={() => setActiveBlockId(block._id)}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Building2 size={16} />
                      {block.name}
                    </div>
                    {activeBlockId === block._id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block); }}
                        className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors"
                        aria-label="Delete block"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {structure.length === 0 && !showWizard && (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <Building2 className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Properties Yet</h3>
              <p className="text-slate-500 mb-4">Create your first property to get started</p>
              <button 
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Create Property
              </button>
            </div>
          )}

          {/* Floors and Rooms */}
          {activeBlock && (
            <div className="space-y-6">
              {activeBlock.floors.map(floor => (
                <div key={floor._id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {/* Floor Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        floor.type === 'AC' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {floor.type === 'AC' ? <Snowflake size={20} /> : <Home size={20} />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{floor.name}</h3>
                        <p className="text-xs text-slate-500">{floor.rooms.length} rooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedFloor(floor); setShowAddRoom(true); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        <Plus size={16} />
                        Add Room
                      </button>
                      <button
                        onClick={() => handleDeleteFloor(floor)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Room Cards Grid */}
                  <div className="p-4">
                    {floor.rooms.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {floor.rooms.map(room => (
                          <RoomCard
                            key={room._id}
                            room={room}
                            onDelete={() => handleDeleteRoom(room._id)}
                            onDiscount={() => openDiscountModal(room)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <BedDouble className="mx-auto mb-2 opacity-50" size={32} />
                        <p className="text-sm">No rooms yet. Add your first room.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showWizard && (
        <CreateBlockWizard
          onClose={() => setShowWizard(false)}
          onCreated={(id) => fetchData(id)}
        />
      )}

      {showAddRoom && selectedFloor && (
        <AddRoomModal
          floor={selectedFloor}
          onClose={() => { setShowAddRoom(false); setSelectedFloor(null); }}
          onSuccess={() => { fetchData(); setShowAddRoom(false); setSelectedFloor(null); }}
        />
      )}

      {discountModalOpen && targetRoom && (
        <Modal
          isOpen={discountModalOpen}
          onClose={() => setDiscountModalOpen(false)}
          title={`Apply Discount - Room ${targetRoom.roomNumber}`}
        >
          <div className="space-y-3">
            <button 
              onClick={() => handleApplyDiscount(null)}
              className="w-full p-3 text-left rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="text-red-600" size={16} />
                </div>
                <span className="font-medium text-slate-700">Remove Discount</span>
              </div>
            </button>

            {discounts.map(d => (
              <button 
                key={d._id}
                onClick={() => handleApplyDiscount(d._id)}
                className="w-full p-3 text-left rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{d.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {d.type === 'Fixed' ? `₹${d.value} OFF` : `${d.value}% OFF`}
                    </div>
                  </div>
                  <Tag className="text-emerald-600" size={18} />
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

export default HostelManager;