
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ClickhouseConfig } from '@/types/pipeline';
import { v4 as uuidv4 } from 'uuid';

interface ClickhouseConnectionFormProps {
  onSave: (connection: ClickhouseConfig & { id: string, name: string }) => void;
  onCancel: () => void;
  initialData?: ClickhouseConfig & { id: string, name: string };
}

export const ClickhouseConnectionForm: React.FC<ClickhouseConnectionFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const [connection, setConnection] = useState<ClickhouseConfig & { id: string, name: string }>(
    initialData || {
      id: uuidv4(),
      name: '',
      host: '',
      port: 8443,
      username: 'default',
      password: '',
      database: 'default',
      secure: true,
    }
  );

  const handleChange = (field: string, value: any) => {
    setConnection((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection.name.trim()) {
      alert('Please provide a name for the connection');
      return;
    }
    if (!connection.host.trim()) {
      alert('Please provide a host');
      return;
    }
    onSave(connection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Connection Name</Label>
          <Input
            id="name"
            value={connection.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="My Clickhouse Connection"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={connection.host}
            onChange={(e) => handleChange('host', e.target.value)}
            placeholder="your-instance.clickhouse.cloud"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            value={connection.port}
            onChange={(e) => handleChange('port', parseInt(e.target.value))}
            placeholder="8443"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={connection.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="default"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={connection.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="database">Database</Label>
          <Input
            id="database"
            value={connection.database}
            onChange={(e) => handleChange('database', e.target.value)}
            placeholder="default"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="secure"
            checked={connection.secure}
            onCheckedChange={(checked) => handleChange('secure', checked)}
          />
          <Label htmlFor="secure">Use SSL/TLS Connection</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Connection' : 'Create Connection'}
        </Button>
      </div>
    </form>
  );
};
