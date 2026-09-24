const axios = require('axios');

// In-memory cache to prevent frequent YouTube API calls and cold response latency
const cache = {
  videosByViews: { data: null, expiry: 0 },
  latestVideos: { data: null, expiry: 0 },
  featuredVideos: { data: null, expiry: 0 },
};

// Cache TTL: 1 hour (3600000 ms)
const CACHE_TTL = 60 * 60 * 1000;

const getLatestVideos = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.latestVideos.data && now < cache.latestVideos.expiry) {
      return res.status(200).json({ success: true, fromCache: true, data: cache.latestVideos.data });
    }

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          channelId: process.env.YOUTUBE_CHANNEL_ID,
          maxResults: 12,
          order: 'date',
          type: 'video',
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    cache.latestVideos = {
      data: videos,
      expiry: now + CACHE_TTL,
    };

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('YouTube Videos Error:', error.message);
    if (cache.latestVideos.data) {
      return res.status(200).json({ success: true, fromCache: true, data: cache.latestVideos.data });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};

const getVideosByViews = async (req, res) => {
  try {
    const now = Date.now();
    // Return cached if still valid
    if (cache.videosByViews.data && now < cache.videosByViews.expiry) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        total: cache.videosByViews.data.length,
        data: cache.videosByViews.data,
      });
    }

    let allVideoIds = [];
    let nextPageToken = null;

    // Keep fetching until no more pages
    do {
      const searchResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            channelId: process.env.YOUTUBE_CHANNEL_ID,
            maxResults: 50,
            type: 'video',
            key: process.env.YOUTUBE_API_KEY,
            pageToken: nextPageToken || undefined,
          },
        }
      );

      const ids = searchResponse.data.items.map(item => item.id.videoId);
      allVideoIds = [...allVideoIds, ...ids];
      nextPageToken = searchResponse.data.nextPageToken;

    } while (nextPageToken);

    // Split into chunks of 50
    const chunks = [];
    for (let i = 0; i < allVideoIds.length; i += 50) {
      chunks.push(allVideoIds.slice(i, i + 50));
    }

    // Fetch stats for all chunks
    let allVideos = [];
    for (const chunk of chunks) {
      const statsResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'statistics,snippet',
            id: chunk.join(','),
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );

      const videos = statsResponse.data.items.map(video => ({
        videoId: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        views: Number(video.statistics.viewCount),
        likes: Number(video.statistics.likeCount || 0),
        publishedAt: video.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${video.id}`,
      }));

      allVideos = [...allVideos, ...videos];
    }

    // Sort highest views to lowest
    allVideos.sort((a, b) => b.views - a.views);

    // Update in-memory cache
    cache.videosByViews = {
      data: allVideos,
      expiry: now + CACHE_TTL,
    };

    res.status(200).json({
      success: true,
      total: allVideos.length,
      data: allVideos,
    });

  } catch (error) {
    console.error('Videos by views error:', error.message);
    // If YouTube API fails (e.g., quota exceeded), serve last cached data if available
    if (cache.videosByViews.data) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        warning: 'Served from stale cache due to upstream API error',
        total: cache.videosByViews.data.length,
        data: cache.videosByViews.data,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};

const getMostViewedVideo = async (req, res) => {
  try {
    const now = Date.now();
    // Fast path: If videosByViews cache exists, highest viewed is the first item!
    if (cache.videosByViews.data && cache.videosByViews.data.length > 0) {
      return res.status(200).json({ success: true, fromCache: true, data: cache.videosByViews.data[0] });
    }

    // Otherwise, fetch by views which caches all videos
    await getVideosByViews(req, {
      status: (code) => ({
        json: (payload) => {
          if (payload.success && payload.data && payload.data.length > 0) {
            return res.status(code).json({ success: true, data: payload.data[0] });
          }
          return res.status(code).json(payload);
        }
      })
    });
  } catch (error) {
    console.error('Most Viewed Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch most viewed video' });
  }
};

const getFeaturedVideos = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.featuredVideos.data && now < cache.featuredVideos.expiry) {
      return res.status(200).json({ success: true, fromCache: true, data: cache.featuredVideos.data });
    }

    const featuredVideos = require('../data/featuredVideos');
    const videoIds = featuredVideos.map(v => v.id).join(',');

    const statsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'statistics,snippet',
          id: videoIds,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = statsResponse.data.items.map(video => {
      const featured = featuredVideos.find(f => f.id === video.id);
      return {
        videoId: video.id,
        title: video.snippet.title,
        thumbnail: featured ? featured.thumbnail : video.snippet.thumbnails.medium.url,
        views: Number(video.statistics.viewCount),
        url: `https://www.youtube.com/watch?v=${video.id}`,
      };
    });

    videos.sort((a, b) => b.views - a.views);

    cache.featuredVideos = {
      data: videos,
      expiry: now + CACHE_TTL,
    };

    res.status(200).json({ success: true, data: videos });

  } catch (error) {
    console.error('Featured Videos Error:', error.message);
    if (cache.featuredVideos.data) {
      return res.status(200).json({ success: true, fromCache: true, data: cache.featuredVideos.data });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch featured videos' });
  }
};

module.exports = { getLatestVideos, getMostViewedVideo, getVideosByViews, getFeaturedVideos };