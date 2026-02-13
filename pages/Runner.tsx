import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSOPs } from '../mockData';
import { Icons } from '../components/Icons';
import { FlowViewer } from '../components/FlowViewer';

export const Runner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sop = mockSOPs.find(s => s.id === id);
  
  // State for Graph-based execution
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [executionLog, setExecutionLog] = useState<any[]>([]); // To simulate tracking history
  
  // Task specific states
  const [checklistState, setChecklistState] = useState<{[key: number]: boolean}>({});
  const [qaState, setQaState] = useState<{[key: string]: string}>({});
  const [taskNote, setTaskNote] = useState('');

  // Initialize
  useEffect(() => {
    if (sop && sop.steps.length > 0) {
      // Find start node or first node
      const startNode = sop.steps.find(s => s.type === 'start') || sop.steps[0];
      setCurrentStepId(startNode.id);
    }
  }, [sop]);

  // Reset inputs when step changes
  useEffect(() => {
     setChecklistState({});
     setQaState({});
     setTaskNote('');
  }, [currentStepId]);

  if (!sop) return <div className="p-8 text-white">SOP Not Found</div>;

  const currentStep = sop.steps.find(s => s.id === currentStepId);

  const handleCompleteStep = (nextId?: string) => {
    if (!currentStep) return;

    // Record completion
    setCompletedStepIds(prev => [...prev, currentStep.id]);
    setExecutionLog(prev => [...prev, { 
       stepId: currentStep.id, 
       timestamp: new Date(), 
       action: 'complete',
       note: taskNote,
       checklistData: currentStep.taskType === 'checklist' ? checklistState : undefined,
       qaData: currentStep.taskType === 'qa' ? qaState : undefined
    }]);

    // Determine next step
    let targetId = nextId;

    // If no specific target passed (linear flow), try to find from data
    if (!targetId && currentStep.nextStepId) {
      if (typeof currentStep.nextStepId === 'string') {
        targetId = currentStep.nextStepId;
      } else if (Array.isArray(currentStep.nextStepId) && currentStep.nextStepId.length > 0) {
        // Default to first path if not specified (shouldn't happen in decision nodes ideally)
        targetId = currentStep.nextStepId[0];
      }
    }

    if (targetId) {
       // Add a small delay for visual effect
       setTimeout(() => {
         setCurrentStepId(targetId!);
       }, 500);
    } else {
       // End of flow
       setTimeout(() => {
          navigate('/history');
       }, 1000);
    }
  };

  const handleChecklistChange = (index: number) => {
     setChecklistState(prev => ({...prev, [index]: !prev[index]}));
  };

  const handleQaChange = (id: string, value: string) => {
     setQaState(prev => ({...prev, [id]: value}));
  };

  if (!currentStep) return <div className="p-8 text-white">Initializing Flow...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0f172a]">
      {/* Left: Flow Visualizer */}
      <div className="flex-1 min-w-0 relative border-r border-slate-700">
        <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur p-3 rounded-lg border border-slate-700 shadow-lg">
           <h2 className="font-bold text-white flex items-center gap-2">
              <Icons.Play /> {sop.title}
           </h2>
           <p className="text-xs text-slate-400 mt-1">執行代碼: EXEC-{new Date().getTime().toString().slice(-6)}</p>
        </div>
        <FlowViewer 
           steps={sop.steps} 
           currentStepId={currentStepId} 
           completedStepIds={completedStepIds} 
        />
      </div>

      {/* Right: Control Panel */}
      <div className="w-96 shrink-0 flex flex-col bg-[#111827] z-10 shadow-xl">
         {/* Step Header */}
         <div className="p-6 border-b border-slate-700 bg-[#1a202c]">
            <div className="flex items-center gap-2 mb-3">
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  currentStep.type === 'decision' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  currentStep.type === 'start' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
               }`}>
                  {currentStep.type === 'decision' ? '決策點' : 
                   currentStep.taskType === 'checklist' ? '檢核任務' :
                   currentStep.taskType === 'qa' ? '問答任務' : 
                   currentStep.type === 'start' ? '流程開始' : '簡易任務'}
               </span>
               <span className="text-xs text-slate-500">ID: {currentStep.id}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{currentStep.description}</p>
         </div>

         {/* Action Area */}
         <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* 1. Checklist Task */}
            {currentStep.type === 'task' && currentStep.taskType === 'checklist' && (
               <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                     <h4 className="text-sm text-white font-bold mb-3 flex items-center gap-2">
                        <Icons.Check /> 執行檢核表
                     </h4>
                     {currentStep.checklistItems && currentStep.checklistItems.length > 0 ? (
                        currentStep.checklistItems.map((item, idx) => (
                           <label key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-700/50 rounded cursor-pointer transition-colors">
                              <input 
                                 type="checkbox" 
                                 checked={!!checklistState[idx]}
                                 onChange={() => handleChecklistChange(idx)}
                                 className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500" 
                              />
                              <span className="text-sm text-slate-300 leading-tight">{item}</span>
                           </label>
                        ))
                     ) : (
                        <p className="text-xs text-slate-500 italic">此步驟無定義檢核項目</p>
                     )}
                  </div>
               </div>
            )}

            {/* 2. Q&A Task */}
            {currentStep.type === 'task' && currentStep.taskType === 'qa' && (
               <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
                     <h4 className="text-sm text-white font-bold mb-3 flex items-center gap-2">
                        <Icons.Type /> 填寫回答
                     </h4>
                     {currentStep.qaItems && currentStep.qaItems.length > 0 ? (
                        currentStep.qaItems.map((item, idx) => (
                           <div key={idx}>
                              <label className="block text-xs font-bold text-slate-400 mb-1.5">{item.question}</label>
                              <input 
                                 type={item.answerType === 'number' ? 'number' : 'text'}
                                 value={qaState[item.id] || ''}
                                 onChange={(e) => handleQaChange(item.id, e.target.value)}
                                 className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"
                                 placeholder={item.answerType === 'number' ? '請輸入數字...' : '請輸入回答...'}
                              />
                           </div>
                        ))
                     ) : (
                        <p className="text-xs text-slate-500 italic">此步驟無定義問題</p>
                     )}
                  </div>
               </div>
            )}
            
            {/* Common: Text Note Area (For all Tasks) */}
            {currentStep.type === 'task' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">執行備註 (選填)</label>
                  <textarea 
                     value={taskNote}
                     onChange={(e) => setTaskNote(e.target.value)}
                     className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                     rows={3} 
                     placeholder="請輸入執行過程中的觀察或額外資訊..."
                  ></textarea>
                </div>
            )}

            {currentStep.type === 'decision' && (
               <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-2">
                     <span className="text-3xl font-bold">?</span>
                  </div>
                  <p className="text-slate-300 text-center text-sm px-4">請根據當前狀況選擇流程路徑</p>
               </div>
            )}

            {currentStep.type === 'start' && (
               <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-500/10">
                     <Icons.Play />
                  </div>
                  <p className="text-slate-300 text-sm">準備開始執行此標準作業程序</p>
               </div>
            )}
            
            {currentStep.type === 'end' && (
               <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4 ring-4 ring-blue-500/10">
                     <Icons.Check />
                  </div>
                  <p className="text-slate-300 text-sm">流程已到達終點，請確認後歸檔</p>
               </div>
            )}
         </div>

         {/* Footer Actions */}
         <div className="p-6 border-t border-slate-700 bg-[#1a202c]">
            {currentStep.type === 'decision' && Array.isArray(currentStep.nextStepId) ? (
               <div className="grid grid-cols-2 gap-3">
                  <button 
                     onClick={() => handleCompleteStep(currentStep.nextStepId![0])}
                     className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
                  >
                     是 / 通過
                  </button>
                  <button 
                     onClick={() => handleCompleteStep(currentStep.nextStepId![1])}
                     className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
                  >
                     否 / 退回
                  </button>
               </div>
            ) : (
               <button 
                  onClick={() => handleCompleteStep()}
                  className={`w-full py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                     currentStep.type === 'end' 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                  }`}
               >
                  {currentStep.type === 'end' ? '完成並歸檔' : (currentStep.type === 'start' ? '開始執行' : '完成步驟')}
                  {currentStep.type !== 'end' && <Icons.ChevronRight />}
               </button>
            )}
         </div>
      </div>
    </div>
  );
};