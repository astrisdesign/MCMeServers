import { useMCPClient } from '../contexts/MCPClientContext';
import { Wrench, ChevronRight, Loader2 } from 'lucide-react';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

interface ToolListProps {
    onSelectTool: (tool: Tool) => void;
    selectedToolName?: string;
}

export function ToolList({ onSelectTool, selectedToolName }: ToolListProps) {
    const { tools, isConnected } = useMCPClient();

    return (
        <div className="flex flex-col h-full bg-[#252526] border-r border-[#6f6f6f]">
            <h3 className="p-3 text-xs font-bold uppercase tracking-wider text-[#cccccc] border-b border-[#3c3c3c] flex justify-between items-center">
                <span>Available Tools</span>
                <span className="bg-[#3c3c3c] px-1.5 py-0.5 rounded text-[10px]">{tools.length}</span>
            </h3>

            <div className="overflow-y-auto flex-1">
                {!isConnected ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-50">
                        <div className="text-4xl mb-2">🔌</div>
                        <p className="text-xs text-[#cccccc]">Connect to a server<br />to list tools</p>
                    </div>
                ) : tools.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-50">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-xs text-[#cccccc]">No tools found</p>
                    </div>
                ) : (
                    tools.map((tool) => (
                        <button
                            key={tool.name}
                            onClick={() => onSelectTool(tool)}
                            className={`w-full text-left p-3 flex items-center gap-2 hover:bg-[#2a2d2e] border-b border-[#3c3c3c] transition-colors
                ${selectedToolName === tool.name ? 'bg-[#094771] hover:bg-[#094771] border-l-2 border-l-white' : 'border-l-2 border-l-transparent'}
              `}
                        >
                            <Wrench size={14} className="text-[#007fd4] shrink-0" />
                            <div className="overflow-hidden min-w-0 flex-1">
                                <div className="font-medium text-xs truncate">{tool.name}</div>
                                <div className="text-[10px] text-[#cccccc] truncate opacity-70">{tool.description || "No description"}</div>
                            </div>
                            <ChevronRight size={12} className="ml-auto opacity-50 shrink-0" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
