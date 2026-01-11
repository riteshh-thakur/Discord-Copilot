/**
 * Knowledge Manager Component
 */

'use client';

import { useState, useEffect } from 'react';
import { KnowledgeChunk } from '../../../shared/types';
import { knowledgeService } from '../lib/back4appService';
import { useDropzone } from 'react-dropzone';
import { X, Search, Plus, Upload, Trash2, FileText, Sparkles, BookOpen } from 'lucide-react';

interface KnowledgeManagerProps {
  onClose: () => void;
  onUpdate: () => void;
  showNotification: (message: string) => void;
}

export default function KnowledgeManager({ onClose, onUpdate, showNotification }: KnowledgeManagerProps) {
  const [knowledgeChunks, setKnowledgeChunks] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newSource, setNewSource] = useState('');

  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const chunks = await knowledgeService.getAllChunks();
      setKnowledgeChunks(chunks);
    } catch (error) {
      console.error('Failed to load knowledge:', error);
      showNotification('❌ Failed to load knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedding = async (text: string): Promise<number[]> => {
    const response = await fetch('/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.embedding;
  };

  const handleAddKnowledge = async () => {
    if (!newContent.trim() || !newSource.trim()) {
      showNotification('⚠️ Please provide both content and source');
      return;
    }

    setUploading(true);
    try {
      // Generate embedding for the content
      const embedding = await generateEmbedding(newContent);

      await knowledgeService.saveChunks([{
        content: newContent,
        source: newSource,
        embedding,
      }]);

      setNewContent('');
      setNewSource('');
      setShowAddForm(false);
      await loadKnowledge();
      onUpdate();
      showNotification('✅ Knowledge added successfully!');
    } catch (error) {
      console.error('Failed to add knowledge:', error);
      showNotification('❌ Failed to add knowledge chunk');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteChunk = async (objectId: string) => {
    if (!objectId) {
      showNotification('❌ Invalid chunk ID');
      return;
    }

    if (confirm('Are you sure you want to delete this knowledge chunk?')) {
      try {
        await knowledgeService.deleteChunk(objectId);
        await loadKnowledge();
        onUpdate();
        showNotification('✅ Knowledge chunk deleted successfully!');
      } catch (error) {
        console.error('Failed to delete chunk:', error);
        showNotification('❌ Failed to delete knowledge chunk');
      }
    }
  };

  const handleDeleteBySource = async (source: string) => {
    if (confirm(`Are you sure you want to delete all chunks from "${source}"?`)) {
      try {
        await knowledgeService.deleteBySource(source);
        await loadKnowledge();
        onUpdate();
        showNotification(`✅ All chunks from "${source}" deleted successfully!`);
      } catch (error) {
        console.error('Failed to delete chunks:', error);
        showNotification('❌ Failed to delete chunks');
      }
    }
  };

  const handlePDFUpload = async (file: File) => {
    setUploading(true);
    try {
      // Parse PDF
      const formData = new FormData();
      formData.append('file', file);

      const parseResponse = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse PDF');
      }

      const { chunks, source } = await parseResponse.json();

      // Generate embeddings for all chunks
      showNotification('📊 Generating embeddings for chunks...');
      const chunksWithEmbeddings = await Promise.all(
        chunks.map(async (chunkText: string) => {
          const embedding = await generateEmbedding(chunkText);
          return {
            content: chunkText,
            source: source,
            embedding,
          };
        })
      );

      // Save all chunks
      await knowledgeService.saveChunks(chunksWithEmbeddings);

      await loadKnowledge();
      onUpdate();
      showNotification(`✅ PDF uploaded and ${chunksWithEmbeddings.length} chunks added!`);
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      showNotification('❌ Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf');
      if (pdfFile) {
        handlePDFUpload(pdfFile);
      } else {
        showNotification('⚠️ Please upload a PDF file');
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  useEffect(() => {
    loadKnowledge();
  }, []);

  const filteredChunks = searchQuery.trim()
    ? knowledgeChunks.filter(chunk => 
        chunk.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chunk.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : knowledgeChunks;

  const sources = Array.from(new Set(knowledgeChunks.map(c => c.source)));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-5xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Knowledge Base Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* PDF Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {isDragActive
                  ? 'Drop the PDF here...'
                  : 'Drag & drop a PDF file here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">Supports PDF files only</p>
            </div>
          </div>

          {/* Search and Add Controls */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
                className="input pl-10"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Knowledge
            </button>
          </div>

          {/* Add Knowledge Form */}
          {showAddForm && (
            <div className="border-2 border-blue-200 bg-blue-50/50 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">Add New Knowledge</h3>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="input"
                  placeholder="e.g., Documentation, Manual, FAQ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="textarea"
                  placeholder="Enter knowledge content..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddKnowledge}
                  disabled={uploading}
                  className="btn btn-primary flex-1"
                >
                  {uploading ? (
                    <>
                      <div className="spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContent('');
                    setNewSource('');
                  }}
                  className="btn btn-secondary"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sources List */}
          {sources.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-medium mb-2">Sources</h3>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {source}
                    <button
                      onClick={() => handleDeleteBySource(source)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Chunks List */}
          <div className="space-y-2">
            <h3 className="font-medium">
              Knowledge Chunks ({filteredChunks.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                Loading knowledge base...
              </div>
            ) : filteredChunks.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchQuery ? 'No knowledge chunks found matching your search.' : 'No knowledge chunks available.'}
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredChunks.map((chunk) => (
                  <div key={chunk.objectId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-blue-600">
                        {chunk.source}
                      </span>
                      <button
                        onClick={() => handleDeleteChunk(chunk.objectId || '')}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {chunk.content}
                    </p>
                    <div className="text-xs text-gray-500">
                      {chunk.createdAt && `Created: ${new Date(chunk.createdAt).toLocaleString()}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {knowledgeChunks.length}
                </div>
                <div className="text-sm text-gray-500">Total Chunks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sources.length}
                </div>
                <div className="text-sm text-gray-500">Sources</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {knowledgeChunks.reduce((sum, c) => sum + c.content.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Characters</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
