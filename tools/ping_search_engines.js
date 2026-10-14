#!/usr/bin/env node
/**
 * Automated Search Engine Ping Tool for АвтоТема
 * Notifies Google and Yandex when sitemap.xml or new articles are updated.
 * Usage:
 *   node tools/ping_search_engines.js
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://avtotema-news.online';
const SITEMAP_URL = `${SITE}/sitemap.xml`;

async function pingGoogle() {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const res = await fetch(url);
    console.log(`[Google Ping] Status: ${res.status} (${res.status === 200 ? 'OK' : 'Noticed'})`);
    return true;
  } catch (err) {
    console.log(`[Google Ping] Note: ${err.message}`);
    return false;
  }
}

async function pingYandex() {
  const url = `https://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  try {
    const res = await fetch(url);
    console.log(`[Yandex Ping] Status: ${res.status} (${res.status === 200 ? 'OK' : 'Noticed'})`);
    return true;
  } catch (err) {
    console.log(`[Yandex Ping] Note: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`  🚀 SEARCH ENGINE PING: Notifying search indexers...`);
  console.log(`  Sitemap: ${SITEMAP_URL}`);
  console.log(`======================================================\n`);

  await pingGoogle();
  await pingYandex();

  console.log(`\n✅ Пинг поисковых систем завершён.`);
}

main().catch(err => {
  console.error('Ping error:', err.message);
});
