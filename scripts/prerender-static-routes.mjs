// scripts/prerender-static-routes.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIST_BROWSER = path.resolve('dist/wwm-helper/browser');
const BASE = 'https://besaids.github.io/WWM-Helper';
const DEFAULT_IMAGE = `${BASE}/assets/portal/wwm-logo.png`;

const ROUTES = {
  'home': {
    title: 'WWM Helper – Where Winds Meet Timers, Checklists, Guides & Tools',
    description:
      'Unofficial Where Winds Meet companion; track resets, events, seasonal goals, and keep your own checklists. Runs in your browser; no login.',
  },
  'timers': {
    title: 'WWM Timers – Daily, Weekly, Events; WWM Helper',
    description:
      'Reset timers for Where Winds Meet; daily/weekly cycles, event windows, and configurable schedules so you stop missing activities.',
  },
  'checklist': {
    title: 'WWM Checklists – Dailies, Weeklies, Seasonal; WWM Helper',
    description:
      'Track dailies, weeklies, seasonal goals, and custom tasks; pin what matters; hide noise; keep your run clean.',
  },
  'map': {
    title: 'WWM Map – Interactive Links & Tracking; WWM Helper',
    description: 'Map helpers and quick navigation for Where Winds Meet points of interest and farming routes.',
  },
  'guides': {
    title: 'WWM Guides – Trading, Boss Talents, Seasonal Paths; WWM Helper',
    description: 'Practical guides for Where Winds Meet systems; trading, seasonal paths, boss talents, mystic skills, and more.',
  },
  'guides/boss-talents': {
    title: 'Boss Talents Guide (Blade Out); WWM Helper',
    description: 'Seasonal boss talent challenges for Sword Trial and Hero’s Realm; track requirements, rewards, and completion.',
  },
  'guides/chess-wins': {
    title: 'Chinese Chess Wins Guide; WWM Helper',
    description: 'Guide for winning Chinese Chess encounters in Where Winds Meet; patterns, setups, and practical tips.',
  },
  'guides/multi-day-rewards': {
    title: 'Multi-day Rewards Guide; WWM Helper',
    description: 'What resets when; how multi-day rewards work in Where Winds Meet; plan ahead and avoid waste.',
  },
  'guides/trading': {
    title: 'Trading Guide; WWM Helper',
    description: 'Trading routes, reset logic, and practical strategy for Where Winds Meet trading; optimize coins and time.',
  },
  'guides/path-season': {
    title: 'Seasonal Path Challenges Guide; WWM Helper',
    description: 'Requirements and rewards for seasonal Path challenges; clear steps, unlock notes, and completion tracking.',
  },
  'guides/mystic-skill-materials': {
    title: 'Mystic Skill Materials Farming Guide; WWM Helper',
    description: 'How to gather mystic skill upgrade materials efficiently; what matters, where to look, and how to track nodes.',
  },
  'guides/mystic-metrics': {
    title: 'Mystic Skill Damage Metrics; WWM Helper',
    description: 'Compare mystic skills by DPS, damage per Vitality, and efficiency; pin skills for side-by-side charts.',
  },
  'tools': {
    title: 'WWM Tools Hub; WWM Helper',
    description: 'Utility tools for Where Winds Meet; chess helper, planners, and quality-of-life utilities.',
  },
  'tools/chinese-chess': {
    title: 'Chinese Chess Tool; WWM Helper',
    description: 'Practice and solve Chinese Chess positions; helper tool built for Where Winds Meet players.',
  },
  'tools/mystic-upgrade-planner': {
    title: 'Mystic Upgrade Planner; WWM Helper',
    description: 'Plan mystic upgrades and required materials; reduce guesswork; keep your progression structured.',
  },
  'tools/settings': {
    title: 'Import/Export Settings; WWM Helper',
    description: 'Export and import your timers and checklist setup; keep your config safe; move between devices easily.',
  },
  'privacy': {
    title: 'Privacy; WWM Helper',
    description: 'Privacy details; what data is stored locally, what analytics are collected, and how consent works.',
  },
  '404': {
    title: '404 – Page not found | WWM Helper',
    description: 'This page does not exist. Use Home, Guides, or Tools to navigate.',
  }
};

function mustRead(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function setTag(html, { name, property, content }) {
  const attr = name ? `name="${name}"` : `property="${property}"`;
  const re = new RegExp(`<meta\\s+${attr}[^>]*>`, 'i');

  const tag = `<meta ${name ? `name="${name}"` : `property="${property}"`} content="${escapeHtml(content)}" />`;

  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function setCanonical(html, href) {
  const re = /<link\s+rel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function setTitle(html, title) {
  const re = /<title>[\s\S]*?<\/title>/i;
  const tag = `<title>${escapeHtml(title)}</title>`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function canonicalForRoute(routePath) {
  // Standardize on trailing-slash canonical URLs (matches GitHub Pages folder URLs).
  if (!routePath || routePath === '/') return `${BASE}/`;

  const cleaned = String(routePath).replace(/^\/+/, '').replace(/\/+$/, '');
  return `${BASE}/${cleaned}/`;
}


function writeRouteIndex(routePath, baseIndexHtml, seo) {
  const outDir = path.join(DIST_BROWSER, routePath);
  ensureDir(outDir);

  const canonical = canonicalForRoute(routePath);
  let html = baseIndexHtml;

  html = setTitle(html, seo.title);
  html = setTag(html, { name: 'description', content: seo.description });

  html = setCanonical(html, canonical);

  html = setTag(html, { property: 'og:title', content: seo.title });
  html = setTag(html, { property: 'og:description', content: seo.description });
  html = setTag(html, { property: 'og:url', content: canonical });
  html = setTag(html, { property: 'og:image', content: DEFAULT_IMAGE });

  html = setTag(html, { name: 'twitter:title', content: seo.title });
  html = setTag(html, { name: 'twitter:description', content: seo.description });
  html = setTag(html, { name: 'twitter:image', content: DEFAULT_IMAGE });

  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

function main() {
  const indexPath = path.join(DIST_BROWSER, 'index.html');
  const baseIndexHtml = mustRead(indexPath);

  // Root entry; keep as-is but ensure canonical root.
  const rootCanonical = `${BASE}/`;
  let rootHtml = baseIndexHtml;
  rootHtml = setCanonical(rootHtml, rootCanonical);
  fs.writeFileSync(indexPath, rootHtml, 'utf8');

  for (const [routePath, seo] of Object.entries(ROUTES)) {
    writeRouteIndex(routePath, rootHtml, seo);
  }

  console.log(`[prerender-static] wrote ${Object.keys(ROUTES).length} route index.html files`);
}

main();
