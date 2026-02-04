import { useState } from 'react';
import { useMCPClient } from '../contexts/MCPClientContext';
import { Plug, CircleStop, Loader2 } from 'lucide-react';

export function ServerConfig() {
    const { connect, disconnect, isConnected, error } = useMCPClient();
    const [path, setPath] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = async () => {
        if (!path) return;
        setIsLoading(true);
        await connect(path);
        setIsLoading(false);
    };

    const handleDisconnect = async () => {
        setIsLoading(true);
        await disconnect();
        setIsLoading(false);
    }

    // Pre-fill for testing/demo (optional)
    // useEffect(() => setPath('C:\\Github\\ABE2\\ABE2\\library\\tools\\clinerules-manager\\index.js'), []);

    return (
        <div className="p-4 border-b border-[#6f6f6f] bg-[#1e1e1e] flex flex-col gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#cccccc] mb-2">Server Connection</h2>

            <div className="flex gap-2 w-full">
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="Path to server executable (e.g. index.js)"
                    className="input flex-1 font-mono text-xs"
                    disabled={isConnected}
                />

                {!isConnected ? (
                    <button
                        onClick={handleConnect}
                        disabled={isLoading || !path}
                        className="btn flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Plug size={16} />}
                        Connect
                    </button>
                ) : (
                    <button
                        onClick={handleDisconnect}
                        disabled={isLoading}
                        className="btn bg-red-600 hover:bg-red-700 flex items-center gap-2"
                        style={{ backgroundColor: '#d13438' }}
                    >
                        <CircleStop size={16} />
                        Disconnect
                    </button>
                )}
            </div>

            {error && (
                <div className="text-red-400 text-xs mt-1 bg-red-900/20 p-2 border border-red-900 rounded">
                    Error: {error}
                </div>
            )}

            {isConnected && !error && (
                <div className="text-[#89d185] text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#89d185]"></span>
                    Connected to MCP Server
                </div>
            )}
        </div>
    );
}
