import React from 'react';
import { MCPTool } from '../types';
import { ChevronRight, Wrench } from 'lucide-react';

interface ToolListProps {
    tools: MCPTool[];
    onSelect: (toolId: string) => void;
    selectedId: string | null;
}

const ToolList: React.FC<ToolListProps> = ({ tools, onSelect, selectedId }) => {
    return (
        <div className="tool-list">
            {tools.map((tool) => (
                <button
                    key={tool.name}
                    onClick={() => onSelect(tool.name)}
                    className={`tool-item w-full flex items-start gap-3 text-left ${selectedId === tool.name ? 'active' : ''
                        }`}
                >
                    <div className="tool-icon mt-1">
                        <Wrench className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{tool.name}</div>
                        {tool.description && (
                            <div className="tool-desc line-clamp-2 mt-1">
                                {tool.description}
                            </div>
                        )}
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${selectedId === tool.name ? 'rotate-90 text-accent-color' : 'text-text-dim'}`} />
                </button>
            ))}
        </div>
    );
};

export default ToolList;
