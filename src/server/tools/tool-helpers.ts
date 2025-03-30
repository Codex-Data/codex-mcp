import { z } from "zod";
import { ToolResponse } from "../../types.js";

export const handleError = (
  error: unknown,
  operation: string
): ToolResponse => ({
  content: [
    {
      type: "text" as const,
      text: `Error ${operation}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    },
  ],
  isError: true,
});

export const createToolResponse = (data: any): ToolResponse => ({
  content: [
    {
      type: "text" as const,
      text: JSON.stringify(data, null, 2),
    },
  ],
});

export const withErrorHandling = <T>(
  handler: (params: T) => Promise<any>,
  errorMessage: string
) => {
  return async (params: T): Promise<ToolResponse> => {
    try {
      const result = await handler(params);
      return createToolResponse(result);
    } catch (error) {
      console.error("Tool error", error);
      return handleError(error, errorMessage);
    }
  };
};

export const createTool = <T extends z.ZodType>(
  name: string,
  description: string,
  schema: T,
  handler: (params: z.infer<T>) => Promise<ToolResponse>
) => ({
  definition: {
    name,
    description,
    schema,
  },
  handler: withErrorHandling(handler, `error in ${name}`),
});
