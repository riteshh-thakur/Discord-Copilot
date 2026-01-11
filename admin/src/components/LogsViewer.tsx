/**
 * Logs Viewer Component
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Search, RefreshCw, Download, Trash2, FileText, Activity, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

interface LogsViewerProps {
  onClose: () => void;
}

export default function LogsViewer({ onClose }: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Mock logs for demonstration
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          level: 'success',
          message: 'Discord Copilot Bot connected successfully',
          source: 'Discord Client'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
          level: 'info',
          message: 'User @username requested assistance with configuration',
          source: 'Message Handler'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
          level: 'success',
          message: 'AI response generated successfully (156 tokens)',
          source: 'LLM Service'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          level: 'warning',
          message: 'Rate limit approaching for channel #general',
          source: 'Rate Limiter'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
          level: 'info',
          message: 'Knowledge base searched for "configuration help"',
          source: 'Knowledge Service'
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 600000), // 10 minutes ago
          level: 'error',
          message: 'Failed to connect to OpenRouter API: Timeout',
          source: 'LLM Service'
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          level: 'success',
          message: 'Conversation memory updated with new summary',
          source: 'Memory Service'
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 60000), // 1 minute ago
          level: 'info',
          message: 'Bot responded to user query about API limits',
          source: 'Message Handler'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = !searchQuery.trim() || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const exportLogs = () => {
    const logData = {
      exportedAt: new Date().toISOString(),
      totalLogs: logs.length,
      logs: logs
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-copilot-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-6xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">System Logs</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="input pl-10"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input w-40"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            <button
              onClick={loadLogs}
              className="btn btn-secondary"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={exportLogs}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={clearLogs}
              className="btn btn-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {logs.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Logs</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {logs.filter(l => l.level === 'success').length}
              </div>
              <div className="text-sm font-medium text-gray-600">Success</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {logs.filter(l => l.level === 'warning').length}
              </div>
              <div className="text-sm font-medium text-gray-600">Warnings</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {logs.filter(l => l.level === 'error').length}
              </div>
              <div className="text-sm font-medium text-gray-600">Errors</div>
            </div>
          </div>

          {/* Logs List */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner text-blue-600 mx-auto mb-3"></div>
                <div className="text-gray-500 font-medium">Loading logs...</div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery || filter !== 'all' 
                  ? 'No logs found matching your criteria.' 
                  : 'No logs available.'}
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span>{log.level.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {log.source}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {log.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {log.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
