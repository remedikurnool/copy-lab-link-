import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Patient } from '../types';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addPatient, removePatient } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Patient>>({
    fullName: '',
    age: '',
    phone: '',
    gender: 'female',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.age || !formData.phone) return;
    
    addPatient({
      ...formData as Patient,
      id: Date.now().toString()
    });
    
    setFormData({
      fullName: '',
      age: '',
      phone: '',
      gender: 'female',
      address: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background-light dark:bg-background-dark animate-slide-in-right">
      <div className="shrink-0 p-4 pb-2 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white transition-transform active:scale-95">
                <span className="material-symbols-rounded">arrow_back</span>
             </button>
             <h2 className="text-2xl font-bold text-text-main dark:text-white">My Patients</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="size-10 rounded-full bg-primary-light text-black flex items-center justify-center shadow-glow animate-pulse active:scale-90 transition-transform"
          >
            <span className="material-symbols-rounded">add</span>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 opacity-60">
             <span className="material-symbols-rounded text-6xl mb-4">group_add</span>
             <p className="text-sm">No patients saved yet.</p>
          </div>
        ) : (
          patients.map((p) => (
            <div key={p.id} className="glass-card rounded-3xl p-5 flex items-center gap-4 relative group">
               <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl ${p.gender === 'female' ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'}`}>
                  <span className="material-symbols-rounded">{p.gender === 'female' ? 'female' : 'male'}</span>
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-text-main dark:text-white">{p.fullName}</h3>
                  <p className="text-xs text-text-sub dark:text-gray-400">{p.age} Yrs • {p.phone}</p>
               </div>
               <button 
                 onClick={() => removePatient(p.id)}
                 className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-full"
               >
                  <span className="material-symbols-rounded text-sm">delete</span>
               </button>
            </div>
          ))
        )}
      </div>

      {/* Add Patient Sheet */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
           <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-surface-dark rounded-t-[2.5rem] p-8 pb-10 relative animate-slide-up space-y-5">
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2"></div>
              <h3 className="text-xl font-bold text-text-main dark:text-white text-center">Add New Patient</h3>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Full Name</label>
                    <input 
                      type="text" required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 text-sm"
                      placeholder="e.g. Jane Doe"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Age</label>
                        <input 
                          type="number" required
                          value={formData.age}
                          onChange={e => setFormData({...formData, age: e.target.value})}
                          className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 text-sm"
                          placeholder="25"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Gender</label>
                        <select 
                          value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value as any})}
                          className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 text-sm"
                        >
                           <option value="female">Female</option>
                           <option value="male">Male</option>
                           <option value="other">Other</option>
                        </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Phone</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 text-sm"
                      placeholder="10-digit mobile number"
                    />
                 </div>
              </div>

              <button type="submit" className="w-full bg-text-main dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold shadow-glow">
                 Save Patient
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default Patients;