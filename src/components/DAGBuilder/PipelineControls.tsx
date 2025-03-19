
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Database, Table, ArrowDownToLine, Code, Play, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { NodeType } from '@/types/pipeline';

interface PipelineControlsProps {
  onAddNode: (type: NodeType) => void;
  onExecute: () => void;
  onSave: () => void;
  onClear: () => void;
}

export const PipelineControls: React.FC<PipelineControlsProps> = ({
  onAddNode,
  onExecute,
  onSave,
  onClear,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="glass-panel p-1 rounded-full flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 h-10"
          onClick={() => onAddNode('gcsSource')}
        >
          <Cloud size={16} className="text-node-gcs" />
          <span>GCS Source</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 h-10"
          onClick={() => onAddNode('clickhouseConnect')}
        >
          <Database size={16} className="text-node-clickhouse" />
          <span>Clickhouse</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 h-10"
          onClick={() => onAddNode('schemaMapping')}
        >
          <Table size={16} className="text-node-sql" />
          <span>Schema</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 h-10"
          onClick={() => onAddNode('dataLoad')}
        >
          <ArrowDownToLine size={16} className="text-node-load" />
          <span>Data Load</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 h-10"
          onClick={() => onAddNode('sqlExecution')}
        >
          <Code size={16} className="text-node-transform" />
          <span>SQL</span>
        </Button>
      </div>

      <div className="flex-1"></div>

      <div className="glass-panel p-1 rounded-full flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-4 h-10"
          onClick={onClear}
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-4 h-10"
          onClick={onSave}
        >
          <Save size={16} />
          <span>Save</span>
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 rounded-full px-4 h-10"
          onClick={onExecute}
        >
          <Play size={16} />
          <span>Execute Pipeline</span>
        </Button>
      </div>
    </div>
  );
};
