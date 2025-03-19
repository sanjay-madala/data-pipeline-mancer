
import React from 'react';
import { NodePanel } from '../UI/NodePanel';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { DataLoadConfig } from '@/types/pipeline';

interface DataLoadConfigPanelProps {
  nodeId: string;
  initialConfig?: DataLoadConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: DataLoadConfig) => void;
}

export const DataLoadConfigPanel: React.FC<DataLoadConfigPanelProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState<DataLoadConfig>(
    initialConfig || {
      strategy: 'delete_and_load',
      targetTable: '',
    }
  );

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  return (
    <NodePanel title="Data Load Configuration" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Load Strategy</Label>
          <RadioGroup
            value={config.strategy}
            onValueChange={(value) => 
              setConfig({ ...config, strategy: value as 'delete_and_load' | 'append' })
            }
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delete_and_load" id="delete_and_load" />
              <Label htmlFor="delete_and_load" className="cursor-pointer">
                Delete and Load
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6 mb-2">
              Delete all existing data in the target table before loading new data.
            </p>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="append" id="append" />
              <Label htmlFor="append" className="cursor-pointer">
                Append
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Add new data to the existing table without modifying existing records.
            </p>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetTable">Target Table</Label>
          <Input
            id="targetTable"
            value={config.targetTable}
            onChange={(e) => setConfig({ ...config, targetTable: e.target.value })}
            placeholder="my_table"
          />
          <p className="text-xs text-muted-foreground">
            Enter the name of the table where data will be loaded.
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </div>
    </NodePanel>
  );
};
