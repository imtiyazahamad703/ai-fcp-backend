const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ik6124518_db_user:YQBErltLXbT0tuB9@cluster0.z19h5ug.mongodb.net/ai-fcp";

async function fixSubmissions() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const collection = mongoose.connection.collection('submissions');

    console.log("🔍 Finding old submissions missing the 'attempts' field...");
    const result = await collection.updateMany(
      { attempts: { $exists: false } },
      { $set: { attempts: 1 } }
    );

    console.log(`🎉 Successfully updated ${result.modifiedCount} old submissions to have attempts: 1`);

  } catch (error) {
    console.error("❌ Error fixing submissions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

fixSubmissions();
