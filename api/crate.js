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

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.searchParams.get('id') || req.query?.id || '';

  const crateName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const pageUrl = `${DOMAIN}/crate/${escapeHtml(slug)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(crateName)} — Spindig</title>
  <meta name="description" content="${escapeHtml(crateName)} — a curated vinyl crate on Spindig.">

  <meta property="og:title" content="${escapeHtml(crateName)} — A Spindig Crate">
  <meta property="og:description" content="A curated vinyl crate on Spindig. Open to start digging.">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="music.playlist">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(crateName)} — A Spindig Crate">
  <meta name="twitter:description" content="A curated vinyl crate on Spindig.">

  <meta name="apple-itunes-app" content="app-id=6759798846, app-argument=${pageUrl}">

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230d0d0d'/><circle cx='50' cy='50' r='44' fill='%23111' stroke='%231a1a1a' stroke-width='1'/><circle cx='50' cy='50' r='18' fill='%230d0d0d' stroke='%23222' stroke-width='1'/><circle cx='50' cy='50' r='5' fill='%23CC6B2C'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

  <style>
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
    .crate-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 26px;
      letter-spacing: -0.5px;
      line-height: 1.3;
      margin-top: 28px;
    }
    .crate-subtitle {
      font-family: var(--font-body);
      font-weight: 500;
      font-size: 16px;
      color: var(--text-secondary);
      margin-top: 8px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="vinyl-container"><div class="vinyl-record"></div></div>
    <h1 class="crate-title">${escapeHtml(crateName)}</h1>
    <p class="crate-subtitle">A curated crate on Spindig</p>
    <div class="buttons">
      <a class="btn btn-open" href="${pageUrl}">Open in Spindig</a>
      <a class="btn btn-download" href="${APP_STORE_URL}">Download on the App Store</a>
    </div>
    <div class="logo-footer"><a href="${DOMAIN}">spindig</a></div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(html);
}
