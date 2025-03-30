import { z } from "zod";
import { getCodex } from "../../lib/codex.js";
import {
  networkIdSchema,
  tokenAddressSchema,
  tokenAddressesSchema,
  limitSchema,
  tokenIdsSchema,
  booleanOptionalSchema,
  cursorSchema,
  holdersSortSchema,
  pairAddressSchema,
  quoteTokenSchema,
  timestampSchema,
  walletAddressSchema,
  tokenIdSchema,
  numberFilterSchema,
  statsTypeSchema,
  tokenFiltersSchema,
  offsetPaginationSchema,
} from "./schema.js";
import { createTool, createToolResponse } from "./tool-helpers.js";
import {
  QuoteToken,
  RankingDirection,
  EventDisplayType,
  EventType,
  TokenRankingAttribute,
  SymbolType,
} from "@codex-data/sdk/dist/sdk/generated/graphql.js";

// --- Tool Input Schemas ---

const GetTokenInputSchema = tokenIdSchema;
const GetTokensInputSchema = z.object({
  ids: tokenIdSchema.array(),
});

const GetTokenPricesInputSchema = z.object({
  inputs: tokenIdSchema
    .extend({
      poolAddress: z
        .string()
        .optional()
        .describe(
          "The address of the pool, when omitted the top pool is used."
        ),
      timestamp: timestampSchema.optional(),
    })
    .array(),
});

const FilterTokensInputSchema = z.object({
  excludeTokens: tokenIdsSchema.describe(
    "A list of token IDs to exclude from results (address:networkId)"
  ),
  filters: tokenFiltersSchema.optional().describe("A set of filters to apply"),
  ...offsetPaginationSchema.shape,
  phrase: z
    .string()
    .optional()
    .describe(
      "A phrase to search for. Can match a token contract address or partially match a token's name or symbol"
    ),
  rankings: z
    .array(
      z.object({
        attribute: z.nativeEnum(TokenRankingAttribute),
        direction: z.nativeEnum(RankingDirection),
      })
    )
    .optional()
    .describe("A list of ranking attributes to apply"),
  statsType: statsTypeSchema,
  tokens: tokenIdsSchema.describe(
    "A list of token IDs (address:networkId) or addresses. Can be left blank to discover new tokens"
  ),
});

const GetLatestTokensInputSchema = z.object({
  networkFilter: networkIdSchema.array(),
  ...offsetPaginationSchema.shape,
});

const GetTokenSparklinesInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID the tokens are on"),
  addresses: tokenAddressesSchema,
});

const GetTokenChartUrlsInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID the pair is on"),
  pairAddress: pairAddressSchema,
  quoteToken: quoteTokenSchema,
});

const GetTokenChartDataWithOptionsInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID the pair or token is on"),
  address: z
    .union([pairAddressSchema, tokenAddressSchema])
    .describe(
      "The pair address or token address to get chart data for. If a token address is provided, the token's top pair will be used."
    ),
  resolution: z
    .string()
    .describe(
      "The time frame for each candle. Available options are 1, 5, 15, 30, 60, 240, 720, 1D, 7D"
    ),
  from: timestampSchema,
  to: timestampSchema,
  countback: z.number().optional(),
  currencyCode: z.string().optional(),
  quoteToken: quoteTokenSchema,
  removeEmptyBars: booleanOptionalSchema,
  removeLeadingNullValues: booleanOptionalSchema,
  statsType: statsTypeSchema,
  symbolType: z.nativeEnum(SymbolType).optional(),
});

const GetTokenHoldersInputSchema = tokenIdSchema.extend({
  cursor: cursorSchema,
  sort: holdersSortSchema,
});

const GetTokenBalancesInputSchema = z.object({
  networkId: networkIdSchema.describe("The network ID the wallet is on"),
  walletAddress: walletAddressSchema.describe(
    "The wallet address to get balances for"
  ),
  cursor: cursorSchema,
  filterToken: z
    .string()
    .optional()
    .describe("Optional token to filter balances for"),
  includeNative: booleanOptionalSchema.describe(
    "Include native token balances"
  ),
});

const GetTokenEventsInputSchema = z.object({
  cursor: cursorSchema.optional().describe("A cursor for use in pagination"),
  direction: z
    .nativeEnum(RankingDirection)
    .optional()
    .describe("The direction to sort the events by"),
  limit: limitSchema
    .optional()
    .describe("The maximum number of events to return"),
  query: z
    .object({
      address: z
        .string()
        .describe(
          "The pair contract address to filter by. If you pass a token address in here, it will instead find the top pair for that token and use that."
        ),
      amountNonLiquidityToken: numberFilterSchema
        .optional()
        .describe("Filter by amount of non-liquidity token"),
      eventDisplayType: z
        .array(z.nativeEnum(EventDisplayType))
        .optional()
        .describe("Filter by event display type"),
      eventType: z
        .nativeEnum(EventType)
        .optional()
        .describe("Filter by event type"),
      maker: z.string().optional().describe("Filter by maker address"),
      networkId: networkIdSchema.describe("The network ID to filter by"),
      priceBaseToken: numberFilterSchema
        .optional()
        .describe("Filter by price in base token"),
      priceBaseTokenTotal: numberFilterSchema
        .optional()
        .describe("Filter by total price in base token"),
      priceUsd: numberFilterSchema
        .optional()
        .describe("Filter by price in USD"),
      priceUsdTotal: numberFilterSchema
        .optional()
        .describe("Filter by total price in USD"),
      quoteToken: z
        .nativeEnum(QuoteToken)
        .optional()
        .describe("Filter by quote token"),
      timestamp: z
        .object({
          from: z.number().describe("Start timestamp"),
          to: z.number().describe("End timestamp"),
        })
        .optional()
        .describe("Filter by timestamp range"),
    })
    .describe("Query parameters for filtering token events"),
});

const GetTokenEventsForMakerInputSchema = z.object({
  cursor: cursorSchema.optional().describe("A cursor for use in pagination"),
  direction: z
    .nativeEnum(RankingDirection)
    .optional()
    .describe("The direction to sort the events by"),
  limit: limitSchema
    .optional()
    .describe("The maximum number of events to return"),
  query: z
    .object({
      eventType: z
        .nativeEnum(EventType)
        .optional()
        .describe("The specific event type to filter by"),
      maker: z.string().describe("The specific wallet address to filter by"),
      networkId: networkIdSchema
        .optional()
        .describe("The network ID to filter by"),
      priceUsdTotal: numberFilterSchema
        .optional()
        .describe("The total amount of quoteToken involved in the swap in USD"),
      timestamp: z
        .object({
          from: z.number().describe("Start timestamp"),
          to: z.number().describe("End timestamp"),
        })
        .optional()
        .describe("The time range to filter by"),
      tokenAddress: z
        .string()
        .optional()
        .describe("The token involved in the event"),
    })
    .describe("Query parameters for filtering token events"),
});

/**
 * Get Token Info
 * Retrieves detailed information about a specific token
 */
export const getTokenInfo = createTool(
  "get_token_info",
  "Get detailed information about a specific token",
  GetTokenInputSchema,
  async (params) => {
    const codex = getCodex();
    const tokenData = await codex.queries.token({
      input: params,
    });

    return createToolResponse(tokenData.token);
  }
);

/**
 * Get Tokens
 * Retrieves detailed information about multiple tokens
 */
export const getTokens = createTool(
  "get_tokens",
  "Get detailed information about multiple tokens",
  GetTokensInputSchema,
  async (params) => {
    const codex = getCodex();
    const tokensData = await codex.queries.tokens({
      ids: params.ids,
    });

    return createToolResponse(tokensData.tokens);
  }
);

/**
 * Get Token Prices
 * Retrieves current prices for tokens
 */
export const getTokenPrices = createTool(
  "get_token_prices",
  "Get real-time or historical prices for a list of tokens",
  GetTokenPricesInputSchema,
  async (params) => {
    const codex = getCodex();

    const tokenPrices = await codex.queries.getTokenPrices({
      inputs: params.inputs,
    });

    return createToolResponse(tokenPrices.getTokenPrices);
  }
);

/**
 * Filter Tokens
 * Filter tokens by various criteria
 */
export const filterTokens = createTool(
  "filter_tokens",
  "Filter tokens by various criteria",
  FilterTokensInputSchema,
  async (params) => {
    const {
      excludeTokens,
      filters,
      limit,
      offset,
      phrase,
      rankings,
      statsType,
      tokens,
    } = params;
    const codex = getCodex();

    const filterParams: Record<string, any> = {};

    if (excludeTokens) filterParams.excludeTokens = excludeTokens;
    if (filters) filterParams.filters = filters;
    if (limit) filterParams.limit = limit;
    if (offset) filterParams.offset = offset;
    if (phrase) filterParams.phrase = phrase;
    if (rankings) filterParams.rankings = rankings;
    if (statsType) filterParams.statsType = statsType;
    if (tokens) filterParams.tokens = tokens;

    const filteredTokens = await codex.queries.filterTokens(filterParams);

    return createToolResponse(filteredTokens.filterTokens);
  }
);

/**
 * Get Token Holders
 * Retrieves information about token holders
 */
export const getTokenHolders = createTool(
  "get_token_holders",
  "Returns list of wallets that hold a given token, ordered by holdings descending. Also has the unique count of holders for that token. (Codex Growth and Enterprise Plans only)",
  GetTokenHoldersInputSchema,
  async (params) => {
    const { networkId, address, cursor, sort } = params;
    const codex = getCodex();

    const holders = await codex.queries.holders({
      input: {
        tokenId: `${address}:${networkId}`,
        cursor,
        sort,
      },
    });

    return createToolResponse(holders.holders);
  }
);

/**
 * Get Token Balances
 * Retrieves token balances for a wallet
 */
export const getTokenBalances = createTool(
  "get_token_balances",
  "Get token balances for a wallet (Codex Growth and Enterprise Plans only)",
  GetTokenBalancesInputSchema,
  async (params) => {
    const { networkId, walletAddress, cursor, filterToken, includeNative } =
      params;
    const codex = getCodex();

    const balances = await codex.queries.balances({
      input: {
        walletId: `${walletAddress}:${networkId}`,
        cursor,
        filterToken,
        includeNative,
      },
    });

    return createToolResponse(balances.balances);
  }
);

/**
 * Get Top 10 Holders Percent
 * Retrieves the percentage of tokens held by top 10 holders
 */
export const getTop10HoldersPercent = createTool(
  "get_top_10_holders_percent",
  "Get the percentage of tokens held by top 10 holders",
  GetTokenInputSchema,
  async (params) => {
    const { networkId, address } = params;
    const codex = getCodex();

    const percent = await codex.queries.top10HoldersPercent({
      tokenId: `${address}:${networkId}`,
    });

    return createToolResponse(percent.top10HoldersPercent);
  }
);

/**
 * Get Token Chart Data
 * Retrieves chart data for a token pair with configurable options
 */
export const getTokenChartData = createTool(
  "get_token_chart_data",
  "Returns bar chart data to track token price changes over time. Can be queried using either a pair address or token address.",
  GetTokenChartDataWithOptionsInputSchema,
  async (params) => {
    const {
      networkId,
      address,
      resolution,
      from,
      to,
      countback,
      currencyCode,
      quoteToken,
      removeEmptyBars,
      removeLeadingNullValues,
      statsType,
      symbolType,
    } = params;
    const codex = getCodex();

    const chartData = await codex.queries.getBars({
      symbol: `${address}:${networkId}`,
      resolution,
      from,
      to,
      countback,
      currencyCode,
      quoteToken,
      removeEmptyBars,
      removeLeadingNullValues,
      statsType,
      symbolType,
    });

    return createToolResponse(chartData.getBars);
  }
);

/**
 * Get Token Chart URLs
 * Retrieves chart URLs for a token pair
 */
export const getTokenChartUrls = createTool(
  "get_token_chart_urls",
  "Chart images for token pairs (Codex Growth and Enterprise Plans only)",
  GetTokenChartUrlsInputSchema,
  async (params) => {
    const { networkId, pairAddress, quoteToken } = params;
    const codex = getCodex();

    const chartUrls = await codex.queries.chartUrls({
      input: {
        pair: {
          chartSettings: {
            networkId,
            pairAddress,
            quoteToken,
          },
        },
      },
    });

    return createToolResponse(chartUrls.chartUrls);
  }
);

/**
 * Get Latest Tokens
 * Retrieves latest tokens
 */
export const getLatestTokens = createTool(
  "get_latest_tokens",
  "Get a list of the latests token contracts deployed (Codex Growth and Enterprise Plans only). Note: This endpoint is only available on Ethereum, Optimum, Base, and Arbitrum networks (network IDs 1, 10, 8453, and 42161).",
  GetLatestTokensInputSchema,
  async (params) => {
    const { networkFilter, limit, offset } = params;
    const codex = getCodex();

    const latestTokens = await codex.queries.getLatestTokens({
      networkFilter,
      limit,
      offset,
    });

    return createToolResponse(latestTokens.getLatestTokens);
  }
);

/**
 * Get Token Sparklines
 * Retrieves a list of token simple chart data (sparklines) for the given tokens
 */
export const getTokenSparklines = createTool(
  "get_token_sparklines",
  "Get a list of token simple chart data (sparklines) for the given tokens",
  GetTokenSparklinesInputSchema,
  async (params) => {
    const { networkId, addresses } = params;
    const codex = getCodex();

    const sparklines = await codex.queries.tokenSparklines({
      input: {
        ids: addresses.map((address) => `${address}:${networkId}`),
      },
    });

    return createToolResponse(sparklines.tokenSparklines);
  }
);

/**
 * Get Token Events
 * Retrieves transactions for a token pair
 */
export const getTokenEvents = createTool(
  "get_token_events",
  "Get transactions for a token pair",
  GetTokenEventsInputSchema,
  async (params) => {
    const codex = getCodex();

    const events = await codex.queries.getTokenEvents({
      cursor: params.cursor,
      direction: params.direction,
      limit: params.limit,
      query: params.query,
    });

    return createToolResponse(events.getTokenEvents);
  }
);

/**
 * Get Token Events For Maker
 * Retrieves a list of token events for a given wallet address
 */
export const getTokenEventsForMaker = createTool(
  "get_token_events_for_maker",
  "Get a list of token events for a given wallet address",
  GetTokenEventsForMakerInputSchema,
  async (params) => {
    const codex = getCodex();

    const events = await codex.queries.getTokenEventsForMaker({
      cursor: params.cursor,
      direction: params.direction,
      limit: params.limit,
      query: params.query,
    });

    return createToolResponse(events.getTokenEventsForMaker);
  }
);
