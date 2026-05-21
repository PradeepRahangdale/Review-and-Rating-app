const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    foundedOn: { type: Date, required: true },
    description: { type: String, default: '', trim: true },
    logo: { type: String, default: '' },
    logoColor: { type: String, default: '#1e3a5f' },
    logoText: { type: String, default: '' },
  },
  { timestamps: true }
);

companySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'company',
});

companySchema.set('toJSON', { virtuals: true });
companySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Company', companySchema);
