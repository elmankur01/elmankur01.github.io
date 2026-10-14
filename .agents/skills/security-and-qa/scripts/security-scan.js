#!/usr/bin/env node
/**
 * Security & QA Scanner for АвтоТема (https://avtotema-news.online)
 * Detects secrets, dangerous DOM sinks, XSS vulnerabilities, and syntax issues.
 * Usage:
 *   node security-scan.js
 *   node security-scan.js path/to/file.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const targetArg = process.argv[2];

const IGNORE_DIRS = new Set(['.git', 'node_modules', '.github']);
const SCANNABLE_EXTS = new Set(['.js', '.html', '.json', '.yml', '.yaml', '.sh']);

const SECRET_PATTERNS = [
  { name: 'Telegram Bot Token', regex: /bot\d{8,12}:[A-Za-z0-9_-]{35}/ },
  { name: 'GitHub Personal Token', regex: /gh[pousr]_[0-9a-zA-Z]{36}/ },
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: 'Private Key Block', regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/ },
  { name: 'Hardcoded Password/Secret', regex: /(?:password|secret|api_key|apikey|auth_token)\s*[:=]\s*["'][A-Za-z0-9_\-\.!@#$%^&*]{10,}["']/i }
];

const DANGEROUS_DOM_PATTERNS = [
  { name: 'Unsafe innerHTML assignment with dynamic variable', regex: /\.innerHTML\s*=\s*(?:[a-zA-Z0-9_$.]+|\`[^`]*\${)/ },
  { name: 'Direct document.write invocation', regex: /document\.write\s*\(/ },
  { name: 'Dangerous eval() call', regex: /\beval\s*\(/ },
  { name: 'Dynamic new Function execution', regex: /new\s+Function\s*\(/ }
];

function collectFiles(dir) {
  const results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (IGNORE_DIRS.has(item)) continue;
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results.push(...collectFiles(fullPath));
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (SCANNABLE_EXTS.has(ext)) {
            results.push(fullPath);
          }
        }
      } catch (e) {
        // Skip inaccessible files
      }
    }
  } catch (e) {
    // Directory not accessible
  }
  return results;
}

function scanFile(filePath) {
  const relPath = path.relative(rootDir, filePath);
  const issues = [];
  const warnings = [];

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return { relPath, issues: [`Cannot read file: ${err.message}`], warnings: [] };
  }

  // 1. Secret Scanning
  for (const { name, regex } of SECRET_PATTERNS) {
    // Ignore self-references inside this scanner or test scripts
    if (relPath.includes('security-scan.js') || relPath.includes('SKILL.md')) continue;

    const gRegex = new RegExp(regex.source, (regex.flags || '') + (regex.flags && regex.flags.includes('g') ? '' : 'g'));
    const matches = content.matchAll(gRegex);
    for (const match of matches) {
      const matchStr = match[0];
      // Ignore known localStorage key identifiers like 'at_yt_secret' or 'at_admin_token'
      if (/["'](?:at_|tg_)[a-z0-9_]+["']/i.test(matchStr)) continue;
      issues.push(`POTENTIAL LEAK [${name}]: "${matchStr.slice(0, 15)}..." detected.`);
    }
  }

  // 2. DOM XSS / Insecure APIs (JS and HTML files)
  if (filePath.endsWith('.js') || filePath.endsWith('.html')) {
    // Exclude security scanner itself
    if (!relPath.includes('security-scan.js')) {
      for (const { name, regex } of DANGEROUS_DOM_PATTERNS) {
        const match = content.match(regex);
        if (match) {
          warnings.push(`DOM SINK [${name}]: Found "${match[0].slice(0, 35)}..."`);
        }
      }
    }
  }

  // 3. Insecure external resources (HTTP inside HTTPS)
  const httpMatches = content.match(/src=["']http:\/\/[^"']+["']/gi) || [];
  for (const httpMatch of httpMatches) {
    // Allow localhost/127.0.0.1
    if (!httpMatch.includes('localhost') && !httpMatch.includes('127.0.0.1')) {
      warnings.push(`MIXED CONTENT: Insecure HTTP resource "${httpMatch}"`);
    }
  }

  return { relPath, issues, warnings };
}

function main() {
  let filesToScan = [];
  if (targetArg) {
    const targetPath = path.resolve(rootDir, targetArg);
    if (fs.existsSync(targetPath)) {
      if (fs.statSync(targetPath).isDirectory()) {
        filesToScan = collectFiles(targetPath);
      } else {
        filesToScan = [targetPath];
      }
    } else {
      console.error(`Target not found: ${targetArg}`);
      process.exit(1);
    }
  } else {
    filesToScan = collectFiles(rootDir);
  }

  console.log(`\n======================================================`);
  console.log(`  🛡️  SECURITY & QA SCANNER: Auditing ${filesToScan.length} file(s)...`);
  console.log(`======================================================\n`);

  let totalIssues = 0;
  let totalWarnings = 0;

  for (const file of filesToScan) {
    const result = scanFile(file);
    if (result.issues.length > 0 || result.warnings.length > 0) {
      const icon = result.issues.length > 0 ? '❌' : '⚠️';
      console.log(`${icon} ${result.relPath}`);
      result.issues.forEach(msg => {
        totalIssues++;
        console.log(`   [CRITICAL] ${msg}`);
      });
      result.warnings.forEach(msg => {
        totalWarnings++;
        console.log(`   [WARNING]  ${msg}`);
      });
      console.log('');
    }
  }

  console.log(`------------------------------------------------------`);
  console.log(`Scan completed: ${filesToScan.length} files audited.`);
  console.log(`Critical Vulnerabilities: ${totalIssues} | Warnings: ${totalWarnings}`);
  console.log(`------------------------------------------------------\n`);

  if (totalIssues > 0) {
    console.error('FAILED: Critical security issues must be resolved before commit!');
    process.exitCode = 1;
  } else {
    console.log('✅ Security scan PASSED. Zero critical leaks detected.');
  }
}

main();
