const companies = [
  {
    name: 'Graffersid Web and App Development',
    location: '816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    description: 'Leading web and mobile app development company in Indore.',
    logoColor: '#1a237e',
    logoText: 'G',
    reviewCount: 41,
    targetRating: 4.5,
  },
  {
    name: 'Code Tech Company',
    location: '414, Kanha Appartment, Bhawarkua, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    description: 'Innovative software solutions for startups and enterprises.',
    logoColor: '#2d6a4f',
    logoText: '<CT>',
    reviewCount: 2,
    targetRating: 4.5,
  },
  {
    name: 'Innogent Pvt. Ltd.',
    location: '910, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    description: 'Product engineering and digital transformation partner.',
    logoColor: '#e85d04',
    logoText: '💡',
    reviewCount: 2,
    targetRating: 4.5,
  },
  {
    name: 'Pixel Web and App Development',
    location: '410, Bansi Trade Center, Indore (M.P.)',
    city: 'Indore, Madhya Pradesh, India',
    foundedOn: new Date('2016-01-01'),
    description: 'Creative web and app development studio in Indore.',
    logoColor: '#0077b6',
    logoText: 'P',
    reviewCount: 2,
    targetRating: 4.5,
  },
];

const sampleReviewers = [
  { name: 'Rahul Sharma', subject: 'Great experience', text: 'Professional team and on-time delivery. Highly recommended.' },
  { name: 'Priya Patel', subject: 'Excellent work', text: 'They understood our requirements perfectly and delivered quality code.' },
  { name: 'Amit Verma', subject: 'Good service', text: 'Solid development skills. Communication could be slightly better.' },
  { name: 'Sneha Gupta', subject: 'Outstanding', text: 'Best agency we have worked with in Indore. Will hire again.' },
  { name: 'Vikram Singh', subject: 'Satisfied', text: 'Project completed within budget. Support after launch was helpful.' },
  { name: 'Anita Joshi', subject: 'Reliable partner', text: 'Transparent process and regular updates throughout the project.' },
  { name: 'Karan Mehta', subject: 'Impressive UI', text: 'The design team did an amazing job on our mobile app interface.' },
  { name: 'Divya Rao', subject: 'Worth it', text: 'Fair pricing for the quality delivered. No major issues faced.' },
];

function buildRatings(count, target) {
  const ratings = Array(count).fill(Math.round(target));
  let sum = ratings.reduce((a, b) => a + b, 0);
  const goal = Math.round(target * count * 10) / 10;

  let i = 0;
  while (sum < goal && i < count) {
    if (ratings[i] < 5) {
      ratings[i] += 1;
      sum += 1;
    }
    i += 1;
  }

  i = 0;
  while (sum > goal && i < count) {
    if (ratings[i] > 4) {
      ratings[i] -= 1;
      sum -= 1;
    }
    i += 1;
  }

  return ratings;
}

function buildReviews(companyId, count, targetRating) {
  const ratings = buildRatings(count, targetRating);
  return ratings.map((rating, index) => {
    const sample = sampleReviewers[index % sampleReviewers.length];
    return {
      company: companyId,
      reviewerName: sample.name,
      subject: sample.subject,
      reviewText: sample.text,
      rating,
      likes: Math.floor(Math.random() * 12),
      likedBy: [],
    };
  });
}

module.exports = { companies, buildReviews };
