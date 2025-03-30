import { z } from "zod";
import { getCodex } from "../../lib/codex.js";
import { networkIdSchema } from "./schema.js";
import { createTool, createToolResponse } from "./tool-helpers.js";

// --- Tool Input Schemas ---

const GetNetworkStatusInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID to get status for"),
});

const GetNetworkStatsInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID to get stats for"),
});

/**
 * Get Networks Tool
 * Retrieves a list of all blockchain networks supported by Codex
 */
export const getNetworks = createTool(
  "get_networks",
  "Get a list of all blockchain networks supported by Codex",
  z.object({}),
  async () => {
    const codex = getCodex();
    const networks = await codex.queries.getNetworks({});
    return createToolResponse(networks.getNetworks);
  }
);

/**
 * Get Network Status Tool
 * Retrieves the status of a specific blockchain network
 */
export const getNetworkStatus = createTool(
  "get_network_status",
  "Get the status of a specific blockchain network",
  GetNetworkStatusInputSchema,
  async (params) => {
    const { networkId } = params;
    const codex = getCodex();
    const networkStatus = await codex.queries.getNetworkStatus({
      networkIds: networkId,
    });
    return createToolResponse(networkStatus.getNetworkStatus);
  }
);

/**
 * Get Network Stats Tool
 * Retrieves metadata and statistics for a given network
 */
export const getNetworkStats = createTool(
  "get_network_stats",
  "Get metadata and statistics for a given network",
  GetNetworkStatsInputSchema,
  async (params) => {
    const { networkId } = params;
    const codex = getCodex();
    const networkStats = await codex.queries.getNetworkStats({
      networkId,
    });
    return createToolResponse(networkStats.getNetworkStats);
  }
);
