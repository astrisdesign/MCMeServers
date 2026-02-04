import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { TauriShellTransport } from "../lib/TauriShellTransport";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface MCPClientContextType {
    client: Client | null;
    isConnected: boolean;
    tools: Tool[];
    connect: (scriptPath: string) => Promise<void>;
    disconnect: () => Promise<void>;
    callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
    error: string | null;
}

const MCPClientContext = createContext<MCPClientContextType | undefined>(undefined);

export function MCPClientProvider({ children }: { children: React.ReactNode }) {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [tools, setTools] = useState<Tool[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [transport, setTransport] = useState<TauriShellTransport | null>(null);

    const connect = useCallback(async (scriptPath: string) => {
        setError(null);
        try {
            if (client) {
                await disconnect();
            }

            const newTransport = new TauriShellTransport("node", [scriptPath]);
            const newClient = new Client(
                { name: "TauriApp", version: "1.0.0" },
                { capabilities: {} }
            );

            setTransport(newTransport);

            await newClient.connect(newTransport);
            setClient(newClient);
            setIsConnected(true);

            // Fetch tools immediately
            const result = await newClient.listTools();
            setTools(result.tools);

        } catch (err) {
            console.error("Failed to connect:", err);
            setError(err instanceof Error ? err.message : String(err));
            setIsConnected(false);
        }
    }, [client]);

    const disconnect = useCallback(async () => {
        if (client) {
            try {
                await client.close();
            } catch (e) {
                console.error("Error closing client:", e);
            }
        }
        if (transport) {
            try {
                await transport.close();
            } catch (e) {
                console.error("Error closing transport:", e);
            }
        }
        setClient(null);
        setTransport(null);
        setIsConnected(false);
        setTools([]);
    }, [client, transport]);

    const callTool = useCallback(async (name: string, args: Record<string, unknown>) => {
        if (!client) throw new Error("Not connected");
        return await client.callTool({ name, arguments: args });
    }, [client]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            disconnect(); // This is async but safe to call in cleanup ignore promise
        };
    }, []);

    return (
        <MCPClientContext.Provider value={{ client, isConnected, tools, connect, disconnect, callTool, error }}>
            {children}
        </MCPClientContext.Provider>
    );
}

export function useMCPClient() {
    const context = useContext(MCPClientContext);
    if (context === undefined) {
        throw new Error('useMCPClient must be used within a MCPClientProvider');
    }
    return context;
}
