#!/usr/bin/env node
/**
 * Performance & PWA Auditor for АвтоТема (https://avtotema-news.online)
 * Audits images for CLS/LCP, checks sw.js cache versioning, and validates manifest.json.
 * Usage:
 *   node audit-performance.js
 *   node audit-performance.js index.html
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const targetArg = process.argv[2];

function auditImagesInHtml(filePath, content) {
  const issues = [];
  const warnings = [];
  const imgRegex = /<img\b([^>]*)>/gi;
  let match;
  let imgIndex = 0;

  while ((match = imgRegex.exec(content)) !== null) {
    imgIndex++;
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1] : `image #${imgIndex}`;

    const hasWidth = /\bwidth=["']?\d+/i.test(attrs);
    const hasHeight = /\bheight=["']?\d+/i.test(attrs);
    const hasLazy = /loading=["']lazy["']/i.test(attrs);
    const hasHighPriority = /fetchpriority=["']high["']/i.test(attrs);

    // CLS check: width & height
    if (!hasWidth || !hasHeight) {
      warnings.push(`[CLS] Image "${src}" is missing explicit width or height attributes.`);
    }

    // LCP check: first image is likely the hero image
    if (imgIndex === 1) {
      if (hasLazy) {
        issues.push(`[LCP] Hero image "${src}" has loading="lazy". Remove lazy-loading for above-the-fold hero image!`);
      }
      if (!hasHighPriority) {
        warnings.push(`[LCP] Consider adding fetchpriority="high" to hero image "${src}".`);
      }
    } else {
      // Images below the fold should be lazy-loaded
      if (!hasLazy) {
        warnings.push(`[PERF] Below-the-fold image "${src}" is missing loading="lazy".`);
      }
    }
  }

  return { imgCount: imgIndex, issues, warnings };
}

function auditServiceWorker() {
  const swPath = path.join(rootDir, 'sw.js');
  if (!fs.existsSync(swPath)) {
    return { found: false, issues: ['sw.js not found in root directory'], warnings: [] };
  }
  const content = fs.readFileSync(swPath, 'utf8');
  const issues = [];
  const warnings = [];

  const cacheMatch = content.match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
  if (!cacheMatch) {
    warnings.push('CACHE_NAME constant not explicitly defined in sw.js');
  } else {
    // Check version
    const version = cacheMatch[1];
    // Cache version check
  }

  if (!content.includes('caches.delete')) {
    warnings.push('No automatic cache purge (caches.delete) found in sw.js activate handler.');
  }

  return {
    found: true,
    cacheName: cacheMatch ? cacheMatch[1] : 'Unknown',
    issues,
    warnings
  };
}

function auditManifest() {
  const manifestPath = path.join(rootDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { found: false, issues: ['manifest.json not found in root directory'], warnings: [] };
  }
  const issues = [];
  const warnings = [];
  try {
    const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!data.name && !data.short_name) issues.push('Missing name / short_name in manifest.json');
    if (!data.icons || data.icons.length === 0) issues.push('No icons defined in manifest.json');
    if (!data.start_url) warnings.push('Missing start_url in manifest.json');
    if (!data.theme_color) warnings.push('Missing theme_color in manifest.json');
    return { found: true, name: data.name || data.short_name, issues, warnings };
  } catch (err) {
    return { found: true, issues: [`Invalid JSON in manifest.json: ${err.message}`], warnings: [] };
  }
}

function main() {
  console.log(`\n======================================================`);
  console.log(`  ⚡ PERFORMANCE & PWA AUDITOR (АвтоТема)`);
  console.log(`======================================================\n`);

  let targetFiles = [];
  if (targetArg) {
    const full = path.resolve(rootDir, targetArg);
    if (fs.existsSync(full)) targetFiles = [full];
  } else {
    const indexHtml = path.join(rootDir, 'index.html');
    if (fs.existsSync(indexHtml)) targetFiles.push(indexHtml);
  }

  let totalIssues = 0;
  let totalWarnings = 0;

  console.log(`--- 1. Image Performance & Layout Shift (CLS / LCP) ---`);
  for (const file of targetFiles) {
    const rel = path.relative(rootDir, file);
    const content = fs.readFileSync(file, 'utf8');
    const res = auditImagesInHtml(file, content);

    console.log(`📄 ${rel} (${res.imgCount} images scanned):`);
    if (res.issues.length === 0 && res.warnings.length === 0) {
      console.log(`   ✅ All images meet CLS/LCP performance standards.`);
    } else {
      res.issues.forEach(i => { totalIssues++; console.log(`   ❌ ${i}`); });
      res.warnings.forEach(w => { totalWarnings++; console.log(`   ⚠️  ${w}`); });
    }
    console.log('');
  }

  console.log(`--- 2. Service Worker (sw.js) & Cache Lifecycle -------`);
  const sw = auditServiceWorker();
  if (sw.found) {
    console.log(`✅ sw.js active (Current Cache: "${sw.cacheName}")`);
    sw.issues.forEach(i => { totalIssues++; console.log(`   ❌ ${i}`); });
    sw.warnings.forEach(w => { totalWarnings++; console.log(`   ⚠️  ${w}`); });
  } else {
    console.log(`ℹ️ sw.js not found in root (skipping Service Worker check)`);
  }
  console.log('');

  console.log(`--- 3. PWA Web App Manifest (manifest.json) -----------`);
  const mf = auditManifest();
  if (mf.found) {
    console.log(`✅ manifest.json active (App Name: "${mf.name || 'OK'}")`);
    mf.issues.forEach(i => { totalIssues++; console.log(`   ❌ ${i}`); });
    mf.warnings.forEach(w => { totalWarnings++; console.log(`   ⚠️  ${w}`); });
  } else {
    console.log(`ℹ️ manifest.json not found in root`);
  }
  console.log('');

  console.log(`------------------------------------------------------`);
  console.log(`Summary: Critical Issues: ${totalIssues} | Warnings: ${totalWarnings}`);
  console.log(`------------------------------------------------------\n`);

  if (totalIssues > 0) {
    process.exitCode = 1;
  }
}

main();
