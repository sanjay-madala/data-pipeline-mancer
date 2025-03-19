
import React from 'react';
import { NodePanel } from '../UI/NodePanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ClickhouseConfig } from '@/types/pipeline';

interface ClickhouseConfigPanelProps {
  nodeId: string;
  initialConfig?: ClickhouseConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: ClickhouseConfig) => void;
}

export const ClickhouseConfigPanel: React.FC<ClickhouseConfigPanelProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = React.useState<ClickhouseConfig>(
    initialConfig || {
      host: '',
      port: 8443,
      username: 'default',
      password: '',
      database: 'default',
      secure: true,
    }
  );

  const handleChange = (field: keyof ClickhouseConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  return (
    <NodePanel title="Clickhouse Connection Configuration" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={config.host}
            onChange={(e) => handleChange('host', e.target.value)}
            placeholder="your-instance.clickhouse.cloud"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            value={config.port}
            onChange={(e) => handleChange('port', parseInt(e.target.value))}
            placeholder="8443"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={config.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="default"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={config.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Database</Label>
          <Input
            id="database"
            value={config.database}
            onChange={(e) => handleChange('database', e.target.value)}
            placeholder="default"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="secure"
            checked={config.secure}
            onCheckedChange={(checked) => handleChange('secure', checked)}
          />
          <Label htmlFor="secure">Use SSL/TLS Connection</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Connection</Button>
        </div>
      </div>
    </NodePanel>
  );
};
