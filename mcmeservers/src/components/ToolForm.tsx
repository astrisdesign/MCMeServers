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
        <div className="tool-form flex flex-col h-full overflow-hidden">
            <div className="tool-form-header p-4 border-b">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="tool-name">{tool.name}</span>
                </h2>
                <p className="tool-description text-sm mt-1">{tool.description}</p>
            </div>

            <div className="tool-form-body flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Form Area */}
                    <div className="form-card p-4 rounded mb-6">
                        <h3 className="section-title text-xs uppercase tracking-wider font-bold mb-4 border-b pb-2">Arguments</h3>
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
                                <button type="submit" disabled={isExecuting} className="btn-primary btn flex items-center gap-2 px-6 py-2 shadow-sm">
                                    {isExecuting ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                    Execute Tool
                                </button>
                            </div>
                        </Form>
                    </div>

                    {/* Results Area */}
                    {(result || error) && (
                        <div className={`result-card rounded p-4 border ${error ? 'error' : 'success'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                                {error ? (
                                    <><AlertTriangle size={16} /> Error</>
                                ) : (
                                    <><CheckCircle size={16} /> Execution Result</>
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
