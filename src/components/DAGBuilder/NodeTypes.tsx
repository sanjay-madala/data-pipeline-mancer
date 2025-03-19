
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cloud, Database, Table, ArrowDownToLine, Code, Play, CheckCircle2, Split, FileCode } from "lucide-react";
import { NodeType } from '@/types/pipeline';

interface NodeProps {
  id: string;
  data: {
    label: string;
    description?: string;
  };
  selected: boolean;
  type: NodeType;
}

const nodeConfig = {
  gcsSource: {
    icon: Cloud,
    class: 'gcs-node',
    handles: { inputs: 0, outputs: 1 }
  },
  clickhouseConnect: {
    icon: Database,
    class: 'clickhouse-node',
    handles: { inputs: 1, outputs: 1 }
  },
  schemaMapping: {
    icon: Table,
    class: 'sql-node',
    handles: { inputs: 1, outputs: 1 }
  },
  dataLoad: {
    icon: ArrowDownToLine,
    class: 'load-node',
    handles: { inputs: 1, outputs: 1 }
  },
  sqlExecution: {
    icon: Code,
    class: 'transform-node',
    handles: { inputs: 1, outputs: 1 }
  },
  customStep: {
    icon: FileCode,
    class: 'custom-node',
    handles: { inputs: 1, outputs: 1 }
  },
  pipelineReference: {
    icon: Play,
    class: 'pipeline-node',
    handles: { inputs: 1, outputs: 1 }
  },
  orchestrationStart: {
    icon: Play,
    class: 'orchestration-start-node',
    handles: { inputs: 0, outputs: 1 }
  },
  orchestrationEnd: {
    icon: CheckCircle2,
    class: 'orchestration-end-node',
    handles: { inputs: 1, outputs: 0 }
  },
  orchestrationCondition: {
    icon: Split,
    class: 'orchestration-condition-node',
    handles: { inputs: 1, outputs: 2 }
  }
};

const BaseNode = memo(({ id, data, selected, type }: NodeProps) => {
  const config = nodeConfig[type as keyof typeof nodeConfig];
  const Icon = config.icon;
  
  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 
                   ${config.class} ${selected ? 'shadow-md ring-2 ring-primary/50' : 'shadow'}
                   transform-gpu hover:scale-[1.02] w-60`}>
      {config.handles.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 -ml-1.5"
        />
      )}
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-md shadow-sm">
          <Icon size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-medium truncate">{data.label}</div>
          {data.description && (
            <div className="text-xs opacity-70 truncate">{data.description}</div>
          )}
        </div>
      </div>
      
      {config.handles.outputs > 0 && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 -mr-1.5"
        />
      )}

      {type === 'orchestrationCondition' && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 -mb-1.5"
        />
      )}
    </div>
  );
});

export const GCSSourceNode = (props: NodeProps) => <BaseNode {...props} type="gcsSource" />;
export const ClickhouseConnectNode = (props: NodeProps) => <BaseNode {...props} type="clickhouseConnect" />;
export const SchemaMappingNode = (props: NodeProps) => <BaseNode {...props} type="schemaMapping" />;
export const DataLoadNode = (props: NodeProps) => <BaseNode {...props} type="dataLoad" />;
export const SQLExecutionNode = (props: NodeProps) => <BaseNode {...props} type="sqlExecution" />;
export const CustomStepNode = (props: NodeProps) => <BaseNode {...props} type="customStep" />;
export const PipelineReferenceNode = (props: NodeProps) => <BaseNode {...props} type="pipelineReference" />;
export const OrchestrationStartNode = (props: NodeProps) => <BaseNode {...props} type="orchestrationStart" />;
export const OrchestrationEndNode = (props: NodeProps) => <BaseNode {...props} type="orchestrationEnd" />;
export const OrchestrationConditionNode = (props: NodeProps) => <BaseNode {...props} type="orchestrationCondition" />;

export const nodeTypes = {
  gcsSource: GCSSourceNode,
  clickhouseConnect: ClickhouseConnectNode,
  schemaMapping: SchemaMappingNode,
  dataLoad: DataLoadNode,
  sqlExecution: SQLExecutionNode,
  customStep: CustomStepNode,
  pipelineReference: PipelineReferenceNode,
  orchestrationStart: OrchestrationStartNode,
  orchestrationEnd: OrchestrationEndNode,
  orchestrationCondition: OrchestrationConditionNode,
};
