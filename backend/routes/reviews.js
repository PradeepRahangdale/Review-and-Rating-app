const express = require('express');
const Review = require('../models/Review');
const Company = require('../models/Company');

const router = express.Router();

router.get('/company/:companyId', async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let sort = { createdAt: sortOrder };
    if (sortBy === 'rating') sort = { rating: sortOrder };
    if (sortBy === 'relevance') sort = { likes: sortOrder, rating: -1 };

    const reviews = await Review.find({ company: company._id }).sort(sort);
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    res.json({ count: reviews.length, avgRating, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyId, reviewerName, subject, reviewText, rating } = req.body;

    if (!companyId || !reviewerName || !subject || !reviewText || !rating) {
      return res.status(400).json({
        message: 'companyId, reviewerName, subject, reviewText, and rating are required',
      });
    }

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const review = await Review.create({
      company: companyId,
      reviewerName,
      subject,
      reviewText,
      rating: Number(rating),
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/like', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const sessionId = req.body.sessionId || req.ip || 'anonymous';
    const alreadyLiked = review.likedBy.includes(sessionId);

    if (alreadyLiked) {
      review.likedBy = review.likedBy.filter((id) => id !== sessionId);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      review.likedBy.push(sessionId);
      review.likes += 1;
    }

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
