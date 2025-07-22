import express from "express";
import upload from "../../middleware/analytics/uploadMiddleware.js";
import {
  uploadAnalytics,
  getAllAnalytics,
  togglePublishStatus,
  getAverageAnalytics,
  getStudentAnalytics,
} from "../../controllers/analytics/analyticsController.js";

const router = express.Router();

router.post("/upload-analytics", upload.single("file"), uploadAnalytics);
router.get("/analytics", getAllAnalytics);
router.post("/analytics/publish/:studentId", togglePublishStatus);
router.get("/average", getAverageAnalytics);         
router.get("/student/:id", getStudentAnalytics);      


export default router;
