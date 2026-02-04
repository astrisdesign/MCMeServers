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
    cmd.stdout.on("data", (chunk: string | Uint8Array) => {
      // Tauri v2 might return string or Uint8Array depending on configuration, 
      // but usually for text commands it is string.
      // If it's bytes, we might need decoding, but assuming string for now as per docs for default shell.
      const data = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
      this.readBuffer += data;
      this.processBuffer();
    });

    // Handle stderr (logs)
    cmd.stderr.on("data", (chunk: string | Uint8Array) => {
      const line = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
      console.error(`[MCP STDERR] ${line}`);
    });

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
