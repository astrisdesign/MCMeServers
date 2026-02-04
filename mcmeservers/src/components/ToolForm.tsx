import { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useMCPClient } from '../contexts/MCPClientContext';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Play, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface ToolFormProps {
    tool: Tool;
}

export function ToolForm({ tool }: ToolFormProps) {
    const { callTool } = useMCPClient();
    const [formData, setFormData] = useState<any>({});
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Using any for data to avoid import issues with RJSF types
    const handleSubmit = async (data: any) => {
        const { formData } = data;
        setIsExecuting(true);
        setResult(null);
        setError(null);
        try {
            const resp = await callTool(tool.name, formData);
            setResult(resp);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsExecuting(false);
        }
    };

    const handleClear = () => {
        setResult(null);
        setError(null);
    }

    // Schema adjustments if needed
    const schema = tool.inputSchema as any;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-[#6f6f6f] bg-[#1e1e1e]">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-[#007fd4]">{tool.name}</span>
                </h2>
                <p className="text-sm text-[#cccccc] mt-1">{tool.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Form Area */}
                    <div className="bg-[#252526] p-4 rounded shadow-lg border border-[#3c3c3c] mb-6">
                        <h3 className="text-xs uppercase tracking-wider font-bold text-[#cccccc] mb-4 border-b border-[#3c3c3c] pb-2">Arguments</h3>
                        <Form
                            schema={schema}
                            validator={validator}
                            formData={formData}
                            onChange={(e) => setFormData(e.formData)}
                            onSubmit={handleSubmit}
                            className="rjsf"
                            liveValidate
                        >
                            <div className="mt-6 flex gap-3">
                                <button type="submit" disabled={isExecuting} className="btn flex items-center gap-2 px-6 py-2 shadow-sm">
                                    {isExecuting ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                    Execute Tool
                                </button>
                            </div>
                        </Form>
                    </div>

                    {/* Results Area */}
                    {(result || error) && (
                        <div className={`rounded p-4 border ${error ? 'border-[#f48771] bg-[#3a1d1d]' : 'border-[#89d185] bg-[#1e3a1e]'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                                {error ? (
                                    <><AlertTriangle size={16} className="text-[#f48771]" /> Error</>
                                ) : (
                                    <><CheckCircle size={16} className="text-[#89d185]" /> Execution Result</>
                                )}
                            </div>
                            <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                                {error ? error : JSON.stringify(result, null, 2)}
                            </pre>
                            <button onClick={handleClear} className="mt-2 text-[10px] underline opacity-70 hover:opacity-100">Clear Output</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
