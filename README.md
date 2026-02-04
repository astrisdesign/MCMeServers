<p align="center">
  <img src="mcmeservers/src-tauri/icons/MCMeServer_Icon.png" alt="MCMeServers Icon" width="200"/>
</p>

# MCMeServers

(Pronounced "Em See Me Servers")

A premium human interface for **Model Context Protocol (MCP)** servers, built with **Tauri 2.0**, **React**, and **TypeScript**.

MCMeServers provides a seamless, visually stunning way to interact with your MCP servers. It handles tool discovery, dynamic form generation, and provides a persistent library for your favorite server configurations. Use the bot tools like a bot!

## ✨ Features

- 🎨 **Premium UI**: JExTile-inspired "High-Visibility" design with a sleek dark mode and elegant animations.
- 🛠️ **Dynamic Tool Discovery**: Automatically reads tool schemas from connected MCP servers and generates interactive forms.
- 📂 **Server Library**: Save and manage your MCP server executable paths in a persistent browser-based library.
- 🚀 **High Performance**: Built on Tauri 2.0 for a lightweight, secure, and fast desktop experience.
- 🔄 **Real-time Interaction**: Execute tools and view results instantly with a dedicated terminal-style output pane.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite.
- **Protocol**: Uses `@modelcontextprotocol/sdk` for standard compliance.
- **Transport**: Custom `TauriShellTransport` adapts the MCP `Transport` interface to Tauri's `Command.spawn()` API, allowing the frontend to securely run local server executables.
- **State Management**: React Context (`MCPClientContext`) handles the lifecycle of the connection and tools.
- **Persistence**: `localStorage` is used for the Server Library, synchronized via a custom `useServerLibrary` hook.
- **Form Generation**: `@rjsf/core` dynamically produces validated inputs from JSON Schema definitions.

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (LTS recommended)
- [PNPM](https://pnpm.io/) or NPM

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    cd mcmeservers
    npm install
    ```
3.  Launch the application in development mode:
    ```bash
    npm run tauri dev
    ```

## 🛠️ Configuration

To allow the application to spawn local processes (like `node` or your custom MCP executables), the Tauri shell plugin is configured in `src-tauri/capabilities/default.json`.

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

## 📖 Usage

1.  **Connect**: Enter the absolute path to your MCP server executable (e.g., `C:\path\to\mcp-server\index.js` or an `.exe`).
2.  **Save**: Once connected, click the **Save** icon to add the server to your library for quick access later.
3.  **Browse**: Select a tool from the **Available Tools** sidebar.
4.  **Execute**: Fill out the auto-generated parameters and click **Run Tool**.
5.  **Analyze**: View the JSON output in the scrollable result pane.

---

Built by the MCMe Team. Inspired by modern developer tools and the Model Context Protocol.