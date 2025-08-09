// server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection using Atlas URI from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Connection error:", err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", ItemSchema);

// Routes
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post("/items", async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  res.sendStatus(200);
});

app.put("/items/:id", async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, { name: req.body.name });
  res.sendStatus(200);
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// Run server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
