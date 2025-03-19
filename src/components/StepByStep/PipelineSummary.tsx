
import React from 'react';
import { PipelineConfig } from '@/types/pipeline';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PipelineSummaryProps {
  config: PipelineConfig;
  onExecute: () => void;
  onSave: () => void;
  onEdit: (step: number) => void;
}

export const PipelineSummary: React.FC<PipelineSummaryProps> = ({
  config,
  onExecute,
  onSave,
  onEdit,
}) => {
  const getStepInfo = (node: any) => {
    switch (node.type) {
      case 'gcsSource':
        return {
          title: 'Source: Google Cloud Storage',
          details: node.data.config ? 
            `Bucket: ${node.data.config.bucketName}, File: ${node.data.config.filePath}` :
            'Not fully configured',
          isComplete: node.data.config?.bucketName && node.data.config?.filePath
        };
      case 'clickhouseConnect':
        return {
          title: 'Connection: Clickhouse',
          details: node.data.config ? 
            `Host: ${node.data.config.host}, Database: ${node.data.config.database}` :
            'Not fully configured',
          isComplete: node.data.config?.host && node.data.config?.database
        };
      case 'schemaMapping':
        return {
          title: 'Schema Mapping',
          details: node.data.config ? 
            `Table: ${node.data.config.tableName}, Fields: ${node.data.config.fields?.length || 0}` :
            'Not fully configured',
          isComplete: node.data.config?.tableName && node.data.config?.fields?.length > 0
        };
      case 'dataLoad':
        return {
          title: 'Data Load Strategy',
          details: node.data.config ? 
            `Strategy: ${node.data.config.strategy}, Target: ${node.data.config.targetTable}` :
            'Not fully configured',
          isComplete: node.data.config?.targetTable
        };
      case 'sqlExecution':
        return {
          title: 'SQL Execution',
          details: node.data.config?.createMaterializedView ? 
            `Materialized View: ${node.data.config.viewName}` :
            'SQL Query configured',
          isComplete: node.data.config?.query
        };
      default:
        return {
          title: 'Unknown Step',
          details: 'Configuration unknown',
          isComplete: false
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <h2 className="text-lg font-medium mb-4">Pipeline Summary</h2>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {config.nodes.map((node, index) => {
              const { title, details, isComplete } = getStepInfo(node);
              return (
                <div key={node.id} className="flex items-start gap-4 p-3 border rounded-md bg-background">
                  <div className="mt-1">
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-muted-foreground">{details}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(index)}>
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSave}>
          Save Pipeline
        </Button>
        <Button onClick={onExecute}>
          Execute Pipeline
        </Button>
      </div>
    </div>
  );
};
