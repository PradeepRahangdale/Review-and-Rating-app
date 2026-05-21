const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    reviewerName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    reviewText: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
