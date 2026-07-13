const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ik6124518_db_user:YQBErltLXbT0tuB9@cluster0.z19h5ug.mongodb.net/ai-fcp";

async function renameFolder() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const collection = mongoose.connection.collection('questions');

    const result = await collection.updateMany(
      { folder: '75 blind question' },
      { $set: { folder: 'leetcode 75 blind questions' } }
    );

    console.log(`🎉 Successfully renamed folder for ${result.modifiedCount} questions!`);

  } catch (error) {
    console.error("❌ Error renaming folder:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

renameFolder();
