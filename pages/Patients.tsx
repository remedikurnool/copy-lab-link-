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
    <div className="h-full w-full flex flex-col bg-background-light dark:bg-background-dark animate-slide-in-right relative">
      {/* App Bar */}
      <div className="shrink-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between h-16 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-main dark:text-white">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">My Patients</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar pb-32">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
             <span className="material-symbols-rounded text-6xl mb-4">group_add</span>
             <p className="text-sm font-medium text-center">No patients saved yet.<br/>Add family members for quicker booking.</p>
             <button onClick={() => setShowAddForm(true)} className="mt-6 bg-primary px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20">Add First Patient</button>
          </div>
        ) : (
          patients.map((p) => (
            <div key={p.id} className="bg-white dark:bg-surface-dark rounded-3xl p-5 flex items-center gap-4 border border-gray-100 dark:border-gray-800 shadow-sm relative group active:scale-[0.99] transition-transform">
               <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl ${p.gender === 'female' ? 'bg-pink-100 text-pink-500 dark:bg-pink-900/20' : 'bg-blue-100 text-blue-500 dark:bg-blue-900/20'}`}>
                  <span className="material-symbols-rounded filled-icon">{p.gender === 'female' ? 'female' : 'male'}</span>
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-text-main dark:text-white text-base">{p.fullName}</h3>
                  <p className="text-xs text-text-sub dark:text-gray-400 font-medium">{p.age} Yrs • {p.phone}</p>
               </div>
               <button 
                 onClick={() => removePatient(p.id)}
                 className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
               >
                  <span className="material-symbols-rounded text-lg">delete</span>
               </button>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      {patients.length > 0 && !showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="absolute bottom-10 right-6 size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-float active:scale-90 transition-transform z-30"
          >
            <span className="material-symbols-rounded text-3xl">add</span>
          </button>
      )}

      {/* Add Patient Sheet */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
           <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-surface-dark rounded-t-[2.5rem] p-8 pb-10 relative animate-slide-up space-y-5 border-t border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xl font-bold text-text-main dark:text-white">Add New Patient</h3>
                 <button type="button" onClick={() => setShowAddForm(false)} className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <span className="material-symbols-rounded">close</span>
                 </button>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary text-text-main dark:text-white"
                      placeholder="e.g. Jane Doe"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Age</label>
                        <input 
                          type="number" required
                          value={formData.age}
                          onChange={e => setFormData({...formData, age: e.target.value})}
                          className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary text-text-main dark:text-white"
                          placeholder="25"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Gender</label>
                        <select 
                          value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value as any})}
                          className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary text-text-main dark:text-white"
                        >
                           <option value="female">Female</option>
                           <option value="male">Male</option>
                           <option value="other">Other</option>
                        </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Phone Number</label>
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary text-text-main dark:text-white"
                      placeholder="+91 98765 43210"
                    />
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-transform mt-4"
              >
                Save Patient
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default Patients;