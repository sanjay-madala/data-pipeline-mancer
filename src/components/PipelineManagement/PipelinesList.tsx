
import React from 'react';
import { PipelineConfig } from '@/types/pipeline';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Play, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface PipelinesListProps {
  pipelines: PipelineConfig[];
  activePipelineId: string | null;
  onCreatePipeline: () => void;
  onSelectPipeline: (id: string) => void;
  onDeletePipeline: (id: string) => void;
  onExecutePipeline: (id: string) => void;
}

export const PipelinesList: React.FC<PipelinesListProps> = ({
  pipelines,
  activePipelineId,
  onCreatePipeline,
  onSelectPipeline,
  onDeletePipeline,
  onExecutePipeline,
}) => {
  const handleDeletePipeline = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this pipeline?')) {
      onDeletePipeline(id);
    }
  };

  const handleExecutePipeline = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onExecutePipeline(id);
  };

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Pipelines</h2>
        <Button
          onClick={onCreatePipeline}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          <span>New Pipeline</span>
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {pipelines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pipelines yet. Create your first pipeline to get started.
            </div>
          ) : (
            pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors ${
                  activePipelineId === pipeline.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelectPipeline(pipeline.id)}
              >
                <div>
                  <h3 className="font-medium">{pipeline.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pipeline.nodes.length} nodes, {pipeline.edges.length} connections
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleExecutePipeline(pipeline.id, e)}
                    title="Execute pipeline"
                  >
                    <Play size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeletePipeline(pipeline.id, e)}
                    title="Delete pipeline"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
