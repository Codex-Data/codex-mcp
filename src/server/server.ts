import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCodexTools } from "./tools/index.js";
import { initializeCodex } from "../lib/codex.js";

// Create and start the MCP server
export async function startServer() {
  try {
    // Create a new MCP server instance
    const server = new McpServer({
      name: "Codex-MCP",
      version: "0.1.2",
    });

    // Initialize Codex client
    initializeCodex(process.env.CODEX_API_KEY || "");

    // Register all tools
    registerCodexTools(server);

    // Log server information
    console.error(`Codex MCP Server initialized`);
    console.error("Server is ready to handle requests");

    return server;
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}
