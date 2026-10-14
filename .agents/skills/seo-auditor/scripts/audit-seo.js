#!/usr/bin/env node
/**
 * SEO Auditor Script for АвтоТема (https://avtotema-news.online)
 * Performs automated SEO audit on HTML pages without external dependencies.
 * Usage:
 *   node audit-seo.js                     # Audits root index.html and all files in articles/
 *   node audit-seo.js path/to/article.html # Audits a single file
 */

const fs = require('fs');
const path = require('path');

const targetArg = process.argv[2];
const rootDir = process.cwd();

function getHtmlFiles(target) {
  if (target) {
    const fullPath = path.resolve(rootDir, target);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File or directory "${target}" not found.`);
      process.exit(1);
    }
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) return [fullPath];
    if (stat.isDirectory()) {
      return fs.readdirSync(fullPath)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(fullPath, f));
    }
  }

  const files = [];
  const indexHtml = path.join(rootDir, 'index.html');
  if (fs.existsSync(indexHtml)) files.push(indexHtml);

  const articlesDir = path.join(rootDir, 'articles');
  if (fs.existsSync(articlesDir)) {
    try {
      const artFiles = fs.readdirSync(articlesDir)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(articlesDir, f));
      files.push(...artFiles);
    } catch (e) {
      // Permission or read error handling
    }
  }
  return files;
}

function auditHtml(filePath, content) {
  const issues = [];
  const warnings = [];
  const passes = [];

  // 1. Title tag
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push('Missing <title> tag');
  } else {
    const titleText = titleMatch[1].trim();
    if (titleText.length < 30 || titleText.length > 70) {
      warnings.push(`<title> length is ${titleText.length} chars (recommended 30-70)`);
    } else {
      passes.push(`<title> tag length is optimal (${titleText.length} chars)`);
    }
  }

  // 2. Meta description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                    content.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    issues.push('Missing <meta name="description"> tag');
  } else {
    const descText = descMatch[1].trim();
    if (descText.length < 90 || descText.length > 180) {
      warnings.push(`<meta description> length is ${descText.length} chars (recommended 100-165)`);
    } else {
      passes.push(`<meta description> length is optimal (${descText.length} chars)`);
    }
  }

  // 3. Canonical link
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i) ||
                     content.match(/<link\s+href=["'](.*?)["']\s+rel=["']canonical["']/i);
  if (!canonMatch) {
    warnings.push('Missing <link rel="canonical"> tag');
  } else {
    passes.push(`Canonical URL present: ${canonMatch[1]}`);
  }

  // 4. Open Graph tags
  const ogRequired = ['og:title', 'og:description', 'og:image', 'og:url'];
  for (const tag of ogRequired) {
    const reg = new RegExp(`<meta\\s+(?:property|name)=["']${tag}["']\\s+content=["']([^"']*)["']`, 'i');
    const altReg = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${tag}["']`, 'i');
    if (!reg.test(content) && !altReg.test(content)) {
      warnings.push(`Missing Open Graph tag: ${tag}`);
    }
  }

  // 5. Headings check (h1)
  const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  if (!h1Matches) {
    issues.push('Missing <h1> heading');
  } else if (h1Matches.length > 1) {
    warnings.push(`Multiple <h1> tags detected (${h1Matches.length}). Recommended exactly 1.`);
  } else {
    passes.push('Exactly one <h1> heading found');
  }

  // 6. Image alt tags
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  for (const img of imgMatches) {
    if (!img.match(/alt=["'][^"']+["']/i)) {
      missingAlt++;
    }
  }
  if (missingAlt > 0) {
    warnings.push(`${missingAlt} image(s) missing descriptive alt attribute`);
  } else if (imgMatches.length > 0) {
    passes.push(`All ${imgMatches.length} images have alt attributes`);
  }

  // 7. Schema.org JSON-LD
  const jsonLdMatch = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (!jsonLdMatch) {
    warnings.push('Missing Schema.org JSON-LD structured data');
  } else {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      const schemaType = parsed['@type'] || (parsed['@graph'] && parsed['@graph'].map(g => g['@type']).join(', '));
      passes.push(`Valid Schema.org JSON-LD found (Type: ${schemaType || 'Unknown'})`);
    } catch (err) {
      issues.push(`Invalid JSON inside Schema.org script: ${err.message}`);
    }
  }

  return { filePath, issues, warnings, passes };
}

function main() {
  const files = getHtmlFiles(targetArg);
  if (files.length === 0) {
    console.log('No HTML files found to audit.');
    return;
  }

  console.log(`\n======================================================`);
  console.log(`  🔍 SEO AUDIT: Scanning ${files.length} file(s)...`);
  console.log(`======================================================\n`);

  let totalIssues = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const relPath = path.relative(rootDir, file);
    const content = fs.readFileSync(file, 'utf8');
    const result = auditHtml(file, content);

    const hasProblems = result.issues.length > 0 || result.warnings.length > 0;
    const statusIcon = result.issues.length > 0 ? '❌' : (result.warnings.length > 0 ? '⚠️' : '✅');

    console.log(`${statusIcon} ${relPath}`);

    if (result.issues.length > 0) {
      totalIssues += result.issues.length;
      result.issues.forEach(msg => console.log(`   [CRITICAL] ${msg}`));
    }
    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      result.warnings.forEach(msg => console.log(`   [WARN]     ${msg}`));
    }
    if (!hasProblems) {
      console.log(`   [PASS] All core SEO checks passed.`);
    }
    console.log('');
  }

  console.log(`------------------------------------------------------`);
  console.log(`Summary: ${files.length} files scanned.`);
  console.log(`Critical Issues: ${totalIssues} | Warnings: ${totalWarnings}`);
  console.log(`------------------------------------------------------\n`);

  if (totalIssues > 0) {
    process.exitCode = 1;
  }
}

main();
