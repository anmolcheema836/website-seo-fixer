import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { runAudit, auditToolSchema } from "./tools/audit.js";
import { updateWordPressPost, wpToolSchema } from "./tools/wordpress.js";

export function registerTools(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "audit_website",
          description: "Audits a website for technical and on-page SEO issues, returning a score, severity-based issues, and actionable fixes.",
          inputSchema: auditToolSchema,
        },
        {
          name: "wordpress_update_post",
          description: "Updates a WordPress post's metadata, title, or content using the REST API. Requires user confirmation.",
          inputSchema: wpToolSchema,
        }
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      switch (request.params.name) {
        case "audit_website": {
          const result = await runAudit(request.params.arguments);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        case "wordpress_update_post": {
          const result = await updateWordPressPost(request.params.arguments);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error executing tool: ${error.message}` }],
        isError: true,
      };
    }
  });
}