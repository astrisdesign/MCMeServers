import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { MCPTool } from '../types';
import { useMCPClient } from '../contexts/MCPClientContext';
import { Play, Copy, Check, Terminal, Info, AlertTriangle, Settings } from 'lucide-react';

interface ToolFormProps {
    tool: MCPTool;
}

const ToolForm: React.FC<ToolFormProps> = ({ tool }) => {
    const { callTool } = useMCPClient();
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async ({ formData }: { formData?: any }) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await callTool(tool.name, formData);
            setResult(response);
        } catch (err: any) {
            setError(err.message || 'Execution failed');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="tool-form">
            <header className="tool-form-header">
                <div className="flex items-center gap-3 mb-2">
                    <Terminal className="w-6 h-6 text-accent-color" />
                    <h2 className="tool-name">{tool.name}</h2>
                </div>
                {tool.description && (
                    <p className="tool-description">
                        {tool.description}
                    </p>
                )}
            </header>

            <div className="tool-form-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Form Side */}
                    <div className="form-card">
                        <h3 className="section-title mb-6 flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Parameters
                        </h3>
                        <Form
                            schema={tool.inputSchema as any}
                            validator={validator}
                            onSubmit={handleSubmit}
                            className="rjsf"
                        >
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                                    ) : (
                                        <Play className="w-4 h-4 fill-current" />
                                    )}
                                    <span>{isLoading ? 'Executing...' : 'Run Tool'}</span>
                                </button>
                            </div>
                        </Form>
                    </div>

                    {/* Result Side */}
                    <div className="flex flex-col gap-6">
                        {(result || error) ? (
                            <div className={`result-card form-card ${error ? 'border-error-color/30' : 'border-success-color/30'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="section-title m-0 flex items-center gap-2">
                                        {error ? <AlertTriangle className="w-4 h-4 text-error-color" /> : <Terminal className="w-4 h-4 text-success-color" />}
                                        {error ? 'Error' : 'Output'}
                                    </h3>
                                    {result && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 hover:bg-highlight-bg rounded-lg transition-colors text-text-dim hover:text-accent-color"
                                            title="Copy result"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-success-color" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-4 bg-error-color/10 border border-error-color/20 rounded-lg text-error-color text-sm font-mono mt-2">
                                        {error}
                                    </div>
                                )}

                                {result && (
                                    <pre className="text-xs font-mono text-text-secondary overflow-x-auto">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ) : (
                            <div className="form-card flex flex-col items-center justify-center py-16 text-center opacity-60">
                                <div className="w-12 h-12 rounded-full bg-highlight-bg flex items-center justify-center mb-4">
                                    <Info className="w-6 h-6 text-text-dim" />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-text-dim">Waiting for Input</h4>
                                <p className="text-xs max-w-[200px] mt-2">Configure parameters and run the tool to see results here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolForm;
