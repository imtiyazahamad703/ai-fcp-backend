const mongoose = require('mongoose');

async function migrateFolder() {
  await mongoose.connect('mongodb://localhost:27017/coding-platform');
  const db = mongoose.connection.db;

  const questionsColl = db.collection('questions');
  const res = await questionsColl.updateMany(
    { folder: { $in: ['Uncategorized', 'General Practice'] } },
    { $set: { folder: 'Practice Coding Challenges' } }
  );
  console.log(`Updated ${res.modifiedCount} questions.`);

  const foldersColl = db.collection('folders');
  await foldersColl.deleteOne({ name: 'Uncategorized' });
  await foldersColl.deleteOne({ name: 'General Practice' });
  
  const gpExists = await foldersColl.findOne({ name: 'Practice Coding Challenges' });
  if (!gpExists) {
    await foldersColl.insertOne({ name: 'Practice Coding Challenges' });
    console.log('Inserted Practice Coding Challenges folder.');
  }

  console.log('Migration complete.');
  process.exit(0);
}

migrateFolder().catch(console.error);
