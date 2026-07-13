require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-fcp';
  console.log('Connecting to database...');
  await mongoose.connect(uri);

  const rawData = fs.readFileSync('./dsa_interview_questions.json', 'utf8');
  const questions = JSON.parse(rawData);

  // Add the folder, tags, and timestamp fields
  const now = new Date();
  const questionsWithFolder = questions.map(q => ({
    ...q,
    folder: 'DSA Interview Questions',
    tags: [],
    createdAt: now,
    updatedAt: now
  }));

  const db = mongoose.connection.db;
  const questionsCollection = db.collection('questions');

  console.log(`Inserting ${questionsWithFolder.length} DSA questions...`);
  await questionsCollection.insertMany(questionsWithFolder);

  console.log('Successfully seeded DSA Interview Questions!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
