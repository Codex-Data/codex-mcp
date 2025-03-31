import {
  QuoteToken,
  DetailedPairStatsDuration,
  HoldersSortAttribute,
  RankingDirection,
  TokenPairStatisticsType,
} from "@codex-data/sdk/dist/sdk/generated/graphql.js";
import { z } from "zod";

export const networkIdSchema = z.number().positive().describe("The network ID");
export const networkIdOptionalSchema = networkIdSchema
  .optional()
  .describe("Optional network ID");
export const networkIdsSchema = z
  .array(networkIdSchema)
  .describe("Array of network IDs");

export const tokenAddressSchema = z
  .string()
  .describe("The token contract address");
export const tokenAddressesSchema = z
  .array(tokenAddressSchema)
  .describe("Array of token contract addresses");
export const tokenIdsSchema = z
  .array(z.string())
  .optional()
  .describe("A list of token IDs (address:networkId)");

export const pairAddressSchema = z
  .string()
  .describe("The pair contract address");
export const pairAddressesSchema = z
  .array(pairAddressSchema)
  .describe("Array of pair contract addresses");

export const walletAddressSchema = z.string().describe("The wallet address");

export const limitSchema = z
  .number()
  .optional()
  .describe("Maximum number of items to return");
export const offsetSchema = z
  .number()
  .optional()
  .describe("Number of items to skip");
export const cursorSchema = z
  .string()
  .optional()
  .describe("Cursor for pagination");
export const timestampSchema = z.number().describe("Unix timestamp");
export const booleanOptionalSchema = z.boolean().optional();
export const resolutionOptionalSchema = z
  .string()
  .optional()
  .describe("Time resolution for the data");

export const quoteTokenSchema = z
  .nativeEnum(QuoteToken)
  .optional()
  .describe("The token of interest (token0 or token1)");

export const detailedPairStatsDurationSchema = z
  .nativeEnum(DetailedPairStatsDuration)
  .describe("The duration for stats");

export const bucketCountSchema = z
  .number()
  .optional()
  .describe(
    "The number of aggregated values to receive. Note: Each duration has predetermined bucket sizes. The first n-1 buckets are historical. The last bucket is a snapshot of current data."
  );

export const numberFilterSchema = z
  .object({
    gt: z.number().optional().describe("Greater than"),
    gte: z.number().optional().describe("Greater than or equal to"),
    lt: z.number().optional().describe("Less than"),
    lte: z.number().optional().describe("Less than or equal to"),
  })
  .describe("Filter for numeric values with comparison operators");

export const offsetPaginationSchema = z.object({
  limit: limitSchema,
  offset: offsetSchema,
});

export const cursorPaginationSchema = z.object({
  limit: limitSchema,
  cursor: cursorSchema,
});

export const networkAddressSchema = z.object({
  networkId: networkIdSchema,
  address: z.string(),
});

export const holdersSortAttributeSchema = z
  .nativeEnum(HoldersSortAttribute)
  .optional();

export const rankingDirectionSchema = z.nativeEnum(RankingDirection).optional();

export const holdersSortSchema = z
  .object({
    attribute: holdersSortAttributeSchema,
    direction: rankingDirectionSchema,
  })
  .optional()
  .describe("Sort options for the holders list");

export const tokenIdSchema = z
  .object({
    networkId: networkIdSchema.describe("The network ID the token is on"),
    address: tokenAddressSchema,
  })
  .describe("A token identifier consisting of network ID and address");

export const pairIdSchema = z
  .object({
    networkId: networkIdSchema.describe("The network ID the pair is on"),
    address: pairAddressSchema,
  })
  .describe("A pair identifier consisting of network ID and address");

export const statsTypeSchema = z
  .nativeEnum(TokenPairStatisticsType)
  .optional()
  .describe("The type of statistics returned. Can be FILTERED or UNFILTERED");

export const tokenFiltersSchema = z
  .object({
    buyCount1: numberFilterSchema
      .optional()
      .describe("Number of buy transactions in the last hour"),
    buyCount4: numberFilterSchema
      .optional()
      .describe("Number of buy transactions in the last 4 hours"),
    buyCount5m: numberFilterSchema
      .optional()
      .describe("Number of buy transactions in the last 5 minutes"),
    buyCount12: numberFilterSchema
      .optional()
      .describe("Number of buy transactions in the last 12 hours"),
    buyCount24: numberFilterSchema
      .optional()
      .describe("Number of buy transactions in the last 24 hours"),
    change1: numberFilterSchema
      .optional()
      .describe("Price change in the last hour"),
    change4: numberFilterSchema
      .optional()
      .describe("Price change in the last 4 hours"),
    change5m: numberFilterSchema
      .optional()
      .describe("Price change in the last 5 minutes"),
    change12: numberFilterSchema
      .optional()
      .describe("Price change in the last 12 hours"),
    change24: numberFilterSchema
      .optional()
      .describe("Price change in the last 24 hours"),
    createdAt: timestampSchema.optional().describe("Token creation timestamp"),
    creatorAddress: walletAddressSchema
      .optional()
      .describe("Token creator's wallet address"),
    exchangeAddress: z
      .string()
      .optional()
      .describe("Exchange contract address"),
    exchangeId: z.string().optional().describe("Exchange identifier"),
    fdv: numberFilterSchema.optional().describe("Fully diluted valuation"),
    high1: numberFilterSchema
      .optional()
      .describe("Highest price in the last hour"),
    high4: numberFilterSchema
      .optional()
      .describe("Highest price in the last 4 hours"),
    high5m: numberFilterSchema
      .optional()
      .describe("Highest price in the last 5 minutes"),
    high12: numberFilterSchema
      .optional()
      .describe("Highest price in the last 12 hours"),
    high24: numberFilterSchema
      .optional()
      .describe("Highest price in the last 24 hours"),
    holders: numberFilterSchema.optional().describe("Number of token holders"),
    includeScams: booleanOptionalSchema.describe(
      "Whether to include potential scam tokens"
    ),
    isVerified: booleanOptionalSchema.describe("Whether the token is verified"),
    lastTransaction: timestampSchema
      .optional()
      .describe("Timestamp of the last transaction"),
    liquidity: numberFilterSchema.optional().describe("Total liquidity"),
    low1: numberFilterSchema
      .optional()
      .describe("Lowest price in the last hour"),
    low4: numberFilterSchema
      .optional()
      .describe("Lowest price in the last 4 hours"),
    low5m: numberFilterSchema
      .optional()
      .describe("Lowest price in the last 5 minutes"),
    low12: numberFilterSchema
      .optional()
      .describe("Lowest price in the last 12 hours"),
    low24: numberFilterSchema
      .optional()
      .describe("Lowest price in the last 24 hours"),
    marketCap: numberFilterSchema.optional().describe("Market capitalization"),
    network: networkIdSchema.optional().describe("Network ID"),
    notableHolderCount: numberFilterSchema
      .optional()
      .describe("Number of notable holders"),
    potentialScam: booleanOptionalSchema.describe(
      "Whether the token is potentially a scam"
    ),
    priceUSD: numberFilterSchema.optional().describe("Current price in USD"),
    sellCount1: numberFilterSchema
      .optional()
      .describe("Number of sell transactions in the last hour"),
    sellCount4: numberFilterSchema
      .optional()
      .describe("Number of sell transactions in the last 4 hours"),
    sellCount5m: numberFilterSchema
      .optional()
      .describe("Number of sell transactions in the last 5 minutes"),
    sellCount12: numberFilterSchema
      .optional()
      .describe("Number of sell transactions in the last 12 hours"),
    sellCount24: numberFilterSchema
      .optional()
      .describe("Number of sell transactions in the last 24 hours"),
    trendingIgnored: booleanOptionalSchema.describe(
      "Whether the token is ignored in trending calculations"
    ),
    txnCount1: numberFilterSchema
      .optional()
      .describe("Total transactions in the last hour"),
    txnCount4: numberFilterSchema
      .optional()
      .describe("Total transactions in the last 4 hours"),
    txnCount5m: numberFilterSchema
      .optional()
      .describe("Total transactions in the last 5 minutes"),
    txnCount12: numberFilterSchema
      .optional()
      .describe("Total transactions in the last 12 hours"),
    txnCount24: numberFilterSchema
      .optional()
      .describe("Total transactions in the last 24 hours"),
    uniqueBuys1: numberFilterSchema
      .optional()
      .describe("Unique buyers in the last hour"),
    uniqueBuys4: numberFilterSchema
      .optional()
      .describe("Unique buyers in the last 4 hours"),
    uniqueBuys5m: numberFilterSchema
      .optional()
      .describe("Unique buyers in the last 5 minutes"),
    uniqueBuys12: numberFilterSchema
      .optional()
      .describe("Unique buyers in the last 12 hours"),
    uniqueBuys24: numberFilterSchema
      .optional()
      .describe("Unique buyers in the last 24 hours"),
    uniqueSells1: numberFilterSchema
      .optional()
      .describe("Unique sellers in the last hour"),
    uniqueSells4: numberFilterSchema
      .optional()
      .describe("Unique sellers in the last 4 hours"),
    uniqueSells5m: numberFilterSchema
      .optional()
      .describe("Unique sellers in the last 5 minutes"),
    uniqueSells12: numberFilterSchema
      .optional()
      .describe("Unique sellers in the last 12 hours"),
    uniqueSells24: numberFilterSchema
      .optional()
      .describe("Unique sellers in the last 24 hours"),
    uniqueTransactions1: numberFilterSchema
      .optional()
      .describe("Unique transactions in the last hour"),
    uniqueTransactions4: numberFilterSchema
      .optional()
      .describe("Unique transactions in the last 4 hours"),
    uniqueTransactions5m: numberFilterSchema
      .optional()
      .describe("Unique transactions in the last 5 minutes"),
    uniqueTransactions12: numberFilterSchema
      .optional()
      .describe("Unique transactions in the last 12 hours"),
    uniqueTransactions24: numberFilterSchema
      .optional()
      .describe("Unique transactions in the last 24 hours"),
    volume1: numberFilterSchema
      .optional()
      .describe("Trading volume in the last hour"),
    volume4: numberFilterSchema
      .optional()
      .describe("Trading volume in the last 4 hours"),
    volume5m: numberFilterSchema
      .optional()
      .describe("Trading volume in the last 5 minutes"),
    volume12: numberFilterSchema
      .optional()
      .describe("Trading volume in the last 12 hours"),
    volume24: numberFilterSchema
      .optional()
      .describe("Trading volume in the last 24 hours"),
    volumeChange1: numberFilterSchema
      .optional()
      .describe("Volume change in the last hour"),
    volumeChange4: numberFilterSchema
      .optional()
      .describe("Volume change in the last 4 hours"),
    volumeChange5m: numberFilterSchema
      .optional()
      .describe("Volume change in the last 5 minutes"),
    volumeChange12: numberFilterSchema
      .optional()
      .describe("Volume change in the last 12 hours"),
    volumeChange24: numberFilterSchema
      .optional()
      .describe("Volume change in the last 24 hours"),
  })
  .describe("Filters for token queries");
