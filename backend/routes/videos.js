const express = require('express');
const router = express.Router();
const { 
  getLatestVideos, 
  getMostViewedVideo, 
  getVideosByViews,
  getFeaturedVideos 
} = require('../controllers/videosController');

router.get('/', getLatestVideos);
router.get('/most-viewed', getMostViewedVideo);
router.get('/by-views', getVideosByViews);
router.get('/featured', getFeaturedVideos);

module.exports = router;