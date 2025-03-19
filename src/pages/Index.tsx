
import React from 'react';
import { DAGCanvas } from '@/components/DAGBuilder/DAGCanvas';
import { 
  CircleStackIcon,
  ArrowPathIcon,
  ServerStackIcon
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <ArrowPathIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-medium">Data Pipeline Builder</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <CircleStackIcon className="w-4 h-4" />
              <span>Google Cloud Storage</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <ServerStackIcon className="w-4 h-4" />
              <span>Clickhouse Cloud</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <div className="animate-fade-up">
          <div className="glass-panel p-6 mb-6 max-w-3xl">
            <h2 className="text-lg font-medium mb-2">Build Your Data Pipeline</h2>
            <p className="text-muted-foreground">
              Create a step-by-step data pipeline to move and transform data from Google Cloud Storage to Clickhouse Cloud.
              Drag nodes onto the canvas and connect them to build your workflow.
            </p>
          </div>
          
          <DAGCanvas />
        </div>
      </main>
    </div>
  );
};

export default Index;
