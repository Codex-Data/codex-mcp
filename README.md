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

To use the MCP Codex Server, you need to have a Codex API key. You can get your key from the [Codex Dashboard](https://dashboard.codex.io).

### Using npx (No Installation Required)

You can run the MCP Codex Server directly without installation using npx:

```bash
# Run the server in stdio mode (for CLI tools)
npx @codex-data/codex-mcp
```

### Running the Server Locally

Start the server using stdio (for embedding in CLI tools):

```bash
pnpm start
```

For development with auto-reload:

```bash
pnpm dev
```

### Integration with Claude Desktop

1. Open Claude Desktop settings
2. Go to the Developer tab and click "Edit Config"
3. Add a new server configuration:

No installation:

```json
{
  "mcpServers": {
    "codex-data": {
      "command": "npx",
      "args": ["-y", "@codex-data/codex-mcp"],
      "env": {
        "CODEX_API_KEY": "<your-codex-api-key>"
      }
    }
  }
}
```

Local installation:

```json
{
  "mcpServers": {
    "codex-data": {
      "command": "node",
      "args": ["/path/to/codex-mcp/build/index.js"],
      "env": {
        "CODEX_API_KEY": "<your-codex-api-key>"
      }
    }
  }
}
```

4. Replace `/path/to/codex-mcp` with the actual path to your installation
5. Replace `<your-codex-api-key>` with your actual Codex API key

### Connecting using Claude CLI

If you're using Claude CLI:

```bash
# Add the MCP server
claude mcp add codex-data -e CODEX_API_KEY=<your-codex-api-key> npx @codex-data/codex-mcp

# Start Claude with the MCP server enabled
claude
```

## License

ISC
