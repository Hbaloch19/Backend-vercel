// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/todolist')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('Item', ItemSchema);

// Routes
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  res.sendStatus(200);
});

app.put('/items/:id', async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, { name: req.body.name });
  res.sendStatus(200);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:3000');
});
