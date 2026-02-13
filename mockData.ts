import { SOP, ExecutionLog, SOPSchedule, SOPVersion } from './types';

export const mockSOPs: SOP[] = [
  {
    id: 'sop-001',
    title: '發票審核流程',
    category: '財務部',
    version: 'v1.3',
    status: 'Active',
    lastUpdated: '2小時前',
    author: 'Sarah Chen',
    description: '標準的月度發票審核與付款批准流程，包含副總裁審核機制。',
    steps: [
      { id: '1', title: '收到請求', description: '系統自動接收發票請求', type: 'start', position: { x: 100, y: 200 }, width: 100, height: 40, nextStepId: '2' },
      { 
        id: '2', 
        title: '核准發票', 
        description: '財務專員確認發票內容無誤', 
        type: 'task', 
        taskType: 'checklist',
        assignee: 'Sarah Chen', 
        checklistItems: ['確認發票抬頭統編正確', '確認金額與請款單一致', '確認附件完整'],
        position: { x: 300, y: 190 }, 
        width: 140, 
        height: 60, 
        nextStepId: '3' 
      },
      { id: '3', title: '金額 > $5k?', description: '檢查金額是否超過授權上限', type: 'decision', position: { x: 550, y: 180 }, width: 120, height: 80, nextStepId: ['4', '5'] }, // 4 is Yes, 5 is No
      { 
        id: '4', 
        title: '副總裁審核', 
        description: '需要副總裁層級批准', 
        type: 'task', 
        taskType: 'qa',
        assignee: 'Alex T', 
        qaItems: [{ id: 'q1', question: '批准理由', answerType: 'text' }, { id: 'q2', question: '核准金額', answerType: 'number' }],
        position: { x: 750, y: 100 }, 
        width: 140, 
        height: 60, 
        nextStepId: '5' 
      },
      { id: '5', title: '處理付款', description: '安排銀行轉帳', type: 'task', taskType: 'simple', assignee: 'System', position: { x: 750, y: 300 }, width: 140, height: 60, nextStepId: '6' },
      { id: '6', title: '結束', description: '流程完成', type: 'end', position: { x: 950, y: 310 }, width: 100, height: 40 },
    ]
  },
  {
    id: 'sop-002',
    title: '新進員工報到',
    category: '人資部',
    version: 'v2.1',
    status: 'Draft',
    lastUpdated: '1天前',
    author: 'Mike Ross',
    description: '包含IT設備申請、帳號開通以及入職培訓安排。',
    steps: [
      { id: '1', title: 'HR資料建立', description: '在系統建立員工基本資料', type: 'start', position: { x: 100, y: 150 }, width: 100, height: 40, nextStepId: '2' },
      { id: '2', title: 'IT設備準備', description: '申請筆電與螢幕', type: 'task', taskType: 'checklist', checklistItems: ['筆記型電腦', '外接螢幕', '滑鼠與鍵盤'], position: { x: 300, y: 140 }, width: 140, height: 60, nextStepId: '3' },
      { id: '3', title: '帳號開通', description: 'Email與Slack開通', type: 'task', taskType: 'simple', position: { x: 500, y: 140 }, width: 140, height: 60, nextStepId: '4' },
      { id: '4', title: '流程結束', description: '準備迎接第一天', type: 'end', position: { x: 700, y: 150 }, width: 100, height: 40 },
    ]
  },
  {
    id: 'sop-003',
    title: '伺服器維護',
    category: 'IT維運',
    version: 'v1.0',
    status: 'Active',
    lastUpdated: '3天前',
    author: 'DevOps Team',
    description: '每週例行性伺服器重啟與日誌清理作業標準程序。',
    steps: []
  }
];

export const mockVersions: SOPVersion[] = [
  { id: 'v-001', sopId: 'sop-001', version: 'v1.0', committedAt: '2023-10-01 09:00', committedBy: 'Sarah Chen', changeLog: '初始版本建立', status: 'Deprecated' },
  { id: 'v-002', sopId: 'sop-001', version: 'v1.1', committedAt: '2023-10-10 14:30', committedBy: 'Sarah Chen', changeLog: '新增金額審核節點', status: 'Deprecated' },
  { id: 'v-003', sopId: 'sop-001', version: 'v1.2', committedAt: '2023-10-15 11:00', committedBy: 'Manager Wu', changeLog: '調整副總裁審核門檻', status: 'Deprecated' },
  { id: 'v-004', sopId: 'sop-001', version: 'v1.3', committedAt: '2023-10-24 16:00', committedBy: 'Sarah Chen', changeLog: '優化付款流程', status: 'Published' },
  { id: 'v-005', sopId: 'sop-002', version: 'v1.0', committedAt: '2023-09-01 09:00', committedBy: 'Mike Ross', changeLog: '建立報到基本流程', status: 'Deprecated' },
  { id: 'v-006', sopId: 'sop-002', version: 'v2.0', committedAt: '2023-10-05 10:00', committedBy: 'Mike Ross', changeLog: '整合 IT 設備申請', status: 'Published' },
  { id: 'v-007', sopId: 'sop-002', version: 'v2.1', committedAt: '2023-10-25 09:00', committedBy: 'Mike Ross', changeLog: '修正 Email 開通權限說明 (Draft)', status: 'Draft' },
];

export const mockSchedules: SOPSchedule[] = [
  {
    id: 'sch-001',
    sopId: 'sop-003',
    sopTitle: '伺服器維護',
    scheduledTime: '2023-10-27 02:00',
    repeat: 'Weekly',
    status: 'Pending'
  },
  {
    id: 'sch-002',
    sopId: 'sop-001',
    sopTitle: '發票審核流程',
    scheduledTime: '2023-10-27 17:00',
    repeat: 'Monthly',
    status: 'Pending'
  },
  {
    id: 'sch-003',
    sopId: 'sop-002',
    sopTitle: '新進員工報到 (John Doe)',
    scheduledTime: '2023-10-26 09:00',
    repeat: 'Once',
    status: 'Overdue'
  }
];

export const mockHistory: ExecutionLog[] = [
  {
    id: 'exec-9921',
    sopId: 'sop-001',
    sopTitle: '發票審核流程',
    executor: 'Alex Morgan',
    startTime: '2023-10-24 10:30',
    endTime: '2023-10-24 11:15',
    status: 'Completed',
    stepLogs: [
      { stepId: '1', completedAt: '10:30', status: 'success' },
      { stepId: '2', completedAt: '10:35', status: 'success', note: '發票號碼 INV-2023-001 確認無誤' },
      { stepId: '3', completedAt: '10:36', status: 'success', note: '金額 $3,200，無需副總裁審核' },
      { stepId: '5', completedAt: '10:40', status: 'success' },
      { stepId: '6', completedAt: '10:41', status: 'success' },
    ]
  },
  {
    id: 'exec-9920',
    sopId: 'sop-003',
    sopTitle: '伺服器維護',
    executor: 'System Bot',
    startTime: '2023-10-23 02:00',
    endTime: '2023-10-23 02:05',
    status: 'Failed',
    stepLogs: [
      { stepId: '1', completedAt: '02:00', status: 'success' },
      { stepId: '2', completedAt: '02:01', status: 'error', note: '無法連接到資料庫節點 DB-02' }
    ]
  }
];