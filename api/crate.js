import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const APP_STORE_URL = 'https://apps.apple.com/app/spindig/id6759798846';
const DOMAIN = 'https://digspindig.com';
const EBAY_CAMPAIGN_ID = process.env.EBAY_CAMPAIGN_ID || '';
const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || '';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

function generateBuyUrls(artist, title, discogsReleaseId) {
  const query = encodeURIComponent(`${artist} ${title} vinyl`);
  const bandcampQuery = encodeURIComponent(`${artist} ${title}`);
  return {
    bandcamp: `https://bandcamp.com/search?q=${bandcampQuery}&item_type=a`,
    discogs: discogsReleaseId
      ? `https://www.discogs.com/sell/release/${discogsReleaseId}`
      : `https://www.discogs.com/search/?q=${encodeURIComponent(`${artist} ${title}`)}&type=release&format=Vinyl`,
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${query}&_sacat=176985${EBAY_CAMPAIGN_ID ? `&campid=${EBAY_CAMPAIGN_ID}&toolid=10001&mkevt=1` : ''}`,
    amazon: `https://www.amazon.com/s?k=${query}&i=music${AMAZON_AFFILIATE_TAG ? `&tag=${AMAZON_AFFILIATE_TAG}` : ''}`,
  };
}

function renderRecordCard(record, index) {
  const buyUrls = generateBuyUrls(record.artist, record.title, record.discogsReleaseId);
  const hasImage = record.coverImageUrl && !record.coverImageUrl.includes('spacer.gif');

  return `
    <div class="record-card">
      <div class="record-inner">
        ${hasImage
          ? `<img class="record-cover" src="${escapeHtml(record.coverImageUrl)}" alt="${escapeHtml(record.title)}" loading="${index < 4 ? 'eager' : 'lazy'}">`
          : `<div class="record-cover record-cover-empty"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></div>`
        }
        <div class="record-info">
          <h3 class="record-title">${escapeHtml(record.title)}</h3>
          <p class="record-artist">${escapeHtml(record.artist)}</p>
          ${record.year ? `<span class="record-year">${record.year}</span>` : ''}
          <div class="record-actions">
            <button class="btn-preview" onclick="togglePreview(this, '${escapeJs(record.artist)}', '${escapeJs(record.title)}')" aria-label="Preview ${escapeHtml(record.title)}">
              <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              <svg class="icon-stop" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              <span>Preview</span>
            </button>
            <details class="buy-details">
              <summary class="btn-buy">Buy Vinyl</summary>
              <div class="buy-links">
                <a href="${escapeHtml(buyUrls.bandcamp)}" target="_blank" rel="noopener">Bandcamp</a>
                <a href="${escapeHtml(buyUrls.discogs)}" target="_blank" rel="noopener">Discogs</a>
                <a href="${escapeHtml(buyUrls.ebay)}" target="_blank" rel="noopener">eBay</a>
                <a href="${escapeHtml(buyUrls.amazon)}" target="_blank" rel="noopener">Amazon</a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>`;
}

function renderFullCratePage(crate, slug) {
  const pageUrl = `${DOMAIN}/crate/${escapeHtml(slug)}`;
  const records = crate.records || [];
  const ogImageUrl = `${DOMAIN}/api/og-image?slug=${encodeURIComponent(slug)}`;
  const fallbackOgImage = crate.cover_image_url || records[0]?.coverImageUrl || '';
  const ogImage = ogImageUrl;

  const ogDescription = crate.description
    || `${crate.record_count} records curated${crate.creator_display_name ? ` by ${crate.creator_display_name}` : ''} on Spindig`;

  const recordCards = records.map((r, i) => renderRecordCard(r, i)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(crate.name)} — Spindig</title>
  <meta name="description" content="${escapeHtml(ogDescription)}">

  <meta property="og:title" content="${escapeHtml(crate.name)} — A Spindig Crate">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="music.playlist">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(crate.name)} — A Spindig Crate">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">

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
    }

    .page {
      max-width: 680px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* ===== HEADER ===== */
    .crate-header {
      padding: 60px 0 32px;
      text-align: center;
    }

    .crate-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 32px;
      letter-spacing: -1px;
      line-height: 1.2;
      color: var(--text-primary);
    }

    .crate-description {
      font-family: var(--font-body);
      font-style: italic;
      color: var(--text-secondary);
      font-size: 16px;
      line-height: 1.6;
      margin: 16px auto 0;
      max-width: 480px;
      border-left: 3px solid var(--accent);
      padding-left: 16px;
      text-align: left;
    }

    .crate-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--text-tertiary);
    }

    .crate-meta .dot {
      color: var(--text-muted);
    }

    .crate-creator {
      color: var(--text-secondary);
    }

    .shop-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .shop-name {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .verified-icon {
      color: var(--accent);
      flex-shrink: 0;
    }

    .shop-location {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .vibe-tags {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .vibe-tag {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--accent);
      border: 1px solid var(--accent);
      border-radius: 20px;
      padding: 5px 14px;
      background: rgba(204, 107, 44, 0.08);
      letter-spacing: 0.1px;
    }

    /* ===== RECORDS ===== */
    .records-section {
      padding-bottom: 16px;
    }

    .records-label {
      font-family: var(--font-display);
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 16px;
      padding-left: 4px;
    }

    .records-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .record-card {
      background: var(--bg-elevated);
      border-radius: 14px;
      overflow: hidden;
      transition: background 0.15s ease;
    }

    .record-card:hover {
      background: #191919;
    }

    .record-inner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
    }

    .record-cover {
      width: 72px;
      height: 72px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      background: var(--bg-surface);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .record-cover-empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .record-info {
      flex: 1;
      min-width: 0;
    }

    .record-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.2px;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .record-artist {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-secondary);
      letter-spacing: 0.1px;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .record-year {
      font-family: var(--font-body);
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 0.2px;
      margin-top: 4px;
      display: inline-block;
    }

    .record-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    /* ===== PREVIEW BUTTON ===== */
    .btn-preview {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--bg-border);
      color: var(--text-secondary);
      border-radius: 20px;
      padding: 6px 14px;
      font-family: var(--font-body);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-preview:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .btn-preview.playing {
      border-color: var(--accent);
      color: var(--accent);
    }

    .btn-preview.playing .icon-play { display: none; }
    .btn-preview.playing .icon-stop { display: inline !important; }

    /* ===== BUY BUTTON ===== */
    .buy-details {
      position: relative;
    }

    .btn-buy {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid var(--bg-border);
      color: var(--text-secondary);
      border-radius: 20px;
      padding: 6px 14px;
      font-family: var(--font-body);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      list-style: none;
      white-space: nowrap;
    }

    .btn-buy::-webkit-details-marker { display: none; }

    .btn-buy:hover {
      border-color: #22C55E;
      color: #22C55E;
    }

    .buy-details[open] .btn-buy {
      border-color: #22C55E;
      color: #22C55E;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .buy-links {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 10;
      background: var(--bg-surface);
      border: 1px solid var(--bg-border);
      border-top: none;
      border-radius: 0 0 12px 12px;
      overflow: hidden;
      min-width: 140px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .buy-links a {
      display: block;
      padding: 10px 16px;
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .buy-links a:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    .buy-links a + a {
      border-top: 1px solid var(--bg-border);
    }

    /* ===== CTA ===== */
    .cta-section {
      text-align: center;
      padding: 48px 0 32px;
      border-top: 1px solid var(--bg-border);
      margin-top: 32px;
    }

    .cta-heading {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 22px;
      letter-spacing: -0.5px;
      color: var(--text-primary);
    }

    .cta-subtext {
      font-family: var(--font-body);
      font-size: 15px;
      color: var(--text-tertiary);
      margin-top: 8px;
    }

    .btn-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 40px;
      margin-top: 24px;
      border-radius: 32px;
      background: var(--accent);
      color: #fff;
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      letter-spacing: 0.2px;
      transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
    }

    .btn-cta:hover {
      background: #b85e26;
      box-shadow: 0 8px 32px rgba(204, 107, 44, 0.25);
    }

    .btn-cta:active {
      transform: scale(0.97);
    }

    .btn-cta svg {
      width: 20px;
      height: 20px;
    }

    .cta-free {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 12px;
      letter-spacing: 0.2px;
    }

    .btn-appstore {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 32px;
      margin-top: 12px;
      border-radius: 32px;
      background: var(--bg-surface);
      border: 1px solid var(--bg-border);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      transition: background 0.2s ease;
    }

    .btn-appstore:hover {
      background: #222;
    }

    .btn-appstore svg {
      width: 18px;
      height: 18px;
    }

    /* ===== FOOTER ===== */
    .footer {
      text-align: center;
      padding: 32px 0 40px;
    }

    .footer-logo {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 20px;
      color: var(--text-disabled);
      letter-spacing: -0.5px;
    }

    .footer-logo a {
      color: inherit;
      text-decoration: none;
    }

    .footer-logo a:hover {
      color: var(--text-muted);
    }

    .footer-links {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 12px;
    }

    .footer-links a {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
    }

    .footer-links a:hover {
      color: var(--text-secondary);
    }

    /* ===== DESKTOP GRID ===== */
    @media (min-width: 640px) {
      .crate-header {
        padding-top: 80px;
      }

      .crate-name {
        font-size: 40px;
      }

      .crate-description {
        font-size: 17px;
      }

      .records-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .record-card {
        border-radius: 16px;
      }

      .record-inner {
        flex-direction: column;
        align-items: stretch;
        padding: 14px;
        gap: 12px;
      }

      .record-cover {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        border-radius: 10px;
      }

      .record-title {
        font-size: 16px;
        white-space: normal;
      }

      .record-artist {
        font-size: 14px;
        white-space: normal;
      }

      .cta-heading {
        font-size: 28px;
      }
    }

    /* ===== REDUCED MOTION ===== */
    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="crate-header">
      <h1 class="crate-name">${escapeHtml(crate.name)}</h1>
      ${crate.description ? `<p class="crate-description">${escapeHtml(crate.description)}</p>` : ''}
      <div class="crate-meta">
        <span>${crate.record_count} ${crate.record_count === 1 ? 'record' : 'records'}</span>
        ${crate.crate_type === 'shop' && crate.shop_name
          ? `<span class="dot">&middot;</span><span class="shop-badge"><span class="shop-name">${escapeHtml(crate.shop_name)}</span>${crate.verified ? '<svg class="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</span>`
          : crate.creator_display_name ? `<span class="dot">&middot;</span><span class="crate-creator">Curated by ${escapeHtml(crate.creator_display_name)}</span>` : ''}
      </div>
      ${crate.crate_type === 'shop' && crate.shop_location ? `<p class="shop-location">${escapeHtml(crate.shop_location)}</p>` : ''}
      ${crate.vibe_tags && crate.vibe_tags.length > 0 ? `
      <div class="vibe-tags">
        ${crate.vibe_tags.map(tag => `<span class="vibe-tag">${escapeHtml(tag)}</span>`).join('')}
      </div>` : ''}
    </header>

    <section class="records-section">
      <p class="records-label">In This Crate</p>
      <div class="records-list">
        ${recordCards}
      </div>
    </section>

    <section class="cta-section">
      <h2 class="cta-heading">Got a crate worth sharing?</h2>
      <p class="cta-subtext">Build your own and share it with friends.</p>
      <div>
        <a class="btn-cta" href="${APP_STORE_URL}">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Get Spindig
        </a>
      </div>
      <p class="cta-free">Free on iOS</p>
    </section>

    <footer class="footer">
      <div class="footer-logo"><a href="${DOMAIN}">spindig</a></div>
      <div class="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/support">Support</a>
      </div>
    </footer>
  </div>

  <script>
  (function() {
    var currentAudio = null;
    var currentBtn = null;

    function normalize(str) {
      return str.toLowerCase().replace(/[^a-z0-9\\s]/g, '').trim();
    }

    function stripArticles(str) {
      return str.replace(/^(the|a|an)\\s+/, '').trim();
    }

    function artistMatches(expected, actual) {
      var ne = normalize(expected);
      var na = normalize(actual);
      if (ne === na) return true;
      var se = stripArticles(ne);
      var sa = stripArticles(na);
      if (se === sa) return true;
      var ew = se.split(/\\s+/);
      var aw = sa.split(/\\s+/);
      if (ew.length > 1 && aw.length > 1) {
        if (se.indexOf(sa) !== -1 || sa.indexOf(se) !== -1) return true;
      }
      return false;
    }

    function stopCurrent() {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
        currentAudio = null;
      }
      if (currentBtn) {
        currentBtn.querySelector('span').textContent = 'Preview';
        currentBtn.classList.remove('playing');
        currentBtn = null;
      }
    }

    window.togglePreview = async function(btn, artist, title) {
      if (currentBtn === btn) {
        stopCurrent();
        return;
      }
      stopCurrent();
      btn.querySelector('span').textContent = 'Loading...';

      try {
        var q = encodeURIComponent(artist + ' ' + title);

        // Try album search first (gets Track 1 — vinyl logic)
        var albumRes = await fetch('https://api.deezer.com/search/album?q=' + q + '&limit=5');
        var albumData = await albumRes.json();
        var albums = (albumData && albumData.data) || [];
        var previewUrl = null;

        for (var i = 0; i < albums.length; i++) {
          if (!artistMatches(artist, albums[i].artist.name)) continue;
          var tlRes = await fetch('https://api.deezer.com/album/' + albums[i].id + '/tracks');
          var tlData = await tlRes.json();
          var tracks = (tlData && tlData.data) || [];
          tracks.sort(function(a, b) { return (a.track_position || 0) - (b.track_position || 0); });
          var t1 = tracks.find(function(t) { return t.track_position === 1 && t.preview; });
          if (t1) { previewUrl = t1.preview; break; }
          var any = tracks.find(function(t) { return t.preview; });
          if (any) { previewUrl = any.preview; break; }
        }

        // Fallback: general track search
        if (!previewUrl) {
          var res = await fetch('https://api.deezer.com/search?q=' + q + '&limit=10');
          var data = await res.json();
          var results = (data && data.data) || [];
          for (var j = 0; j < results.length; j++) {
            if (results[j].preview && artistMatches(artist, results[j].artist.name)) {
              previewUrl = results[j].preview;
              break;
            }
          }
        }

        if (!previewUrl) {
          btn.querySelector('span').textContent = 'No preview';
          setTimeout(function() { btn.querySelector('span').textContent = 'Preview'; }, 2500);
          return;
        }

        var audio = new Audio(previewUrl);
        audio.volume = 0.7;
        currentAudio = audio;
        currentBtn = btn;

        audio.addEventListener('ended', stopCurrent);
        audio.addEventListener('error', stopCurrent);

        await audio.play();
        btn.querySelector('span').textContent = 'Stop';
        btn.classList.add('playing');
      } catch(e) {
        btn.querySelector('span').textContent = 'Preview';
      }
    };

    // Close buy dropdowns when clicking elsewhere
    document.addEventListener('click', function(e) {
      document.querySelectorAll('.buy-details[open]').forEach(function(d) {
        if (!d.contains(e.target)) d.removeAttribute('open');
      });
    });
  })();
  </script>
</body>
</html>`;
}

function renderFallbackPage(slug) {
  const crateName = slug
    ? slug.replace(/-[a-z0-9]{4}$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'A Crate';
  const pageUrl = `${DOMAIN}/crate/${escapeHtml(slug)}`;

  return `<!DOCTYPE html>
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
    .container { max-width: 400px; width: 100%; text-align: center; }
    .vinyl-container { position: relative; width: 200px; height: 200px; margin: 0 auto; }
    .vinyl-record {
      width: 100%; height: 100%; border-radius: 50%; position: relative;
      background: radial-gradient(circle at center, var(--accent) 0%, var(--accent) 11%, #1a1a1a 11%, #1a1a1a 12.5%, #111 12.5%, #0f0f0f 14%, #131313 14%, #111 15.5%, #0f0f0f 15.5%, #131313 17%, #111 17%, #0f0f0f 18.5%, #131313 18.5%, #111 20%, #0f0f0f 20%, #131313 21.5%, #111 21.5%, #0f0f0f 23%, #131313 23%, #111 24.5%, #0f0f0f 24.5%, #131313 26%, #111 26%, #0f0f0f 27.5%, #131313 27.5%, #111 29%, #0f0f0f 29%, #131313 30.5%, #111 30.5%, #0f0f0f 32%, #131313 32%, #111 33.5%, #0f0f0f 33.5%, #131313 35%, #111 35%, #0f0f0f 36.5%, #131313 36.5%, #111 38%, #0f0f0f 38%, #131313 39.5%, #111 39.5%, #0f0f0f 41%, #131313 41%, #111 42.5%, #0f0f0f 42.5%, #131313 44%, #111 44%, #0f0f0f 45.5%, #131313 45.5%, #0d0d0d 48%), radial-gradient(circle at center, transparent 47%, #1a1a1a 47%, #1a1a1a 49%, #0d0d0d 49%), radial-gradient(circle at center, #111 0%, #0a0a0a 100%);
      box-shadow: 0 0 0 2px #1a1a1a, 0 16px 48px rgba(0, 0, 0, 0.5);
      animation: spin 6s linear infinite;
    }
    .vinyl-record::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.02) 100%); }
    .vinyl-record::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: var(--bg-base); z-index: 2; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .vinyl-record { animation: none; } }
    .crate-title { font-family: var(--font-display); font-weight: 600; font-size: 26px; letter-spacing: -0.5px; line-height: 1.3; margin-top: 28px; }
    .crate-subtitle { font-family: var(--font-body); font-weight: 500; font-size: 16px; color: var(--text-secondary); margin-top: 8px; }
    .buttons { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; align-items: center; }
    .btn { display: block; width: 100%; max-width: 300px; padding: 16px 36px; border-radius: 32px; font-family: var(--font-body); font-weight: 600; font-size: 16px; text-decoration: none; text-align: center; transition: background 0.2s ease, box-shadow 0.2s ease; }
    .btn-open { background: var(--accent); color: #fff; }
    .btn-open:hover { background: #b85e26; box-shadow: 0 8px 32px rgba(204, 107, 44, 0.25); }
    .btn-download { background: var(--bg-surface); border: 1px solid var(--bg-border); color: var(--text-primary); font-size: 15px; padding: 14px 32px; }
    .btn-download:hover { background: #222; }
    .logo-footer { margin-top: 48px; font-family: var(--font-display); font-weight: 700; font-size: 20px; color: var(--text-disabled); letter-spacing: -0.5px; }
    .logo-footer a { color: inherit; text-decoration: none; }
    .logo-footer a:hover { color: var(--text-muted); }
  </style>
</head>
<body>
  <div class="container">
    <div class="vinyl-container"><div class="vinyl-record"></div></div>
    <h1 class="crate-title">${escapeHtml(crateName)}</h1>
    <p class="crate-subtitle">A curated crate on Spindig</p>
    <div class="buttons">
      <a class="btn btn-open" href="${APP_STORE_URL}">Get Spindig</a>
      <a class="btn btn-download" href="${APP_STORE_URL}">Download on the App Store</a>
    </div>
    <div class="logo-footer"><a href="${DOMAIN}">spindig</a></div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.searchParams.get('id') || req.query?.id || '';

  // Try to fetch published crate from Supabase
  let crateData = null;
  if (supabase && slug) {
    try {
      const { data, error } = await supabase
        .from('shared_crates')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        crateData = data;
      }
    } catch {
      // Fall through to fallback
    }
  }

  if (crateData && crateData.records && crateData.records.length > 0) {
    const html = renderFullCratePage(crateData, slug);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(html);
  }

  // Fallback: no data in Supabase, show generic page
  const html = renderFallbackPage(slug);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return res.status(200).send(html);
}
