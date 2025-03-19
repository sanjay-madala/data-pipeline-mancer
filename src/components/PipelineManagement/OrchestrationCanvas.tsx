
import React, { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  Node, 
  XYPosition 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';

import { nodeTypes } from '@/components/DAGBuilder/NodeTypes';
import { PipelineConfig, OrchestrationConfig, PipelineNode, NodeType } from '@/types/pipeline';
import { Button } from '@/components/ui/button';
import { Play, Save } from 'lucide-react';
import { PipelineEdge } from '@/types/pipeline';

interface OrchestrationCanvasProps {
  orchestration: OrchestrationConfig;
  availablePipelines: PipelineConfig[];
  onSave: (orchestration: OrchestrationConfig) => void;
  onExecute: (orchestrationId: string) => void;
}

export const OrchestrationCanvas: React.FC<OrchestrationCanvasProps> = ({
  orchestration,
  availablePipelines,
  onSave,
  onExecute,
}) => {
  const [nodes, setNodes] = useState<PipelineNode[]>(orchestration.nodes);
  const [edges, setEdges] = useState<PipelineEdge[]>(orchestration.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      const updatedNodes = changes.reduce((acc: PipelineNode[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter((node) => node.id !== change.id);
        } else if (change.type === 'position' || change.type === 'dimensions') {
          return acc.map((node) => {
            if (node.id === change.id) {
              return { ...node, ...change.position && { position: change.position } };
            }
            return node;
          });
        }
        return acc;
      }, [...nds]);
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      const updatedEdges = changes.reduce((acc: PipelineEdge[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter((edge) => edge.id !== change.id);
        }
        return acc;
      }, [...eds]);
      return updatedEdges;
    });
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => [...eds, { id: `e-${Date.now()}`, ...params }]);
  }, []);

  const addNode = (type: NodeType, pipelineId?: string) => {
    if (!reactFlowInstance) {
      toast.error('Canvas not ready');
      return;
    }

    const position = reactFlowInstance.project({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
    });

    let label = '';
    let description = '';
    
    if (type === 'pipelineReference' && pipelineId) {
      const pipeline = availablePipelines.find(p => p.id === pipelineId);
      if (pipeline) {
        label = `Pipeline: ${pipeline.name}`;
        description = pipeline.description || '';
      }
    } else {
      switch (type) {
        case 'orchestrationStart':
          label = 'Start';
          break;
        case 'orchestrationEnd':
          label = 'End';
          break;
        case 'orchestrationCondition':
          label = 'Condition';
          break;
        default:
          label = 'Node';
      }
    }

    const newNode: PipelineNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: {
        label,
        description,
        pipelineId,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    const updatedOrchestration: OrchestrationConfig = {
      ...orchestration,
      nodes,
      edges,
    };
    onSave(updatedOrchestration);
    toast.success('Orchestration saved');
  };

  const handleExecute = () => {
    onExecute(orchestration.id);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">{orchestration.name}</h2>
          <p className="text-sm text-muted-foreground">{orchestration.description}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save size={16} />
            <span>Save</span>
          </Button>
          <Button onClick={handleExecute} className="flex items-center gap-1">
            <Play size={16} />
            <span>Execute</span>
          </Button>
        </div>
      </div>

      <div className="p-2 mb-4 border rounded-md flex flex-wrap gap-2">
        <Button size="sm" onClick={() => addNode('orchestrationStart')}>
          Start
        </Button>
        <Button size="sm" onClick={() => addNode('orchestrationEnd')}>
          End
        </Button>
        <Button size="sm" onClick={() => addNode('orchestrationCondition')}>
          Condition
        </Button>
        {availablePipelines.map((pipeline) => (
          <Button
            key={pipeline.id}
            size="sm"
            variant="outline"
            onClick={() => addNode('pipelineReference', pipeline.id)}
          >
            {pipeline.name}
          </Button>
        ))}
      </div>

      <div className="flex-1 border rounded-md" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes as Node[]}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
