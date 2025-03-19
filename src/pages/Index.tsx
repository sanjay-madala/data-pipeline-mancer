
import React, { useState } from 'react';
import { FileStackIcon, ArrowUpIcon, ServerIcon, Database } from 'lucide-react';
import { StepByStepPipeline } from '@/components/StepByStep/StepByStepPipeline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <ArrowUpIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-medium">Data Pipeline Builder</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <FileStackIcon className="w-4 h-4" />
              <span>Google Cloud Storage</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <ServerIcon className="w-4 h-4" />
              <span>Clickhouse Cloud</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <StepByStepPipeline />
      </main>
    </div>
  );
};

export default Index;
