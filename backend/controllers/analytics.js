const Crime = require('../models/Crime');
const { spawn } = require('child_process');
const path = require('path');

// @desc    Get crime trends
// @route   GET /api/analytics/trends
exports.getTrends = async (req, res) => {
  try {
    const { location, type, startDate, endDate } = req.query;
    let match = {};

    if (location) match.location = { $regex: location, $options: 'i' };
    if (type) match.type = type;
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const trends = await Crime.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedTrends = trends.map(t => ({
      date: `${t._id.year}-${t._id.month.toString().padStart(2, '0')}`,
      count: t.count
    }));

    res.status(200).json({ success: true, data: formattedTrends });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get crime distribution (AI Insights)
// @route   GET /api/analytics/insights
exports.getInsights = async (req, res) => {
  try {
    const crimes = await Crime.find({}, 'coordinates.lat coordinates.lng date type');
    
    const inputData = crimes.map(c => ({
      lat: c.coordinates.lat,
      lng: c.coordinates.lng,
      date: c.date,
      type: c.type
    }));

    const pythonProcess = spawn('python', [path.join(__dirname, '../../ml-models/analysis.py')]);
    
    let resultData = '';
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ success: false, message: 'ML Analysis failed' });
      }
      try {
        const insights = JSON.parse(resultData);
        res.status(200).json({ success: true, data: insights });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to parse ML results' });
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get type distribution
// @route   GET /api/analytics/distribution
exports.getDistribution = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    let match = {};

    if (location) match.location = { $regex: location, $options: 'i' };
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const distribution = await Crime.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ success: true, data: distribution });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// @desc    Get big data insights (PySpark)
// @route   GET /api/analytics/spark-insights
exports.getSparkInsights = async (req, res) => {
  try {
    const pythonProcess = spawn('python', [path.join(__dirname, '../../ml-models/spark_analysis.py')]);
    
    let resultData = '';
    let errorData = '';

    // Timeout after 60 seconds
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      if (!res.headersSent) {
        res.status(504).json({ success: false, message: 'Spark analysis timed out' });
      }
    }, 60000);

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Spark Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (res.headersSent) return;

      if (code !== 0) {
        return res.status(500).json({ success: false, message: 'Spark Analysis failed', error: errorData });
      }
      try {
        const insights = JSON.parse(resultData);
        res.status(200).json({ success: true, data: insights });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to parse Spark results' });
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
