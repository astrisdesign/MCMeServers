import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mcmeservers-library';

export interface SavedServer {
    id: string;
    path: string;
    name: string;
    addedAt: number;
}

function generateId(): string {
    return `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function extractServerName(path: string): string {
    // Extract filename from path (works for both Windows and Unix paths)
    const normalizedPath = path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const filename = parts[parts.length - 1] || 'unknown-server';

    // Remove common extensions
    return filename
        .replace(/\.(js|ts|mjs|cjs|exe|py)$/i, '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function loadFromStorage(): SavedServer[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load server library:', e);
    }
    return [];
}

function saveToStorage(servers: SavedServer[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    } catch (e) {
        console.error('Failed to save server library:', e);
    }
}

export function useServerLibrary() {
    const [savedServers, setSavedServers] = useState<SavedServer[]>(() => loadFromStorage());

    // Sync to localStorage whenever savedServers changes
    useEffect(() => {
        saveToStorage(savedServers);
    }, [savedServers]);

    const addServer = useCallback((path: string) => {
        const trimmedPath = path.trim();
        if (!trimmedPath) return;

        // Check if already exists
        const exists = savedServers.some(s => s.path.toLowerCase() === trimmedPath.toLowerCase());
        if (exists) return;

        const newServer: SavedServer = {
            id: generateId(),
            path: trimmedPath,
            name: extractServerName(trimmedPath),
            addedAt: Date.now(),
        };

        setSavedServers(prev => [...prev, newServer].sort((a, b) => a.name.localeCompare(b.name)));
    }, [savedServers]);

    const removeServer = useCallback((id: string) => {
        setSavedServers(prev => prev.filter(s => s.id !== id));
    }, []);

    const isPathSaved = useCallback((path: string): boolean => {
        const trimmedPath = path.trim().toLowerCase();
        return savedServers.some(s => s.path.toLowerCase() === trimmedPath);
    }, [savedServers]);

    return {
        savedServers,
        addServer,
        removeServer,
        isPathSaved,
    };
}
