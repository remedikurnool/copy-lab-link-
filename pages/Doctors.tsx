import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';

const Doctors: React.FC = () => {
  const { doctors, fetchDoctors } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const categories = ['All', 'General Physician', 'Dermatologist', 'Orthopedics'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesCategory = filter === 'All' || doc.category === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark">
      {/* Header */}
       <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white hover:bg-gray-50 active:scale-95 transition-transform">
                <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h2 className="text-text-main dark:text-white text-2xl font-bold leading-tight tracking-tight">Find Doctors</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2 shrink-0">
           <div className="relative">
             <span className="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">search</span>
             <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors, specialties..."
                className="w-full bg-white dark:bg-surface-dark border-none rounded-2xl py-3 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white"
             />
           </div>
        </div>

        {/* Filter Chips */}
        <div className="shrink-0 z-20 bg-background-light dark:bg-background-dark pb-2">
          <div className="flex gap-3 px-4 py-2 overflow-x-auto hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-full transition-colors text-xs font-bold ${
                  filter === cat 
                    ? 'bg-primary text-text-main shadow-lg shadow-primary/25' 
                    : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-4 hide-scrollbar pt-2">
            {filteredDoctors.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No doctors found.</div>
            ) : (
                filteredDoctors.map((doc) => (
                    <Link to={`/doctor/${doc.id}`} key={doc.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 active:scale-[0.99] transition-transform">
                        <div className="size-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                             <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight truncate">{doc.name}</h3>
                                    <p className="text-primary text-xs font-bold uppercase tracking-wide mb-1">{doc.specialty}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400">{doc.centers[0].rating}</span>
                                    <span className="material-symbols-outlined text-[10px] text-green-600 filled-icon">star</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{doc.experience} Exp • {doc.centers[0].location}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400">Consultation Fee</span>
                                    <span className="font-bold text-text-main dark:text-white">₹{doc.centers[0].price}</span>
                                </div>
                                <button className="bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    </div>
  );
};

export default Doctors;