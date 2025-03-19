
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GCSConfig } from '@/types/pipeline';
import { v4 as uuidv4 } from 'uuid';

interface GCSConnectionFormProps {
  onSave: (connection: GCSConfig & { id: string, name: string, secrets?: Record<string, string> }) => void;
  onCancel: () => void;
  initialData?: GCSConfig & { id: string, name: string, secrets?: Record<string, string> };
}

export const GCSConnectionForm: React.FC<GCSConnectionFormProps> = ({ 
  onSave, 
  onCancel,
  initialData
}) => {
  const [connection, setConnection] = useState<GCSConfig & { id: string, name: string, secrets?: Record<string, string> }>(
    initialData || {
      id: uuidv4(),
      name: '',
      bucketName: '',
      filePath: '',
      fileFormat: 'csv',
      delimiter: ',',
      hasHeader: true,
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
    if (!connection.bucketName.trim()) {
      alert('Please provide a bucket name');
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
            placeholder="My GCS Connection"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bucketName">Bucket Name</Label>
          <Input
            id="bucketName"
            value={connection.bucketName}
            onChange={(e) => handleChange('bucketName', e.target.value)}
            placeholder="my-gcs-bucket"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filePath">Default File Path</Label>
          <Input
            id="filePath"
            value={connection.filePath}
            onChange={(e) => handleChange('filePath', e.target.value)}
            placeholder="path/to/data.csv"
          />
          <p className="text-xs text-muted-foreground">Optional. You can specify this later in pipelines.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileFormat">Default File Format</Label>
          <Select
            value={connection.fileFormat}
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

        {connection.fileFormat === 'csv' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="delimiter">Delimiter</Label>
              <Select
                value={connection.delimiter}
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

            <div className="flex items-center space-x-2">
              <Switch
                id="hasHeader"
                checked={connection.hasHeader}
                onCheckedChange={(checked) => handleChange('hasHeader', checked)}
              />
              <Label htmlFor="hasHeader">Has Header Row</Label>
            </div>
          </>
        )}

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="secrets">
            <AccordionTrigger>Connection Secrets</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Add credentials or other sensitive information that will be stored securely.
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
                        placeholder="SERVICE_ACCOUNT_KEY"
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
