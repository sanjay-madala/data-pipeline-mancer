
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GCSConfig, ClickhouseConfig } from '@/types/pipeline';

// Extended types with id and name
export interface GCSConnection extends GCSConfig {
  id: string;
  name: string;
  secrets?: Record<string, string>;
}

export interface ClickhouseConnection extends ClickhouseConfig {
  id: string;
  name: string;
  secrets?: Record<string, string>;
}

export const useConnections = () => {
  const [gcsConnections, setGCSConnections] = useState<GCSConnection[]>([]);
  const [clickhouseConnections, setClickhouseConnections] = useState<ClickhouseConnection[]>([]);

  // Load connections from localStorage on mount
  useEffect(() => {
    const storedGCSConnections = localStorage.getItem('gcsConnections');
    const storedClickhouseConnections = localStorage.getItem('clickhouseConnections');

    if (storedGCSConnections) {
      setGCSConnections(JSON.parse(storedGCSConnections));
    }

    if (storedClickhouseConnections) {
      setClickhouseConnections(JSON.parse(storedClickhouseConnections));
    }
  }, []);

  // Save connections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('gcsConnections', JSON.stringify(gcsConnections));
  }, [gcsConnections]);

  useEffect(() => {
    localStorage.setItem('clickhouseConnections', JSON.stringify(clickhouseConnections));
  }, [clickhouseConnections]);

  // Add a new GCS connection
  const addGCSConnection = (connection: GCSConfig & { id?: string, name: string, secrets?: Record<string, string> }) => {
    const newConnection = {
      ...connection,
      id: connection.id || uuidv4(),
      secrets: connection.secrets || {},
    };
    setGCSConnections(prev => [...prev, newConnection as GCSConnection]);
  };

  // Add a new Clickhouse connection
  const addClickhouseConnection = (connection: ClickhouseConfig & { id?: string, name: string, secrets?: Record<string, string> }) => {
    const newConnection = {
      ...connection,
      id: connection.id || uuidv4(),
      secrets: connection.secrets || {},
    };
    setClickhouseConnections(prev => [...prev, newConnection as ClickhouseConnection]);
  };

  // Update a GCS connection
  const updateGCSConnection = (id: string, updatedConnection: Partial<GCSConnection>) => {
    setGCSConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, ...updatedConnection } : conn
      )
    );
  };

  // Update a Clickhouse connection
  const updateClickhouseConnection = (id: string, updatedConnection: Partial<ClickhouseConnection>) => {
    setClickhouseConnections(prev => 
      prev.map(conn => 
        conn.id === id ? { ...conn, ...updatedConnection } : conn
      )
    );
  };

  // Delete a GCS connection
  const deleteGCSConnection = (id: string) => {
    setGCSConnections(prev => prev.filter(conn => conn.id !== id));
  };

  // Delete a Clickhouse connection
  const deleteClickhouseConnection = (id: string) => {
    setClickhouseConnections(prev => prev.filter(conn => conn.id !== id));
  };

  // Get a specific connection
  const getConnection = (id: string, type: 'gcs' | 'clickhouse') => {
    if (type === 'gcs') {
      return gcsConnections.find(conn => conn.id === id);
    } else {
      return clickhouseConnections.find(conn => conn.id === id);
    }
  };

  // Add or update a connection secret
  const updateConnectionSecret = (
    id: string, 
    type: 'gcs' | 'clickhouse', 
    secretKey: string, 
    secretValue: string
  ) => {
    if (type === 'gcs') {
      setGCSConnections(prev => 
        prev.map(conn => 
          conn.id === id ? { 
            ...conn, 
            secrets: { ...(conn.secrets || {}), [secretKey]: secretValue } 
          } : conn
        )
      );
    } else {
      setClickhouseConnections(prev => 
        prev.map(conn => 
          conn.id === id ? { 
            ...conn, 
            secrets: { ...(conn.secrets || {}), [secretKey]: secretValue } 
          } : conn
        )
      );
    }
  };

  return {
    gcsConnections,
    clickhouseConnections,
    addGCSConnection,
    addClickhouseConnection,
    updateGCSConnection,
    updateClickhouseConnection,
    deleteGCSConnection,
    deleteClickhouseConnection,
    getConnection,
    updateConnectionSecret
  };
};
