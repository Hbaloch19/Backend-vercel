import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// **DO NOT start listening here!**
// export the app for Vercel to use as a serverless function:
export default app;
