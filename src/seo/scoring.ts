import { SEOIssue } from './analyzer.js';

export function calculateScore(issues: SEOIssue[]): number {
  let score = 100;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'CRITICAL': score -= 20; break;
      case 'HIGH': score -= 10; break;
      case 'MEDIUM': score -= 5; break;
      case 'LOW': score -= 2; break;
    }
  });

  return Math.max(0, score);
}