
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NodePanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const NodePanel: React.FC<NodePanelProps> = ({ title, onClose, children }) => {
  // Determine if we're in the step-by-step mode or the DAG mode
  const isStepByStep = !onClose || typeof onClose !== 'function';
  
  return (
    <div className={`node-panel ${isStepByStep ? '' : 'animate-fade-in'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {!isStepByStep && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className={isStepByStep ? "max-h-[60vh]" : "h-[calc(100vh-20rem)]"}>
        <div className="space-y-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};
