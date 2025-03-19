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

import { nodeTypes } from './NodeTypes';
import { usePipeline } from '@/hooks/usePipeline';
import { GCSConfigPanel } from '../ConfigPanels/GCSConfig';
import { ClickhouseConfigPanel } from '../ConfigPanels/ClickhouseConfig';
import { SchemaMapper } from '../ConfigPanels/SchemaMapper';
import { DataLoadConfigPanel } from '../ConfigPanels/DataLoadConfig';
import { SQLEditor } from '../ConfigPanels/SQLEditor';
import { PipelineControls } from './PipelineControls';
import { NodeType } from '@/types/pipeline';
import { toast } from 'sonner';

import { GCSConfig, ClickhouseConfig, SchemaConfig, DataLoadConfig, SQLConfig } from '@/types/pipeline';

export const DAGCanvas: React.FC = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    updateNodeData, 
    removeNode,
    validatePipeline,
    executePipeline
  } = usePipeline();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const defaultGCSConfig: GCSConfig = {
    bucketName: '',
    filePath: '',
    fileFormat: 'csv',
  };

  const defaultClickhouseConfig: ClickhouseConfig = {
    host: '',
    port: 8443,
    username: 'default',
    password: '',
    database: 'default',
    secure: true,
  };

  const defaultSchemaConfig: SchemaConfig = {
    tableName: '',
    fields: [{ name: '', type: 'String', sourceField: '', nullable: true }],
  };

  const defaultDataLoadConfig: DataLoadConfig = {
    strategy: 'delete_and_load',
    targetTable: '',
  };

  const defaultSQLConfig: SQLConfig = {
    query: '',
    createMaterializedView: false,
    viewName: '',
  };

  const handleAddNode = (type: NodeType) => {
    if (!reactFlowInstance) {
      toast.error('Canvas not ready. Please try again.');
      return;
    }

    const position = reactFlowInstance.project({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
    });

    addNode(type, position);
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  const handleSaveGCSConfig = (nodeId: string, config: GCSConfig) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.bucketName}/${config.filePath}`
    });
  };

  const handleSaveClickhouseConfig = (nodeId: string, config: ClickhouseConfig) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.host}:${config.port}/${config.database}`
    });
  };

  const handleSaveSchemaConfig = (nodeId: string, config: SchemaConfig) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.tableName} (${config.fields.length} fields)`
    });
  };

  const handleSaveDataLoadConfig = (nodeId: string, config: DataLoadConfig) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.strategy} to ${config.targetTable}`
    });
  };

  const handleSaveSQLConfig = (nodeId: string, config: SQLConfig) => {
    let description = 'SQL Query';
    if (config.createMaterializedView && config.viewName) {
      description = `Materialized View: ${config.viewName}`;
    } 
    updateNodeData(nodeId, { config, description });
  };

  const handleSavePipeline = () => {
    if (validatePipeline()) {
      const pipelineConfig = {
        nodes,
        edges,
      };
      
      localStorage.setItem('savedPipeline', JSON.stringify(pipelineConfig));
      toast.success('Pipeline saved successfully');
    }
  };

  const handleClearPipeline = () => {
    if (window.confirm('Are you sure you want to clear the pipeline? All unsaved changes will be lost.')) {
      // Reset nodes and edges
      onNodesChange([{ type: 'remove', id: 'all' }]);
      onEdgesChange([{ type: 'remove', id: 'all' }]);
      toast.info('Pipeline cleared');
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        <PipelineControls
          onAddNode={handleAddNode}
          onExecute={executePipeline}
          onSave={handleSavePipeline}
          onClear={handleClearPipeline}
        />

        <div className="pipeline-canvas flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes as unknown as Node[]}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            onInit={setReactFlowInstance}
          >
            <Background color="#ddd" gap={24} size={1} />
            <Controls />
            <MiniMap nodeColor={(n) => {
              switch (n.type) {
                case 'gcsSource': return '#3b82f6';
                case 'clickhouseConnect': return '#ec4899';
                case 'schemaMapping': return '#10b981';
                case 'dataLoad': return '#8b5cf6';
                case 'sqlExecution': return '#f59e0b';
                default: return '#888';
              }
            }} />
            
            <Panel position="bottom-right">
              <div className="text-xs text-muted-foreground">
                Drag nodes to position • Double-click canvas to pan
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && selectedNode.type === 'gcsSource' && (
          <GCSConfigPanel
            nodeId={selectedNode.id}
            initialConfig={selectedNode.data.config || defaultGCSConfig}
            onClose={() => setSelectedNode(null)}
            onSave={handleSaveGCSConfig}
          />
        )}

        {selectedNode && selectedNode.type === 'clickhouseConnect' && (
          <ClickhouseConfigPanel
            nodeId={selectedNode.id}
            initialConfig={selectedNode.data.config || defaultClickhouseConfig}
            onClose={() => setSelectedNode(null)}
            onSave={handleSaveClickhouseConfig}
          />
        )}

        {selectedNode && selectedNode.type === 'schemaMapping' && (
          <SchemaMapper
            nodeId={selectedNode.id}
            initialConfig={selectedNode.data.config || defaultSchemaConfig}
            onClose={() => setSelectedNode(null)}
            onSave={handleSaveSchemaConfig}
          />
        )}

        {selectedNode && selectedNode.type === 'dataLoad' && (
          <DataLoadConfigPanel
            nodeId={selectedNode.id}
            initialConfig={selectedNode.data.config || defaultDataLoadConfig}
            onClose={() => setSelectedNode(null)}
            onSave={handleSaveDataLoadConfig}
          />
        )}

        {selectedNode && selectedNode.type === 'sqlExecution' && (
          <SQLEditor
            nodeId={selectedNode.id}
            initialConfig={selectedNode.data.config || defaultSQLConfig}
            onClose={() => setSelectedNode(null)}
            onSave={handleSaveSQLConfig}
          />
        )}
      </div>
    </div>
  );
};
