/**
 * Admin Console Dashboard
 */

'use client';

import { useEffect, useState } from 'react';
import { AgentConfig, ConversationMemory } from '../../../shared/types';
import { agentConfigService, memoryService, testBack4AppConnection } from '../lib/back4appService';
import MemoryView from '../components/MemoryView';
import KnowledgeManager from '../components/KnowledgeManager';
import LogsViewer from '../components/LogsViewer';
import { 
  Settings, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Activity, 
  Zap,
  Save,
  X,
  Edit,
  Trash2,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Database,
  Bot,
  Play,
  Eye
} from 'lucide-react';

export default function Dashboard() {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [memory, setMemory] = useState<ConversationMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [instructionsText, setInstructionsText] = useState('You are a helpful AI assistant for Discord. Your personality should be:\n- Friendly and approachable\n- Knowledgeable but humble\n- Willing to help with various topics\n- Respectful and professional\n- Able to admit when you don\'t know something\n\nRules:\n- Always be helpful and respectful\n- Never provide harmful or dangerous information\n- Keep responses concise but informative\n- Use appropriate formatting for readability');
  const [channelIds, setChannelIds] = useState('123456789012345678, 987654321098765432');
  const [ragEnabled, setRagEnabled] = useState(true);
  const [notification, setNotification] = useState('');
  const [showMemoryView, setShowMemoryView] = useState(false);
  const [showKnowledgeManager, setShowKnowledgeManager] = useState(false);
  const [showLogsViewer, setShowLogsViewer] = useState(false);
  const [back4appConnected, setBack4appConnected] = useState<boolean | null>(null);

  const initializeData = async () => {
    console.log('🔄 Initializing admin dashboard data...');
    try {
      // Test Back4App connection first
      const connectionResult = await testBack4AppConnection();
      setBack4appConnected(connectionResult.connected);
      
      if (!connectionResult.connected) {
        let errorMsg = '⚠️ Back4App connection failed. ';
        if (connectionResult.error === 'unauthorized') {
          errorMsg += '403 Unauthorized - Please verify your JavaScript Key and ensure Parse classes exist in Back4App dashboard.';
        } else if (connectionResult.error === 'credentials') {
          errorMsg += 'Missing credentials - Please check your .env.local file.';
        } else {
          errorMsg += connectionResult.message || 'Please check your Back4App configuration.';
        }
        showNotification(errorMsg);
        
        // Still try to proceed - maybe classes just need to be created
        console.warn('⚠️ Connection test failed, but proceeding anyway...');
      }

      const [configData, memoryData] = await Promise.all([
        agentConfigService.getActiveConfig(),
        memoryService.getMemory()
      ]);
      console.log('📊 Data loaded:', { configData, memoryData });
      
      // Auto-initialize config if it doesn't exist
      if (!configData) {
        console.log('📝 No config found, creating default...');
        try {
          const defaultConfig = await agentConfigService.saveConfig({
            systemInstructions: instructionsText,
            allowedChannelIds: channelIds.split(',').map(id => id.trim()).filter(id => id),
            ragEnabled: true
          });
          setConfig(defaultConfig);
          showNotification('✅ Default configuration created!');
        } catch (error) {
          console.error('Failed to create default config:', error);
        }
      } else {
        setConfig(configData);
        setInstructionsText(configData.systemInstructions);
        setChannelIds(configData.allowedChannelIds.join(', '));
        setRagEnabled(configData.ragEnabled);
      }
      
      // Auto-initialize memory if it doesn't exist
      if (!memoryData) {
        console.log('🧠 No memory found, creating default...');
        try {
          const defaultMemory = await memoryService.saveMemory('');
          setMemory(defaultMemory);
        } catch (error) {
          console.error('Failed to create default memory:', error);
        }
      } else {
        setMemory(memoryData);
      }
    } catch (error: any) {
      console.error('❌ Failed to load data:', error);
      setBack4appConnected(false);
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('credentials')) {
        showNotification('❌ Back4App credentials missing. Please check your .env.local file.');
      } else {
        showNotification(`⚠️ Error loading data: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveInstructions = async () => {
    console.log('💾 Save Instructions clicked');
    console.log('📊 Current config state:', config);
    console.log('📝 Instructions text:', instructionsText);
    
    try {
      const ids = channelIds.split(',').map(id => id.trim()).filter(id => id);
      
      if (config && config.objectId) {
        // Update existing config
        await agentConfigService.updateConfig(config.objectId, {
          systemInstructions: instructionsText,
          allowedChannelIds: ids,
          ragEnabled: ragEnabled
        });
      } else {
        // Create new config
        await agentConfigService.saveConfig({
          systemInstructions: instructionsText,
          allowedChannelIds: ids,
          ragEnabled: ragEnabled
        });
      }
      
      console.log('✅ Config saved successfully');
      await initializeData();
      setEditingInstructions(false);
      showNotification('✅ Instructions saved successfully!');
    } catch (error: any) {
      console.error('❌ Save instructions error:', error);
      const errorMsg = error?.message || 'Unknown error';
      if (errorMsg.includes('403') || errorMsg.includes('unauthorized')) {
        showNotification('❌ 403 Unauthorized - Please check: 1) JavaScript Key is correct, 2) AgentConfig class exists in Back4App, 3) Permissions are set correctly');
      } else {
        showNotification(`❌ Failed to save instructions: ${errorMsg}`);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      const ids = channelIds.split(',').map(id => id.trim()).filter(id => id);
      if (config && config.objectId) {
        await agentConfigService.updateConfig(config.objectId, {
          allowedChannelIds: ids,
          ragEnabled
        });
      } else {
        // Create new config with current instructions or default
        await agentConfigService.saveConfig({
          systemInstructions: instructionsText || 'You are a helpful AI assistant for Discord.',
          allowedChannelIds: ids,
          ragEnabled
        });
      }
      await initializeData();
      setEditingSettings(false);
      showNotification('✅ Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      const errorMsg = error?.message || 'Unknown error';
      if (errorMsg.includes('403') || errorMsg.includes('unauthorized')) {
        showNotification('❌ 403 Unauthorized - Please check: 1) JavaScript Key is correct, 2) AgentConfig class exists in Back4App, 3) Permissions are set correctly');
      } else {
        showNotification(`❌ Failed to save settings: ${errorMsg}`);
      }
    }
  };

  const handleResetMemory = async () => {
    if (confirm('Are you sure you want to reset conversation memory? This action cannot be undone.')) {
      try {
        await memoryService.resetMemory();
        await initializeData();
        showNotification('✅ Memory reset successfully!');
      } catch (error: any) {
        console.error('Failed to reset memory:', error);
        const errorMsg = error?.message || 'Unknown error';
        if (errorMsg.includes('403') || errorMsg.includes('unauthorized')) {
          showNotification('❌ 403 Unauthorized - Please check your JavaScript Key and class permissions.');
        } else {
          showNotification(`❌ Failed to reset memory: ${errorMsg}`);
        }
      }
    }
  };

  const handleTestBot = () => {
    showNotification('🤖 Bot test initiated - Check Discord for response!');
  };

  const handleExportConfig = () => {
    const configData = {
      systemInstructions: instructionsText,
      allowedChannelIds: channelIds.split(',').map(id => id.trim()),
      ragEnabled,
      memory: memory?.summary
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discord-copilot-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('📥 Configuration exported successfully!');
  };

  const handleViewDocumentation = () => {
    window.open('/docs', '_blank');
  };

  const handleViewLogs = () => {
    setShowLogsViewer(true);
  };

  const handleManageKnowledge = () => {
    setShowKnowledgeManager(true);
  };

  const handleViewMemory = () => {
    setShowMemoryView(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner text-blue-600"></div>
          <div className="text-lg font-semibold text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative z-10">
      {/* Notification */}
      {notification && (
        <div className="notification">
          <div className="flex items-center gap-2">
            {notification.includes('✅') ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : notification.includes('❌') ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Memory View Modal */}
      {showMemoryView && (
        <MemoryView
          memory={memory}
          onClose={() => setShowMemoryView(false)}
          onUpdate={initializeData}
          showNotification={showNotification}
        />
      )}

      {/* Knowledge Manager Modal */}
      {showKnowledgeManager && (
        <KnowledgeManager
          onClose={() => setShowKnowledgeManager(false)}
          onUpdate={initializeData}
          showNotification={showNotification}
        />
      )}

      {/* Logs Viewer Modal */}
      {showLogsViewer && (
        <LogsViewer
          onClose={() => setShowLogsViewer(false)}
        />
      )}

      <header className="mb-10">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Discord Copilot Admin
                </h1>
                <p className="text-gray-700 mt-1 font-medium">Manage your AI agent configuration and knowledge</p>
              </div>
            </div>
          </div>
          {back4appConnected !== null && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className={`status-indicator ${back4appConnected ? 'text-green-500' : 'text-red-500'}`}>
                <div className={`w-3 h-3 rounded-full ${back4appConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {back4appConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Instructions Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">System Instructions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Define personality, tone, rules, and behavioral constraints
          </p>
          {editingInstructions ? (
            <div className="space-y-4">
              <textarea
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                className="textarea"
                placeholder="Enter system instructions..."
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveInstructions}
                  className="btn btn-primary"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingInstructions(false)}
                  className="btn btn-secondary"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : config ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {config.systemInstructions.substring(0, 150)}...
                </p>
              </div>
              <button 
                onClick={() => setEditingInstructions(true)}
                className="btn btn-primary w-full"
              >
                <Edit className="w-4 h-4" />
                Edit Instructions
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setEditingInstructions(true)}
              className="btn btn-primary w-full"
            >
              <Sparkles className="w-4 h-4" />
              Create Instructions
            </button>
          )}
        </div>

        {/* Memory Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Conversation Memory</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Rolling conversation summary for context
          </p>
          {memory ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {memory.summary ? `${memory.summary.substring(0, 150)}...` : 'Empty memory (will be populated as bot interacts)'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleViewMemory}
                  className="btn btn-secondary flex-1"
                >
                  <Eye className="w-4 h-4" />
                  View/Edit
                </button>
                <button 
                  onClick={handleResetMemory}
                  className="btn btn-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">No memory data found</p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const newMemory = await memoryService.saveMemory('');
                    setMemory(newMemory);
                    showNotification('✅ Memory initialized successfully!');
                    await initializeData();
                  } catch (error: any) {
                    console.error('Failed to initialize memory:', error);
                    const errorMsg = error?.message || 'Unknown error';
                    if (errorMsg.includes('403') || errorMsg.includes('unauthorized')) {
                      showNotification('❌ 403 Unauthorized - Please check: 1) JavaScript Key is correct, 2) ConversationMemory class exists in Back4App, 3) Permissions are set correctly');
                    } else {
                      showNotification(`❌ Failed to create memory: ${errorMsg}`);
                    }
                  }
                }}
                className="btn btn-primary w-full"
              >
                <Sparkles className="w-4 h-4" />
                Initialize Memory
              </button>
            </div>
          )}
        </div>

        {/* Discord Settings Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Discord Settings</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure allowed channels and bot behavior
          </p>
          {editingSettings ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowed Channel IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={channelIds}
                  onChange={(e) => setChannelIds(e.target.value)}
                  className="input"
                  placeholder="123456789012345678, 987654321098765432"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="ragEnabled"
                  checked={ragEnabled}
                  onChange={(e) => setRagEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="ragEnabled" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable RAG (Retrieval-Augmented Generation)
                </label>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveSettings}
                  className="btn btn-primary flex-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingSettings(false)}
                  className="btn btn-secondary"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : config ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Channels:</span>
                  <span className="text-sm font-bold text-blue-600">{config.allowedChannelIds.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">RAG:</span>
                  <span className={`text-sm font-bold ${config.ragEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {config.ragEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setEditingSettings(true)}
                className="btn btn-primary w-full"
              >
                <Edit className="w-4 h-4" />
                Edit Settings
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 mb-2">No configuration found</p>
              </div>
              <button 
                onClick={() => setEditingSettings(true)}
                className="btn btn-primary w-full"
              >
                <Sparkles className="w-4 h-4" />
                Create Configuration
              </button>
            </div>
          )}
        </div>

        {/* Knowledge Management Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Upload and manage PDF documents for RAG
          </p>
          <button 
            onClick={handleManageKnowledge}
            className="btn btn-primary w-full"
          >
            <FileText className="w-4 h-4" />
            Manage Knowledge
          </button>
        </div>

        {/* Bot Status Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Bot Status</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Monitor Discord bot connection and activity
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="status-indicator">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-green-700">Online</span>
            </div>
            <button 
              onClick={handleViewLogs}
              className="btn btn-secondary w-full"
            >
              <Eye className="w-4 h-4" />
              View Logs
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card p-6 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Common administrative tasks
          </p>
          <div className="space-y-2">
            <button 
              onClick={handleTestBot}
              className="btn btn-secondary w-full"
            >
              <Play className="w-4 h-4" />
              Test Bot Response
            </button>
            <button 
              onClick={handleExportConfig}
              className="btn btn-secondary w-full"
            >
              <Download className="w-4 h-4" />
              Export Configuration
            </button>
            <button 
              onClick={handleViewDocumentation}
              className="btn btn-secondary w-full"
            >
              <FileText className="w-4 h-4" />
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
