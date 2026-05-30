const axios = require('axios');

const getChannelStats = async (req, res) => {
  try {
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

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('YouTube Stats Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

module.exports = { getChannelStats };