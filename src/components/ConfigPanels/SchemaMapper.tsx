
import React, { useState } from 'react';
import { NodePanel } from '../UI/NodePanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SchemaConfig, SchemaField } from '@/types/pipeline';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface SchemaMapperProps {
  nodeId: string;
  initialConfig?: SchemaConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: SchemaConfig) => void;
}

export const SchemaMapper: React.FC<SchemaMapperProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState<SchemaConfig>(
    initialConfig || {
      tableName: '',
      fields: [{ name: '', type: 'String', sourceField: '', nullable: true }],
    }
  );

  const handleAddField = () => {
    setConfig({
      ...config,
      fields: [...config.fields, { name: '', type: 'String', sourceField: '', nullable: true }],
    });
  };

  const handleRemoveField = (index: number) => {
    setConfig({
      ...config,
      fields: config.fields.filter((_, i) => i !== index),
    });
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedFields = [...config.fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setConfig({ ...config, fields: updatedFields });
  };

  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, tableName: e.target.value });
  };

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  return (
    <NodePanel title="Schema Mapping Configuration" onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tableName">Target Table Name</Label>
          <Input
            id="tableName"
            value={config.tableName}
            onChange={handleTableNameChange}
            placeholder="my_table"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Label>Fields</Label>
            <Button size="sm" variant="outline" onClick={handleAddField}>
              <Plus className="h-4 w-4 mr-1" /> Add Field
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {config.fields.map((field, index) => (
                <Card key={index} className="p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveField(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`field-name-${index}`}>Field Name</Label>
                        <Input
                          id={`field-name-${index}`}
                          value={field.name}
                          onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                          placeholder="field_name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-source-${index}`}>Source Field</Label>
                        <Input
                          id={`field-source-${index}`}
                          value={field.sourceField}
                          onChange={(e) => handleFieldChange(index, 'sourceField', e.target.value)}
                          placeholder="source_field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => handleFieldChange(index, 'type', value)}
                        >
                          <SelectTrigger id={`field-type-${index}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="String">String</SelectItem>
                            <SelectItem value="UInt32">UInt32</SelectItem>
                            <SelectItem value="UInt64">UInt64</SelectItem>
                            <SelectItem value="Int32">Int32</SelectItem>
                            <SelectItem value="Int64">Int64</SelectItem>
                            <SelectItem value="Float32">Float32</SelectItem>
                            <SelectItem value="Float64">Float64</SelectItem>
                            <SelectItem value="Date">Date</SelectItem>
                            <SelectItem value="DateTime">DateTime</SelectItem>
                            <SelectItem value="Boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2 pt-7">
                        <Switch
                          id={`field-nullable-${index}`}
                          checked={field.nullable}
                          onCheckedChange={(checked) => handleFieldChange(index, 'nullable', checked)}
                        />
                        <Label htmlFor={`field-nullable-${index}`}>Nullable</Label>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schema</Button>
        </div>
      </div>
    </NodePanel>
  );
};
