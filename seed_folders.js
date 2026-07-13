const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ik6124518_db_user:YQBErltLXbT0tuB9@cluster0.z19h5ug.mongodb.net/ai-fcp";

async function seedFolders() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const questionsCollection = mongoose.connection.collection('questions');
    const foldersCollection = mongoose.connection.collection('folders');

    const distinctFolders = await questionsCollection.distinct('folder');
    console.log("Found distinct folders in questions:", distinctFolders);

    let createdCount = 0;
    for (const folderName of distinctFolders) {
      if (folderName && folderName.trim() !== '') {
        // Use upsert to avoid duplicates
        const result = await foldersCollection.updateOne(
          { name: folderName },
          { $set: { name: folderName }, $setOnInsert: { createdAt: new Date(), updatedAt: new Date() } },
          { upsert: true }
        );
        if (result.upsertedCount > 0) createdCount++;
      }
    }

    console.log(`🎉 Successfully created ${createdCount} new persistent folders!`);

  } catch (error) {
    console.error("❌ Error seeding folders:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedFolders();
