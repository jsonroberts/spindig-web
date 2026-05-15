// Server-side Deezer proxy.
// Deezer's API doesn't set Access-Control-Allow-Origin, so browsers
// block direct fetch from the crate page. This endpoint fetches the
// preview URL server-side and returns it as JSON.

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function stripArticles(str) {
  return str.replace(/^(the|a|an)\s+/, '').trim();
}

function artistMatches(expected, actual) {
  const normExpected = normalize(expected);
  const normActual = normalize(actual);
  if (normExpected === normActual) return true;
  const strippedExpected = stripArticles(normExpected);
  const strippedActual = stripArticles(normActual);
  if (strippedExpected === strippedActual) return true;
  const expectedWords = strippedExpected.split(/\s+/);
  const actualWords = strippedActual.split(/\s+/);
  if (expectedWords.length > 1 && actualWords.length > 1) {
    return normActual.includes(strippedExpected) || normExpected.includes(strippedActual);
  }
  return false;
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const artist = url.searchParams.get('artist') || req.query?.artist || '';
  const title = url.searchParams.get('title') || req.query?.title || '';

  if (!artist || !title) {
    return res.status(400).json({ error: 'Missing artist or title' });
  }

  const q = encodeURIComponent(`${artist} ${title}`);

  try {
    // 1) Try album search to get Track 1
    const albumRes = await fetch(`https://api.deezer.com/search/album?q=${q}&limit=5`);
    if (albumRes.ok) {
      const albumData = await albumRes.json();
      const albums = albumData?.data || [];

      for (const album of albums) {
        if (!artistMatches(artist, album.artist?.name || '')) continue;
        const tlRes = await fetch(`https://api.deezer.com/album/${album.id}/tracks`);
        if (!tlRes.ok) continue;
        const tlData = await tlRes.json();
        const tracks = (tlData?.data || []).slice();
        tracks.sort((a, b) => (a.track_position || 0) - (b.track_position || 0));
        const t1 = tracks.find(t => t.track_position === 1 && t.preview);
        if (t1) {
          res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
          return res.status(200).json({ previewUrl: t1.preview, source: 'album_track1' });
        }
        const any = tracks.find(t => t.preview);
        if (any) {
          res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
          return res.status(200).json({ previewUrl: any.preview, source: 'album_any' });
        }
      }
    }

    // 2) Fallback: general track search
    const trackRes = await fetch(`https://api.deezer.com/search?q=${q}&limit=10`);
    if (trackRes.ok) {
      const trackData = await trackRes.json();
      const results = trackData?.data || [];
      for (const track of results) {
        if (track.preview && artistMatches(artist, track.artist?.name || '')) {
          res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
          return res.status(200).json({ previewUrl: track.preview, source: 'track_search' });
        }
      }
    }

    return res.status(404).json({ previewUrl: null, error: 'No preview found' });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
