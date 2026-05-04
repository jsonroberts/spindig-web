import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response('Not configured', { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase
    .from('shared_crates')
    .select('name, records, record_count, creator_display_name, vibe_tags, crate_type, shop_name, verified')
    .eq('slug', slug)
    .single();

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const covers = (data.records || [])
    .map(r => r.coverImageUrl)
    .filter(url => url && !url.includes('spacer.gif'))
    .slice(0, 4);

  const recordCount = data.record_count || data.records?.length || 0;
  const isShop = data.crate_type === 'shop' && data.shop_name;
  const creator = isShop
    ? data.shop_name + (data.verified ? ' \u2713' : '')
    : (data.creator_display_name || '');
  const vibeTags = data.vibe_tags || [];

  // Pad covers array to 4 if needed (show empty slots)
  while (covers.length < 4) {
    covers.push(null);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0d0d0d',
          padding: '48px',
        }}
      >
        {/* Left: 2x2 cover grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '534px',
            height: '534px',
            gap: '6px',
            borderRadius: '20px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {covers.map((url, i) =>
            url ? (
              <img
                key={i}
                src={url}
                width={264}
                height={264}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                key={i}
                style={{
                  width: '264px',
                  height: '264px',
                  backgroundColor: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid #2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#2a2a2a',
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* Right: text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '48px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '44px',
              fontWeight: 700,
              color: '#f5f5f5',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {data.name}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#a0a0a0',
              marginTop: '20px',
              lineHeight: 1.4,
            }}
          >
            {recordCount} {recordCount === 1 ? 'record' : 'records'}
            {creator ? ` \u00B7 by ${creator}` : ''}
          </div>
          {vibeTags.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '20px',
              }}
            >
              {vibeTags.map((tag, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '18px',
                    color: '#CC6B2C',
                    border: '1.5px solid #CC6B2C',
                    borderRadius: '16px',
                    padding: '4px 14px',
                    background: 'rgba(204, 107, 44, 0.08)',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #CC6B2C 30%, #1a1a1a 31%, #151515 100%)',
                border: '1px solid #2a2a2a',
              }}
            />
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#CC6B2C',
                letterSpacing: '-0.5px',
              }}
            >
              spindig
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
