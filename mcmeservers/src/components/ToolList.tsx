import { useMCPClient } from '../contexts/MCPClientContext';
import { Wrench, ChevronRight } from 'lucide-react';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

interface ToolListProps {
    onSelectTool: (tool: Tool) => void;
    selectedToolName?: string;
}

export function ToolList({ onSelectTool, selectedToolName }: ToolListProps) {
    const { tools, isConnected } = useMCPClient();

    return (
        <div className="tool-list flex flex-col h-full">
            <h3 className="tool-list-header p-3 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Available Tools</span>
                <span className="tool-count px-6 py-2 rounded text-[10px]">{tools.length}</span>
            </h3>

            <div className="overflow-y-auto flex-1">
                {!isConnected ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-50">
                        <div className="text-4xl mb-2">🔌</div>
                        <p className="text-xs">Connect to a server<br />to list tools</p>
                    </div>
                ) : tools.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-50">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-xs">No tools found</p>
                    </div>
                ) : (
                    tools.map((tool) => (
                        <button
                            key={tool.name}
                            onClick={() => onSelectTool(tool)}
                            className={`tool-item w-full text-left p-3 flex items-center gap-2 border-b transition-colors
                ${selectedToolName === tool.name ? 'active' : ''}
              `}
                        >
                            <Wrench size={14} className="tool-icon shrink-0" />
                            <div className="overflow-hidden min-w-0 flex-1">
                                <div className="font-medium text-xs truncate">{tool.name}</div>
                                <div className="tool-desc text-[10px] truncate opacity-70">{tool.description || "No description"}</div>
                            </div>
                            <ChevronRight size={12} className="ml-auto opacity-50 shrink-0" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
