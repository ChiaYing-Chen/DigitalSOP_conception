import React, { useEffect, useRef } from 'react';
import { Graph, Shape } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Dnd } from '@antv/x6-plugin-dnd';
import { SOPStep } from '../types';

interface FlowEditorProps {
  steps: SOPStep[];
  onStepsChange: (steps: SOPStep[]) => void;
  onSelectStep: (step: SOPStep | null) => void;
  onInitDrag: (startDragFn: (e: React.MouseEvent, type: string) => void) => void;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ 
  steps, 
  onStepsChange, 
  onSelectStep,
  onInitDrag 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const dndRef = useRef<Dnd | null>(null);

  // Initialize Graph
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      background: {
        color: '#0f172a',
      },
      grid: {
        size: 10,
        visible: true,
        type: 'mesh',
        args: {
          color: '#1e293b',
          thickness: 1,
        },
      },
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      connecting: {
        router: {
          name: 'manhattan',
          args: {
            padding: 20,
            obstacleAvoidance: true, // Smart routing around nodes
          },
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'boundary',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#94a3b8',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          });
        },
      },
      embedding: {
        enabled: true,
        findParent: 'bbox', // Automatically find parent by bounding box
        frontOnly: false,
      },
    });

    // Plugins
    graph
      .use(new Transform({
        resizing: true,
        rotating: false,
      }))
      .use(new Selection({
        rubberband: true,
        showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
      }))
      .use(new Snapline({
        enabled: true,
      }));

    // Events
    graph.on('node:click', ({ node }) => {
      const data = node.getData() as SOPStep;
      if (data) {
        onSelectStep({ ...data, id: node.id });
      }
    });

    graph.on('blank:click', () => {
      onSelectStep(null);
    });

    // Node added/moved/resized event
    graph.on('node:change:position', () => {
       // In a full app, we sync position changes back to parent state here
    });

    graphRef.current = graph;
    dndRef.current = new Dnd({
      target: graph,
      scaled: false,
    });

    // Register Custom Shapes
    // 1. Swimlane (Container)
    Graph.registerNode('custom-swimlane', {
      inherit: 'rect',
      width: 300,
      height: 500,
      attrs: {
        body: {
          fill: '#1e293b',
          stroke: '#475569',
          strokeWidth: 2,
          strokeDasharray: '5 5',
          rx: 4,
          ry: 4,
        },
        label: {
          text: '垂直泳道',
          fill: '#94a3b8',
          fontSize: 14,
          fontWeight: 'bold',
          refY: 20,
        },
      },
      zIndex: 1, // Lower z-index so tasks sit on top
    });

    // 2. Task Node
    Graph.registerNode('custom-task', {
      inherit: 'rect',
      width: 140,
      height: 60,
      attrs: {
        body: {
          fill: '#334155',
          stroke: '#64748b',
          strokeWidth: 1,
          rx: 6,
          ry: 6,
        },
        label: {
          text: '任務節點',
          fill: '#f1f5f9',
          fontSize: 12,
        },
      },
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#3b82f6', fill: '#fff' } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#3b82f6', fill: '#fff' } } },
          left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#3b82f6', fill: '#fff' } } },
          right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#3b82f6', fill: '#fff' } } },
        },
        items: [
          { group: 'top' },
          { group: 'bottom' },
          { group: 'left' },
          { group: 'right' },
        ],
      },
      zIndex: 10,
    });

    // 3. Decision Node
    Graph.registerNode('custom-decision', {
      inherit: 'polygon',
      width: 100,
      height: 80,
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
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#f59e0b', fill: '#fff' } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#f59e0b', fill: '#fff' } } },
          left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#f59e0b', fill: '#fff' } } },
          right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#f59e0b', fill: '#fff' } } },
        },
        items: [
          { group: 'top' },
          { group: 'bottom' },
          { group: 'left' },
          { group: 'right' },
        ],
      },
      zIndex: 10,
    });

    // 4. Start/End Node
    Graph.registerNode('custom-circle', {
      inherit: 'circle',
      width: 60,
      height: 60,
      attrs: {
        body: {
          fill: '#334155',
          stroke: '#10b981',
          strokeWidth: 2,
        },
        label: {
          text: 'Start',
          fill: '#fff',
          fontSize: 12,
        },
      },
      ports: {
        items: [
          { group: 'top' }, { group: 'bottom' }, { group: 'left' }, { group: 'right' }
        ],
        groups: {
           top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#10b981', fill: '#fff' } } },
           bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#10b981', fill: '#fff' } } },
           left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#10b981', fill: '#fff' } } },
           right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#10b981', fill: '#fff' } } },
        }
      },
      zIndex: 10,
    });

    // 5. Text Node
    Graph.registerNode('custom-text', {
      inherit: 'rect',
      width: 120,
      height: 40,
      attrs: {
        body: {
          fill: 'transparent',
          stroke: 'transparent',
        },
        label: {
          text: '文字標籤',
          fill: '#cbd5e1',
          fontSize: 14,
        },
      },
      zIndex: 10,
    });

    // Initial Render
    renderGraph(graph, steps);

    // Setup Drag Function for Parent
    onInitDrag((e: React.MouseEvent, type: string) => {
      if (!dndRef.current || !graphRef.current) return;

      let node;
      if (type === 'swimlane') {
        node = graphRef.current.createNode({
          shape: 'custom-swimlane',
          data: { type: 'swimlane', title: '垂直泳道' }
        });
      } else if (type === 'task-simple') {
        node = graphRef.current.createNode({
          shape: 'custom-task',
          label: '簡易任務',
          data: { type: 'task', taskType: 'simple', title: '簡易任務' }
        });
      } else if (type === 'task-check') {
        node = graphRef.current.createNode({
          shape: 'custom-task',
          label: '檢核任務',
          data: { type: 'task', taskType: 'checklist', title: '檢核任務', checklistItems: ['項目 1'] }
        });
      } else if (type === 'task-qa') {
        node = graphRef.current.createNode({
          shape: 'custom-task',
          label: '問答任務',
          data: { type: 'task', taskType: 'qa', title: '問答任務', qaItems: [{ id: 'q1', question: '問題 1', answerType: 'text' }] }
        });
      } else if (type === 'decision') {
        node = graphRef.current.createNode({
          shape: 'custom-decision',
          label: 'Check?',
          data: { type: 'decision', title: '判斷?' }
        });
      } else if (type === 'start') {
        node = graphRef.current.createNode({
          shape: 'custom-circle',
          label: 'Start',
          attrs: { body: { stroke: '#10b981' } },
          data: { type: 'start', title: 'Start' }
        });
      } else if (type === 'end') {
        node = graphRef.current.createNode({
          shape: 'custom-circle',
          label: 'End',
          attrs: { body: { stroke: '#ef4444' } },
          data: { type: 'end', title: 'End' }
        });
      } else if (type === 'text') {
        node = graphRef.current.createNode({
          shape: 'custom-text',
          label: '輸入文字...',
          data: { type: 'text', title: '文字說明' }
        });
      }

      if (node) {
        dndRef.current.start(node, e.nativeEvent as any);
      }
    });

    return () => {
      graph.dispose();
    };
  }, []);

  const renderGraph = (graph: Graph, steps: SOPStep[]) => {
    const cells: any[] = [];
    
    // Create Nodes
    steps.forEach(step => {
      let shapeType = 'custom-task';
      let attrs: any = {};
      
      if (step.type === 'start') {
         shapeType = 'custom-circle';
         attrs = { body: { stroke: '#10b981' }, label: { text: step.title }};
      } else if (step.type === 'end') {
         shapeType = 'custom-circle';
         attrs = { body: { stroke: '#ef4444' }, label: { text: step.title }};
      } else if (step.type === 'decision') {
         shapeType = 'custom-decision';
         attrs = { label: { text: '?' } }; 
      } else if (step.type === 'swimlane') {
         shapeType = 'custom-swimlane';
         attrs = { label: { text: step.title } };
      } else if (step.type === 'text') {
         shapeType = 'custom-text';
         attrs = { label: { text: step.title } };
      } else {
         // Task types share the same shape but might have different labels in full view
         attrs = { label: { text: step.title } };
      }

      const node = graph.createNode({
        id: step.id,
        shape: shapeType,
        x: step.position?.x || 0,
        y: step.position?.y || 0,
        width: step.width,
        height: step.height,
        attrs: attrs,
        data: step, // Store full data
      });
      
      cells.push(node);
    });

    // Create Edges
    steps.forEach(step => {
      if (step.nextStepId) {
        const targets = Array.isArray(step.nextStepId) ? step.nextStepId : [step.nextStepId];
        targets.forEach(targetId => {
          if (steps.find(s => s.id === targetId)) {
            const edge = graph.createEdge({
               source: step.id,
               target: targetId,
               attrs: {
                line: {
                  stroke: '#94a3b8',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8,
                  },
                },
               }
            });
            cells.push(edge);
          }
        });
      }
    });

    graph.resetCells(cells);
    graph.centerContent();
  };

  return (
    <div className="w-full h-full" ref={containerRef} />
  );
};