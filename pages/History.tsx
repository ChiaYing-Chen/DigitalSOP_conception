import React, { useState } from 'react';
import { mockHistory } from '../mockData';
import { ExecutionLog } from '../types';
import { Icons } from '../components/Icons';

export const History: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">成功</span>;
    if (status === 'Failed') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">失敗</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">進行中</span>;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* List View */}
      <div className={`${selectedLog ? 'w-1/2' : 'w-full'} flex flex-col border-r border-slate-700 transition-all duration-300`}>
         <div className="p-6 border-b border-slate-700 bg-[#1a202c] flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">執行歷史紀錄</h2>
            <div className="flex gap-2">
              <select className="bg-[#0f172a] border border-slate-600 text-slate-300 text-sm rounded-lg p-2 focus:ring-blue-500 outline-none">
                <option>所有狀態</option>
                <option>成功</option>
                <option>失敗</option>
              </select>
            </div>
         </div>
         <div className="overflow-y-auto flex-1 bg-[#0f172a]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1e293b] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">SOP 名稱</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">執行者</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">開始時間</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockHistory.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className={`cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-blue-900/20' : 'hover:bg-[#1e293b]'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{log.sopTitle}</div>
                      <div className="text-xs text-slate-500 font-mono">#{log.id}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                           {log.executor.charAt(0)}
                         </div>
                         <span className="text-sm text-slate-300">{log.executor}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{log.startTime}</td>
                    <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                    <td className="px-6 py-4 text-right">
                       <Icons.ChevronRight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      {/* Detail View (Review Interface) */}
      {selectedLog && (
        <div className="w-1/2 flex flex-col bg-[#111827] animate-in slide-in-from-right duration-300">
           <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-[#1a202c]">
              <div className="flex items-center gap-3">
                 <button onClick={() => setSelectedLog(null)} className="lg:hidden text-slate-400"><Icons.ChevronLeft /></button>
                 <div>
                   <h3 className="font-bold text-white text-lg">{selectedLog.sopTitle}</h3>
                   <span className="text-xs text-slate-500 font-mono">#{selectedLog.id} • 回顧模式</span>
                 </div>
              </div>
              <button className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700 transition-colors border border-slate-700">
                匯出報告
              </button>
           </div>

           <div className="p-6 flex-1 overflow-y-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-500 uppercase">總耗時</span>
                    <p className="text-xl font-mono text-white mt-1">45m 12s</p>
                 </div>
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-500 uppercase">執行者</span>
                    <p className="text-sm font-medium text-white mt-2 flex items-center gap-2">
                      <Icons.User /> {selectedLog.executor}
                    </p>
                 </div>
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-500 uppercase">完成度</span>
                    <p className="text-xl font-mono text-white mt-1">100%</p>
                 </div>
              </div>

              {/* Timeline */}
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">執行時間軸</h4>
              <div className="relative pl-4 border-l-2 border-slate-700 space-y-8">
                 {selectedLog.stepLogs.map((step, idx) => (
                    <div key={idx} className="relative group">
                       <div className={`absolute -left-[23px] top-0 w-4 h-4 rounded-full border-4 border-[#111827] ${step.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                       <div className="flex flex-col bg-[#1e293b] p-4 rounded-lg border border-slate-700 shadow-sm group-hover:border-blue-500/50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                             <span className="text-sm font-bold text-white">步驟 ID: {step.stepId}</span>
                             <span className="text-xs text-slate-500 font-mono">{step.completedAt}</span>
                          </div>
                          {step.note && (
                             <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-300 border-l-2 border-blue-500">
                                <span className="text-blue-400 font-bold mr-1">筆記:</span>
                                {step.note}
                             </div>
                          )}
                          {step.status === 'error' && (
                             <div className="mt-2 p-2 bg-red-900/20 rounded text-xs text-red-300 border border-red-900/50 flex items-center gap-2">
                                <Icons.AlertCircle /> 發生錯誤
                             </div>
                          )}
                       </div>
                    </div>
                 ))}
                 
                 {/* End Marker */}
                 <div className="relative">
                    <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full border-4 border-[#111827] bg-slate-500"></div>
                    <span className="text-xs text-slate-500 italic ml-2">流程結束</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};