const Company = require('../models/Company');
const Review = require('../models/Review');
const { companies, buildReviews } = require('../data/seedData');

async function seedDatabase({ reset = false } = {}) {
  if (reset) {
    await Review.deleteMany({});
    await Company.deleteMany({});
  }

  const existing = await Company.countDocuments();
  if (existing > 0 && !reset) {
    return { seeded: false, count: existing };
  }

  for (const data of companies) {
    const { reviewCount, targetRating, ...companyFields } = data;
    const company = await Company.create(companyFields);
    const reviews = buildReviews(company._id, reviewCount, targetRating);
    await Review.insertMany(reviews);
    console.log(`Seeded: ${company.name} (${reviewCount} reviews)`);
  }

  return { seeded: true, count: companies.length };
}

async function ensureSeed() {
  const shouldReset = process.env.SEED_RESET === 'true';
  const forceSeed = process.env.SEED_ON_START === 'true';
  const count = await Company.countDocuments();

  if (count > 0 && !shouldReset && !forceSeed) {
    return;
  }

  if (count > 0 && shouldReset) {
    console.log('SEED_RESET=true — clearing and re-seeding database...');
  } else if (count === 0) {
    console.log('Database empty — seeding sample data...');
  } else {
    console.log('SEED_ON_START=true — re-seeding database...');
  }

  const result = await seedDatabase({ reset: shouldReset || forceSeed || count === 0 });
  if (result.seeded) {
    console.log(`Seed complete — ${result.count} companies loaded.`);
  }
}

module.exports = { seedDatabase, ensureSeed };
