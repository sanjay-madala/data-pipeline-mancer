
import { useState, useCallback } from 'react';
import { 
  Connection, 
  Edge, 
  Node, 
  addEdge, 
  NodeChange, 
  EdgeChange, 
  applyNodeChanges, 
  applyEdgeChanges, 
  XYPosition
} from '@xyflow/react';
import { PipelineNode, PipelineEdge, NodeType } from '../types/pipeline';
import { toast } from '@/components/ui/sonner';

let nodeId = 0;

export function usePipeline() {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const getDefaultLabel = (type: NodeType): string => {
    switch (type) {
      case 'gcsSource': return 'GCS Source';
      case 'clickhouseConnect': return 'Clickhouse Connection';
      case 'schemaMapping': return 'Schema Mapping';
      case 'dataLoad': return 'Data Load';
      case 'sqlExecution': return 'SQL Execution';
      default: return 'Unknown Node';
    }
  };

  const addNode = useCallback((type: NodeType, position: XYPosition) => {
    const id = `node_${type}_${nodeId++}`;
    const newNode: PipelineNode = {
      id,
      type,
      position,
      data: {
        label: getDefaultLabel(type),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    return newNode;
  }, []);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } } 
          : node
      )
    );
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  }, []);

  const validatePipeline = useCallback(() => {
    // Check if we have at least one source and one destination
    const hasGCSSource = nodes.some(node => node.type === 'gcsSource');
    const hasClickhouseConnect = nodes.some(node => node.type === 'clickhouseConnect');
    
    if (!hasGCSSource) {
      toast.error("Pipeline requires a GCS Source node");
      return false;
    }
    
    if (!hasClickhouseConnect) {
      toast.error("Pipeline requires a Clickhouse Connection node");
      return false;
    }
    
    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (disconnectedNodes.length > 0) {
      toast.error(`There are ${disconnectedNodes.length} disconnected nodes in the pipeline`);
      return false;
    }
    
    // Check for cycles
    const adjacencyList: Record<string, string[]> = {};
    
    nodes.forEach(node => {
      adjacencyList[node.id] = [];
    });
    
    edges.forEach(edge => {
      adjacencyList[edge.source].push(edge.target);
    });
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    function hasCycle(nodeId: string): boolean {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      for (const neighbor of adjacencyList[nodeId]) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }
      
      recursionStack.delete(nodeId);
      return false;
    }
    
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          toast.error("Pipeline contains a cycle, which is not allowed");
          return false;
        }
      }
    }
    
    // All validation checks passed
    return true;
  }, [nodes, edges]);

  const executePipeline = useCallback(() => {
    if (!validatePipeline()) {
      return;
    }
    
    toast.success("Pipeline execution started");
    
    // In a real app, we would connect to actual services here
    setTimeout(() => {
      toast.success("Pipeline executed successfully");
    }, 2000);
  }, [validatePipeline]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    removeNode,
    selectedNode,
    setSelectedNode,
    validatePipeline,
    executePipeline
  };
}
