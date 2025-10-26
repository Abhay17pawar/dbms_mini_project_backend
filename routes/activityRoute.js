const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.get("/", activityController.getActivities);
router.post("/", activityController.createActivity);

// Route to get a single activity by ID
router.get("/:id", activityController.getActivityById);

// Route to update an activity by ID
router.put("/:id", activityController.updateActivity);

// Route to delete an activity by ID
router.delete("/:id", activityController.deleteActivity);

module.exports = router;