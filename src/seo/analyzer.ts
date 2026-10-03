import { CrawlResult } from '../crawler/spider.js';

export interface SEOIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  issue: string;
  evidence: string;
  affectedUrl: string;
  recommendedFix: string;
}

export function analyzePage(data: CrawlResult): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (data.status >= 400) {
    issues.push({
      severity: 'CRITICAL',
      issue: 'Page returns error status',
      evidence: `HTTP ${data.status}`,
      affectedUrl: data.url,
      recommendedFix: 'Check server logs or update links pointing to this 4xx/5xx page.'
    });
    return issues; // Skip further analysis if broken
  }

  if (!data.title) {
    issues.push({
      severity: 'HIGH',
      issue: 'Missing Title Tag',
      evidence: 'Title tag is empty or missing.',
      affectedUrl: data.url,
      recommendedFix: 'Add a descriptive title tag between 50-60 characters.'
    });
  } else if (data.title.length > 60) {
    issues.push({
      severity: 'LOW',
      issue: 'Title Tag too long',
      evidence: `Length: ${data.title.length} characters.`,
      affectedUrl: data.url,
      recommendedFix: 'Shorten title to under 60 characters to prevent truncation in SERPs.'
    });
  }

  if (!data.metaDescription) {
    issues.push({
      severity: 'HIGH',
      issue: 'Missing Meta Description',
      evidence: 'No <meta name="description"> found.',
      affectedUrl: data.url,
      recommendedFix: 'Write a compelling meta description between 150-160 characters summarizing the page.'
    });
  }

  if (!data.h1) {
    issues.push({
      severity: 'MEDIUM',
      issue: 'Missing H1 Tag',
      evidence: 'No <h1> element found on the page.',
      affectedUrl: data.url,
      recommendedFix: 'Add exactly one H1 tag that clearly states the main topic of the page.'
    });
  }

  const missingAlt = data.images.filter(img => !img.alt);
  if (missingAlt.length > 0) {
    issues.push({
      severity: 'MEDIUM',
      issue: 'Images missing alt text',
      evidence: `${missingAlt.length} images are missing alt attributes.`,
      affectedUrl: data.url,
      recommendedFix: 'Add descriptive alt text to all images for accessibility and image SEO.'
    });
  }

  return issues;
}