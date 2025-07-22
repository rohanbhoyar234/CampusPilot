import express from "express";
import SeatingPlan from "../../models/seating/SeatingPlan.js";

const router = express.Router();

router.get("/latest-plan", async (req, res) => {
  try {
    const latestPlan = await SeatingPlan.findOne().sort({ examDate: -1 }).lean();


    if (!latestPlan) {
      return res.status(404).json({ message: "No seating plan found" });
    }

    res.json(latestPlan);
  } catch (error) {
    console.error("Error fetching latest seating plan:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
