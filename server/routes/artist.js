const express = require('express');

const router = express.Router();
const CHANNEL_ID = 'UCrBCc_nHvLVBMgh-nA3ayTQ';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const COMPOSITIONS = [
  'Lv28G1RKgY4',
  'aie43g0Ayvw',
  'soR1Vj6yC4s',
  'vhPEGyESUvU',
  'NS6Z5xwuXlw'
];

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function readTag(entry, tag) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXml(match[1]) : '';
}

async function readComposition(videoId) {
  const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  if (!response.ok) throw new Error(`YouTube metadata returned ${response.status}`);
  const metadata = await response.json();
  return {
    videoId,
    title: metadata.title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: metadata.thumbnail_url,
    role: 'COMPOSITION / COLLABORATION'
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const response = await fetch(FEED_URL, { headers: { Accept: 'application/atom+xml' } });
    if (!response.ok) throw new Error(`YouTube feed returned ${response.status}`);

    const xml = await response.text();
    const works = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
      const entry = match[1];
      const videoId = readTag(entry, 'yt:videoId');
      const title = readTag(entry, 'title');
      const published = readTag(entry, 'published');
      return {
        videoId,
        title,
        published,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      };
    }).filter((work) => work.videoId && work.title);

    const selectedWorks = works.filter((work) => {
      const title = work.title.toLowerCase();
      return title.includes('official music video')
        && !title.includes('#shorts')
        && !title.includes('releasing soon');
    });

    const compositions = await Promise.all(COMPOSITIONS.map(readComposition));
    res.json({ source: 'youtube-rss', channelId: CHANNEL_ID, works: selectedWorks, compositions });
  } catch (error) {
    next(error);
  }
});

module.exports = router;