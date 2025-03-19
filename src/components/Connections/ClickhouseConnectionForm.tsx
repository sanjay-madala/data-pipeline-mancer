
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2Icon } from 'lucide-react';
import { ClickhouseConfig } from '@/types/pipeline';
import { v4 as uuidv4 } from 'uuid';

interface ClickhouseConnectionFormProps {
  onSave: (connection: ClickhouseConfig & { id: string, name: string, secrets?: Record<string, string> }) => void;
  onCancel: () => void;
  initialData?: ClickhouseConfig & { id: string, name: string, secrets?: Record<string, string> };
}

export const ClickhouseConnectionForm: React.FC<ClickhouseConnectionFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const [connection, setConnection] = useState<ClickhouseConfig & { id: string, name: string, secrets?: Record<string, string> }>(
    initialData || {
      id: uuidv4(),
      name: '',
      host: '',
      port: 8443,
      username: 'default',
      password: '',
      database: 'default',
      secure: true,
      secrets: {},
    }
  );

  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');

  const handleChange = (field: string, value: any) => {
    setConnection((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSecret = () => {
    if (!newSecretKey.trim()) return;
    
    setConnection((prev) => ({
      ...prev,
      secrets: {
        ...(prev.secrets || {}),
        [newSecretKey]: newSecretValue
      }
    }));
    
    setNewSecretKey('');
    setNewSecretValue('');
  };

  const handleRemoveSecret = (key: string) => {
    const newSecrets = { ...(connection.secrets || {}) };
    delete newSecrets[key];
    
    setConnection((prev) => ({
      ...prev,
      secrets: newSecrets
    }));
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

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="secrets">
            <AccordionTrigger>Connection Secrets</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Add service tokens or other sensitive information that will be stored securely.
                  </p>
                  
                  {Object.entries(connection.secrets || {}).length > 0 && (
                    <div className="border rounded-md p-2 my-2">
                      {Object.entries(connection.secrets || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{key}: </span>
                            <span className="text-muted-foreground">
                              {value.replace(/./g, '•')}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveSecret(key)}
                          >
                            <Trash2Icon className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-3">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="secretKey">Key</Label>
                      <Input
                        id="secretKey"
                        value={newSecretKey}
                        onChange={(e) => setNewSecretKey(e.target.value)}
                        placeholder="API_TOKEN"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="secretValue">Value</Label>
                      <Input
                        id="secretValue"
                        type="password"
                        value={newSecretValue}
                        onChange={(e) => setNewSecretValue(e.target.value)}
                        placeholder="•••••••••••"
                      />
                    </div>
                    <div className="pt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddSecret}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
