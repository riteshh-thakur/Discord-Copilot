/**
 * Memory View Component
 */

'use client';

import { useState } from 'react';
import { ConversationMemory } from '../../shared/types';
import { memoryService } from '../lib/back4appService';
import { X, Save, Edit, Trash2, Brain, Clock } from 'lucide-react';

interface MemoryViewProps {
  memory: ConversationMemory | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function MemoryView({ memory, onClose, onUpdate }: MemoryViewProps) {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(memory?.summary || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (memory) {
        await memoryService.updateMemory(memory.objectId, summary);
      } else {
        await memoryService.saveMemory(summary);
      }
      onUpdate();
      setEditing(false);
    } catch (error) {
      alert('Failed to update memory');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear the memory summary? This action cannot be undone.')) {
      setLoading(true);
      try {
        if (memory) {
          await memoryService.updateMemory(memory.objectId, '');
        } else {
          await memoryService.saveMemory('');
        }
        setSummary('');
        onUpdate();
        console.log('✅ Memory cleared successfully!');
      } catch (error) {
        console.error('❌ Failed to clear memory');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Conversation Memory</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Memory Summary
            </label>
            {editing ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="textarea h-64"
                placeholder="Enter conversation memory summary..."
              />
            ) : (
              <div className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm overflow-y-auto leading-relaxed">
                {summary || (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No memory summary available
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {memory && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date(memory.updatedAt).toLocaleString()}</span>
              </div>
            )}
            {!memory && <div></div>}

            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-primary"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={loading}
                    className="btn btn-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
