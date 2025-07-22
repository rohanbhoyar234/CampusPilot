import express from "express";
import PublishedSeatingPlan from "../models/PublishedSeatingPlan.js";

const router = express.Router();


router.post("/seating", async (req, res) => {
  try {
    const { data } = req.body;

    console.log("Data received for publishing:", JSON.stringify(data, null, 2));

    await PublishedSeatingPlan.deleteMany(); 
    const published = new PublishedSeatingPlan(data);
    await published.save();

    res.status(200).json({ message: "Seating plan published." });
  } catch (err) {
    res.status(500).json({ message: "Publish failed", error: err.message });
  }
});


router.get("/seating", async (req, res) => {
  try {
    const plan = await PublishedSeatingPlan.findOne({});
    if (!plan) {
      return res.status(404).json({ message: "No seating plan published." });
    }

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch published plan", error: err.message });
  }
});

export default router;
