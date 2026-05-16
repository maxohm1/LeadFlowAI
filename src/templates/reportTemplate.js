/**
 * PDF Report HTML Template
 * Generates a professional, visually stunning audit report
 */

function generateReportHTML(data) {
  const { lead, enrichment, processedAt } = data;
  const date = new Date(processedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const e = enrichment;

  const listItems = (arr) => (arr || []).map(i => `<li>${i}</li>`).join('');
  const hasContent = (val) => val && val !== 'N/A' && val !== 'Unable to determine.' && val !== 'Requires additional data.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; line-height: 1.7; background: #fff; }

  /* Cover Page */
  .cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); color: #fff; text-align: center; page-break-after: always; position: relative; overflow: hidden; }
  .cover::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%); }
  .cover-content { position: relative; z-index: 1; }
  .cover-badge { display: inline-block; padding: 8px 24px; border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 40px; color: rgba(255,255,255,0.8); }
  .cover h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, #fff 0%, #c7d2fe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cover h2 { font-size: 22px; font-weight: 300; color: rgba(255,255,255,0.7); margin-bottom: 60px; }
  .cover-meta { font-size: 13px; color: rgba(255,255,255,0.5); }
  .cover-meta span { display: block; margin: 4px 0; }
  .cover-line { width: 60px; height: 3px; background: linear-gradient(90deg, #818cf8, #a78bfa); border-radius: 2px; margin: 30px auto; }

  /* Page styles */
  .page { padding: 60px; page-break-after: always; min-height: 100vh; }
  .page:last-child { page-break-after: avoid; }

  /* Section headers */
  .section { margin-bottom: 40px; }
  .section-number { font-size: 12px; font-weight: 700; color: #6366f1; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
  .section h2 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .section-line { width: 40px; height: 3px; background: linear-gradient(90deg, #6366f1, #a78bfa); border-radius: 2px; margin: 12px 0 20px; }
  .section p { font-size: 15px; color: #374151; margin-bottom: 14px; }

  /* Cards */
  .card { background: #f8fafc; border-radius: 12px; padding: 28px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
  .card-header { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .card-icon.blue { background: #ede9fe; }
  .card-icon.green { background: #d1fae5; }
  .card-icon.orange { background: #fef3c7; }
  .card-icon.red { background: #fee2e2; }

  /* Lists */
  ul { padding-left: 0; list-style: none; }
  li { position: relative; padding: 8px 0 8px 28px; font-size: 14px; color: #374151; border-bottom: 1px solid #f1f5f9; }
  li:last-child { border-bottom: none; }
  li::before { content: '▸'; position: absolute; left: 8px; color: #6366f1; font-weight: 700; }

  /* Grid */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* Metrics */
  .metric-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border-radius: 12px; padding: 24px; text-align: center; }
  .metric-value { font-size: 24px; font-weight: 700; }
  .metric-label { font-size: 12px; opacity: 0.8; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }

  /* CTA */
  .cta { background: linear-gradient(135deg, #0f0c29, #302b63); color: #fff; border-radius: 16px; padding: 48px; text-align: center; margin-top: 40px; }
  .cta h2 { font-size: 28px; margin-bottom: 16px; }
  .cta p { font-size: 15px; opacity: 0.8; margin-bottom: 24px; }
  .cta-button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #6366f1, #a78bfa); color: #fff; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 15px; }

  /* Footer */
  .footer { text-align: center; padding: 30px; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; margin-top: 40px; }

  /* Table of Contents */
  .toc-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #d1d5db; font-size: 15px; }
  .toc-item span:first-child { color: #6366f1; font-weight: 600; margin-right: 12px; }
  .toc-item span:last-child { color: #9ca3af; }

  /* Highlight */
  .highlight { background: linear-gradient(135deg, #ede9fe, #e0e7ff); border-left: 4px solid #6366f1; padding: 20px 24px; border-radius: 0 12px 12px 0; margin: 20px 0; font-size: 15px; color: #374151; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-content">
    <div class="cover-badge">Confidential Business Audit</div>
    <h1>${lead.companyName}</h1>
    <h2>Strategic Business Intelligence Report</h2>
    <div class="cover-line"></div>
    <div class="cover-meta">
      <span>Prepared for: ${lead.fullName}</span>
      <span>Date: ${date}</span>
      <span>Industry: ${lead.industry}</span>
    </div>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page">
  <div class="section">
    <div class="section-number">Contents</div>
    <h2>Table of Contents</h2>
    <div class="section-line"></div>
  </div>
  <div class="toc-item"><span>01</span> Executive Summary <span>3</span></div>
  <div class="toc-item"><span>02</span> Company Overview <span>4</span></div>
  <div class="toc-item"><span>03</span> Industry Analysis <span>5</span></div>
  <div class="toc-item"><span>04</span> Competitive Landscape <span>6</span></div>
  <div class="toc-item"><span>05</span> SWOT Analysis <span>7</span></div>
  <div class="toc-item"><span>06</span> Strategic Recommendations <span>8</span></div>
  <div class="toc-item"><span>07</span> Next Steps <span>9</span></div>

  <div class="highlight" style="margin-top:40px;">
    This report was generated using AI-powered business intelligence tools, combining publicly available data with advanced analysis to deliver actionable insights for <strong>${lead.companyName}</strong>.
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 01</div>
    <h2>Executive Summary</h2>
    <div class="section-line"></div>
    <p>${e.companyOverview || ''}</p>
  </div>

  ${e.keyMetrics ? `<div class="grid">
    <div class="metric-box"><div class="metric-value">${e.keyMetrics.marketSize || 'N/A'}</div><div class="metric-label">Market Size</div></div>
    <div class="metric-box"><div class="metric-value">${e.keyMetrics.industryGrowthRate || 'N/A'}</div><div class="metric-label">Growth Rate</div></div>
    <div class="metric-box"><div class="metric-value">${e.keyMetrics.employeeEstimate || lead.companySize}</div><div class="metric-label">Company Size</div></div>
    <div class="metric-box"><div class="metric-value">${e.estimatedRevenue || 'N/A'}</div><div class="metric-label">Est. Revenue</div></div>
  </div>` : ''}
</div>

<!-- INDUSTRY ANALYSIS -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 02</div>
    <h2>Industry & Market Analysis</h2>
    <div class="section-line"></div>
    <p>${e.industryAnalysis || ''}</p>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-icon blue">📦</div> Key Products & Services</div>
    <ul>${listItems(e.keyProducts)}</ul>
  </div>

  ${hasContent(e.targetAudience) ? `<div class="card">
    <div class="card-header"><div class="card-icon green">🎯</div> Target Audience</div>
    <p style="font-size:14px;color:#374151;padding:0 8px;">${e.targetAudience}</p>
  </div>` : ''}
</div>

<!-- COMPETITIVE LANDSCAPE -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 03</div>
    <h2>Competitive Landscape</h2>
    <div class="section-line"></div>
    <p>${e.competitiveLandscape || ''}</p>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-icon orange">⚔️</div> Key Competitors</div>
    <ul>${listItems(e.keyCompetitors)}</ul>
  </div>
  ${hasContent(e.marketPosition) ? `<div class="highlight">${e.marketPosition}</div>` : ''}
</div>

<!-- SWOT -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 04</div>
    <h2>Strategic SWOT Analysis</h2>
    <div class="section-line"></div>
  </div>
  <div class="grid">
    <div class="card"><div class="card-header"><div class="card-icon green">💪</div> Strengths</div><ul>${listItems(e.strengths)}</ul></div>
    <div class="card"><div class="card-header"><div class="card-icon red">⚡</div> Challenges</div><ul>${listItems(e.challenges)}</ul></div>
    <div class="card"><div class="card-header"><div class="card-icon blue">🚀</div> Opportunities</div><ul>${listItems(e.opportunities)}</ul></div>
    <div class="card"><div class="card-header"><div class="card-icon orange">🔍</div> Digital Presence</div><p style="font-size:14px;color:#374151;padding:8px;">${e.digitalPresence || 'N/A'}</p></div>
  </div>
</div>

<!-- RECOMMENDATIONS -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 05</div>
    <h2>Strategic Recommendations</h2>
    <div class="section-line"></div>
    <p>Based on our comprehensive analysis, here are our top recommendations for ${lead.companyName}:</p>
  </div>
  ${(e.recommendations || []).map((rec, i) => `
    <div class="card">
      <div class="card-header"><span style="color:#6366f1;font-weight:800;font-size:18px;">${String(i+1).padStart(2,'0')}</span> ${rec}</div>
    </div>
  `).join('')}

  ${hasContent(e.techStack) ? `<div class="card"><div class="card-header"><div class="card-icon blue">⚙️</div> Technology Stack</div><p style="font-size:14px;color:#374151;padding:0 8px;">${e.techStack}</p></div>` : ''}
</div>

<!-- NEXT STEPS / CTA -->
<div class="page">
  <div class="section">
    <div class="section-number">Section 06</div>
    <h2>Next Steps</h2>
    <div class="section-line"></div>
  </div>

  <div class="cta">
    <h2>Let's Transform These Insights Into Action</h2>
    <p>This report represents just the beginning. We'd love to dive deeper into ${lead.companyName}'s specific needs and develop a tailored strategy.</p>
    <div class="cta-button">Schedule a Consultation →</div>
  </div>

  <div class="footer">
    <p>This report was generated by <strong>LeadFlowAI</strong> — AI-Powered Business Intelligence</p>
    <p>Generated on ${date} | Confidential — Prepared exclusively for ${lead.fullName}</p>
    <p style="margin-top:8px;font-size:10px;">Data sourced from publicly available information and AI analysis. Verify critical data points independently.</p>
  </div>
</div>

</body>
</html>`;
}

module.exports = { generateReportHTML };
