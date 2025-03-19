
import React from 'react';
import { NodePanel } from '../UI/NodePanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GCSConfig } from '@/types/pipeline';

interface GCSConfigPanelProps {
  nodeId: string;
  initialConfig?: GCSConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: GCSConfig) => void;
}

export const GCSConfigPanel: React.FC<GCSConfigPanelProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState<GCSConfig>(
    initialConfig || {
      bucketName: '',
      filePath: '',
      fileFormat: 'csv',
      delimiter: ',',
      hasHeader: true,
    }
  );

  const handleChange = (field: keyof GCSConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  return (
    <NodePanel title="Google Cloud Storage Configuration" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bucketName">Bucket Name</Label>
          <Input
            id="bucketName"
            value={config.bucketName}
            onChange={(e) => handleChange('bucketName', e.target.value)}
            placeholder="my-gcs-bucket"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filePath">File Path</Label>
          <Input
            id="filePath"
            value={config.filePath}
            onChange={(e) => handleChange('filePath', e.target.value)}
            placeholder="path/to/data.csv"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileFormat">File Format</Label>
          <Select
            value={config.fileFormat}
            onValueChange={(value) => handleChange('fileFormat', value)}
          >
            <SelectTrigger id="fileFormat">
              <SelectValue placeholder="Select file format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="parquet">Parquet</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.fileFormat === 'csv' && (
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Select
              value={config.delimiter}
              onValueChange={(value) => handleChange('delimiter', value)}
            >
              <SelectTrigger id="delimiter">
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value="\t">Tab (\t)</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {config.fileFormat === 'csv' && (
          <div className="flex items-center space-x-2">
            <Switch
              id="hasHeader"
              checked={config.hasHeader}
              onCheckedChange={(checked) => handleChange('hasHeader', checked)}
            />
            <Label htmlFor="hasHeader">Has Header Row</Label>
          </div>
        )}

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
