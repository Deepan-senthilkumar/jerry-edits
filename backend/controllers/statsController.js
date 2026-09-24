const axios = require('axios');

// In-memory cache for stats
let statsCache = {
  data: null,
  expiry: 0,
};

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getChannelStats = async (req, res) => {
  try {
    const now = Date.now();
    if (statsCache.data && now < statsCache.expiry) {
      return res.status(200).json({ success: true, fromCache: true, data: statsCache.data });
    }

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'statistics,snippet',
          id: process.env.YOUTUBE_CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const channel = response.data.items[0];
    const stats = {
      channelName: channel.snippet.title,
      subscribers: channel.statistics.subscriberCount,
      totalViews: channel.statistics.viewCount,
      totalVideos: channel.statistics.videoCount,
      thumbnail: channel.snippet.thumbnails.default.url,
    };

    statsCache = {
      data: stats,
      expiry: now + CACHE_TTL,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('YouTube Stats Error:', error.message);
    if (statsCache.data) {
      return res.status(200).json({ success: true, fromCache: true, data: statsCache.data });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

module.exports = { getChannelStats };