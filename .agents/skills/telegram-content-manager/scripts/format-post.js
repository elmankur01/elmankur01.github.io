#!/usr/bin/env node
/**
 * Telegram Post Formatter & Validator for @avtotema_news
 * Usage:
 *   node format-post.js post.txt
 *   echo "Post text..." | node format-post.js
 */

const fs = require('fs');

const inputArg = process.argv[2];

function getPostContent() {
  if (inputArg && fs.existsSync(inputArg)) {
    return fs.readFileSync(inputArg, 'utf8');
  }
  // Try reading from stdin if available synchronously
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return null;
  }
}

function validateTelegramPost(text) {
  const issues = [];
  const warnings = [];
  const charCount = text.length;

  // 1. Length validation
  if (charCount > 4096) {
    issues.push(`Post exceeds Telegram maximum limit of 4096 characters (Current: ${charCount})`);
  } else if (charCount > 1024) {
    warnings.push(`Post is ${charCount} chars. Note: Photo caption limit is 1024 chars (fine for standalone text post).`);
  }

  // 2. Link to portal
  if (!text.includes('avtotema-news.online')) {
    warnings.push('Post does not contain a link to https://avtotema-news.online');
  }

  // 3. Hashtags check
  const hashtags = text.match(/#[A-Za-zА-Яа-я0-9_]+/g);
  if (!hashtags || hashtags.length === 0) {
    warnings.push('No hashtags found (recommended: #АвтоТема #[Марка] #новости)');
  }

  // 4. Check unclosed basic HTML tags if HTML is used
  const tags = ['b', 'i', 'code', 'pre', 'a', 'blockquote'];
  for (const tag of tags) {
    const openCount = (text.match(new RegExp(`<${tag}(?:\\s+[^>]*)?>`, 'gi')) || []).length;
    const closeCount = (text.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (openCount !== closeCount) {
      issues.push(`Mismatched <${tag}> tags (Opened: ${openCount}, Closed: ${closeCount})`);
    }
  }

  return { charCount, issues, warnings, hashtags: hashtags || [] };
}

function main() {
  const content = getPostContent();
  if (!content || !content.trim()) {
    console.log('Usage: node format-post.js <file-path>');
    console.log('Or pipe content: cat post.txt | node format-post.js');
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`  📱 TELEGRAM POST VALIDATOR (@avtotema_news)`);
  console.log(`======================================================\n`);

  const report = validateTelegramPost(content);

  console.log(`📊 Metrics:`);
  console.log(`- Characters: ${report.charCount}`);
  console.log(`- Fits Photo Caption (<=1024): ${report.charCount <= 1024 ? '✅ YES' : '⚠️ NO (Text post only)'}`);
  console.log(`- Hashtags found (${report.hashtags.length}): ${report.hashtags.join(' ') || 'None'}`);
  console.log('');

  if (report.issues.length > 0) {
    console.log(`❌ Critical Issues:`);
    report.issues.forEach(i => console.log(`   - ${i}`));
  }
  if (report.warnings.length > 0) {
    console.log(`⚠️ Warnings / Suggestions:`);
    report.warnings.forEach(w => console.log(`   - ${w}`));
  }
  if (report.issues.length === 0 && report.warnings.length === 0) {
    console.log('✅ Post is fully valid and ready for publishing!');
  }

  console.log(`\n--- PREVIEW -------------------------------------------`);
  console.log(content.trim());
  console.log(`-------------------------------------------------------\n`);

  if (report.issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
