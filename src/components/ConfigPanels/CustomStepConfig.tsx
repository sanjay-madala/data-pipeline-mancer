
import React, { useState } from 'react';
import { NodePanel } from '@/components/UI/NodePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomStepConfig } from '@/types/pipeline';
import { PlusCircle, X } from 'lucide-react';

interface CustomStepConfigPanelProps {
  nodeId: string;
  initialConfig: CustomStepConfig;
  onClose: () => void;
  onSave: (nodeId: string, config: CustomStepConfig) => void;
}

export const CustomStepConfigPanel: React.FC<CustomStepConfigPanelProps> = ({
  nodeId,
  initialConfig,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState<CustomStepConfig>(
    initialConfig || {
      code: '',
      inputs: [],
      outputs: [],
      description: '',
    }
  );

  const handleAddInput = () => {
    setConfig((prev) => ({
      ...prev,
      inputs: [...prev.inputs, ''],
    }));
  };

  const handleRemoveInput = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index: number, value: string) => {
    setConfig((prev) => ({
      ...prev,
      inputs: prev.inputs.map((input, i) => (i === index ? value : input)),
    }));
  };

  const handleAddOutput = () => {
    setConfig((prev) => ({
      ...prev,
      outputs: [...prev.outputs, ''],
    }));
  };

  const handleRemoveOutput = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index),
    }));
  };

  const handleOutputChange = (index: number, value: string) => {
    setConfig((prev) => ({
      ...prev,
      outputs: prev.outputs.map((output, i) => (i === index ? value : output)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(nodeId, config);
  };

  return (
    <NodePanel title="Custom Step Configuration" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={config.description}
            onChange={(e) =>
              setConfig({ ...config, description: e.target.value })
            }
            placeholder="Describe what this custom step does"
          />
        </div>

        <div className="space-y-2">
          <Label>Input Parameters</Label>
          {config.inputs.map((input, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Input parameter name"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInput(index)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddInput}
            className="w-full mt-2"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Input
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Output Parameters</Label>
          {config.outputs.map((output, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={output}
                onChange={(e) => handleOutputChange(index, e.target.value)}
                placeholder="Output parameter name"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOutput(index)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOutput}
            className="w-full mt-2"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Output
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Custom Code</Label>
          <Textarea
            id="code"
            value={config.code}
            onChange={(e) => setConfig({ ...config, code: e.target.value })}
            placeholder="Write your custom transformation code here"
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </NodePanel>
  );
};
