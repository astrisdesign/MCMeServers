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
        <div className="server-config p-4 border-b flex flex-col gap-2">
            <h2 className="section-title text-xs font-bold uppercase tracking-wider mb-2">Server Connection</h2>

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
                        className="btn btn-danger flex items-center gap-2"
                    >
                        <CircleStop size={16} />
                        Disconnect
                    </button>
                )}
            </div>

            {error && (
                <div className="status-message error text-xs mt-1 p-2 rounded">
                    Error: {error}
                </div>
            )}

            {isConnected && !error && (
                <div className="status-message success text-xs flex items-center gap-1">
                    <span className="status-indicator success"></span>
                    Connected to MCP Server
                </div>
            )}
        </div>
    );
}
