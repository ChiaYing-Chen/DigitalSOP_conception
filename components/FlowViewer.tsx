import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { SOPStep } from '../types';

interface FlowViewerProps {
  steps: SOPStep[];
  currentStepId: string;
  completedStepIds: string[];
}

export const FlowViewer: React.FC<FlowViewerProps> = ({ 
  steps, 
  currentStepId,
  completedStepIds
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // Initialize Graph
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      interacting: false, // Read-only
      background: {
        color: '#0f172a',
      },
      grid: {
        size: 10,
        visible: true,
        type: 'dot',
        args: { 
          color: '#1e293b', 
          thickness: 1 
        },
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: { radius: 8 },
        },
        anchor: 'center',
        connectionPoint: 'boundary',
      },
    });

    // Register Custom Shapes (Same as Editor for consistency, but distinct registry if needed)
    // We re-register to ensure availability in this route context
    
    // 1. Swimlane
    Graph.registerNode('viewer-swimlane', {
      inherit: 'rect',
      attrs: {
        body: {
          fill: '#1e293b',
          stroke: '#334155',
          strokeWidth: 2,
          strokeDasharray: '5 5',
          rx: 4, ry: 4,
        },
        label: {
          fill: '#64748b',
          fontSize: 14,
          fontWeight: 'bold',
          refY: 20,
        },
      },
      zIndex: 1,
    }, true);

    // 2. Task
    Graph.registerNode('viewer-task', {
      inherit: 'rect',
      width: 140, height: 60,
      attrs: {
        body: {
          fill: '#334155',
          stroke: '#64748b',
          strokeWidth: 1,
          rx: 6, ry: 6,
        },
        label: {
          fill: '#f1f5f9',
          fontSize: 12,
        },
      },
      zIndex: 10,
    }, true);

    // 3. Decision
    Graph.registerNode('viewer-decision', {
      inherit: 'polygon',
      width: 100, height: 80,
      points: '0,40 50,0 100,40 50,80',
      attrs: {
        body: {
          fill: '#334155',
          stroke: '#f59e0b',
          strokeWidth: 1,
        },
        label: {
          text: '?',
          fill: '#f59e0b',
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      zIndex: 10,
    }, true);

    // 4. Start/End
    Graph.registerNode('viewer-circle', {
      inherit: 'circle',
      width: 60, height: 60,
      attrs: {
        body: {
          fill: '#334155',
          strokeWidth: 2,
        },
        label: {
          fill: '#fff',
          fontSize: 12,
        },
      },
      zIndex: 10,
    }, true);

    graphRef.current = graph;

    return () => {
      graph.dispose();
    };
  }, []);

  // Render and Update Graph based on props
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    // Render Nodes
    const cells: any[] = [];
    
    steps.forEach(step => {
      let shapeType = 'viewer-task';
      let attrs: any = {};
      
      if (step.type === 'start') {
         shapeType = 'viewer-circle';
         attrs = { body: { stroke: '#10b981' }, label: { text: step.title }};
      } else if (step.type === 'end') {
         shapeType = 'viewer-circle';
         attrs = { body: { stroke: '#ef4444' }, label: { text: step.title }};
      } else if (step.type === 'decision') {
         shapeType = 'viewer-decision';
         attrs = { label: { text: '?' } }; 
      } else if (step.type === 'swimlane') {
         shapeType = 'viewer-swimlane';
         attrs = { label: { text: step.title } };
      } else {
         attrs = { label: { text: step.title } };
      }

      // Determine State Styles
      const isCurrent = step.id === currentStepId;
      const isCompleted = completedStepIds.includes(step.id);

      if (isCurrent) {
        attrs.body = { ...attrs.body, stroke: '#3b82f6', strokeWidth: 3, fill: '#1e3a8a' }; // Blue Highight
        attrs.label = { ...attrs.label, fill: '#ffffff', fontWeight: 'bold' };
      } else if (isCompleted) {
        attrs.body = { ...attrs.body, stroke: '#10b981', strokeWidth: 2, fill: '#064e3b' }; // Green Completed
        attrs.label = { ...attrs.label, fill: '#a7f3d0' };
      }

      const node = graph.createNode({
        id: step.id,
        shape: shapeType,
        x: step.position?.x || 0,
        y: step.position?.y || 0,
        width: step.width,
        height: step.height,
        attrs: attrs,
      });
      
      cells.push(node);
    });

    // Render Edges
    steps.forEach(step => {
      if (step.nextStepId) {
        const targets = Array.isArray(step.nextStepId) ? step.nextStepId : [step.nextStepId];
        targets.forEach(targetId => {
          if (steps.find(s => s.id === targetId)) {
            // Check if this path is "active" (i.e., start node is completed/current and end node is completed/current)
            // Simplified logic: highlight edge if source is completed
            const isPathActive = completedStepIds.includes(step.id);
            
            cells.push(graph.createEdge({
               source: step.id,
               target: targetId,
               attrs: {
                line: {
                  stroke: isPathActive ? '#10b981' : '#475569',
                  strokeWidth: isPathActive ? 2 : 1,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8,
                    fill: isPathActive ? '#10b981' : '#475569',
                  },
                },
               }
            }));
          }
        });
      }
    });

    graph.resetCells(cells);

    // Center on current node
    const currentNode = graph.getCellById(currentStepId);
    if (currentNode) {
       graph.centerCell(currentNode, { animation: { duration: 600 } });
       // graph.select(currentNode); // Removed to fix TypeError as Selection plugin is not used
    } else {
       graph.centerContent();
    }

  }, [steps, currentStepId, completedStepIds]);

  return (
    <div className="w-full h-full shadow-inner bg-[#0f172a]" ref={containerRef} />
  );
};