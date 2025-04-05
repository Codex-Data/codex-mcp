import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolHandler, Tool } from "../../types.js";
import { ZodRawShape } from "zod";

import { getNetworks, getNetworkStatus, getNetworkStats } from "./networks.js";
import {
  getTokenInfo,
  getTokens,
  getTokenPrices,
  filterTokens,
  getLatestTokens,
  getTokenBalances,
  getTokenHolders,
  getTop10HoldersPercent,
  getTokenSparklines,
  getTokenEvents,
  getTokenEventsForMaker,
  getTokenChartData,
  getTokenChartUrls,
} from "./tokens.js";
import {
  getDetailedPairStats,
  getDetailedPairsStats,
  filterPairs,
  getPairMetadata,
  getTokenPairs,
  getTokenPairsWithMetadata,
  getLiquidityMetadata,
  getLiquidityLocks,
} from "./pairs.js";
import { filterExchanges } from "./exchanges.js";

function registerTool<TParams = undefined>(
  server: McpServer,
  name: string,
  description: string,
  schema: ZodRawShape | undefined,
  handler: ToolHandler<TParams>
): void {
  if (schema) {
    server.tool(name, description, schema, async (params) => {
      const response = await handler(params as TParams);
      return {
        content: response.content.map((content) => ({
          type: "text" as const,
          text: content.text,
        })),
        isError: response.isError,
      };
    });
  } else {
    server.tool(name, description, async () => {
      const response = await handler(undefined as TParams);
      return {
        content: response.content.map((content) => ({
          type: "text" as const,
          text: content.text,
        })),
        isError: response.isError,
      };
    });
  }
}

const codexTools: Tool<any>[] = [
  // Network tools
  getNetworks,
  getNetworkStatus,
  getNetworkStats,

  // Token tools
  getTokenInfo,
  getTokens,
  getTokenPrices,
  filterTokens,
  getTokenHolders,
  getTokenBalances,
  getTop10HoldersPercent,
  getTokenChartData,
  getTokenChartUrls,
  getLatestTokens,
  getTokenSparklines,
  getTokenEvents,
  getTokenEventsForMaker,

  // Pair tools
  getDetailedPairStats,
  getDetailedPairsStats,
  filterPairs,
  getPairMetadata,
  getTokenPairs,
  getTokenPairsWithMetadata,
  getLiquidityMetadata,
  getLiquidityLocks,

  // Exchange tools
  filterExchanges,
];

// Register all tools with the server
export function registerCodexTools(server: McpServer): void {
  console.error(`Registering ${codexTools.length} Codex tools`);

  codexTools.forEach((tool) => {
    registerTool(
      server,
      tool.definition.name,
      tool.definition.description,
      tool.definition.schema.shape,
      tool.handler
    );
    console.error(`Registered tool: ${tool.definition.name}`);
  });
}
