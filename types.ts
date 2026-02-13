export type SOPStatus = 'Active' | 'Draft' | 'Archived';

export interface SOPStep {
  id: string;
  title: string;
  description: string;
  type: 'start' | 'task' | 'decision' | 'end' | 'swimlane' | 'text';
  // Task specific properties
  taskType?: 'simple' | 'checklist' | 'qa';
  assignee?: string;
  checklistItems?: string[]; // For 'checklist' type
  qaItems?: { id: string; question: string; answerType: 'text' | 'number' }[]; // For 'qa' type
  
  // Graph properties
  nextStepId?: string | string[]; // Single ID or array for branches
  position?: { x: number; y: number }; // For visual editor
  width?: number;
  height?: number;
  parentId?: string; // For nesting inside swimlanes
}

export interface SOP {
  id: string;
  title: string;
  category: string;
  version: string;
  status: SOPStatus;
  lastUpdated: string;
  author: string;
  description: string;
  steps: SOPStep[];
}

export interface SOPVersion {
  id: string;
  sopId: string;
  version: string;
  committedAt: string; // Date string
  committedBy: string;
  changeLog: string;
  status: 'Published' | 'Draft' | 'Deprecated';
}

export interface SOPSchedule {
  id: string;
  sopId: string;
  sopTitle: string;
  scheduledTime: string; // ISO Format or display string like '2023-10-25 14:00'
  repeat?: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Pending' | 'Overdue';
}

export interface ExecutionLog {
  id: string;
  sopId: string;
  sopTitle: string;
  executor: string;
  startTime: string;
  endTime?: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  stepLogs: {
    stepId: string;
    completedAt: string;
    note?: string;
    status: 'success' | 'warning' | 'error';
    // Capture user inputs
    checklistResult?: boolean[];
    qaResult?: { questionId: string; answer: string }[];
  }[];
}