const express = require('express');
const {
  getCrimes,
  getCrime,
  createCrime,
  updateCrime,
  deleteCrime,
  uploadCSV
} = require('../controllers/crimes');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/')
  .get(getCrimes)
  .post(protect, authorize('admin'), createCrime);

router.route('/:id')
  .get(getCrime)
  .put(protect, authorize('admin'), updateCrime)
  .delete(protect, authorize('admin'), deleteCrime);

router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadCSV);

module.exports = router;
