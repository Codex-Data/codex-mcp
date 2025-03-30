/**
 * Represents a tool's response content
 */
export type ToolContent = {
  type: "text";
  text: string;
};

/**
 * Represents a tool's response
 */
export type ToolResponse = {
  content: ToolContent[];
  isError?: boolean;
};

/**
 * Represents a tool's handler function
 */
export type ToolHandler<TParams = undefined> = (
  params: TParams
) => Promise<ToolResponse>;

/**
 * Represents the structure of a tool definition object.
 * Used by createTool helper and consumed during registration.
 */
export type Tool<TParams = undefined> = {
  definition: {
    name: string;
    description: string;
    schema: { shape: any }; // Consider using a more specific type if possible
  };
  handler: (params: TParams) => Promise<ToolResponse>;
};
