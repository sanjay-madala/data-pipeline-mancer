
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudIcon, 
  DatabaseIcon, 
  PlusCircleIcon, 
  Trash2Icon, 
  PencilIcon,
  ArrowLeftIcon,
  ServerIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GCSConnectionForm } from '@/components/Connections/GCSConnectionForm';
import { ClickhouseConnectionForm } from '@/components/Connections/ClickhouseConnectionForm';
import { ConnectionTest } from '@/components/Connections/ConnectionTest';
import { GCSConfig, ClickhouseConfig } from '@/types/pipeline';
import { ConnectionsList } from '@/components/Connections/ConnectionsList';
import { useConnections } from '@/hooks/useConnections';

const Connections = () => {
  const [activeTab, setActiveTab] = useState<'gcs' | 'clickhouse'>('gcs');
  const [isCreating, setIsCreating] = useState(false);
  const [editingConnection, setEditingConnection] = useState<{id: string, type: 'gcs' | 'clickhouse'} | null>(null);
  const [testingConnection, setTestingConnection] = useState<{id: string, type: 'gcs' | 'clickhouse'} | null>(null);
  
  const { 
    gcsConnections, 
    clickhouseConnections, 
    addGCSConnection, 
    addClickhouseConnection, 
    updateGCSConnection,
    updateClickhouseConnection,
    deleteGCSConnection,
    deleteClickhouseConnection,
    getConnection
  } = useConnections();

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingConnection(null);
  };

  const handleEditConnection = (id: string, type: 'gcs' | 'clickhouse') => {
    setEditingConnection({ id, type });
    setActiveTab(type);
    setIsCreating(true);
  };

  const handleTestConnection = (id: string, type: 'gcs' | 'clickhouse') => {
    setTestingConnection({ id, type });
  };

  const handleDelete = (id: string, type: 'gcs' | 'clickhouse') => {
    if (window.confirm('Are you sure you want to delete this connection? This action cannot be undone.')) {
      if (type === 'gcs') {
        deleteGCSConnection(id);
      } else {
        deleteClickhouseConnection(id);
      }
      toast.success('Connection deleted successfully');
    }
  };

  const handleSaveGCS = (connection: GCSConfig & { id: string, name: string, secrets?: Record<string, string> }) => {
    if (editingConnection && editingConnection.type === 'gcs') {
      updateGCSConnection(editingConnection.id, connection);
      toast.success('Connection updated successfully');
    } else {
      addGCSConnection(connection);
      toast.success('Connection created successfully');
    }
    setIsCreating(false);
    setEditingConnection(null);
  };

  const handleSaveClickhouse = (connection: ClickhouseConfig & { id: string, name: string, secrets?: Record<string, string> }) => {
    if (editingConnection && editingConnection.type === 'clickhouse') {
      updateClickhouseConnection(editingConnection.id, connection);
      toast.success('Connection updated successfully');
    } else {
      addClickhouseConnection(connection);
      toast.success('Connection created successfully');
    }
    setIsCreating(false);
    setEditingConnection(null);
  };

  const getConnectionToEdit = () => {
    if (!editingConnection) return null;
    
    if (editingConnection.type === 'gcs') {
      return gcsConnections.find(c => c.id === editingConnection.id);
    } else {
      return clickhouseConnections.find(c => c.id === editingConnection.id);
    }
  };

  const getConnectionToTest = () => {
    if (!testingConnection) return undefined;
    
    return getConnection(testingConnection.id, testingConnection.type);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Connection Management</h1>
        </div>
        {!isCreating && (
          <Button onClick={handleCreateNew}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add New Connection
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingConnection ? 'Edit Connection' : 'Create New Connection'}</CardTitle>
            <CardDescription>
              Configure your connection details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gcs' | 'clickhouse')}>
              <TabsList className="mb-4">
                <TabsTrigger value="gcs" className="flex items-center gap-2">
                  <CloudIcon className="h-4 w-4" />
                  Google Cloud Storage
                </TabsTrigger>
                <TabsTrigger value="clickhouse" className="flex items-center gap-2">
                  <DatabaseIcon className="h-4 w-4" />
                  Clickhouse
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gcs">
                <GCSConnectionForm 
                  onSave={handleSaveGCS} 
                  onCancel={() => {
                    setIsCreating(false);
                    setEditingConnection(null);
                  }}
                  initialData={editingConnection?.type === 'gcs' ? getConnectionToEdit() as (GCSConfig & { id: string, name: string, secrets?: Record<string, string> }) : undefined}
                />
              </TabsContent>
              
              <TabsContent value="clickhouse">
                <ClickhouseConnectionForm 
                  onSave={handleSaveClickhouse} 
                  onCancel={() => {
                    setIsCreating(false);
                    setEditingConnection(null);
                  }}
                  initialData={editingConnection?.type === 'clickhouse' ? getConnectionToEdit() as (ClickhouseConfig & { id: string, name: string, secrets?: Record<string, string> }) : undefined}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CloudIcon className="h-5 w-5 text-blue-500" />
                <CardTitle>Google Cloud Storage Connections</CardTitle>
              </div>
              <CardDescription>
                Manage your GCS bucket connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionsList 
                connections={gcsConnections} 
                type="gcs"
                onEdit={handleEditConnection}
                onDelete={handleDelete}
                onTest={handleTestConnection}
                emptyMessage="No GCS connections configured. Create one to get started."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ServerIcon className="h-5 w-5 text-pink-500" />
                <CardTitle>Clickhouse Connections</CardTitle>
              </div>
              <CardDescription>
                Manage your Clickhouse database connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionsList 
                connections={clickhouseConnections} 
                type="clickhouse"
                onEdit={handleEditConnection}
                onDelete={handleDelete}
                onTest={handleTestConnection}
                emptyMessage="No Clickhouse connections configured. Create one to get started."
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {testingConnection && (
        <ConnectionTest 
          isOpen={!!testingConnection}
          onClose={() => setTestingConnection(null)}
          connection={getConnectionToTest()}
          connectionType={testingConnection?.type || 'gcs'}
        />
      )}
    </div>
  );
};

export default Connections;
