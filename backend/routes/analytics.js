const express = require('express');
const { getTrends, getInsights, getDistribution, getSparkInsights } = require('../controllers/analytics');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/trends', protect, getTrends);
router.get('/insights', protect, getInsights);
router.get('/spark-insights', protect, getSparkInsights);
router.get('/distribution', protect, getDistribution);

module.exports = router;
