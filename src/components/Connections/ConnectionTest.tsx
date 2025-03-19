
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react';
import { GCSConnection, ClickhouseConnection } from '@/hooks/useConnections';

interface ConnectionTestProps {
  isOpen: boolean;
  onClose: () => void;
  connection: GCSConnection | ClickhouseConnection | undefined;
  connectionType: 'gcs' | 'clickhouse';
}

export const ConnectionTest: React.FC<ConnectionTestProps> = ({
  isOpen,
  onClose,
  connection,
  connectionType
}) => {
  const [activeTab, setActiveTab] = useState<'connection' | 'data'>('connection');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [query, setQuery] = useState<string>(
    connectionType === 'clickhouse' 
      ? 'SELECT * FROM system.tables LIMIT 10' 
      : ''
  );
  const [filePath, setFilePath] = useState<string>(
    connectionType === 'gcs' && (connection as GCSConnection)?.filePath
      ? (connection as GCSConnection).filePath
      : ''
  );

  if (!connection) {
    return null;
  }

  const handleTestConnection = () => {
    setIsLoading(true);
    setTestResult(null);
    setErrorMessage('');

    // Simulate connection test
    setTimeout(() => {
      setIsLoading(false);
      // 80% success rate for demo purposes
      if (Math.random() > 0.2) {
        setTestResult('success');
      } else {
        setTestResult('error');
        setErrorMessage(
          connectionType === 'gcs' 
            ? 'Failed to access the GCS bucket. Check your credentials and bucket name.'
            : 'Failed to connect to the Clickhouse server. Check your connection details.'
        );
      }
    }, 1500);
  };

  const handleDataPreview = () => {
    setIsLoading(true);
    setPreviewData([]);
    setErrorMessage('');

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
      
      // 80% success rate for demo purposes
      if (Math.random() > 0.2) {
        if (connectionType === 'gcs') {
          // Generate mock data based on file format
          const format = (connection as GCSConnection).fileFormat;
          const mockData = generateMockData(format, 15);
          setPreviewData(mockData);
        } else {
          // Generate mock Clickhouse data
          const mockData = generateMockClickhouseData(query, 15);
          setPreviewData(mockData);
        }
      } else {
        setTestResult('error');
        setErrorMessage(
          connectionType === 'gcs' 
            ? `Failed to read data from the file: ${filePath}. File not found or permission denied.`
            : `Failed to execute query: ${query}. Check your SQL syntax.`
        );
      }
    }, 2000);
  };

  // Helper function to generate mock data
  const generateMockData = (format: string, rowCount: number) => {
    const data: any[] = [];
    
    // Generate headers based on format
    let headers: string[] = [];
    if (format === 'csv') {
      headers = ['id', 'name', 'email', 'date', 'value'];
    } else if (format === 'json') {
      headers = ['id', 'user', 'metadata', 'timestamp', 'status'];
    } else if (format === 'parquet') {
      headers = ['id', 'product', 'category', 'price', 'inventory', 'last_updated'];
    }
    
    // Generate rows
    for (let i = 0; i < rowCount; i++) {
      const row: any = {};
      headers.forEach(header => {
        if (header === 'id') {
          row[header] = i + 1;
        } else if (header.includes('date') || header.includes('timestamp') || header === 'last_updated') {
          row[header] = new Date(Date.now() - Math.random() * 10000000000).toISOString();
        } else if (header.includes('price') || header.includes('value')) {
          row[header] = (Math.random() * 1000).toFixed(2);
        } else if (header === 'inventory') {
          row[header] = Math.floor(Math.random() * 1000);
        } else if (header === 'status') {
          const statuses = ['active', 'pending', 'completed', 'failed'];
          row[header] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (header === 'metadata') {
          row[header] = JSON.stringify({
            source: 'api',
            version: '1.0.' + Math.floor(Math.random() * 10)
          });
        } else if (header === 'category') {
          const categories = ['electronics', 'clothing', 'food', 'books', 'home'];
          row[header] = categories[Math.floor(Math.random() * categories.length)];
        } else {
          row[header] = `Sample ${header} ${i + 1}`;
        }
      });
      data.push(row);
    }
    
    return data;
  };

  // Helper function to generate mock Clickhouse data
  const generateMockClickhouseData = (query: string, rowCount: number) => {
    const data: any[] = [];
    
    // Parse query for table name (very simplified)
    const tableMatch = query.match(/FROM\s+(\w+)/i);
    let tableName = 'system.tables';
    if (tableMatch && tableMatch[1]) {
      tableName = tableMatch[1];
    }
    
    // Define different column sets based on table name
    let headers: string[] = [];
    if (tableName.includes('system.tables')) {
      headers = ['database', 'name', 'engine', 'partition_key', 'sorting_key', 'total_rows'];
    } else if (tableName.includes('events')) {
      headers = ['id', 'event_type', 'user_id', 'timestamp', 'properties'];
    } else {
      headers = ['id', 'name', 'created_at', 'value', 'user_id'];
    }
    
    // Generate rows
    for (let i = 0; i < rowCount; i++) {
      const row: any = {};
      headers.forEach(header => {
        if (header === 'id') {
          row[header] = i + 1;
        } else if (header === 'user_id') {
          row[header] = Math.floor(Math.random() * 1000);
        } else if (header === 'timestamp' || header === 'created_at') {
          row[header] = new Date(Date.now() - Math.random() * 10000000000).toISOString();
        } else if (header === 'value' || header === 'total_rows') {
          row[header] = Math.floor(Math.random() * 10000);
        } else if (header === 'event_type') {
          const types = ['pageview', 'click', 'purchase', 'signup'];
          row[header] = types[Math.floor(Math.random() * types.length)];
        } else if (header === 'properties') {
          row[header] = JSON.stringify({
            browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox',
            os: Math.random() > 0.5 ? 'Windows' : 'MacOS',
            screen: '1920x1080'
          });
        } else if (header === 'engine') {
          const engines = ['MergeTree', 'ReplacingMergeTree', 'SummingMergeTree', 'AggregatingMergeTree'];
          row[header] = engines[Math.floor(Math.random() * engines.length)];
        } else if (header === 'database') {
          row[header] = Math.random() > 0.7 ? 'system' : 'default';
        } else if (header === 'partition_key' || header === 'sorting_key') {
          row[header] = Math.random() > 0.5 ? 'timestamp' : '';
        } else {
          row[header] = `Sample ${header.replace('_', ' ')} ${i + 1}`;
        }
      });
      data.push(row);
    }
    
    return data;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Connection: {connection.name}</DialogTitle>
          <DialogDescription>
            {connectionType === 'gcs' 
              ? `Google Cloud Storage bucket: ${(connection as GCSConnection).bucketName}` 
              : `Clickhouse server: ${(connection as ClickhouseConnection).host}:${(connection as ClickhouseConnection).port}`}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'connection' | 'data')}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList>
            <TabsTrigger value="connection">Connection Test</TabsTrigger>
            <TabsTrigger value="data">Data Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 py-4">
              <div className="text-center space-y-4">
                <Button onClick={handleTestConnection} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                      Testing connection...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                
                {testResult === 'success' && (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Connection successful!</span>
                  </div>
                )}
                
                {testResult === 'error' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-red-600">
                    <div className="flex items-center">
                      <AlertCircleIcon className="h-5 w-5 mr-2" />
                      <span>Connection failed</span>
                    </div>
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                      {errorMessage}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border rounded-md p-4 mt-4">
                <h3 className="font-medium mb-2">Connection Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {connectionType === 'gcs' ? (
                    <>
                      <dt className="font-medium">Bucket Name:</dt>
                      <dd>{(connection as GCSConnection).bucketName}</dd>
                      
                      <dt className="font-medium">File Format:</dt>
                      <dd>{(connection as GCSConnection).fileFormat.toUpperCase()}</dd>
                      
                      {(connection as GCSConnection).fileFormat === 'csv' && (
                        <>
                          <dt className="font-medium">Delimiter:</dt>
                          <dd>{(connection as GCSConnection).delimiter === '\t' ? 'Tab' : (connection as GCSConnection).delimiter}</dd>
                          
                          <dt className="font-medium">Has Header:</dt>
                          <dd>{(connection as GCSConnection).hasHeader ? 'Yes' : 'No'}</dd>
                        </>
                      )}
                      
                      <dt className="font-medium">Default File Path:</dt>
                      <dd>{(connection as GCSConnection).filePath || '(Not specified)'}</dd>
                    </>
                  ) : (
                    <>
                      <dt className="font-medium">Host:</dt>
                      <dd>{(connection as ClickhouseConnection).host}</dd>
                      
                      <dt className="font-medium">Port:</dt>
                      <dd>{(connection as ClickhouseConnection).port}</dd>
                      
                      <dt className="font-medium">Database:</dt>
                      <dd>{(connection as ClickhouseConnection).database}</dd>
                      
                      <dt className="font-medium">Username:</dt>
                      <dd>{(connection as ClickhouseConnection).username}</dd>
                      
                      <dt className="font-medium">Secure Connection:</dt>
                      <dd>{(connection as ClickhouseConnection).secure ? 'Yes (SSL/TLS)' : 'No'}</dd>
                    </>
                  )}
                </dl>
                
                {Object.keys(connection.secrets || {}).length > 0 && (
                  <>
                    <h3 className="font-medium mt-4 mb-2">Connection Secrets</h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      {Object.keys(connection.secrets || {}).map(key => (
                        <React.Fragment key={key}>
                          <dt className="font-medium">{key}:</dt>
                          <dd>••••••••••</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 py-4 flex-1 flex flex-col">
              <div className="space-y-2">
                {connectionType === 'gcs' ? (
                  <div className="space-y-2">
                    <Label htmlFor="filePath">File Path</Label>
                    <Input 
                      id="filePath"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      placeholder="path/to/your/data.csv"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="query">SQL Query</Label>
                    <textarea
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="SELECT * FROM your_table LIMIT 10"
                      className="w-full h-20 p-2 border rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button onClick={handleDataPreview} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Loading data...
                      </>
                    ) : (
                      'Preview Data'
                    )}
                  </Button>
                </div>
              </div>
              
              {testResult === 'error' && (
                <div className="flex flex-col items-center justify-center gap-2 text-red-600 my-4">
                  <div className="flex items-center">
                    <AlertCircleIcon className="h-5 w-5 mr-2" />
                    <span>Error retrieving data</span>
                  </div>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    {errorMessage}
                  </div>
                </div>
              )}
              
              {!isLoading && previewData.length > 0 && (
                <div className="flex-1 overflow-hidden border rounded-md">
                  <ScrollArea className="h-[400px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(previewData[0]).map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <TableCell key={`${rowIndex}-${colIndex}`}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
              
              {!isLoading && !testResult && previewData.length === 0 && (
                <div className="flex-1 flex items-center justify-center border border-dashed rounded-md text-muted-foreground">
                  Click "Preview Data" to see data from your connection
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
