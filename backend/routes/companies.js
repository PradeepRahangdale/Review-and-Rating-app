const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Company = require('../models/Company');
const Review = require('../models/Review');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

function buildCompanyFilter(query) {
  const filter = {};
  const { search, city } = query;

  if (city && city.trim()) {
    filter.city = { $regex: city.trim(), $options: 'i' };
  }

  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
    ];
  }

  return filter;
}

async function attachReviewStats(companies) {
  const ids = companies.map((c) => c._id);
  const stats = await Review.aggregate([
    { $match: { company: { $in: ids } } },
    {
      $group: {
        _id: '$company',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const map = Object.fromEntries(
    stats.map((s) => [s._id.toString(), { avgRating: s.avgRating, reviewCount: s.reviewCount }])
  );

  return companies.map((company) => {
    const data = map[company._id.toString()] || { avgRating: 0, reviewCount: 0 };
    return {
      ...company.toObject(),
      avgRating: data.reviewCount ? Number(data.avgRating.toFixed(1)) : 0,
      reviewCount: data.reviewCount,
    };
  });
}

router.get('/', async (req, res) => {
  try {
    const filter = buildCompanyFilter(req.query);
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const sortMap = {
      name: { name: sortOrder },
      rating: { avgRating: sortOrder },
      founded: { foundedOn: sortOrder },
      date: { createdAt: sortOrder },
    };

    let companies = await Company.find(filter).sort(sortMap[sortBy] || sortMap.name);

    if (sortBy === 'rating') {
      const withStats = await attachReviewStats(companies);
      withStats.sort((a, b) => (b.avgRating - a.avgRating) * sortOrder);
      return res.json({ count: withStats.length, companies: withStats });
    }

    const withStats = await attachReviewStats(companies);
    res.json({ count: withStats.length, companies: withStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const reviews = await Review.find({ company: company._id });
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    res.json({
      company: {
        ...company.toObject(),
        avgRating,
        reviewCount: reviews.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, location, city, foundedOn, description, logoColor, logoText } = req.body;

    if (!name || !location || !city || !foundedOn) {
      return res.status(400).json({ message: 'name, location, city, and foundedOn are required' });
    }

    const company = await Company.create({
      name,
      location,
      city,
      foundedOn: new Date(foundedOn),
      description: description || '',
      logo: req.file ? `/uploads/${req.file.filename}` : '',
      logoColor: logoColor || '#1e3a5f',
      logoText: logoText || name.charAt(0).toUpperCase(),
    });

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
