import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctors, addToCart } = useStore();
  const navigate = useNavigate();
  
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState('Today, 24 Oct');
  const [selectedTime, setSelectedTime] = useState('');

  const doc = doctors.find(d => d.id === id);
  if (!doc) return <div className="p-4">Doctor not found</div>;

  const handleBook = () => {
    if (!selectedTime) {
        alert('Please select a time slot');
        return;
    }
    addToCart(doc, selectedCenterIdx, selectedDate, selectedTime);
    navigate('/cart');
  };

  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'];

  return (
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">arrow_back</span>
        </button>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Doctor Profile</h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">share</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-28">
         {/* Profile Card */}
         <div className="px-4">
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                <div className="size-28 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-400 mb-3">
                    <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover rounded-full border-4 border-white dark:border-surface-dark" />
                </div>
                <h1 className="text-xl font-bold text-text-main dark:text-white leading-tight">{doc.name}</h1>
                <p className="text-primary font-bold text-sm mb-1">{doc.specialty}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">{doc.experience} Experience • {doc.centers[0].reviews} Reviews</p>
                
                <div className="flex justify-center gap-2 w-full">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Patients</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">1.2k+</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl flex-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Rating</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">4.9 ★</p>
                    </div>
                </div>
            </div>
         </div>

         {/* About */}
         <div className="px-4 mt-6">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">About Doctor</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {doc.about}
            </p>
         </div>

         {/* Hospital Selection */}
         <div className="px-4 mt-6">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">Select Hospital</h3>
            <div className="flex flex-col gap-3">
                {doc.centers.map((center, idx) => (
                    <div 
                        key={idx}
                        onClick={() => setSelectedCenterIdx(idx)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                            selectedCenterIdx === idx 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                            : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark'
                        }`}
                    >
                        <div>
                            <p className="font-bold text-text-main dark:text-white">{center.centerName}</p>
                            <p className="text-xs text-gray-500">{center.location}</p>
                        </div>
                        <p className="font-bold text-text-main dark:text-white">₹{center.price}</p>
                    </div>
                ))}
            </div>
         </div>

         {/* Slot Booking */}
         <div className="px-4 mt-6">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">Book Appointment</h3>
            
            {/* Date Selector */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-4">
                {['Today, 24 Oct', 'Tom, 25 Oct', 'Sat, 26 Oct'].map((date) => (
                    <button 
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                            selectedDate === date
                            ? 'bg-text-main dark:bg-white text-white dark:text-text-main'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                        {date}
                    </button>
                ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                    <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                            selectedTime === time
                            ? 'bg-primary text-text-main shadow-md shadow-primary/20 scale-105'
                            : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-text-main dark:text-gray-300'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 shadow-soft max-w-md mx-auto z-50">
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Consultation Fee</span>
                  <span className="text-xl font-extrabold text-text-main dark:text-white">₹{doc.centers[selectedCenterIdx].price}</span>
              </div>
              <button 
                onClick={handleBook}
                className="flex-1 bg-primary hover:bg-primary-dark text-text-main h-12 rounded-full font-bold text-base shadow-lg shadow-primary/30 transition-transform active:scale-95"
              >
                 Book Appointment
              </button>
          </div>
      </div>
    </div>
  );
};

export default DoctorDetails;