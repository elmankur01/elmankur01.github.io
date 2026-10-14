---
name: seo-auditor
description: Audit web pages, articles, hub catalogs, and sitemap.xml for SEO compliance, Search Console errors, Schema.org structured data, and Open Graph tags. Trigger when asked to "audit SEO", "check sitemap", "fix Search Console errors", "verify metadata", or "optimize for search engines".
metadata:
  author: AvtoTema Team
  version: "1.0.0"
---

# SEO Auditor & Search Console Quality Skill

Specialized skill for comprehensive Search Engine Optimization (SEO) auditing of **АвтоТема** (`avtotema-news.online`), ensuring 100% indexing in Google Search Console and Yandex Webmaster.

## Audit Workflow

When auditing any page or the entire site, execute this checklist:

### 1. Meta Tags & Head Invariants
- **`<title>`**: Unique, format: `Заголовок статьи | АвтоТема` (up to 70 characters).
- **`<meta name="description">`**: 140–160 characters, compelling summary without boilerplate repetition.
- **`<link rel="canonical">`**: Absolute URL (`https://avtotema-news.online/...`), must strictly match the served URL without trailing slash or redirection loops.
- **`<meta name="robots" content="index, follow">`**: Present on all public content.
- **Favicons & Manifest**: SVG, PNG 32x32, ICO, Apple Touch Icon, and `/manifest.json`.

### 2. Open Graph & Social Cards
- `og:type`: `article` for articles, `website` for home and hubs.
- `og:title`, `og:description`, `og:url` (absolute), `og:site_name` ("АвтоТема"), `og:locale` ("ru_RU").
- `og:image`: High-resolution 1200x675 (16:9 ratio). Must be an absolute URL (`https://avtotema-news.online/images/...`).
- `twitter:card`: `summary_large_image`.

### 3. Structured Data (Schema.org JSON-LD)
Validate that all pages contain valid JSON-LD:
- **Articles**: `@type: "Article"`, `headline`, `description`, `image`, `datePublished` (ISO 8601), `inLanguage: "ru"`, `mainEntityOfPage`, `publisher`.
- **Breadcrumbs**: `@type: "BreadcrumbList"` with sequential `ListItem` positions starting from 1.
- **Brand Pages**: `@type: "Brand"`, `name`, `description`, `url`.

### 4. Sitemap & Robots.txt Integrity
- **`sitemap.xml`**:
  - Run XML validation: `xmllint --noout sitemap.xml`.
  - Must only contain canonical, 200 OK URLs (no 404s, no redirects).
  - All `<loc>` tags must begin with `https://avtotema-news.online/`.
- **`robots.txt`**:
  - `User-agent: *` followed by `Allow: /`.
  - Disallow Yandex separate render bot: `User-agent: YandexRenderResourcesBot`, `Disallow: /` (since the site is 100% static pre-rendered HTML).
  - Valid `Sitemap: https://avtotema-news.online/sitemap.xml` declaration.
  - No unsupported directives for Googlebot (e.g. avoid unsupported `Host:` header).

### 5. Content Quality & EEAT
- Minimum 4–5 substantive paragraphs per article (0 boilerplate sentences).
- Breadcrumbs with back navigation (`← Назад`).
- Proper heading hierarchy (`<h1>` unique, followed by `<h2>`, `<h3>`).
- All images must have informative `alt="..."` descriptions and licensing attribution.

## Automated Audit Script

Run the automated SEO scanner directly via Node.js:

```bash
# Audit specific article:
node .agents/skills/seo-auditor/scripts/audit-seo.js articles/some-article.html

# Audit index.html:
node .agents/skills/seo-auditor/scripts/audit-seo.js index.html

# Audit all pages site-wide:
node .agents/skills/seo-auditor/scripts/audit-seo.js
```

