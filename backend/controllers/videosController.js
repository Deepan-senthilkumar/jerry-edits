const axios = require('axios');

const getLatestVideos = async (req, res) => {
  try {
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

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('YouTube Videos Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};

const getMostViewedVideo = async (req, res) => {
  try {
    let allVideoIds = [];
    let nextPageToken = null;

    // Fetch ALL video IDs using pagination
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

      allVideos = [...allVideos, ...statsResponse.data.items];
    }

    // Find the video with highest views from ALL videos
    const mostViewed = allVideos.reduce((max, video) => {
      return Number(video.statistics.viewCount) > Number(max.statistics.viewCount)
        ? video : max;
    });

    const result = {
      videoId: mostViewed.id,
      title: mostViewed.snippet.title,
      views: Number(mostViewed.statistics.viewCount),
      thumbnail: mostViewed.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${mostViewed.id}`,
    };

    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Most Viewed Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch most viewed video' });
  }
};

const getVideosByViews = async (req, res) => {
  try {
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

    } while (nextPageToken); // stop when no more pages

    // YouTube allows max 50 IDs per stats request
    // So split into chunks of 50
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

    res.status(200).json({
      success: true,
      total: allVideos.length,
      data: allVideos
    });

  } catch (error) {
    console.error('Videos by views error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};
const getFeaturedVideos = async (req, res) => {
  try {
    const featuredVideos = require('../data/featuredVideos');

    // Extract just the IDs for API call
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

    // Merge API data with your custom thumbnails
    const videos = statsResponse.data.items.map(video => {
      // Find matching custom thumbnail by video ID
      const featured = featuredVideos.find(f => f.id === video.id);

      return {
        videoId: video.id,
        title: video.snippet.title,
        thumbnail: featured ? featured.thumbnail : video.snippet.thumbnails.medium.url,
        views: Number(video.statistics.viewCount),
        url: `https://www.youtube.com/watch?v=${video.id}`,
      };
    });

    // Sort by highest views first
    videos.sort((a, b) => b.views - a.views);

    res.status(200).json({ success: true, data: videos });

  } catch (error) {
    console.error('Featured Videos Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch featured videos' });
  }
};

module.exports = { getLatestVideos, getMostViewedVideo, getVideosByViews, getFeaturedVideos };