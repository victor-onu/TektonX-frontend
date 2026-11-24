// Runs after `vite build`. Search engines, AI assistants and link previews
// read raw HTML, and an empty <div id="root"> tells them nothing, so this
// writes each public page as its own HTML file with its real content and tags,
// plus robots.txt, sitemap.xml, llms.txt and a 404 page. Visitors still get the
// same React app: main.tsx takes over #root on load.
import fs from 'node:fs'
import path from 'node:path'
import { PUBLIC_PAGES, APP_PATHS, SITE_URL, render } from '../.prerender/entry-prerender.js'

const dist = path.resolve('dist')
const shells = Object.fromEntries(
  [...new Set(PUBLIC_PAGES.map((p) => p.shell))].map((s) => [s, fs.readFileSync(path.join(dist, s), 'utf8')]),
)

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Function replacements throughout: rendered HTML can contain `$&`-style text.
function swap(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in the HTML shell`)
  return html.replace(pattern, () => replacement)
}

function setTags(html, { title, description, url }) {
  const t = escapeHtml(title)
  const d = escapeHtml(description)
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`)
  html = swap(html, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`)
  html = swap(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`)
  html = swap(html, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`)
  html = swap(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
  html = swap(html, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`)
  return swap(html, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`)
}

const addToHead = (html, tag) => swap(html, /<\/head>/, `  ${tag}\n  </head>`)

function write(file, text) {
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, text)
}

const pageFile = (p) => (p === '/' ? 'index.html' : `${p.slice(1)}/index.html`)

for (const page of PUBLIC_PAGES) {
  const url = SITE_URL + page.path
  const body = render(page.path)
  if (body.length < 500 || body.includes('PAGE NOT FOUND')) {
    throw new Error(`prerender: ${page.path} did not render. Is its route in App.tsx?`)
  }
  let html = shells[page.shell]
  if (!page.keepShellTags) html = setTags(html, { ...page, url })
  html = addToHead(html, `<link rel="canonical" href="${url}" />`)
  html = swap(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`)
  write(pageFile(page.path), html)
}

// App screens and unknown addresses get the empty shell, kept out of search.
const appShell = addToHead(
  swap(shells['index.html'], /<title>[^<]*<\/title>/, '<title>TektonX</title>'),
  '<meta name="robots" content="noindex" />',
)
write('app-shell/index.html', appShell)
write('404.html', appShell)

write(
  'robots.txt',
  // No Disallow: crawlers must be able to fetch app pages to see their noindex.
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    PUBLIC_PAGES.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>\n`).join('') +
    `</urlset>\n`,
)

const link = (p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.description}`
const isApp = (p) => p.path.startsWith('/mindfulscroll')
write(
  'llms.txt',
  `# TektonX\n\n> ${PUBLIC_PAGES[0].description}\n\nMindfulScroll is a separate Android app, credited to TektonX, with its own pages below.\n\n` +
    `## TektonX\n\n${PUBLIC_PAGES.filter((p) => !isApp(p)).map(link).join('\n')}\n\n` +
    `## MindfulScroll\n\n${PUBLIC_PAGES.filter(isApp).map(link).join('\n')}\n`,
)

// A page with no rewrite would 404 in production, so fail the build instead.
const rewrites = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).rewrites
for (const p of PUBLIC_PAGES) {
  if (p.path === '/') continue
  const rule = rewrites.find((r) => r.source === p.path)
  if (rule?.destination !== `/${pageFile(p.path)}`) throw new Error(`prerender: vercel.json has no rewrite for ${p.path}`)
}
for (const source of APP_PATHS) {
  const rule = rewrites.find((r) => r.source === source)
  if (rule?.destination !== '/app-shell/index.html') throw new Error(`prerender: vercel.json has no rewrite for ${source}`)
}

console.log(`prerendered ${PUBLIC_PAGES.length} pages`)
