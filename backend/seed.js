require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongo } = require('./config/mongodb');
const Company = require('./models/Company');
const Review = require('./models/Review');

const seedData = [
  {
    name: 'Graffersid Web and App Development',
    location: '816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    description: 'Leading web and mobile app development company in Indore.',
    logoColor: '#1a237e',
    logoText: 'G',
    reviews: [
      {
        reviewerName: 'Jorgue Watson',
        subject: 'Excellent service',
        reviewText:
          'Graffersid one of the best Company for web and app development. Professional team, clear communication, and timely delivery on every milestone.',
        rating: 5,
        createdAt: new Date('2022-01-01T14:33:00'),
      },
      {
        reviewerName: 'Jenny Kole',
        subject: 'Great experience',
        reviewText:
          'Very satisfied with the quality of work. The team understood our requirements quickly and delivered a polished product.',
        rating: 4,
        createdAt: new Date('2022-02-15T10:20:00'),
      },
      {
        reviewerName: 'Amit Patel',
        subject: 'Highly recommended',
        reviewText:
          'Outstanding development partner. They built our mobile app from scratch with modern UI and solid backend integration.',
        rating: 5,
        createdAt: new Date('2022-04-10T16:45:00'),
      },
      {
        reviewerName: 'Sarah Johnson',
        subject: 'Professional team',
        reviewText:
          'Graffersid delivered beyond expectations. Great attention to detail and post-launch support.',
        rating: 4,
        createdAt: new Date('2022-06-22T11:00:00'),
      },
      {
        reviewerName: 'David Lee',
        subject: 'Top quality work',
        reviewText:
          'One of the best tech companies in Indore. Transparent pricing and excellent project management.',
        rating: 5,
        createdAt: new Date('2023-01-08T09:15:00'),
      },
    ],
  },
  {
    name: 'Code Tech Company',
    location: 'Vijay Nagar, Indore, Madhya Pradesh',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2018-01-01'),
    description: 'Innovative software solutions for startups and enterprises.',
    logoColor: '#2d6a4f',
    logoText: '<CT>',
    reviews: [
      {
        reviewerName: 'Rahul Sharma',
        subject: 'Solid team',
        reviewText: 'Code Tech delivered our ERP module on schedule. Highly recommended for custom software.',
        rating: 5,
        createdAt: new Date('2023-03-12T13:30:00'),
      },
      {
        reviewerName: 'Neha Gupta',
        subject: 'Good value',
        reviewText: 'Reliable development partner with strong technical skills and fair pricing.',
        rating: 4,
        createdAt: new Date('2023-07-20T15:00:00'),
      },
    ],
  },
  {
    name: 'Innogent Pvt. Ltd.',
    location: 'Scheme 54, Indore, Madhya Pradesh',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2018-10-08'),
    description: 'Product engineering and digital transformation partner.',
    logoColor: '#e85d04',
    logoText: '💡',
    reviews: [
      {
        reviewerName: 'Priya Mehta',
        subject: 'Innovative solutions',
        reviewText: 'Innogent helped us modernize our legacy systems with great expertise and minimal downtime.',
        rating: 4,
        createdAt: new Date('2023-05-05T12:00:00'),
      },
      {
        reviewerName: 'Vikram Singh',
        subject: 'Great partnership',
        reviewText: 'Creative team with strong product thinking. Would work with them again.',
        rating: 5,
        createdAt: new Date('2023-09-18T17:45:00'),
      },
    ],
  },
];

async function seed() {
  await connectMongo(mongoose);

  await Review.deleteMany({});
  await Company.deleteMany({});
  console.log('Cleared existing data in review-rating database.');

  let companyCount = 0;
  let reviewCount = 0;

  for (const item of seedData) {
    const { reviews, ...companyData } = item;
    const company = await Company.create(companyData);
    companyCount += 1;

    for (const review of reviews) {
      const { createdAt, ...reviewFields } = review;
      const doc = await Review.create({
        ...reviewFields,
        company: company._id,
        likes: Math.floor(Math.random() * 12),
        likedBy: [],
      });
      if (createdAt) {
        doc.createdAt = createdAt;
        doc.updatedAt = createdAt;
        await doc.save();
      }
      reviewCount += 1;
    }
  }

  console.log(`Seeded ${companyCount} companies and ${reviewCount} reviews.`);
  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
