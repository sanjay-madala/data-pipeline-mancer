
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GCSConfigPanel } from '../ConfigPanels/GCSConfig';
import { ClickhouseConfigPanel } from '../ConfigPanels/ClickhouseConfig';
import { SchemaMapper } from '../ConfigPanels/SchemaMapper';
import { DataLoadConfigPanel } from '../ConfigPanels/DataLoadConfig';
import { SQLEditor } from '../ConfigPanels/SQLEditor';
import { usePipeline } from '@/hooks/usePipeline';
import { StepNavigation } from './StepNavigation';
import { PipelineSummary } from './PipelineSummary';
import { NodeType } from '@/types/pipeline';

// Define the steps in our pipeline
const PIPELINE_STEPS: NodeType[] = [
  'gcsSource',
  'clickhouseConnect',
  'schemaMapping',
  'dataLoad',
  'sqlExecution'
];

export const StepByStepPipeline: React.FC = () => {
  const {
    nodes,
    edges,
    addNode,
    updateNodeData,
    validatePipeline,
    executePipeline
  } = usePipeline();

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Initialize the pipeline with default nodes on component mount
  useEffect(() => {
    if (nodes.length === 0) {
      PIPELINE_STEPS.forEach((stepType, index) => {
        addNode(stepType, { x: 0, y: index * 100 });
      });
    }
  }, [addNode, nodes.length]);

  const getCurrentNodeId = () => {
    const stepType = PIPELINE_STEPS[currentStep];
    const node = nodes.find(n => n.type === stepType);
    return node?.id || '';
  };

  const handleNext = () => {
    if (currentStep < PIPELINE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveGCSConfig = (nodeId: string, config: any) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.bucketName}/${config.filePath}`
    });
    handleNext();
  };

  const handleSaveClickhouseConfig = (nodeId: string, config: any) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.host}:${config.port}/${config.database}`
    });
    handleNext();
  };

  const handleSaveSchemaConfig = (nodeId: string, config: any) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.tableName} (${config.fields.length} fields)`
    });
    handleNext();
  };

  const handleSaveDataLoadConfig = (nodeId: string, config: any) => {
    updateNodeData(nodeId, { 
      config,
      description: `${config.strategy} to ${config.targetTable}`
    });
    handleNext();
  };

  const handleSaveSQLConfig = (nodeId: string, config: any) => {
    let description = 'SQL Query';
    if (config.createMaterializedView && config.viewName) {
      description = `Materialized View: ${config.viewName}`;
    } 
    updateNodeData(nodeId, { config, description });
    handleNext();
  };

  const handleSavePipeline = () => {
    if (validatePipeline()) {
      const pipelineConfig = {
        nodes,
        edges,
      };
      
      localStorage.setItem('savedPipeline', JSON.stringify(pipelineConfig));
      toast.success('Pipeline saved successfully');
    }
  };

  const handleEditStep = (index: number) => {
    setCurrentStep(index);
    setShowSummary(false);
  };

  const getStepContent = () => {
    const nodeId = getCurrentNodeId();
    const currentNode = nodes.find(n => n.id === nodeId);
    if (!currentNode) return null;

    switch (PIPELINE_STEPS[currentStep]) {
      case 'gcsSource':
        return (
          <GCSConfigPanel
            nodeId={nodeId}
            initialConfig={currentNode.data.config || {
              bucketName: '',
              filePath: '',
              fileFormat: 'csv',
              delimiter: ',',
              hasHeader: true
            }}
            onClose={() => {}}
            onSave={handleSaveGCSConfig}
          />
        );
      case 'clickhouseConnect':
        return (
          <ClickhouseConfigPanel
            nodeId={nodeId}
            initialConfig={currentNode.data.config || {
              host: '',
              port: 8443,
              username: 'default',
              password: '',
              database: 'default',
              secure: true
            }}
            onClose={() => {}}
            onSave={handleSaveClickhouseConfig}
          />
        );
      case 'schemaMapping':
        return (
          <SchemaMapper
            nodeId={nodeId}
            initialConfig={currentNode.data.config || {
              tableName: '',
              fields: [{ name: '', type: 'String', sourceField: '', nullable: true }]
            }}
            onClose={() => {}}
            onSave={handleSaveSchemaConfig}
          />
        );
      case 'dataLoad':
        return (
          <DataLoadConfigPanel
            nodeId={nodeId}
            initialConfig={currentNode.data.config || {
              strategy: 'delete_and_load',
              targetTable: ''
            }}
            onClose={() => {}}
            onSave={handleSaveDataLoadConfig}
          />
        );
      case 'sqlExecution':
        return (
          <SQLEditor
            nodeId={nodeId}
            initialConfig={currentNode.data.config || {
              query: '',
              createMaterializedView: false,
              viewName: ''
            }}
            onClose={() => {}}
            onSave={handleSaveSQLConfig}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (PIPELINE_STEPS[currentStep]) {
      case 'gcsSource': return 'Step 1: Configure Google Cloud Storage Source';
      case 'clickhouseConnect': return 'Step 2: Configure Clickhouse Connection';
      case 'schemaMapping': return 'Step 3: Define Schema Mapping';
      case 'dataLoad': return 'Step 4: Configure Data Load Strategy';
      case 'sqlExecution': return 'Step 5: SQL Execution';
      default: return 'Configure Pipeline';
    }
  };

  if (nodes.length < PIPELINE_STEPS.length) {
    return <div className="flex justify-center items-center h-96">Initializing pipeline...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="glass-panel p-6 mb-6">
        <h2 className="text-lg font-medium mb-2">{showSummary ? 'Pipeline Summary' : getStepTitle()}</h2>
        <p className="text-muted-foreground">
          {showSummary 
            ? 'Review your pipeline configuration and execute when ready.'
            : 'Complete each step to build your data pipeline from Google Cloud Storage to Clickhouse Cloud.'}
        </p>
      </div>

      {showSummary ? (
        <PipelineSummary 
          config={{ nodes, edges }}
          onExecute={executePipeline}
          onSave={handleSavePipeline}
          onEdit={handleEditStep}
        />
      ) : (
        <>
          <div className="step-content animate-fade-up">
            {getStepContent()}
          </div>
          
          <StepNavigation 
            currentStep={currentStep}
            totalSteps={PIPELINE_STEPS.length + 1} // +1 for summary
            onNext={handleNext}
            onPrevious={handlePrevious}
            isNextDisabled={isNextDisabled}
          />
        </>
      )}
    </div>
  );
};
