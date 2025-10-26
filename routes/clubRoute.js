const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

router.get("/", clubController.getClubs);
router.post("/", clubController.createClub);

// Route to assign a head role to a member in a club
router.post("/:clubId/assign-head", clubController.assignClubHead);

// Route to get all heads of a club
router.get("/:clubId/heads", clubController.getClubHeads);

// Route to get all events for a specific club
router.get("/:clubId/events", clubController.getEventsForClub);

// Route to get the budget for a specific club
router.get("/:clubId/budget", clubController.getClubBudget);

// Route to get all activities for a specific club
router.get("/:clubId/activities", clubController.getActivitiesForClub);


module.exports = router;
