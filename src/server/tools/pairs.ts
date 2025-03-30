import { z } from "zod";
import { getCodex } from "../../lib/codex.js";
import {
  networkIdSchema,
  pairAddressesSchema,
  detailedPairStatsDurationSchema,
  bucketCountSchema,
  tokenAddressesSchema,
  pairIdSchema,
  statsTypeSchema,
  numberFilterSchema,
  booleanOptionalSchema,
  offsetPaginationSchema,
} from "./schema.js";
import { createTool, createToolResponse } from "./tool-helpers.js";
import {
  PairRankingAttribute,
  RankingDirection,
} from "@codex-data/sdk/dist/sdk/generated/graphql.js";

// --- Tool Input Schemas ---

const GetDetailedPairStatsInputSchema = pairIdSchema.extend({
  duration: detailedPairStatsDurationSchema,
  bucketCount: bucketCountSchema,
  timestamp: z.number().optional(),
  tokenOfInterest: z.enum(["token0", "token1"]).optional(),
  statsType: statsTypeSchema,
});

const GetDetailedPairsStatsInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID the pairs are on"),
  pairAddresses: pairAddressesSchema,
  duration: detailedPairStatsDurationSchema,
  bucketCount: bucketCountSchema,
});

const FilterPairsInputSchema = z.object({
  filters: z
    .object({
      buyCount1: numberFilterSchema.optional(),
      buyCount4: numberFilterSchema.optional(),
      buyCount12: numberFilterSchema.optional(),
      buyCount24: numberFilterSchema.optional(),
      createdAt: numberFilterSchema.optional(),
      exchangeAddress: z.array(z.string()).optional(),
      highPrice1: numberFilterSchema.optional(),
      highPrice4: numberFilterSchema.optional(),
      highPrice12: numberFilterSchema.optional(),
      highPrice24: numberFilterSchema.optional(),
      lastTransaction: numberFilterSchema.optional(),
      liquidity: numberFilterSchema.optional(),
      lockedLiquidityPercentage: numberFilterSchema.optional(),
      lowPrice1: numberFilterSchema.optional(),
      lowPrice4: numberFilterSchema.optional(),
      lowPrice12: numberFilterSchema.optional(),
      lowPrice24: numberFilterSchema.optional(),
      network: z.array(networkIdSchema).optional(),
      potentialScam: booleanOptionalSchema,
      price: numberFilterSchema.optional(),
      priceChange1: numberFilterSchema.optional(),
      priceChange4: numberFilterSchema.optional(),
      priceChange12: numberFilterSchema.optional(),
      priceChange24: numberFilterSchema.optional(),
      sellCount1: numberFilterSchema.optional(),
      sellCount4: numberFilterSchema.optional(),
      sellCount12: numberFilterSchema.optional(),
      sellCount24: numberFilterSchema.optional(),
      tokenAddress: tokenAddressesSchema.optional(),
      trendingIgnored: booleanOptionalSchema,
      txnCount1: numberFilterSchema.optional(),
      txnCount4: numberFilterSchema.optional(),
      txnCount12: numberFilterSchema.optional(),
      txnCount24: numberFilterSchema.optional(),
      uniqueBuys1: numberFilterSchema.optional(),
      uniqueBuys4: numberFilterSchema.optional(),
      uniqueBuys12: numberFilterSchema.optional(),
      uniqueBuys24: numberFilterSchema.optional(),
      uniqueSells1: numberFilterSchema.optional(),
      uniqueSells4: numberFilterSchema.optional(),
      uniqueSells12: numberFilterSchema.optional(),
      uniqueSells24: numberFilterSchema.optional(),
      uniqueTransactions1: numberFilterSchema.optional(),
      uniqueTransactions4: numberFilterSchema.optional(),
      uniqueTransactions12: numberFilterSchema.optional(),
      uniqueTransactions24: numberFilterSchema.optional(),
      volumeChange1: numberFilterSchema.optional(),
      volumeChange4: numberFilterSchema.optional(),
      volumeChange12: numberFilterSchema.optional(),
      volumeChange24: numberFilterSchema.optional(),
      volumeUSD1: numberFilterSchema.optional(),
      volumeUSD4: numberFilterSchema.optional(),
      volumeUSD12: numberFilterSchema.optional(),
      volumeUSD24: numberFilterSchema.optional(),
    })
    .optional(),
  ...offsetPaginationSchema.shape,
  pairs: z.union([z.array(z.string()), z.string()]).optional(),
  phrase: z.string().optional(),
  rankings: z
    .union([
      z.array(
        z.object({
          attribute: z.nativeEnum(PairRankingAttribute),
          direction: z.nativeEnum(RankingDirection),
        })
      ),
      z.object({
        attribute: z.nativeEnum(PairRankingAttribute),
        direction: z.nativeEnum(RankingDirection),
      }),
    ])
    .optional(),
  statsType: statsTypeSchema,
});

/**
 * Get Detailed Pair Stats Tool
 * Retrieves bucketed stats for a given token within a pair
 */
export const getDetailedPairStats = createTool(
  "get_detailed_pair_stats",
  "Get bucketed stats for a given token within a pair",
  GetDetailedPairStatsInputSchema,
  async (params) => {
    const { networkId, address, duration, bucketCount } = params;
    const codex = getCodex();

    const stats = await codex.queries.getDetailedPairStats({
      networkId,
      pairAddress: address,
      durations: [duration],
      bucketCount,
    });

    return createToolResponse(stats);
  }
);

/**
 * Get Detailed Pairs Stats Tool
 * Returns stats for multiple pairs of a given token (limit of 10)
 */
export const getDetailedPairsStats = createTool(
  "get_detailed_pairs_stats",
  "Get bucketed stats for a given token within a list of pairs",
  GetDetailedPairsStatsInputSchema,
  async (params) => {
    const { networkId, pairAddresses, duration, bucketCount } = params;
    const codex = getCodex();

    const stats = await codex.queries.getDetailedPairsStats({
      input: pairAddresses.map((pairAddress) => ({
        networkId,
        pairAddress,
        durations: [duration],
        bucketCount,
      })),
    });

    return createToolResponse(stats);
  }
);

/**
 * Filter Pairs Tool
 * Returns a list of pairs based on a variety of filters
 */
export const filterPairs = createTool(
  "filter_pairs",
  "Get a list of pairs based on various filters like volume, price, liquidity, etc.",
  FilterPairsInputSchema,
  async (params) => {
    const { filters, limit, offset, pairs, phrase, rankings, statsType } =
      params;
    const codex = getCodex();

    const filterParams: Record<string, any> = {};

    if (filters) filterParams.filters = filters;
    if (limit) filterParams.limit = limit;
    if (offset) filterParams.offset = offset;
    if (pairs) filterParams.pairs = pairs;
    if (phrase) filterParams.phrase = phrase;
    if (rankings) filterParams.rankings = rankings;
    if (statsType) filterParams.statsType = statsType;

    const filteredPairs = await codex.queries.filterPairs(filterParams);

    return createToolResponse(filteredPairs);
  }
);
