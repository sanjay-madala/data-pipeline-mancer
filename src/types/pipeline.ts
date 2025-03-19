
export type NodeType = 
  | "gcsSource" 
  | "clickhouseConnect" 
  | "schemaMapping" 
  | "dataLoad" 
  | "sqlExecution";

export type LoadStrategy = "delete_and_load" | "append";

export interface PipelineNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

export interface NodeData {
  label: string;
  description?: string;
  config?: any;
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

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface PipelineConfig {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}
