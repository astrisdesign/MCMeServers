import React, { useState } from 'react';
import { useMCPClient } from '../contexts/MCPClientContext';
import { Server, Link, Unlink, Activity, AlertCircle } from 'lucide-react';

const ServerConfig: React.FC = () => {
    const { isConnected, connect, disconnect, error } = useMCPClient();
    const [path, setPath] = useState('');

    const handleConnect = async () => {
        if (path.trim()) {
            await connect(path);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Server className={`w-4 h-4 transition-colors ${isConnected ? 'text-success-color' : 'text-text-dim'}`} />
                    </div>
                    <input
                        type="text"
                        className="input w-full pl-10 h-[42px]"
                        placeholder="Absolute path to MCP server executable..."
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        disabled={isConnected}
                    />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            className="btn btn-primary h-[42px] flex items-center gap-2 min-w-[140px] justify-center"
                        >
                            <Link className="w-4 h-4" />
                            <span>Connect</span>
                        </button>
                    ) : (
                        <button
                            onClick={disconnect}
                            className="btn btn-secondary h-[42px] flex items-center gap-2 min-w-[140px] justify-center"
                        >
                            <Unlink className="w-4 h-4" />
                            <span>Disconnect</span>
                        </button>
                    )}

                    {isConnected && (
                        <div className="flex items-center gap-2 px-4 h-[42px] bg-success-bg border border-success-border rounded-xl text-success-color text-xs font-bold">
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                            <span>ONLINE</span>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-3 p-3 bg-error-bg border border-error-border rounded-xl text-error-color text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="flex-1 font-mono text-xs">
                        <span className="font-bold uppercase mr-2">[Connection Error]</span>
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServerConfig;
