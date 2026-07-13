const mongoose = require('mongoose');
require('dotenv').config();

async function updateOverviews() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-fcp';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const questionsCollection = db.collection('questions');

  const questions = await questionsCollection.find({ type: 'fullstack' }).toArray();
  let updatedCount = 0;

  for (const q of questions) {
    if (!q.description) continue;
    
    // Extract the folder name (e.g., 'twosum') from the existing description
    const match = q.description.match(/backend\/src\/([a-z0-9_]+)\/\1\.service\.ts/);
    if (!match) continue;

    const folderName = match[1];

    const newOverview = `### File Overview
Here is a breakdown of the provided starter files. You only need to write code in the **(EDITABLE)** files.

* **\`src/App.tsx\` (EDITABLE)**: The React component. Add your frontend UI logic here to capture user input and trigger the Axios request.
* **\`backend/src/${folderName}/${folderName}.service.ts\` (EDITABLE)**: The NestJS service containing the core algorithm. Write your backend logic here to solve the problem.
* **\`backend/src/${folderName}/${folderName}.dto.ts\` (READ-ONLY)**: Data Transfer Object defining the shape of incoming requests for validation.
* **\`backend/src/${folderName}/${folderName}.controller.ts\` (READ-ONLY)**: The REST API controller that exposes the endpoint to the frontend.
* **\`backend/src/${folderName}/${folderName}.module.ts\` (READ-ONLY)**: NestJS feature module that wires up the controller and service.
* **\`backend/src/app.module.ts\` (READ-ONLY)**: The root application module.`;

    // Replace the old overview with the new one
    // The old overview starts with '### File Overview' and goes to the end of the string
    const descParts = q.description.split('### File Overview');
    if (descParts.length > 1) {
      const newDesc = descParts[0].trim() + '\n\n' + newOverview;
      await questionsCollection.updateOne(
        { _id: q._id },
        { $set: { description: newDesc } }
      );
      updatedCount++;
    }
  }

  console.log(`Successfully updated the file overview for ${updatedCount} questions.`);
  process.exit(0);
}

updateOverviews().catch(console.error);
