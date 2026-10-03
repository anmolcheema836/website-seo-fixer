import { z } from "zod";
import { crawlPage } from "../crawler/spider.js";
import { analyzePage } from "../seo/analyzer.js";
import { calculateScore } from "../seo/scoring.js";

export const auditToolSchema = {
  type: "object",
  properties: {
    url: { type: "string", description: "The homepage or specific URL to audit" },
    maxPages: { type: "number", description: "Maximum pages to crawl (default 1)" }
  },
  required: ["url"],
};

export async function runAudit(args: any) {
  const url = args.url as string;
  // Simplified for MVP: single page crawl. Production would loop via queue.ts
  const crawlData = await crawlPage(url);
  const issues = analyzePage(crawlData);
  const score = calculateScore(issues);

  return {
    report: {
      url,
      date: new Date().toISOString(),
      seoScore: score,
      summary: {
        CRITICAL: issues.filter(i => i.severity === 'CRITICAL').length,
        HIGH: issues.filter(i => i.severity === 'HIGH').length,
        MEDIUM: issues.filter(i => i.severity === 'MEDIUM').length,
        LOW: issues.filter(i => i.severity === 'LOW').length,
      },
      issues,
      nextSteps: "Use 'generate_seo_fix' (or ask ChatGPT to prepare fixes) for the issues listed above."
    }
  };
}