/**
 * Data Enrichment Service
 * Multi-layered company research using web scraping + Google Gemini AI
 */
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');
const { config } = require('../config/env');
const logger = require('../utils/logger');

const MODULE = 'Enrichment';

async function scrapeWebsite(url) {
  if (!url) {
    logger.warn(MODULE, 'No website URL provided — skipping scraping.');
    return null;
  }
  try {
    logger.info(MODULE, `Scraping website: ${url}`);
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      maxRedirects: 5,
    });
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const ogDesc = $('meta[property="og:description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    $('script, style, nav, footer, header, iframe, noscript').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000);
    const aboutText = $('[class*="about"], [id*="about"]').text().trim().substring(0, 1000);
    const servicesText = $('[class*="service"], [class*="product"], [class*="solution"]').text().trim().substring(0, 1000);
    const socialLinks = {};
    const li = $('a[href*="linkedin.com"]').first().attr('href');
    if (li) socialLinks.linkedin = li;
    const tw = $('a[href*="twitter.com"], a[href*="x.com"]').first().attr('href');
    if (tw) socialLinks.twitter = tw;
    const scraped = { title: ogTitle || title, description: ogDesc || metaDesc, keywords: metaKeywords, bodyText, aboutText, servicesText, socialLinks, scrapedUrl: url };
    logger.success(MODULE, `Website scraped — Title: "${scraped.title}"`);
    return scraped;
  } catch (error) {
    logger.warn(MODULE, `Scraping failed: ${error.message}`);
    return null;
  }
}

async function aiResearch(leadData, scrapedData) {
  if (!config.geminiApiKey) {
    logger.error(MODULE, 'Gemini API key not configured.');
    return generateFallbackData(leadData);
  }
  try {
    logger.info(MODULE, 'Starting AI research via Google Gemini...');
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    const scraped = scrapedData ? `\nWEBSITE DATA:\n- Title: ${scrapedData.title}\n- Description: ${scrapedData.description}\n- About: ${scrapedData.aboutText || 'N/A'}\n- Services: ${scrapedData.servicesText || 'N/A'}\n- Body: ${scrapedData.bodyText?.substring(0, 1500) || 'N/A'}` : '\nNo website data available.';
    const prompt = `You are a senior business analyst. Research this company and respond ONLY with valid JSON (no markdown fences).\n\nCOMPANY: ${leadData.companyName}\nINDUSTRY: ${leadData.industry}\nSIZE: ${leadData.companySize}\nWEBSITE: ${leadData.companyWebsite || 'N/A'}\nCONTACT: ${leadData.fullName}\nNOTES: ${leadData.notes || 'None'}${scraped}\n\nJSON format:\n{"companyOverview":"3-4 paragraphs","industryAnalysis":"2-3 paragraphs","keyProducts":["list"],"targetAudience":"text","competitiveLandscape":"2-3 paragraphs","keyCompetitors":["list"],"strengths":["4-6 items"],"challenges":["4-6 items"],"opportunities":["4-6 items"],"recommendations":["5-7 actionable items"],"techStack":"text","marketPosition":"text","recentDevelopments":"text","digitalPresence":"text","estimatedRevenue":"text","keyMetrics":{"industryGrowthRate":"","marketSize":"","employeeEstimate":""}}`;
    const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const text = result.text;
    let parsed;
    try { parsed = JSON.parse(text); } catch {
      const m = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(m ? (m[1] || m[0]).trim() : text);
    }
    logger.success(MODULE, 'AI research completed.');
    return { ...parsed, enrichmentSource: 'ai_research', scrapedData: scrapedData ? { title: scrapedData.title, description: scrapedData.description, socialLinks: scrapedData.socialLinks } : null };
  } catch (error) {
    logger.error(MODULE, `AI research failed: ${error.message}`);
    return generateFallbackData(leadData, scrapedData);
  }
}

function generateFallbackData(leadData, scrapedData) {
  logger.warn(MODULE, 'Using fallback enrichment data.');
  return {
    companyOverview: scrapedData?.description ? `${leadData.companyName} — ${scrapedData.description}` : `${leadData.companyName} operates in the ${leadData.industry} sector as a ${leadData.companySize} organization.`,
    industryAnalysis: `The ${leadData.industry} industry is evolving rapidly with digital transformation and increasing competition.`,
    keyProducts: ['Core business services', 'Industry solutions', 'Professional consulting'],
    targetAudience: `Businesses in the ${leadData.industry} sector.`,
    competitiveLandscape: `The ${leadData.industry} market is competitive with established players and startups.`,
    keyCompetitors: ['Industry leaders', 'Emerging competitors'],
    strengths: ['Active interest in optimization', `Established in ${leadData.industry}`, 'Proactive growth approach'],
    challenges: ['Market competition', 'Digital transformation', 'Customer acquisition costs'],
    opportunities: ['AI adoption', 'Data-driven decisions', 'Strategic partnerships'],
    recommendations: ['Implement data-driven marketing', 'Invest in AI tools', 'Focus on customer retention', 'Enhance digital presence'],
    techStack: 'Unable to determine.', marketPosition: 'Requires additional data.',
    recentDevelopments: 'No recent developments found.', digitalPresence: scrapedData ? 'Active website detected.' : 'Limited information.',
    estimatedRevenue: 'Requires additional data.',
    keyMetrics: { industryGrowthRate: 'Varies', marketSize: 'Dependent on focus', employeeEstimate: leadData.companySize },
    enrichmentSource: 'fallback', scrapedData: null,
  };
}

async function enrichCompanyData(leadData) {
  logger.pipeline(`Starting enrichment for: ${leadData.companyName}`);
  const scrapedData = await scrapeWebsite(leadData.companyWebsite);
  const enrichedData = await aiResearch(leadData, scrapedData);
  return { lead: leadData, enrichment: enrichedData, processedAt: new Date().toISOString() };
}

module.exports = { enrichCompanyData };
