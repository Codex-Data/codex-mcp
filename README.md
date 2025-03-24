# Codex MCP Server

An [MCP](https://modelcontextprotocol.org/) server that provides enriched blockchain data from [Codex](https://codex.io). This server can be used with any MCP-compatible client like [Claude Desktop](https://www.anthropic.com/news/claude-desktop).

## Installation

```bash
# Clone the repository
git clone https://github.com/codex-data/codex-mcp.git
cd codex-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Usage

Start the server:

```bash
pnpm start
```

For development with auto-reload:

```bash
pnpm dev
```

## Available Tools

- `get_networks`: Get the list of available networks.

## Integration with Claude Desktop

1. Open Claude Desktop settings
2. Navigate to MCP settings
3. Add a new server configuration:
   ```json
   {
     "mcpServers": {
       "codex-data": {
         "command": "node",
         "args": ["/path/to/codex-mcp/build/index.js"],
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```
4. Replace `/path/to/codex-mcp` with the actual path to your installation

## License

ISC
