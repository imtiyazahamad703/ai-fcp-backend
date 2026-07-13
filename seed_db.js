const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = "mongodb+srv://ik6124518_db_user:YQBErltLXbT0tuB9@cluster0.z19h5ug.mongodb.net/ai-fcp";

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const jsonPath = path.join(__dirname, '..', 'blind75_full.json');
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Cannot find file at ${jsonPath}. Please make sure you generated it first.`);
      process.exit(1);
    }

    const data = fs.readFileSync(jsonPath, 'utf8');
    const questions = JSON.parse(data);

    const collection = mongoose.connection.collection('questions');

    console.log("🔄 Upserting 75 Blind 75 questions...");
    let insertedCount = 0;
    let updatedCount = 0;

    for (const q of questions) {
      // Completely remove the difficulty field before inserting
      delete q.difficulty;
      q.updatedAt = new Date();
      // Only set createdAt if the document is being inserted
      const updateDoc = {
        $unset: { difficulty: 1 },
        $set: q,
        $setOnInsert: { createdAt: new Date() }
      };

      const result = await collection.updateOne(
        { title: q.title },
        updateDoc,
        { upsert: true }
      );

      if (result.upsertedCount > 0) insertedCount++;
      else if (result.modifiedCount > 0) updatedCount++;
    }

    console.log(`🎉 Successfully seeded/updated questions! Inserted: ${insertedCount}, Updated: ${updatedCount}`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
