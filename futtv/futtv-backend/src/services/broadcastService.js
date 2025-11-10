const axios = require('axios');
const defaultBroadcasters = require('../data/defaultBroadcasters.json');

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; FutTV/1.0; +https://futtv.hserver.pro)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
};

const cache = new Map();
const broadcasterLookup = new Map(
  defaultBroadcasters.map((item) => [item.nome.toLowerCase(), item])
);

const CHANNEL_TYPE_MAP = {
  'PREMIERE': 'Pay-Per-View',
  'GLOBO': 'TV Aberta',
  'SPORTV': 'TV Paga',
  'ESPN': 'TV Paga',
  'PRIME VIDEO': 'Streaming',
  'PRIMEVIDEO': 'Streaming',
  'PARAMOUNT+': 'Streaming',
  'PARAMOUNT PLUS': 'Streaming',
  'STAR+': 'Streaming',
  'STAR PLUS': 'Streaming',
  'YOUTUBE': 'Streaming',
  'TNT SPORTS': 'TV Paga'
};

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    const paramsToStrip = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    paramsToStrip.forEach((param) => parsed.searchParams.delete(param));
    parsed.hash = '';
    return parsed.toString();
  } catch (error) {
    return rawUrl;
  }
}

function extractTransmissionBlock(html) {
  const key = 'transmission:';
  const idx = html.indexOf(key);

  if (idx === -1) {
    return null;
  }

  const start = html.indexOf('{', idx);
  if (start === -1) {
    return null;
  }

  let depth = 0;
  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        const jsonText = html.slice(start, i + 1);
        return JSON.parse(jsonText);
      }
    }
  }

  return null;
}

function normalizeSourceName(rawSource) {
  if (!rawSource || typeof rawSource !== 'string') return null;

  const upper = rawSource.toUpperCase().trim();

  if (upper.includes('PREMIERE')) return 'Premiere';
  if (upper.includes('GLOBO')) return 'Globo';
  if (upper.includes('SPORTV')) return 'SporTV';
  if (upper.includes('PRIME')) return 'Prime Video';
  if (upper.includes('PARAMOUNT')) return 'Paramount+';
  if (upper.includes('ESPN')) return 'ESPN';
  if (upper.includes('STAR')) return 'Star+';
  if (upper.includes('YOUTUBE')) return 'YouTube';
  if (upper.includes('TNT')) return 'TNT Sports';

  return rawSource.trim();
}

function inferFromStreamChannel(streamChannelName) {
  if (!streamChannelName || typeof streamChannelName !== 'string') return null;
  const lower = streamChannelName.toLowerCase();

  if (lower.startsWith('p.')) return 'Premiere';
  if (lower.startsWith('g.')) return 'Globo';
  if (lower.startsWith('s.')) return 'SporTV';
  if (lower.startsWith('prime')) return 'Prime Video';
  if (lower.startsWith('paramount')) return 'Paramount+';
  if (lower.startsWith('youtube')) return 'YouTube';
  if (lower.startsWith('espn')) return 'ESPN';
  if (lower.startsWith('tnt')) return 'TNT Sports';

  return null;
}

function resolveBroadcasterMetadata(nome) {
  if (!nome) return null;
  const cacheKey = nome.toLowerCase();

  if (broadcasterLookup.has(cacheKey)) {
    return broadcasterLookup.get(cacheKey);
  }

  const upper = nome.toUpperCase();
  const tipo = CHANNEL_TYPE_MAP[upper] || CHANNEL_TYPE_MAP[upper.replace(/\s+/g, '')] || null;
  const logoUrl = `https://placehold.co/120x50/0F172A/FFFFFF?text=${encodeURIComponent(nome)}`;

  const metadata = {
    nome,
    tipo: tipo || 'Streaming',
    logo_url: logoUrl,
    url_stream: null
  };

  broadcasterLookup.set(cacheKey, metadata);
  return metadata;
}

async function fetchBroadcastInfo(url) {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return null;

  const cached = cache.get(sanitized);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const { data: html } = await axios.get(sanitized, {
      headers: REQUEST_HEADERS,
      timeout: 10000,
      responseType: 'text'
    });

    const transmissionBlock = extractTransmissionBlock(html);

    if (!transmissionBlock) {
      cache.set(sanitized, { timestamp: now, data: null });
      return null;
    }

    const rawSource = transmissionBlock.bannerData?.source || null;
    const streamChannelName = transmissionBlock.streamChannelName || null;

    const channelName =
      normalizeSourceName(rawSource) || inferFromStreamChannel(streamChannelName);

    if (!channelName) {
      cache.set(sanitized, { timestamp: now, data: null });
      return null;
    }

    const metadata = resolveBroadcasterMetadata(channelName);
    const payload = {
      nome: metadata.nome,
      tipo: metadata.tipo,
      logoUrl: metadata.logo_url,
      urlStream: metadata.url_stream,
      fonte: {
        rawSource,
        streamChannelName,
        banner: transmissionBlock.bannerData || null
      }
    };

    cache.set(sanitized, { timestamp: now, data: payload });
    return payload;
  } catch (error) {
    console.error('❌ Erro ao buscar informações de transmissão:', error.message);
    cache.set(sanitized, { timestamp: now, data: null });
    return null;
  }
}

module.exports = {
  fetchBroadcastInfo
};
