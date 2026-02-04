import React, { useState } from 'react';
import { MCPClientProvider, useMCPClient } from './contexts/MCPClientContext';
import ServerConfig from './components/ServerConfig';
import ToolList from './components/ToolList';
import ToolForm from './components/ToolForm';
import { Terminal, Github, Info } from 'lucide-react';
import './App.css';

const AppContent: React.FC = () => {
  const { isConnected, tools } = useMCPClient();
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const selectedTool = tools.find(t => t.name === selectedToolId);

  return (
    <div className="main-container">
      {/* JExTile-style Slim Title Bar */}
      <div className="title-bar">
        <span>MCMeServers</span>
        <div className="flex items-center gap-3 absolute right-4">
          <Info className="w-4 h-4 text-text-dim hover:text-accent-color cursor-pointer transition-colors" />
          <Github className="w-4 h-4 text-text-dim hover:text-accent-color cursor-pointer transition-colors" />
        </div>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Connection Area */}
        <section className="server-config">
          <div className="max-w-7xl mx-auto">
            <div className="section-title">SERVER CONFIGURATION</div>
            <ServerConfig />
          </div>
        </section>

        {/* Content Split Area */}
        <div className="content-wrapper flex-1">
          {isConnected && (
            <>
              {/* Sidebar */}
              <aside className="sidebar">
                <div className="tool-list-header flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent-color" />
                    <span className="text-xs font-bold uppercase tracking-widest text-text-dim">Available Tools</span>
                  </div>
                  <span className="tool-count px-2 py-0.5 rounded-full text-[10px]">
                    {tools.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ToolList
                    onSelect={setSelectedToolId}
                    selectedId={selectedToolId}
                    tools={tools}
                  />
                </div>
              </aside>

              {/* Main View Area */}
              <div className="main-content">
                {selectedTool ? (
                  <ToolForm tool={selectedTool} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="empty-logo mb-4">MCMESERVERS</div>
                    <div className="max-w-md text-center">
                      <h2 className="text-xl font-semibold mb-2 text-text-color">Ready to Explore</h2>
                      <p className="text-text-secondary text-sm">
                        Connect to an MCP server to see available tools. Select a tool from the list to view its parameters and execute commands.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!isConnected && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-bg-color">
              <div className="p-8 rounded-3xl bg-panel-bg border border-border-color shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-accent-color/10 flex items-center justify-center mb-6 border border-accent-color/20">
                    <Terminal className="w-8 h-8 text-accent-color" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Welcome to MCMeServers</h2>
                  <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                    Provide the path to your Model Context Protocol server (executable) to browse and interact with its tools.
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-highlight-bg border border-border-color rounded-xl text-xs text-text-muted">
                    <Info className="w-3.5 h-3.5" />
                    <span>Enter executable path at the top to begin</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MCPClientProvider>
      <AppContent />
    </MCPClientProvider>
  );
};

export default App;
