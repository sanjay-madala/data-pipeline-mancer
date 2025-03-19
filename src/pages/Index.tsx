
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileStackIcon, ArrowUpIcon, ServerIcon, CloudIcon, LinkIcon } from 'lucide-react';
import { StepByStepPipeline } from '@/components/StepByStep/StepByStepPipeline';
import { DAGCanvas } from '@/components/DAGBuilder/DAGCanvas';
import { OrchestrationCanvas } from '@/components/PipelineManagement/OrchestrationCanvas';
import { PipelinesList } from '@/components/PipelineManagement/PipelinesList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PipelineConfig, OrchestrationConfig } from '@/types/pipeline';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [pipelines, setPipelines] = useState<PipelineConfig[]>([]);
  const [orchestrations, setOrchestrations] = useState<OrchestrationConfig[]>([]);
  
  // Create a new empty pipeline
  const handleCreatePipeline = () => {
    const newPipeline: PipelineConfig = {
      id: uuidv4(),
      name: `Pipeline ${pipelines.length + 1}`,
      nodes: [],
      edges: []
    };
    
    setPipelines([...pipelines, newPipeline]);
    setActivePipelineId(newPipeline.id);
    toast.success('New pipeline created');
  };

  // Create a new orchestration
  const handleCreateOrchestration = () => {
    const newOrchestration: OrchestrationConfig = {
      id: uuidv4(),
      name: `Orchestration ${orchestrations.length + 1}`,
      nodes: [],
      edges: [],
      pipelines: [...pipelines]
    };
    
    setOrchestrations([...orchestrations, newOrchestration]);
    toast.success('New orchestration created');
  };

  // Delete a pipeline
  const handleDeletePipeline = (id: string) => {
    setPipelines(pipelines.filter(p => p.id !== id));
    if (activePipelineId === id) {
      setActivePipelineId(null);
    }
    toast.info('Pipeline deleted');
  };

  // Execute a pipeline
  const handleExecutePipeline = (id: string) => {
    toast.success(`Executing pipeline ${id}`);
    setTimeout(() => {
      toast.success('Pipeline executed successfully');
    }, 2000);
  };

  // Save an orchestration
  const handleSaveOrchestration = (updatedOrchestration: OrchestrationConfig) => {
    setOrchestrations(orchestrations.map(o => 
      o.id === updatedOrchestration.id ? updatedOrchestration : o
    ));
  };

  // Execute an orchestration
  const handleExecuteOrchestration = (id: string) => {
    toast.success(`Executing orchestration ${id}`);
    setTimeout(() => {
      toast.success('Orchestration executed successfully');
    }, 3000);
  };

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
            <Link to="/connections">
              <Button variant="outline" size="sm" className="gap-2">
                <LinkIcon className="w-4 h-4" />
                Manage Connections
              </Button>
            </Link>
            
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <CloudIcon className="w-4 h-4" />
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
        <Tabs defaultValue="step-by-step">
          <TabsList className="mb-4">
            <TabsTrigger value="step-by-step">Step by Step</TabsTrigger>
            <TabsTrigger value="pipeline-builder">Pipeline Builder</TabsTrigger>
            <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="step-by-step" className="mt-0">
            <StepByStepPipeline />
          </TabsContent>
          
          <TabsContent value="pipeline-builder" className="mt-0">
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              <PipelinesList 
                pipelines={pipelines}
                activePipelineId={activePipelineId}
                onCreatePipeline={handleCreatePipeline}
                onSelectPipeline={setActivePipelineId}
                onDeletePipeline={handleDeletePipeline}
                onExecutePipeline={handleExecutePipeline}
              />
              
              {activePipelineId ? (
                <div className="flex-1">
                  <DAGCanvas />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col gap-4 border rounded-lg">
                  <p className="text-muted-foreground">Select a pipeline or create a new one</p>
                  <Button onClick={handleCreatePipeline}>Create Pipeline</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="orchestration" className="mt-0">
            <div className="glass-panel p-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Pipeline Orchestration</h2>
                <Button onClick={handleCreateOrchestration}>
                  Create New Orchestration
                </Button>
              </div>
              
              <p className="text-muted-foreground mt-2">
                Chain multiple pipelines together and create complex workflows
              </p>
            </div>
            
            {orchestrations.length > 0 ? (
              <div className="border rounded-lg p-4 h-[calc(100vh-16rem)]">
                <Tabs defaultValue={orchestrations[0].id}>
                  <TabsList>
                    {orchestrations.map(orch => (
                      <TabsTrigger key={orch.id} value={orch.id}>
                        {orch.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {orchestrations.map(orch => (
                    <TabsContent key={orch.id} value={orch.id} className="mt-4 h-full">
                      <OrchestrationCanvas
                        orchestration={orch}
                        availablePipelines={pipelines}
                        onSave={handleSaveOrchestration}
                        onExecute={handleExecuteOrchestration}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <div className="flex-1 h-[50vh] flex items-center justify-center flex-col gap-4 border rounded-lg">
                <p className="text-muted-foreground">No orchestrations yet</p>
                <Button onClick={handleCreateOrchestration}>Create Orchestration</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
