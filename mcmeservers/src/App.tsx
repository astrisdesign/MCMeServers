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
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 bg-[#252526] text-center py-2 text-xs font-bold tracking-widest text-[#555] select-none border-b border-[#333]">
        MCMeServers
      </div>

      {/* Top Bar for Connection */}
      <ServerConfig />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Tool List */}
        <div className="w-1/3 min-w-[250px] max-w-[350px] h-full overflow-hidden flex flex-col">
          <ToolList
            onSelectTool={setSelectedTool}
            selectedToolName={selectedTool?.name}
          />
        </div>

        {/* Main: Tool Form */}
        <div className="flex-1 h-full bg-[#1e1e1e] overflow-hidden flex flex-col relative">
          {selectedTool ? (
            <ToolForm tool={selectedTool} key={selectedTool.name} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#444] p-8 text-center">
              <div className="text-4xl mb-4 font-light opacity-20">M C P</div>
              <p className="text-sm">Select a tool from the sidebar to configure and run it.</p>
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
