
import React from 'react';
import { 
  CloudIcon, 
  DatabaseIcon, 
  Trash2Icon, 
  PencilIcon, 
  ServerIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { GCSConnection, ClickhouseConnection } from '@/hooks/useConnections';

interface ConnectionsListProps {
  connections: (GCSConnection | ClickhouseConnection)[];
  type: 'gcs' | 'clickhouse';
  onEdit: (id: string, type: 'gcs' | 'clickhouse') => void;
  onDelete: (id: string, type: 'gcs' | 'clickhouse') => void;
  onTest: (id: string, type: 'gcs' | 'clickhouse') => void;
  emptyMessage: string;
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connections,
  type,
  onEdit,
  onDelete,
  onTest,
  emptyMessage
}) => {
  if (connections.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {connections.map((connection) => (
          <TableRow key={connection.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {type === 'gcs' ? (
                  <CloudIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <ServerIcon className="h-4 w-4 text-pink-500" />
                )}
                {connection.name}
              </div>
            </TableCell>
            <TableCell>
              {type === 'gcs' ? (
                <span className="text-sm text-muted-foreground">
                  {(connection as GCSConnection).bucketName}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {(connection as ClickhouseConnection).host}:{(connection as ClickhouseConnection).port}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTest(connection.id, type)}
                >
                  <ExternalLinkIcon className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(connection.id, type)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(connection.id, type)}
                >
                  <Trash2Icon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
