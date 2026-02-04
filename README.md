# MCMeServers
Human interface for MCP servers

# Style Preferences
Make it look similar to VS Code Dark High Contrast.

# HOW TO SUGGESTIONS

The best way to set this up—adhering to your strict requirement to avoid deep Rust work while matching "Claude Code" architecture—is to run the **MCP Client logic entirely in the Tauri Frontend (TypeScript)** and use the **Tauri Shell Plugin** as the transport layer to spawn and communicate with the MCP servers (like your `clinerules-manager`).

This approach requires **zero custom Rust code**. You only need to enable the standard `shell` plugin in your configuration.

### Architecture

This setup mimics Claude Code's local architecture:
1.  **Frontend (React/Vue/etc.)**: Runs the `@modelcontextprotocol/sdk` Client.
2.  **Transport Layer**: A custom TypeScript adapter (provided below) bridges the SDK to Tauri's Shell plugin.
3.  **Backend (Process)**: Tauri spawns the Node.js MCP server (e.g., `clinerules-manager`) as a subprocess and pipes `stdin`/`stdout`.

### Implementation Guide

#### 1. Dependencies
Install the official SDK in your frontend and the shell plugin in your Tauri project.
```bash
# Frontend
npm install @modelcontextprotocol/sdk

# Tauri Project Root
npm run tauri add shell
```

#### 2. The Tauri Shell Transport
Since the official SDK's `StdioClientTransport` depends on Node.js streams (which don't exist in the browser/WebView), you need this adapter. It implements the SDK's `Transport` interface using Tauri's `Command` API.

Create `src/lib/TauriShellTransport.ts`:

```typescript
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { Command, Child } from "@tauri-apps/plugin-shell";

export class TauriShellTransport implements Transport {
  private child: Child | null = null;
  private readBuffer: string = "";

  constructor(
    private command: string,
    private args: string[],
    private env: Record<string, string> = {}
  ) {}

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage) => void;

  async start(): Promise<void> {
    const cmd = Command.create(this.command, this.args, { env: this.env });

    // Handle stdout (server responses)
    cmd.stdout.on("data", (chunk: string) => {
      this.readBuffer += chunk;
      this.processBuffer();
    });

    // Handle stderr (logs)
    cmd.stderr.on("data", (line) => console.error(`[MCP STDERR] ${line}`));

    cmd.on("close", () => {
      this.onclose?.();
    });

    cmd.on("error", (error) => {
      this.onerror?.(new Error(String(error)));
    });

    this.child = await cmd.spawn();
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.child) throw new Error("Transport not started");
    // Write newline-delimited JSON to the server's stdin
    await this.child.write(JSON.stringify(message) + "\n");
  }

  async close(): Promise<void> {
    await this.child?.kill();
  }

  // Processes the buffer to extract complete JSON-RPC messages
  private processBuffer() {
    let newlineIndex: number;
    while ((newlineIndex = this.readBuffer.indexOf("\n")) !== -1) {
      const line = this.readBuffer.slice(0, newlineIndex).trim();
      this.readBuffer = this.readBuffer.slice(newlineIndex + 1);

      if (line) {
        try {
          const message = JSON.parse(line);
          this.onmessage?.(message);
        } catch (error) {
          console.error("Failed to parse MCP message:", line, error);
        }
      }
    }
  }
}
```

#### 3. Connecting the Client
Now you can launch your MCP tools directly from your UI components.

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { TauriShellTransport } from "./lib/TauriShellTransport";

async function connectToClinerules() {
  // 1. Configure the transport to launch your specific tool
  // Note: Ensure 'node' is in your path or bundle it
  const transport = new TauriShellTransport("node", [
    "/path/to/your/clinerules-manager/index.js" 
  ]);

  // 2. Initialize the MCP Client
  const client = new Client(
    { name: "TauriApp", version: "1.0.0" },
    { capabilities: {} }
  );

  // 3. Connect
  await client.connect(transport);

  // 4. List and Use Tools
  const tools = await client.listTools();
  console.log("Available tools:", tools);
  
  // Example: Apply a template based on your schema
  // await client.callTool({ name: "apply_template", arguments: { ... } });
}
```

#### 4. Critical Configuration
To make this work, you must strictly define permissions in `src-tauri/capabilities/default.json` (or `tauri.conf.json` in v2 beta). Tauri blocks shell commands by default. [docs.kkrpc.kunkun](https://docs.kkrpc.kunkun.sh/examples/tauri/)

```json
{
  "permissions": [
    "shell:default",
    {
      "identifier": "shell:allow-spawn",
      "allow": [
        {
          "name": "node",
          "args": true,
          "sidecar": false
        }
      ]
    }
  ]
}
```

### Why this is the "Best" Way
*   **Protocol Compliance**: Uses the official `@modelcontextprotocol/sdk` for parsing and state management, ensuring you match Claude Code's behavior exactly. [modelcontextprotocol](https://modelcontextprotocol.info/docs/tutorials/building-a-client-node/)
*   **Minimal Rust**: You write zero Rust. You utilize the pre-built `shell` plugin which is robust and maintained by the Tauri team. [kunkunsh.github](https://kunkunsh.github.io/kkrpc/)
*   **UI Flexibility**: Since the `Client` object lives in your JS/TS frontend, you can easily bind it to `react-jsonschema-form` or any other library to generate forms dynamically from the `client.listTools()` output.

### Handling Your Attached Tools
Your `clinerules-manager` is a standard Node.js executable.
*   Ensure the user has Node.js installed, OR
*   Package a Node.js binary as a **Tauri Sidecar**. If you do this, change the `command` string in `TauriShellTransport` to `"clinerules-manager"` (or whatever you name the sidecar executable) and remove `"node"` from the start. [dev](https://dev.to/goenning/why-i-chose-tauri-instead-of-electron-34h9)