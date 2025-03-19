
import React from 'react';
import { NodePanel } from '../UI/NodePanel';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { SQLConfig } from '@/types/pipeline';

interface SQLEditorProps {
  nodeId: string;
  initialConfig?: SQLConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: SQLConfig) => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState<SQLConfig>(
    initialConfig || {
      query: '',
      createMaterializedView: false,
      viewName: '',
    }
  );

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  return (
    <NodePanel title="SQL Execution Configuration" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="query">SQL Query</Label>
          <Textarea
            id="query"
            value={config.query}
            onChange={(e) => setConfig({ ...config, query: e.target.value })}
            placeholder="SELECT * FROM my_table WHERE ..."
            className="h-64 font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Enter SQL query to execute against Clickhouse database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="createMaterializedView"
            checked={config.createMaterializedView}
            onCheckedChange={(checked) => 
              setConfig({ ...config, createMaterializedView: checked })
            }
          />
          <Label htmlFor="createMaterializedView">Create Materialized View</Label>
        </div>

        {config.createMaterializedView && (
          <div className="space-y-2">
            <Label htmlFor="viewName">Materialized View Name</Label>
            <Input
              id="viewName"
              value={config.viewName}
              onChange={(e) => setConfig({ ...config, viewName: e.target.value })}
              placeholder="my_materialized_view"
            />
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save SQL</Button>
        </div>
      </div>
    </NodePanel>
  );
};
