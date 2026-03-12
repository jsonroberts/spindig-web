const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || 'ulGiPyTAJGoXAGDkiVVvLAKOMkDYaLbmnFzereiF';
const DISCOGS_BASE = 'https://api.discogs.com';
const USER_AGENT = 'SpindigWeb/1.0 +https://digspindig.com';
const APP_STORE_URL = 'https://apps.apple.com/app/spindig/id6759798846';
const DOMAIN = 'https://digspindig.com';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sharedStyles() {
  return `
    :root {
      --bg-base: #0d0d0d;
      --bg-elevated: #151515;
      --bg-surface: #1a1a1a;
      --bg-border: #1f1f1f;
      --text-primary: #f5f5f5;
      --text-secondary: #a0a0a0;
      --text-tertiary: #6a6a6a;
      --text-muted: #4a4a4a;
      --text-disabled: #3a3a3a;
      --accent: #CC6B2C;
      --font-display: 'Space Grotesk', sans-serif;
      --font-body: 'Inter', sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .album-art {
      width: 280px;
      height: 280px;
      border-radius: 20px;
      object-fit: cover;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      display: block;
      margin: 0 auto;
      background: var(--bg-elevated);
    }
    .album-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 26px;
      letter-spacing: -0.5px;
      line-height: 1.3;
      margin-top: 28px;
    }
    .artist-name {
      font-family: var(--font-body);
      font-weight: 500;
      font-size: 17px;
      color: var(--text-secondary);
      margin-top: 6px;
      letter-spacing: 0.1px;
    }
    .meta {
      font-size: 14px;
      color: var(--text-tertiary);
      margin-top: 8px;
    }
    .genre-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
    }
    .genre-tag {
      background: var(--bg-surface);
      border: 1px solid var(--bg-border);
      border-radius: 16px;
      padding: 6px 14px;
      font-size: 13px;
      color: var(--text-secondary);
      font-family: var(--font-body);
    }
    .buttons {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    .btn {
      display: block;
      width: 100%;
      max-width: 300px;
      padding: 16px 36px;
      border-radius: 32px;
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      text-align: center;
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }
    .btn-open {
      background: var(--accent);
      color: #fff;
    }
    .btn-open:hover {
      background: #b85e26;
      box-shadow: 0 8px 32px rgba(204, 107, 44, 0.25);
    }
    .btn-download {
      background: var(--bg-surface);
      border: 1px solid var(--bg-border);
      color: var(--text-primary);
      font-size: 15px;
      padding: 14px 32px;
    }
    .btn-download:hover {
      background: #222;
    }
    .logo-footer {
      margin-top: 48px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 20px;
      color: var(--text-disabled);
      letter-spacing: -0.5px;
    }
    .logo-footer a {
      color: inherit;
      text-decoration: none;
    }
    .logo-footer a:hover {
      color: var(--text-muted);
    }
    /* Vinyl fallback */
    .vinyl-container {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }
    .vinyl-record {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      background:
        radial-gradient(circle at center,
          var(--accent) 0%, var(--accent) 11%,
          #1a1a1a 11%, #1a1a1a 12.5%,
          #111 12.5%, #0f0f0f 14%,
          #131313 14%, #111 15.5%,
          #0f0f0f 15.5%, #131313 17%,
          #111 17%, #0f0f0f 18.5%,
          #131313 18.5%, #111 20%,
          #0f0f0f 20%, #131313 21.5%,
          #111 21.5%, #0f0f0f 23%,
          #131313 23%, #111 24.5%,
          #0f0f0f 24.5%, #131313 26%,
          #111 26%, #0f0f0f 27.5%,
          #131313 27.5%, #111 29%,
          #0f0f0f 29%, #131313 30.5%,
          #111 30.5%, #0f0f0f 32%,
          #131313 32%, #111 33.5%,
          #0f0f0f 33.5%, #131313 35%,
          #111 35%, #0f0f0f 36.5%,
          #131313 36.5%, #111 38%,
          #0f0f0f 38%, #131313 39.5%,
          #111 39.5%, #0f0f0f 41%,
          #131313 41%, #111 42.5%,
          #0f0f0f 42.5%, #131313 44%,
          #111 44%, #0f0f0f 45.5%,
          #131313 45.5%, #0d0d0d 48%
        ),
        radial-gradient(circle at center,
          transparent 47%, #1a1a1a 47%, #1a1a1a 49%, #0d0d0d 49%
        ),
        radial-gradient(circle at center, #111 0%, #0a0a0a 100%);
      box-shadow: 0 0 0 2px #1a1a1a, 0 16px 48px rgba(0, 0, 0, 0.5);
      animation: spin 6s linear infinite;
    }
    .vinyl-record::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.02) 100%);
    }
    .vinyl-record::before {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--bg-base);
      z-index: 2;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .vinyl-record { animation: none; }
    }
  `;
}

function renderRecordPage({ slug, title, artist, year, imageUrl, genres, label }) {
  const pageUrl = `${DOMAIN}/record/${escapeHtml(slug)}`;
  const ogDescription = [artist, year, label].filter(Boolean).join(' \u00B7 ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} by ${escapeHtml(artist)} — Spindig</title>
  <meta name="description" content="${escapeHtml(title)} by ${escapeHtml(artist)}. Shared via Spindig — curated vinyl discovery.">

  <meta property="og:title" content="${escapeHtml(title)} — ${escapeHtml(artist)}">
  <meta property="og:description" content="${escapeHtml(ogDescription || 'Shared via Spindig')}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">` : ''}
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="music.album">
  <meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">
  <meta name="twitter:title" content="${escapeHtml(title)} — ${escapeHtml(artist)}">
  <meta name="twitter:description" content="Shared via Spindig">
  ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : ''}

  <meta name="apple-itunes-app" content="app-id=6759798846, app-argument=${pageUrl}">

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230d0d0d'/><circle cx='50' cy='50' r='44' fill='%23111' stroke='%231a1a1a' stroke-width='1'/><circle cx='50' cy='50' r='18' fill='%230d0d0d' stroke='%23222' stroke-width='1'/><circle cx='50' cy='50' r='5' fill='%23CC6B2C'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>${sharedStyles()}</style>
</head>
<body>
  <div class="container">
    ${imageUrl
      ? `<img class="album-art" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)} album art" loading="eager">`
      : '<div class="vinyl-container"><div class="vinyl-record"></div></div>'}
    <h1 class="album-title">${escapeHtml(title)}</h1>
    <p class="artist-name">${escapeHtml(artist)}</p>
    ${year || label ? `<p class="meta">${[year, label].filter(Boolean).join(' \u00B7 ')}</p>` : ''}
    ${genres && genres.length ? `<div class="genre-tags">${genres.map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join('')}</div>` : ''}
    <div class="buttons">
      <a class="btn btn-open" href="${pageUrl}">Open in Spindig</a>
      <a class="btn btn-download" href="${APP_STORE_URL}">Download on the App Store</a>
    </div>
    <div class="logo-footer"><a href="${DOMAIN}">spindig</a></div>
  </div>
</body>
</html>`;
}

function renderFallbackPage(slug) {
  const prettyName = slug
    ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'A Record';
  const pageUrl = slug ? `${DOMAIN}/record/${escapeHtml(slug)}` : DOMAIN;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(prettyName)} — Spindig</title>
  <meta name="description" content="Someone shared a record with you on Spindig — curated vinyl discovery.">

  <meta property="og:title" content="${escapeHtml(prettyName)} — Shared via Spindig">
  <meta property="og:description" content="Curated vinyl discovery. Swipe through handpicked records, preview tracks, find where to buy.">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="music.album">
  <meta name="twitter:card" content="summary">

  <meta name="apple-itunes-app" content="app-id=6759798846, app-argument=${pageUrl}">

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230d0d0d'/><circle cx='50' cy='50' r='44' fill='%23111' stroke='%231a1a1a' stroke-width='1'/><circle cx='50' cy='50' r='18' fill='%230d0d0d' stroke='%23222' stroke-width='1'/><circle cx='50' cy='50' r='5' fill='%23CC6B2C'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>${sharedStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="vinyl-container"><div class="vinyl-record"></div></div>
    <h1 class="album-title">Someone shared a record with you</h1>
    <p class="artist-name">${escapeHtml(prettyName)}</p>
    <div class="buttons">
      <a class="btn btn-open" href="${pageUrl}">Open in Spindig</a>
      <a class="btn btn-download" href="${APP_STORE_URL}">Download on the App Store</a>
    </div>
    <div class="logo-footer"><a href="${DOMAIN}">spindig</a></div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.searchParams.get('id') || req.query?.id;
  const discogsId = url.searchParams.get('d') || req.query?.d;

  if (!discogsId) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(renderFallbackPage(slug));
  }

  let release = null;
  try {
    const response = await fetch(`${DISCOGS_BASE}/releases/${discogsId}`, {
      headers: {
        'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
        'User-Agent': USER_AGENT,
      },
    });
    if (response.ok) {
      release = await response.json();
    }
  } catch {
    // Fall through to fallback
  }

  if (!release) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(renderFallbackPage(slug));
  }

  const title = release.title || 'Unknown Album';
  const artist = release.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
  const year = release.year;
  const primaryImage = release.images?.find(i => i.type === 'primary');
  const imageUrl = primaryImage?.uri || release.images?.[0]?.uri || '';
  const genres = [...(release.genres || []), ...(release.styles || [])].slice(0, 4);
  const label = release.labels?.[0]?.name;

  const html = renderRecordPage({ slug, title, artist, year, imageUrl, genres, label });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
