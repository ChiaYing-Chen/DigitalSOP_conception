import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { mockSOPs } from '../mockData';
import { Icons } from '../components/Icons';
import { SOPStep } from '../types';
import { FlowEditor } from '../components/FlowEditor';

export const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sop = mockSOPs.find(s => s.id === id);
  const [steps, setSteps] = useState<SOPStep[]>(sop?.steps || []);
  const [selectedStep, setSelectedStep] = useState<SOPStep | null>(null);
  
  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishData, setPublishData] = useState({
     version: sop ? (() => {
        const parts = sop.version.replace('v', '').split('.');
        if (parts.length > 1) {
            return `v${parts[0]}.${parseInt(parts[1]) + 1}`;
        }
        return sop.version + '.1';
     })() : 'v1.0',
     log: ''
  });

  const startDragRef = useRef<((e: React.MouseEvent, type: string) => void) | null>(null);

  if (!sop) return <div className="p-8 text-white">SOP Not Found</div>;

  const handleInitDrag = (fn: (e: React.MouseEvent, type: string) => void) => {
    startDragRef.current = fn;
  };

  const handleStartDrag = (e: React.MouseEvent, type: string) => {
    if (startDragRef.current) {
      startDragRef.current(e, type);
    }
  };

  const handlePublish = () => {
    console.log("Publishing Version:", publishData);
    setIsPublishModalOpen(false);
    alert(`成功發布版本 ${publishData.version}！`);
  };

  // Helper for Checklist Editing
  const addChecklistItem = () => {
    if (!selectedStep) return;
    const items = selectedStep.checklistItems || [];
    setSelectedStep({ ...selectedStep, checklistItems: [...items, '新檢查項目'] });
  };

  const updateChecklistItem = (index: number, value: string) => {
    if (!selectedStep) return;
    const items = [...(selectedStep.checklistItems || [])];
    items[index] = value;
    setSelectedStep({ ...selectedStep, checklistItems: items });
  };

  const removeChecklistItem = (index: number) => {
    if (!selectedStep) return;
    const items = [...(selectedStep.checklistItems || [])];
    items.splice(index, 1);
    setSelectedStep({ ...selectedStep, checklistItems: items });
  };

  // Helper for QA Editing
  const addQaItem = () => {
    if (!selectedStep) return;
    const items = selectedStep.qaItems || [];
    setSelectedStep({ ...selectedStep, qaItems: [...items, { id: `q-${Date.now()}`, question: '新問題', answerType: 'text' }] });
  };

  const updateQaItem = (index: number, field: 'question' | 'answerType', value: any) => {
    if (!selectedStep) return;
    const items = [...(selectedStep.qaItems || [])];
    items[index] = { ...items[index], [field]: value };
    setSelectedStep({ ...selectedStep, qaItems: items });
  };

  const removeQaItem = (index: number) => {
    if (!selectedStep) return;
    const items = [...(selectedStep.qaItems || [])];
    items.splice(index, 1);
    setSelectedStep({ ...selectedStep, qaItems: items });
  };


  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Sidebar - Component Library */}
      <aside className="w-64 bg-[#1a202c] border-r border-slate-700 p-4 flex flex-col z-10 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">基礎元件</h3>
        
        <div className="space-y-3 mb-6">
            <div 
              onMouseDown={(e) => handleStartDrag(e, 'start')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center"></div>
              <span className="text-sm text-slate-300">開始事件</span>
            </div>
            
            <div 
              onMouseDown={(e) => handleStartDrag(e, 'end')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
               <div className="w-8 h-8 rounded-full border-4 border-red-500 flex items-center justify-center"></div>
               <span className="text-sm text-slate-300">結束事件</span>
            </div>

            <div 
              onMouseDown={(e) => handleStartDrag(e, 'decision')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
               <div className="w-8 h-8 rotate-45 border-2 border-orange-500 flex items-center justify-center text-orange-500">
                  <span className="-rotate-45 font-bold">?</span>
               </div>
               <span className="text-sm text-slate-300 ml-1">判斷閘道</span>
            </div>
        </div>

        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">使用者任務</h3>
        <div className="space-y-3 mb-6">
            <div 
              onMouseDown={(e) => handleStartDrag(e, 'task-simple')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
               <div className="w-8 h-8 rounded border-2 border-blue-500 flex items-center justify-center text-blue-500">
                  <Icons.User />
               </div>
               <span className="text-sm text-slate-300">簡易任務</span>
            </div>

            <div 
              onMouseDown={(e) => handleStartDrag(e, 'task-check')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
               <div className="w-8 h-8 rounded border-2 border-blue-500 flex items-center justify-center text-blue-500">
                  <Icons.Check />
               </div>
               <span className="text-sm text-slate-300">檢核任務</span>
            </div>

            <div 
              onMouseDown={(e) => handleStartDrag(e, 'task-qa')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
               <div className="w-8 h-8 rounded border-2 border-blue-500 flex items-center justify-center text-blue-500">
                  <Icons.Type />
               </div>
               <span className="text-sm text-slate-300">問答任務</span>
            </div>
        </div>

        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">輔助工具</h3>
        <div className="space-y-3">
             <div 
              onMouseDown={(e) => handleStartDrag(e, 'swimlane')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded border-2 border-dashed border-slate-500 flex items-center justify-center group-hover:border-blue-400">
                 <div className="w-4 h-full border-r border-dashed border-slate-500"></div>
              </div>
              <span className="text-sm text-slate-300">垂直泳道</span>
            </div>

            <div 
              onMouseDown={(e) => handleStartDrag(e, 'text')}
              className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-blue-500 hover:bg-slate-700 transition-all flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded border border-slate-500 flex items-center justify-center">
                 <Icons.Type />
              </div>
              <span className="text-sm text-slate-300">文字說明</span>
            </div>
        </div>

      </aside>

      {/* Main Canvas */}
      <div className="flex-1 relative bg-[#0f172a] overflow-hidden">
         <FlowEditor 
            steps={steps} 
            onStepsChange={setSteps} 
            onSelectStep={setSelectedStep}
            onInitDrag={handleInitDrag}
         />
      </div>

      {/* Properties Panel */}
      <aside className="w-80 bg-[#1a202c] border-l border-slate-700 flex flex-col z-10 shadow-xl overflow-hidden">
        <div className="h-12 border-b border-slate-700 flex items-center px-4 justify-between bg-slate-800 shrink-0">
          <span className="text-sm font-semibold text-white">屬性面板</span>
          {selectedStep && <span className="text-xs text-slate-400">ID: {selectedStep.id}</span>}
        </div>
        
        {selectedStep ? (
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
             <div>
               <label className="block text-xs font-medium text-slate-400 mb-1">標題</label>
               <input 
                 type="text" 
                 value={selectedStep.title} 
                 onChange={(e) => setSelectedStep({...selectedStep, title: e.target.value})}
                 className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
               />
             </div>
             
             {selectedStep.type !== 'text' && (
               <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">描述</label>
                  <textarea 
                    rows={3}
                    value={selectedStep.description || ''} 
                    onChange={(e) => setSelectedStep({...selectedStep, description: e.target.value})}
                    className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
               </div>
             )}

             {selectedStep.type === 'task' && (
               <>
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">任務類型</label>
                    <select 
                       value={selectedStep.taskType || 'simple'}
                       onChange={(e) => setSelectedStep({...selectedStep, taskType: e.target.value as any})}
                       className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                    >
                       <option value="simple">簡易任務</option>
                       <option value="checklist">檢核任務</option>
                       <option value="qa">問答任務</option>
                    </select>
                 </div>

                 {selectedStep.taskType === 'checklist' && (
                    <div className="space-y-2 pt-2 border-t border-slate-700">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-400">檢核項目</label>
                          <button onClick={addChecklistItem} className="text-xs text-blue-400 hover:text-blue-300">+ 新增</button>
                       </div>
                       {selectedStep.checklistItems?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                             <input 
                               type="text" 
                               value={item} 
                               onChange={(e) => updateChecklistItem(idx, e.target.value)}
                               className="flex-1 bg-[#0f172a] border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                             />
                             <button onClick={() => removeChecklistItem(idx)} className="text-slate-500 hover:text-red-500">×</button>
                          </div>
                       ))}
                       {(!selectedStep.checklistItems || selectedStep.checklistItems.length === 0) && (
                          <p className="text-xs text-slate-500 italic">尚未新增檢核項目</p>
                       )}
                    </div>
                 )}

                 {selectedStep.taskType === 'qa' && (
                    <div className="space-y-3 pt-2 border-t border-slate-700">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-400">問題列表</label>
                          <button onClick={addQaItem} className="text-xs text-blue-400 hover:text-blue-300">+ 新增</button>
                       </div>
                       {selectedStep.qaItems?.map((item, idx) => (
                          <div key={idx} className="bg-slate-800/50 p-2 rounded border border-slate-700 space-y-2">
                             <div className="flex justify-between items-start">
                                <span className="text-[10px] text-slate-500">問題 {idx + 1}</span>
                                <button onClick={() => removeQaItem(idx)} className="text-slate-500 hover:text-red-500 text-xs">×</button>
                             </div>
                             <input 
                               type="text" 
                               placeholder="問題內容"
                               value={item.question} 
                               onChange={(e) => updateQaItem(idx, 'question', e.target.value)}
                               className="w-full bg-[#0f172a] border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                             />
                             <select 
                               value={item.answerType}
                               onChange={(e) => updateQaItem(idx, 'answerType', e.target.value)}
                               className="w-full bg-[#0f172a] border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                             >
                                <option value="text">文字回答</option>
                                <option value="number">數字回答</option>
                             </select>
                          </div>
                       ))}
                    </div>
                 )}

                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">指派人員</label>
                    <div className="flex items-center gap-2 p-2 bg-[#0f172a] border border-slate-600 rounded">
                       <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white">SC</div>
                       <input 
                         type="text" 
                         value={selectedStep.assignee || ''} 
                         onChange={(e) => setSelectedStep({...selectedStep, assignee: e.target.value})}
                         placeholder="輸入姓名"
                         className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder-slate-600"
                       />
                    </div>
                 </div>
               </>
             )}
             
             <div className="pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                   <span>幾何資訊</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="text-[10px] text-slate-500">寬度</label>
                      <input type="number" value={selectedStep.width || 0} disabled className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400" />
                   </div>
                   <div>
                      <label className="text-[10px] text-slate-500">高度</label>
                      <input type="number" value={selectedStep.height || 0} disabled className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400" />
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <Icons.Settings />
            <p className="mt-2 text-sm">點擊畫布上的節點以編輯屬性</p>
          </div>
        )}

        <div className="p-4 border-t border-slate-700 bg-slate-800 gap-3 grid grid-cols-2 shrink-0">
           <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors">
             儲存草稿
           </button>
           <button 
             onClick={() => setIsPublishModalOpen(true)}
             className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
           >
             發布新版
           </button>
        </div>
      </aside>

      {/* Publish Modal */}
      {isPublishModalOpen && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] border border-slate-600 rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
               <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-white text-lg">發布新版本</h3>
                  <button onClick={() => setIsPublishModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center gap-3">
                     <div className="text-blue-400"><Icons.GitBranch /></div>
                     <div>
                        <div className="text-xs text-slate-400">當前版本</div>
                        <div className="text-sm font-mono text-white">{sop.version}</div>
                     </div>
                     <div className="text-slate-500">→</div>
                     <div>
                        <div className="text-xs text-blue-300 font-bold">新版本號</div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1">新版本號</label>
                     <input 
                        type="text" 
                        value={publishData.version}
                        onChange={(e) => setPublishData({...publishData, version: e.target.value})}
                        className="w-full bg-[#0f172a] border border-slate-600 rounded p-2.5 text-sm text-white focus:border-blue-500 outline-none font-mono"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1">更新日誌 (Change Log)</label>
                     <textarea 
                        rows={3}
                        value={publishData.log}
                        onChange={(e) => setPublishData({...publishData, log: e.target.value})}
                        placeholder="請簡述此次修改的內容..."
                        className="w-full bg-[#0f172a] border border-slate-600 rounded p-2.5 text-sm text-white focus:border-blue-500 outline-none resize-none"
                     />
                  </div>
               </div>

               <div className="p-5 border-t border-slate-700 flex justify-end gap-3 bg-slate-800/50 rounded-b-xl">
                  <button 
                     onClick={() => setIsPublishModalOpen(false)}
                     className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                     取消
                  </button>
                  <button 
                     onClick={handlePublish}
                     className="px-4 py-2 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20 transition-colors flex items-center gap-2"
                  >
                     <Icons.Check /> 確認發布
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};