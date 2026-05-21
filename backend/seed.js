require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongo } = require('./config/mongodb');
const { seedDatabase } = require('./lib/seedDatabase');

async function run() {
  await connectMongo(mongoose);
  await seedDatabase({ reset: true });
  console.log('\nSeed complete — database reset with Figma sample data.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
