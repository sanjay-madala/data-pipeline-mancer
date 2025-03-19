
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
  return (
    <div className="node-panel animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
        <div className="space-y-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};
