
export type NodeType = 
  | "gcsSource" 
  | "clickhouseConnect" 
  | "schemaMapping" 
  | "dataLoad" 
  | "sqlExecution"
  | "customStep"
  | "pipelineReference"
  | "orchestrationStart"
  | "orchestrationEnd"
  | "orchestrationCondition";

export type LoadStrategy = "delete_and_load" | "append";

export interface PipelineNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
  // Add properties expected by ReactFlow's Node type
  dragging?: boolean;
  selected?: boolean;
  height?: number;
  width?: number;
  positionAbsolute?: {
    x: number;
    y: number;
  };
  z?: number;
  sourcePosition?: string;
  targetPosition?: string;
  hidden?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  resizing?: boolean;
}

export interface NodeData {
  label: string;
  description?: string;
  config?: any;
  pipelineId?: string;
  [key: string]: unknown;
}

export interface GCSConfig {
  bucketName: string;
  filePath: string;
  fileFormat: "csv" | "parquet" | "json";
  delimiter?: string;
  hasHeader?: boolean;
}

export interface ClickhouseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  secure: boolean;
}

export interface SchemaField {
  name: string;
  type: string;
  sourceField?: string;
  nullable?: boolean;
}

export interface SchemaConfig {
  tableName: string;
  fields: SchemaField[];
}

export interface DataLoadConfig {
  strategy: LoadStrategy;
  targetTable: string;
}

export interface SQLConfig {
  query: string;
  createMaterializedView?: boolean;
  viewName?: string;
}

export interface CustomStepConfig {
  code: string;
  inputs: string[];
  outputs: string[];
  description: string;
}

export interface OrchestrationConditionConfig {
  condition: string;
  description: string;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: {
    condition?: string;
    label?: string;
  };
}

export interface PipelineConfig {
  id: string;
  name: string;
  description?: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export interface OrchestrationConfig {
  id: string;
  name: string;
  description?: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  pipelines: PipelineConfig[];
}
