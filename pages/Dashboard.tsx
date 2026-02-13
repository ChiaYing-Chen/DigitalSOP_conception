import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockSOPs, mockSchedules } from '../mockData';
import { Icons } from '../components/Icons';
import { SOPStatus } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const categories = ['All', ...Array.from(new Set(mockSOPs.map(sop => sop.category)))];

  const filteredSOPs = selectedCategory === 'All' 
    ? mockSOPs 
    : mockSOPs.filter(sop => sop.category === selectedCategory);

  const getStatusColor = (status: SOPStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Draft': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getIconForCategory = (category: string) => {
    if (category.includes('財務')) return 'text-pink-500 bg-pink-500/10';
    if (category.includes('IT')) return 'text-blue-500 bg-blue-500/10';
    return 'text-purple-500 bg-purple-500/10';
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">數位流程庫</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => navigate(cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    (selectedCategory === cat || (selectedCategory === 'All' && cat === 'All'))
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-500' 
                      : 'bg-[#1e293b] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                >
                  {cat === 'All' ? '全部流程' : cat}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-500 shrink-0 ml-4 hidden md:block">共 {filteredSOPs.length} 個項目</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <div className="group relative flex flex-col items-center justify-center h-full min-h-[240px] rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-slate-700 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-4 text-slate-400 group-hover:text-white">
              <Icons.Plus />
            </div>
            <h3 className="text-lg font-semibold text-white">建立新流程</h3>
            <p className="text-sm text-slate-400 mt-1">從頭開始設計標準作業程序</p>
          </div>

          {/* Project Cards */}
          {filteredSOPs.map((sop) => (
            <div key={sop.id} className="group bg-[#1e293b] border border-slate-700 hover:border-blue-500/50 rounded-xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sop.status)}`}>
                  {sop.status === 'Active' ? '已發佈' : sop.status === 'Draft' ? '草稿' : '已封存'}
                </span>
                <button 
                  className="text-slate-500 hover:text-white relative group/btn"
                  title="設定提醒"
                >
                  <Icons.Bell />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${getIconForCategory(sop.category)}`}>
                  <Icons.FileText />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{sop.title}</h3>
                  <span className="text-xs text-slate-500">{sop.category}</span>
                </div>
              </div>

              <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">
                {sop.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Icons.User /> {sop.author}</span>
                  <span className="flex items-center gap-1"><Icons.Clock /> {sop.lastUpdated}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={() => navigate(`/editor/${sop.id}`)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icons.Edit />
                  編輯
                </button>
                <button 
                  onClick={() => navigate(`/run/${sop.id}`)}
                  disabled={sop.steps.length === 0}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${
                    sop.steps.length === 0 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                  }`}
                >
                  <Icons.Play />
                  執行
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Sidebar */}
      <div className="w-80 bg-[#111827] border-l border-slate-700 p-6 flex flex-col z-20 shadow-xl overflow-y-auto">
         <div className="flex items-center gap-2 mb-6 text-slate-200">
           <Icons.Calendar />
           <h3 className="font-bold text-lg">排程提醒</h3>
         </div>

         <div className="space-y-4">
            {mockSchedules.length > 0 ? mockSchedules.map((schedule) => (
               <div key={schedule.id} className="bg-[#1e293b] rounded-xl border border-slate-700 p-4 relative overflow-hidden group">
                  {schedule.status === 'Overdue' && (
                     <div className="absolute top-0 right-0 p-1 bg-red-500/20 rounded-bl-lg">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        schedule.status === 'Overdue' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                     }`}>
                        {schedule.status === 'Overdue' ? '已過期' : '即將到來'}
                     </span>
                     <span className="text-[10px] text-slate-500 uppercase tracking-wide">{schedule.repeat}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1">{schedule.sopTitle}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                     <Icons.Clock /> {schedule.scheduledTime}
                  </p>

                  <button 
                     onClick={() => navigate(`/run/${schedule.sopId}`)}
                     className="w-full py-1.5 bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                     <Icons.Play /> 立即執行
                  </button>
               </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-sm">
                 <p>目前沒有排程任務</p>
                 <p className="text-xs mt-1">在卡片上點擊鈴鐺設定提醒</p>
              </div>
            )}
         </div>

         <div className="mt-8 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">系統概況</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#1e293b] p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-white">{mockSOPs.length}</span>
                  <span className="text-[10px] text-slate-400">總流程數</span>
               </div>
               <div className="bg-[#1e293b] p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold text-green-400">98%</span>
                  <span className="text-[10px] text-slate-400">執行成功率</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};