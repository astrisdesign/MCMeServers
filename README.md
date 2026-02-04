# MCMeServers
Human interface for MCP servers, built with Tauri 2.0.

## Implementation Details

This application uses the **Client in Frontend** architecture.
1.  **Frontend**: React + TypeScript.
2.  **SDK**: uses `@modelcontextprotocol/sdk` to handle the MCP protocol.
3.  **Transport**: Custom `TauriShellTransport` uses Tauri's `shell` plugin to spawn Node.js processes.

### Architecture
- **`src/lib/TauriShellTransport.ts`**: Adapts the MCP `Transport` interface to Tauri's `Command.spawn()`.
- **`src/contexts/MCPClientContext.tsx`**: React Context that manages the single `Client` instance.
- **`src/components/ServerConfig.tsx`**: UI to input the server path and connect.
- **`src/components/ToolForm.tsx`**: Uses `@rjsf/core` to generate forms dynamically from tool schemas.

## Configuration
To allow spawning `node`, we configured `src-tauri/capabilities/default.json`:

```json
{
  "permissions": [
    "shell:default",
    {
      "identifier": "shell:allow-spawn",
      "allow": [
        {
          "name": "node",
          "command": "node",
          "args": true,
          "sidecar": false
        }
      ]
    }
  ]
}
```

## Known Issues

### Shell Scope Error
**Error**: `Error: error deserializing scope: The shell scope 'command' value is required.`

**Context**: This occurs when attempting to click "Connect" in the UI. The specific line in `TauriShellTransport.ts` calls `Command.create("node", ...)`. Even though we have added `"command": "node"` to the capability configuration (which was the fix for a similar error in other Tauri contexts), the error persists.

**Steps Taken**:
1.  Verified `tauri-plugin-shell` is installed.
2.  Added `shell:allow-spawn` to `capabilities/default.json`.
3.  Updated the capability to explicitly include `"command": "node"` (initially it just had `"name": "node"`).
4.  Restarted the dev server to ensure config reload.

**Hypothesis**:
- Tauri 2.0 Beta/RC capabilities schema might be strict or cached.
- The `identifier` needs to be referenced in `tauri.conf.json` or `src-tauri/src/lib.rs` differently? (Currently it is included via `"permissions": ["shell:default"]` and the inline capability).
- Re-running `tauri dev` might be required after *every* capability change.

## Usage
1.  Run `npm run tauri dev`.
2.  Enter the path to your MCP server (e.g. `C:\path\to\server\index.js`).
3.  Click Connect.