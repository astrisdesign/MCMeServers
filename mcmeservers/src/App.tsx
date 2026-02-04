import { useState } from 'react';
import { MCPClientProvider } from './contexts/MCPClientContext';
import { ServerConfig } from './components/ServerConfig';
import { ToolList } from './components/ToolList';
import { ToolForm } from './components/ToolForm';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import './App.css';

function AppContent() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  return (
    <div className="main-container flex flex-col h-screen overflow-hidden">
      <div className="title-bar shrink-0">
        MCMeServers
      </div>

      {/* Top Bar for Connection */}
      <ServerConfig />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Tool List */}
        <div className="sidebar h-full overflow-hidden flex flex-col">
          <ToolList
            onSelectTool={setSelectedTool}
            selectedToolName={selectedTool?.name}
          />
        </div>

        {/* Main: Tool Form */}
        <div className="main-content flex-1 h-full overflow-hidden flex flex-col relative">
          {selectedTool ? (
            <ToolForm tool={selectedTool} key={selectedTool.name} />
          ) : (
            <div className="empty-state flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="empty-logo text-4xl mb-4 font-light opacity-20">M C P</div>
              <p className="text-sm opacity-50">Select a tool from the sidebar to configure and run it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <MCPClientProvider>
      <AppContent />
    </MCPClientProvider>
  );
}

export default App;
