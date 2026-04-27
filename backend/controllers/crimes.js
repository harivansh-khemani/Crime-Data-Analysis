const Crime = require('../models/Crime');
const fs = require('fs');
const csv = require('csv-parser');

// @desc    Get all crimes
// @route   GET /api/crimes
exports.getCrimes = async (req, res) => {
  try {
    const { type, location, status, startDate, endDate, page = 1, limit = 100 } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const crimes = await Crime.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Crime.countDocuments(query);

    res.status(200).json({
      success: true,
      count: crimes.length,
      total,
      data: crimes
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single crime
// @route   GET /api/crimes/:id
exports.getCrime = async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    if (!crime) return res.status(404).json({ success: false, message: 'Crime not found' });
    res.status(200).json({ success: true, data: crime });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create crime
// @route   POST /api/crimes
exports.createCrime = async (req, res) => {
  try {
    const crime = await Crime.create(req.body);
    res.status(201).json({ success: true, data: crime });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update crime
// @route   PUT /api/crimes/:id
exports.updateCrime = async (req, res) => {
  try {
    const crime = await Crime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!crime) return res.status(404).json({ success: false, message: 'Crime not found' });
    res.status(200).json({ success: true, data: crime });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete crime
// @route   DELETE /api/crimes/:id
exports.deleteCrime = async (req, res) => {
  try {
    const crime = await Crime.findByIdAndDelete(req.params.id);
    if (!crime) return res.status(404).json({ success: false, message: 'Crime not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Upload CSV
// @route   POST /api/crimes/upload
exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a CSV file' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Basic mapping
      results.push({
        crimeId: data.crimeId || `CRIME-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: data.type,
        location: data.location,
        coordinates: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        },
        date: new Date(data.date),
        time: data.time,
        victimAge: parseInt(data.victimAge),
        victimGender: data.victimGender,
        weaponUsed: data.weaponUsed,
        status: data.status || 'Open',
        description: data.description
      });
    })
    .on('end', async () => {
      try {
        await Crime.insertMany(results);
        fs.unlinkSync(req.file.path); // Delete temp file
        res.status(200).json({ success: true, message: `${results.length} records uploaded successfully` });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    });
};
