import React, { useState } from 'react';
import { mockSchedules, mockSOPs } from '../mockData';
import { Icons } from '../components/Icons';
import { SOPSchedule } from '../types';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ sopId: '', time: '09:00', repeat: 'Once' });

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Mock checking schedules for a date (Simplified)
  const getSchedulesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockSchedules.filter(s => s.scheduledTime.startsWith(dateStr));
  };

  const handleSaveSchedule = () => {
    // In a real app, this would make an API call.
    // Here we just close the modal for demo purposes.
    console.log("Saving schedule:", { date: selectedDate, ...newSchedule });
    setIsModalOpen(false);
    alert("排程已設定！(模擬)");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">排程行事曆</h2>
          <p className="text-slate-400 text-sm">管理 SOP 的執行時間與自動提醒</p>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><Icons.ChevronLeft /></button>
           <h3 className="text-xl font-mono font-bold text-white min-w-[140px] text-center">
             {currentDate.getFullYear()} {monthNames[currentDate.getMonth()]}
           </h3>
           <button onClick={handleNextMonth} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><Icons.ChevronRight /></button>
        </div>
      </div>

      <div className="flex-1 bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 bg-[#1a202c] border-b border-slate-700">
          {['週日', '週一', '週二', '週三', '週四', '週五', '週六'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-[#1e293b]">
          {emptyDays.map(i => <div key={`empty-${i}`} className="border-b border-r border-slate-700/50 bg-[#1e293b]/50"></div>)}
          
          {daysArray.map(day => {
             const schedules = getSchedulesForDay(day);
             const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
             
             return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className={`min-h-[100px] border-b border-r border-slate-700/50 p-2 cursor-pointer hover:bg-slate-700/30 transition-colors relative group ${isToday ? 'bg-blue-900/10' : ''}`}
              >
                <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                  {day}
                </span>
                
                <div className="mt-2 space-y-1">
                  {schedules.map(sch => (
                    <div key={sch.id} className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 truncate">
                      {sch.sopTitle}
                    </div>
                  ))}
                  <div className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 text-slate-500">
                    <Icons.Plus />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="bg-[#1e293b] border border-slate-600 rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                 新增排程: {selectedDate.toLocaleDateString()}
              </h3>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">選擇 SOP</label>
                    <select 
                       className="w-full bg-[#0f172a] border border-slate-600 rounded p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                       value={newSchedule.sopId}
                       onChange={(e) => setNewSchedule({...newSchedule, sopId: e.target.value})}
                    >
                       <option value="">請選擇流程...</option>
                       {mockSOPs.map(sop => <option key={sop.id} value={sop.id}>{sop.title}</option>)}
                    </select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-medium text-slate-400 mb-1">執行時間</label>
                       <input 
                         type="time" 
                         className="w-full bg-[#0f172a] border border-slate-600 rounded p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                         value={newSchedule.time}
                         onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-400 mb-1">重複頻率</label>
                       <select 
                          className="w-full bg-[#0f172a] border border-slate-600 rounded p-2.5 text-sm text-white focus:border-blue-500 outline-none"
                          value={newSchedule.repeat}
                          onChange={(e) => setNewSchedule({...newSchedule, repeat: e.target.value})}
                       >
                          <option value="Once">單次</option>
                          <option value="Daily">每天</option>
                          <option value="Weekly">每週</option>
                          <option value="Monthly">每月</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleSaveSchedule}
                   className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/30"
                 >
                   確認排程
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};