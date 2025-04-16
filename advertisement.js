// advertisement.js

import express from "express";
import mongoose from "mongoose";
import Advertisement from "./models/advertisement.js"; // Assuming your model file is named advertisement.js in the models directory

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/advertisementDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fetch Advertisements from database (only name & websiteLink fields)
app.get('/api/advertisements', async (req, res) => {
  try {
    const advertisements = await Advertisement.find({}, 'name websiteLink');
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).send('Error fetching advertisements');
  }
});

// Save Advertisements submitted through form
app.post('/api/advertisements', async (req, res) => {
  const { name, websiteLink } = req.body;
  try {
    const advertisement = new Advertisement({
      name,
      websiteLink
    });
    await advertisement.save();
    res.status(201).send('Advertisement details saved successfully.');
  } catch (error) {
    console.error('Error saving advertisement:', error);
    res.status(500).send('Error saving advertisement');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
