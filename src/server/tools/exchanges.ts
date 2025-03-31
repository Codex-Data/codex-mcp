import { z } from "zod";
import { getCodex } from "../../lib/codex.js";
import {
  networkIdSchema,
  numberFilterSchema,
  offsetPaginationSchema,
} from "./schema.js";
import { createTool, createToolResponse } from "./tool-helpers.js";
import {
  ExchangeRankingAttribute,
  RankingDirection,
} from "@codex-data/sdk/dist/sdk/generated/graphql.js";

// --- Tool Input Schemas ---

const FilterExchangesInputSchema = z.object({
  filters: z
    .object({
      address: z
        .array(z.string())
        .optional()
        .describe("The list of exchange contract addresses to filter by"),
      dailyActiveUsers: numberFilterSchema
        .optional()
        .describe("The total unique daily active users"),
      monthlyActiveUsers: numberFilterSchema
        .optional()
        .describe("The total unique monthly active users (30 days)"),
      network: z
        .array(networkIdSchema)
        .optional()
        .describe("The list of network IDs to filter by"),
      txnCount1: numberFilterSchema
        .optional()
        .describe(
          "The number of transactions on the exchange in the past hour"
        ),
      txnCount4: numberFilterSchema
        .optional()
        .describe(
          "The number of transactions on the exchange in the past 4 hours"
        ),
      txnCount12: numberFilterSchema
        .optional()
        .describe(
          "The number of transactions on the exchange in the past 12 hours"
        ),
      txnCount24: numberFilterSchema
        .optional()
        .describe(
          "The number of transactions on the exchange in the past 24 hours"
        ),
      volumeNBT1: numberFilterSchema
        .optional()
        .describe(
          "The trade volume in the network's base token in the past hour"
        ),
      volumeNBT4: numberFilterSchema
        .optional()
        .describe(
          "The trade volume in the network's base token in the past 4 hours"
        ),
      volumeNBT12: numberFilterSchema
        .optional()
        .describe(
          "The trade volume in the network's base token in the past 12 hours"
        ),
      volumeNBT24: numberFilterSchema
        .optional()
        .describe(
          "The trade volume in the network's base token in the past 24 hours"
        ),
      volumeUSD1: numberFilterSchema
        .optional()
        .describe("The trade volume in USD in the past hour"),
      volumeUSD4: numberFilterSchema
        .optional()
        .describe("The trade volume in USD in the past 4 hours"),
      volumeUSD12: numberFilterSchema
        .optional()
        .describe("The trade volume in USD in the past 12 hours"),
      volumeUSD24: numberFilterSchema
        .optional()
        .describe("The trade volume in USD in the past 24 hours"),
    })
    .optional(),
  ...offsetPaginationSchema.shape,
  phrase: z
    .string()
    .optional()
    .describe(
      "A phrase to search for. Can match an exchange address or ID (address:networkId), or partially match an exchange name"
    ),
  rankings: z
    .array(
      z.object({
        attribute: z.nativeEnum(ExchangeRankingAttribute),
        direction: z.nativeEnum(RankingDirection),
      })
    )
    .optional()
    .describe("A list of ranking attributes to apply"),
});

/**
 * Filter Exchanges Tool
 * Returns a list of exchanges based on a variety of filters
 */
export const filterExchanges = createTool(
  "filter_exchanges",
  "Get a list of exchanges based on various filters like volume, transactions, active users, etc.",
  FilterExchangesInputSchema,
  async (params) => {
    const { filters, limit, offset, phrase, rankings } = params;
    const codex = getCodex();

    const filterParams: Record<string, any> = {};

    if (filters) filterParams.filters = filters;
    if (limit) filterParams.limit = limit;
    if (offset) filterParams.offset = offset;
    if (phrase) filterParams.phrase = phrase;
    if (rankings) filterParams.rankings = rankings;

    const filteredExchanges = await codex.queries.filterExchanges(filterParams);

    return createToolResponse(filteredExchanges.filterExchanges);
  }
);
