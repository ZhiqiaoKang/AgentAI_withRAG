import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getJson } from "serpapi";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

const server = new McpServer({
  name: "serpapi-serach",
  version: "1.0.0",
});

server.registerTool(
  "search_web",
  {
    description: "Search the web using SerpAPI and return the search results",
    inputSchema: {
      query: z.string().describe("the search query to execute"),
      num: z
        .number()
        .optional()
        .describe("the numebr of results to return (default 10)"),
    },
  },
  async ({ query, num = 10 }) => {
    try {
      const results = await getJson({
        engine: "google",
        q: query,
        num,
        api_key: SERPAPI_KEY,
      });

      const fullRestuls = JSON.stringify(results); // obj => JSON

      return {
        content: [
          {
            type: "text",
            text: fullRestuls,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Error processing your query " + error,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SerpAPI MCP SErver running on Stdio");
}

main().catch((error) => {
  console.error("Fatal error", error);
  process.exit(1);
});

export default server;
