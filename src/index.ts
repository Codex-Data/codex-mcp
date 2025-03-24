import { Codex } from "@codex-data/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

if (!process.env.CODEX_API_KEY) {
  throw new Error("CODEX_API_KEY is not defined in environment variables");
}

const codex = new Codex(process.env.CODEX_API_KEY);

const server = new McpServer({
  name: "Codex",
  version: "0.1.0",
});

server.tool("get_networks", async () => {
  const networks = await codex.queries.getNetworks({});
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          networks: networks.getNetworks.map((network) => ({
            id: network.id,
            name: network.name,
          })),
        }),
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);

console.log("MCP server is running");
