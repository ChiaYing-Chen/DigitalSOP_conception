import React, { useState, useEffect } from 'react';
import { mockSOPs, mockVersions } from '../mockData';
import { Icons } from '../components/Icons';

export const VersionControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'versions'>('categories');
  
  // Categories derived from mock data
  const uniqueCategories = Array.from(new Set(mockSOPs.map(sop => sop.category)));
  const categoriesList = uniqueCategories.map(name => ({
      name,
      count: mockSOPs.filter(s => s.category === name).length,
      description: '標準作業流程分類'
  }));

  const [selectedCategory, setSelectedCategory] = useState<string>(uniqueCategories[0] || '');
  // Initialize filtered SOPs based on first category
  const initialFilteredSOPs = mockSOPs.filter(s => s.category === uniqueCategories[0]);
  const [selectedSOP, setSelectedSOP] = useState<string>(initialFilteredSOPs[0]?.id || '');

  // When category changes, update the available SOP list and default selection
  useEffect(() => {
    const sopsInCategory = mockSOPs.filter(s => s.category === selectedCategory);
    if (sopsInCategory.length > 0) {
      setSelectedSOP(sopsInCategory[0].id);
    } else {
      setSelectedSOP('');
    }
  }, [selectedCategory]);

  const filteredSOPs = mockSOPs.filter(s => s.category === selectedCategory);
  const selectedSOPData = mockSOPs.find(s => s.id === selectedSOP);
  const selectedSOPVersions = mockVersions.filter(v => v.sopId === selectedSOP);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'categories' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><Icons.Layers /> 流程分類設定</span>
          {activeTab === 'categories' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>}
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'versions' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2"><Icons.GitBranch /> 版本歷程控管</span>
          {activeTab === 'versions' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>}
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-white">分類管理</h3>
             <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20">
               <Icons.Plus /> 新增分類
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {categoriesList.map((cat) => (
               <div key={cat.name} className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 relative group hover:border-blue-500/50 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-1.5 text-slate-400 hover:text-blue-400 bg-slate-800 rounded hover:bg-slate-700"><Icons.Edit /></button>
                     <button className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded hover:bg-slate-700"><Icons.Trash /></button>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                      cat.name.includes('財務') ? 'bg-pink-500/10 text-pink-500' : 
                      cat.name.includes('IT') ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                  }`}>
                      <Icons.Filter />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{cat.name}</h4>
                  <p className="text-sm text-slate-400 mb-4">{cat.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 py-1.5 px-3 rounded-full w-fit">
                     <Icons.FileText />
                     <span>{cat.count} 個關聯流程</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
           {/* Left: Flow Selector */}
           <div className="w-full lg:w-1/3 bg-[#1e293b] border border-slate-700 rounded-xl p-6 h-fit space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">選擇分類</label>
                <select 
                   value={selectedCategory} 
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                   {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">選擇流程</label>
                <select 
                   value={selectedSOP} 
                   onChange={(e) => setSelectedSOP(e.target.value)}
                   className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   disabled={filteredSOPs.length === 0}
                >
                   {filteredSOPs.length > 0 ? (
                     filteredSOPs.map(sop => (
                        <option key={sop.id} value={sop.id}>{sop.title} ({sop.version})</option>
                     ))
                   ) : (
                     <option value="">此分類下無流程</option>
                   )}
                </select>
              </div>

              {selectedSOPData && (
                <div className="bg-[#0f172a] rounded-lg p-4 border border-slate-700 mt-6">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 uppercase">當前版本</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-xs font-bold">{selectedSOPData.version}</span>
                   </div>
                   <h4 className="text-white font-bold text-lg mb-1">{selectedSOPData.title}</h4>
                   <p className="text-sm text-slate-400 mb-4 line-clamp-2">{selectedSOPData.description}</p>
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>最後更新: {selectedSOPData.lastUpdated}</span>
                      <span>•</span>
                      <span>作者: {selectedSOPData.author}</span>
                   </div>
                </div>
              )}
           </div>

           {/* Right: Version Timeline */}
           <div className="flex-1 bg-[#1e293b] border border-slate-700 rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-white">版本歷史紀錄</h3>
                 <span className="text-xs text-slate-500">共 {selectedSOPVersions.length} 個版本</span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-700 space-y-8 flex-1 overflow-y-auto pr-2">
                 {selectedSOPVersions.map((ver, idx) => (
                    <div key={ver.id} className="relative group">
                       <div className={`absolute -left-[29px] top-0 w-3 h-3 rounded-full border-2 border-[#111827] ${
                          idx === selectedSOPVersions.length - 1 ? 'bg-green-500 ring-4 ring-green-500/20' : 'bg-slate-500'
                       }`}></div>
                       
                       <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4 hover:border-blue-500/40 transition-all">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                <span className="text-lg font-mono font-bold text-white">{ver.version}</span>
                                {ver.status === 'Published' && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">CURRENT</span>}
                                {ver.status === 'Draft' && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded border border-yellow-500/20">DRAFT</span>}
                             </div>
                             <span className="text-xs text-slate-500 font-mono">{ver.committedAt}</span>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-3 bg-slate-800/50 p-2 rounded">
                             {ver.changeLog}
                          </p>
                          
                          <div className="flex justify-between items-center mt-2">
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                                   {ver.committedBy.charAt(0)}
                                </div>
                                {ver.committedBy}
                             </div>
                             
                             <div className="flex gap-2">
                                <button className="text-xs flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700 hover:border-slate-500 transition-colors">
                                   檢視
                                </button>
                                {ver.status !== 'Published' && (
                                   <button className="text-xs flex items-center gap-1 px-2 py-1 bg-slate-800 text-blue-400 hover:text-blue-300 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
                                      <Icons.RotateCcw /> 還原
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {selectedSOPVersions.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                       <p>尚無版本紀錄</p>
                       <p className="text-xs text-slate-600 mt-1">請選擇其他分類或流程</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};