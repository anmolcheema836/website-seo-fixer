import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CrawlResult {
  url: string;
  status: number;
  title: string;
  h1: string;
  metaDescription: string;
  canonical: string;
  images: { src: string; alt: string }[];
  internalLinks: string[];
}

export async function crawlPage(url: string): Promise<CrawlResult> {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);

    const images: { src: string; alt: string }[] = [];
    $('img').each((_, el) => {
      images.push({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || '',
      });
    });

    const internalLinks: string[] = [];
    const baseUrl = new URL(url).origin;
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && (href.startsWith('/') || href.startsWith(baseUrl))) {
        internalLinks.push(href);
      }
    });

    return {
      url,
      status: response.status,
      title: $('title').text().trim(),
      h1: $('h1').first().text().trim(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      canonical: $('link[rel="canonical"]').attr('href') || '',
      images,
      internalLinks
    };
  } catch (error: any) {
    return {
      url,
      status: error.response?.status || 500,
      title: '', h1: '', metaDescription: '', canonical: '', images: [], internalLinks: []
    };
  }
}